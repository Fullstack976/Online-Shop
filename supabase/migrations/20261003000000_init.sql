-- ShopLuxe online shop schema
-- Run in the Supabase SQL editor (or `supabase db push`), then run seed.sql.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  compare_at_price numeric(10, 2) check (compare_at_price is null or compare_at_price >= 0),
  category_id uuid not null references public.categories (id) on delete restrict,
  images text[] not null default '{}',
  stock int not null default 0 check (stock >= 0),
  rating numeric(2, 1) not null default 0,
  review_count int not null default 0,
  is_trending boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_category_idx on public.products (category_id);
create index products_active_trending_idx on public.products (is_active, is_trending, created_at desc);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text,
  city text,
  created_at timestamptz not null default now()
);

create type public.order_status as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

create sequence public.order_number_seq start 10001;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('SL-' || nextval('public.order_number_seq')),
  customer_id uuid references public.customers (id) on delete set null,
  customer_name text not null,
  email text not null,
  phone text,
  address text not null,
  city text not null,
  status public.order_status not null default 'pending',
  subtotal numeric(10, 2) not null,
  shipping numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  created_at timestamptz not null default now()
);
create index orders_created_idx on public.orders (created_at desc);
create index orders_customer_idx on public.orders (customer_id);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  image_url text,
  unit_price numeric(10, 2) not null,
  quantity int not null check (quantity > 0)
);
create index order_items_order_idx on public.order_items (order_id);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (position('@' in email) > 1),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Helpers & triggers
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_touch_updated_at
before update on public.products
for each row execute function public.touch_updated_at();

-- Create a profile row for every new auth user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Checkout: prices come from the products table, never from the client.
-- ---------------------------------------------------------------------------

create or replace function public.place_order(p_customer jsonb, p_items jsonb)
returns table (order_number text, total numeric)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  v_customer_id uuid;
  v_order_id uuid;
  v_subtotal numeric(10, 2) := 0;
  v_shipping numeric(10, 2);
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty int;
  v_email text := lower(trim(p_customer ->> 'email'));
begin
  if coalesce(trim(p_customer ->> 'name'), '') = '' or position('@' in coalesce(v_email, '')) < 2
     or coalesce(trim(p_customer ->> 'address'), '') = '' or coalesce(trim(p_customer ->> 'city'), '') = '' then
    raise exception 'Please fill in your name, email, address and city.';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Your cart is empty.';
  end if;
  if jsonb_array_length(p_items) > 50 then
    raise exception 'Too many items in one order.';
  end if;

  insert into public.customers (name, email, phone, city)
  values (trim(p_customer ->> 'name'), v_email, nullif(trim(p_customer ->> 'phone'), ''), trim(p_customer ->> 'city'))
  on conflict (email) do update
    set name = excluded.name,
        phone = coalesce(excluded.phone, public.customers.phone),
        city = excluded.city
  returning id into v_customer_id;

  insert into public.orders (customer_id, customer_name, email, phone, address, city, subtotal, shipping, total)
  values (
    v_customer_id, trim(p_customer ->> 'name'), v_email, nullif(trim(p_customer ->> 'phone'), ''),
    trim(p_customer ->> 'address'), trim(p_customer ->> 'city'), 0, 0, 0
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := (v_item ->> 'quantity')::int;
    if v_qty is null or v_qty < 1 or v_qty > 99 then
      raise exception 'Invalid quantity in cart.';
    end if;

    select * into v_product
    from public.products
    where id = (v_item ->> 'product_id')::uuid and is_active
    for update;

    if not found then
      raise exception 'A product in your cart is no longer available.';
    end if;
    if v_product.stock < v_qty then
      raise exception 'Only % left of %.', v_product.stock, v_product.name;
    end if;

    update public.products set stock = stock - v_qty where id = v_product.id;

    insert into public.order_items (order_id, product_id, product_name, image_url, unit_price, quantity)
    values (v_order_id, v_product.id, v_product.name, v_product.images[1], v_product.price, v_qty);

    v_subtotal := v_subtotal + v_product.price * v_qty;
  end loop;

  v_shipping := case when v_subtotal >= 50 then 0 else 5.99 end;

  update public.orders
  set subtotal = v_subtotal, shipping = v_shipping, total = v_subtotal + v_shipping
  where id = v_order_id;

  return query
    select o.order_number, o.total from public.orders o where o.id = v_order_id;
end;
$$;

revoke all on function public.place_order(jsonb, jsonb) from public;
grant execute on function public.place_order(jsonb, jsonb) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- profiles: users see themselves; admins see everyone. Role changes happen in SQL only.
create policy "profiles: read own" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());

-- catalog: public read, admin write
create policy "categories: public read" on public.categories
  for select to anon, authenticated using (true);
create policy "categories: admin write" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "products: public read active" on public.products
  for select to anon, authenticated using (is_active or public.is_admin());
create policy "products: admin write" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- customers / orders: admin only (checkout goes through place_order)
create policy "customers: admin all" on public.customers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "orders: admin all" on public.orders
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "order_items: admin all" on public.order_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- newsletter: anyone can subscribe, only admins can read
create policy "newsletter: public insert" on public.newsletter_subscribers
  for insert to anon, authenticated with check (true);
create policy "newsletter: admin read" on public.newsletter_subscribers
  for select to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage: public bucket for product images, admin-only uploads
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product-images: public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'product-images');
create policy "product-images: admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());
create policy "product-images: admin update" on storage.objects
  for update to authenticated using (bucket_id = 'product-images' and public.is_admin());
create policy "product-images: admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());
