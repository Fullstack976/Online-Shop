# ShopLuxe — Online Shop (monorepo)

Next.js 16 + TypeScript + Tailwind v4 дээр бичсэн онлайн дэлгүүр болон admin dashboard.
npm workspaces + Turborepo ашигласан monorepo. Өгөгдөл нь Supabase (Postgres + Auth + Storage).

Supabase-ийн env хоосон үед хоёр апп хоёулаа **mock data**-аар ажиллана (50 бараа, 7 ангилал,
26 харилцагч, сүүлийн 60 хоногийн 96 захиалга). Env-ээ нэмэнгүүт Supabase руу шууд шилжинэ.

**Live (Vercel, team tsstark-academy):**
- Дэлгүүр: https://online-shop-rho-inky.vercel.app
- Admin: https://online-shop-admin-pi.vercel.app

`main` салбар руу push хийх бүрт хоёр апп автоматаар deploy хийгдэнэ. Supabase-ийн env-үүдийг
Supabase ↔ Vercel integration автоматаар синк хийдэг.

```
Online-Shop/
├─ apps/
│  ├─ web/        → Дэлгүүр (http://localhost:3000)
│  └─ admin/      → Admin dashboard (http://localhost:3001)
├─ packages/
│  └─ db/         → @shop/db: types, mock data, Supabase/mock data layer
└─ supabase/
   ├─ migrations/ → Хүснэгт, RLS, place_order функц, storage bucket
   └─ seed.sql    → Mock data-г Supabase руу оруулах SQL
```

## Ажиллуулах

```bash
npm install
npm run dev        # web:3000 + admin:3001 зэрэг, браузерт localhost:3000 автоматаар нээгдэнэ (NO_OPEN=1 бол нээхгүй)
npm run dev:web    # зөвхөн дэлгүүр
npm run dev:admin  # зөвхөн admin
npm run build      # хоёуланг build хийх
npm run typecheck && npm run lint
```

## Supabase холбох

1. [supabase.com](https://supabase.com) дээр project үүсгэнэ.
2. **SQL Editor** дээр `supabase/migrations/20261003000000_init.sql`-ийг ажиллуулна (хүснэгт, RLS, `place_order`, storage bucket).
3. Env-ээ тохируулна. Root `.env` болон `apps/web/.env.local`, `apps/admin/.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...   # (хуучин NEXT_PUBLIC_SUPABASE_ANON_KEY нэр ч ажиллана)
   ```
   Seed скриптэд зориулж **зөвхөн root `.env`** файлд нэмнэ:
   ```
   SUPABASE_SECRET_KEY=sb_secret_...   # Project Settings → API Keys → Secret keys
   ```
   Secret key нь RLS-ийг алгасдаг тул аппуудын `.env.local` эсвэл Vercel-д **бүү** хий, `NEXT_PUBLIC_` угтвар бүү өг.
4. **Authentication → Users → Add user** дээр admin хэрэглэгч (email + password) үүсгэнэ.
5. Бүх өгөгдөл, зургийг Supabase руу оруулна:
   ```bash
   npm run db:seed -- --admin таны@email.com
   ```
   Энэ нь бүх зургийг (бараа, ангилал, hero, blog) Storage-ийн `product-images` bucket руу upload хийж,
   ангилал, бараа, харилцагч, захиалгыг database-д бичээд, тухайн хэрэглэгчид admin эрх өгнө.
   Дахин ажиллуулж болно, demo өгөгдлийг анхны төлөвт нь буцаана.

Аппууд өөрсдөө зөвхөн publishable key ашиглана, бүх эрхийг RLS хянана:
- Бараа, ангилал: хүн бүр уншина, зөвхөн admin засна.
- Захиалга, харилцагч: зөвхөн admin. Дэлгүүр захиалгыг `place_order()` функцээр үүсгэдэг —
  үнэ, нөөцийг сервер дээр барааны хүснэгтээс тооцно (клиентээс ирсэн үнэд итгэхгүй).
- Newsletter: хүн бүр бүртгүүлж болно, зөвхөн admin харна.
- Storage `product-images` bucket: нийтэд уншигдана, зөвхөн admin upload хийнэ.

Secret key ашиглахгүй хувилбар: SQL Editor дээр `supabase/seed.sql`-ийг ажиллуулж болно (зургууд Unsplash-аас уншигдана),
дараа нь `update public.profiles set role = 'admin' where email = '...';`.
Mock data-г өөрчилсөн бол `npm run db:seed-sql` ажиллуулж `seed.sql`-ийг дахин үүсгэнэ.

## Vercel дээр deploy хийх

Нэг repo-оос **2 Vercel project** үүсгэнэ:

| Project | Root Directory | Env |
| --- | --- | --- |
| shop (web) | `apps/web` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| shop-admin | `apps/admin` | дээрх 2 + `NEXT_PUBLIC_STORE_URL` |

Framework нь Next.js гэж автоматаар танигдана, install/build командыг өөрчлөх шаардлагагүй (npm + Turborepo).
Admin-д бараа засахад дэлгүүр дээр 60 секундын дотор шинэчлэгдэнэ (ISR `revalidate = 60`).

## Дэлгүүрийн боломжууд

- Нүүр: hero slider, ангилал, trending бараа, promo banner, newsletter
- Shop: ангилал / үнэ / хямдрал / trending шүүлтүүр, хайлт, эрэмбэлэлт
- Барааны дэлгэрэнгүй: зургийн gallery, тоо ширхэг, "Buy it now", ижил төстэй бараа
- Сагс (localStorage), checkout (cash on delivery), захиалгын баталгаажуулалт
- Collections, About, Blog, Contact, Account хуудсууд — бүгд mobile-д тохирсон

Зургууд нь Unsplash-аас (`images.unsplash.com`) — жинхэнэ бараа оруулахдаа admin-аас Supabase Storage руу upload хийнэ.
