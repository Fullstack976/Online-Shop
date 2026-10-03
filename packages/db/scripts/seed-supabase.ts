/**
 * Loads the demo catalog into Supabase: uploads every image to Storage and upserts
 * categories, products, customers and orders. Safe to re-run (rows are upserted by id).
 *
 *   pnpm db:seed                         # from the repo root, reads ./.env
 *   pnpm db:seed --admin you@example.com # also gives that existing auth user the admin role
 *
 * Needs SUPABASE_SECRET_KEY (sb_secret_…, or a legacy service_role key) in the root .env.
 * That key bypasses RLS: keep it out of the apps and never prefix it with NEXT_PUBLIC_.
 */
import { createClient } from "@supabase/supabase-js";
import { IMAGE_BUCKET, storagePublicUrl } from "../src/env.ts";
import { categories, customerSeeds, orderSeeds, productSeeds } from "../src/mock/index.ts";
import { siteAssetSource, siteAssets, type SiteAssetKey } from "../src/site-assets.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !secret) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env");
  process.exit(1);
}
if (secret.startsWith("sb_publishable_")) {
  console.error("SUPABASE_SECRET_KEY must be the secret key (sb_secret_…), not the publishable key.");
  process.exit(1);
}

const adminFlag = process.argv.indexOf("--admin");
const adminEmail = adminFlag > -1 ? process.argv[adminFlag + 1]?.trim().toLowerCase() : undefined;

const db = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
const publicUrl = (path: string) => storagePublicUrl(url, path);
const photoSource = (id: string, w: number) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&fm=jpg&fit=crop`;

function check(error: { message: string } | null, what: string) {
  if (error) throw new Error(`${what}: ${error.message}`);
}

// ---------------------------------------------------------------------------
// 1. Images → Storage
// ---------------------------------------------------------------------------

type Upload = { path: string; source: string };
const uploads: Upload[] = [];

const categoryImage = new Map<string, string>();
for (const c of categories) {
  const photo = c.imageUrl?.match(/photo-([\w-]+)\?/)?.[1];
  if (!photo) continue;
  const path = `categories/${c.slug}.jpg`;
  uploads.push({ path, source: photoSource(photo, 800) });
  categoryImage.set(c.id, publicUrl(path));
}

const productImages = new Map<string, string[]>();
for (const p of productSeeds) {
  const slug = p.slug;
  const paths = p.photos.map((photo, i) => {
    const path = `products/${slug}-${i + 1}.jpg`;
    uploads.push({ path, source: photoSource(photo, 1200) });
    return path;
  });
  productImages.set(p.id, paths.map(publicUrl));
}

for (const key of Object.keys(siteAssets) as SiteAssetKey[]) {
  uploads.push({ path: `site/${key}.jpg`, source: siteAssetSource(key) });
}

async function uploadOne({ path, source }: Upload) {
  const res = await fetch(source);
  if (!res.ok) throw new Error(`Download failed (${res.status}) for ${source}`);
  const body = new Uint8Array(await res.arrayBuffer());
  const { error } = await db.storage
    .from(IMAGE_BUCKET)
    .upload(path, body, { contentType: "image/jpeg", upsert: true, cacheControl: "31536000" });
  check(error, `Upload ${path}`);
}

console.log(`Uploading ${uploads.length} images to Storage bucket "${IMAGE_BUCKET}"…`);
const queue = [...uploads];
let done = 0;
await Promise.all(
  Array.from({ length: 6 }, async () => {
    for (let job = queue.shift(); job; job = queue.shift()) {
      await uploadOne(job);
      done += 1;
      if (done % 10 === 0 || done === uploads.length) console.log(`  ${done}/${uploads.length}`);
    }
  }),
);

// ---------------------------------------------------------------------------
// 2. Rows → Postgres (dates are relative to now so the dashboard looks fresh)
// ---------------------------------------------------------------------------

const now = Date.now();
const ago = (minutes: number) => new Date(now - minutes * 60_000).toISOString();
const DAY_MIN = 24 * 60;

console.log("Upserting categories…");
check(
  (
    await db.from("categories").upsert(
      categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        image_url: categoryImage.get(c.id) ?? null,
        sort_order: c.sortOrder,
      })),
    )
  ).error,
  "categories",
);

console.log("Upserting products…");
check(
  (
    await db.from("products").upsert(
      productSeeds.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.blurb,
        price: p.price,
        compare_at_price: p.compareAt ?? null,
        category_id: categories[p.cat - 1]!.id,
        images: productImages.get(p.id) ?? [],
        stock: p.stock,
        rating: p.rating,
        review_count: p.reviews,
        is_trending: Boolean(p.trending),
        is_active: true,
        created_at: ago(p.daysAgo * DAY_MIN),
      })),
    )
  ).error,
  "products",
);

console.log("Upserting customers…");
check(
  (
    await db.from("customers").upsert(
      customerSeeds.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        city: c.city,
        created_at: ago(c.daysAgo * DAY_MIN),
      })),
    )
  ).error,
  "customers",
);

// order_number is left to the database sequence (oldest first → SL-10001, SL-10002…),
// so checkout keeps numbering after the demo orders without collisions.
console.log("Upserting orders…");
check(
  (
    await db.from("orders").upsert(
      orderSeeds.map((o) => ({
        id: o.id,
        customer_id: o.customerId,
        customer_name: o.customerName,
        email: o.email,
        phone: o.phone,
        address: o.address,
        city: o.city,
        status: o.status,
        subtotal: o.subtotal,
        shipping: o.shipping,
        total: o.total,
        created_at: ago(o.minutesAgo),
      })),
    )
  ).error,
  "orders",
);

check(
  (
    await db.from("order_items").upsert(
      orderSeeds.flatMap((o) =>
        o.items.map((i) => ({
          id: i.id,
          order_id: i.orderId,
          product_id: i.productId,
          product_name: i.productName,
          image_url: (i.productId && productImages.get(i.productId)?.[0]) ?? null,
          unit_price: i.unitPrice,
          quantity: i.quantity,
        })),
      ),
    )
  ).error,
  "order_items",
);

// ---------------------------------------------------------------------------
// 3. Optional: promote an admin
// ---------------------------------------------------------------------------

if (adminEmail) {
  const { data, error } = await db.from("profiles").update({ role: "admin" }).eq("email", adminEmail).select("id");
  check(error, "Promote admin");
  console.log(
    data?.length
      ? `✓ ${adminEmail} is now an admin.`
      : `! No auth user with email ${adminEmail}. Create it in Supabase → Authentication → Users, then re-run with --admin.`,
  );
}

const count = async (table: string) =>
  (await db.from(table).select("*", { count: "exact", head: true })).count ?? 0;
console.log(
  `Done: ${await count("categories")} categories, ${await count("products")} products, ` +
    `${await count("customers")} customers, ${await count("orders")} orders, ${uploads.length} images.`,
);
