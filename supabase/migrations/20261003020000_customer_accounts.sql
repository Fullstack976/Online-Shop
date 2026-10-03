-- Customer accounts: orders belong to a signed-in user, who can read their own history.
-- Checkout (place_order) now requires a session; the order email comes from that session.

alter table public.orders
  add column if not exists user_id uuid references auth.users (id) on delete set null;
create index if not exists orders_user_idx on public.orders (user_id);

alter table public.customers
  add column if not exists user_id uuid references auth.users (id) on delete set null;
create index if not exists customers_user_idx on public.customers (user_id);

drop policy if exists "orders: read own" on public.orders;
create policy "orders: read own" on public.orders
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "order_items: read own" on public.order_items;
create policy "order_items: read own" on public.order_items
  for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

create or replace function public.place_order(p_customer jsonb, p_items jsonb)
returns table (order_number text, total numeric)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  v_user_id uuid := auth.uid();
  v_customer_id uuid;
  v_order_id uuid;
  v_subtotal numeric(10, 2) := 0;
  v_shipping numeric(10, 2);
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty int;
  v_email text := lower(trim(coalesce(auth.jwt() ->> 'email', p_customer ->> 'email')));
begin
  if v_user_id is null then
    raise exception 'Please sign in to place an order.';
  end if;
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

  insert into public.customers (name, email, phone, city, user_id)
  values (trim(p_customer ->> 'name'), v_email, nullif(trim(p_customer ->> 'phone'), ''), trim(p_customer ->> 'city'), v_user_id)
  on conflict (email) do update
    set name = excluded.name,
        phone = coalesce(excluded.phone, public.customers.phone),
        city = excluded.city,
        user_id = coalesce(public.customers.user_id, excluded.user_id)
  returning id into v_customer_id;

  insert into public.orders (customer_id, user_id, customer_name, email, phone, address, city, subtotal, shipping, total)
  values (
    v_customer_id, v_user_id, trim(p_customer ->> 'name'), v_email, nullif(trim(p_customer ->> 'phone'), ''),
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

revoke all on function public.place_order(jsonb, jsonb) from public, anon;
grant execute on function public.place_order(jsonb, jsonb) to authenticated;
