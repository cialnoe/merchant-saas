# StockFlow — Merchant Order & Inventory Management

A production-ready multi-tenant SaaS for merchants to manage products and orders, built with Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn-style components, and Supabase (Postgres + Auth + RLS).

---

## 1. Prerequisites

- Node.js 18.18+ (Node 20 recommended)
- A free [Supabase](https://supabase.com) project
- A [Vercel](https://vercel.com) account (for deployment)

---

## 2. Local Setup — Exact Terminal Commands

This project is already scaffolded for you (see the attached zip). To run it locally:

```bash
# 1. Unzip and enter the project
unzip merchant-saas.zip
cd merchant-saas

# 2. Install dependencies
npm install

# 3. (Optional) Re-sync/add more shadcn components later
npx shadcn@latest init      # already configured via components.json — safe to skip
npx shadcn@latest add toast # example: add any additional shadcn component

# 4. Set up environment variables
cp .env.local.example .env.local
# then open .env.local and paste your Supabase URL + anon key (see step 3 below)

# 5. Run the dev server
npm run dev
# App runs at http://localhost:3000
```

If you were scaffolding this from scratch (rather than using the provided files), the equivalent commands would be:

```bash
npx create-next-app@latest merchant-saas --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*"
cd merchant-saas
npx shadcn@latest init
npx shadcn@latest add button input label card table dialog select badge dropdown-menu
npm install @supabase/ssr @supabase/supabase-js zod lucide-react
```

---

## 3. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → **New Project**.
2. Once created, go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Paste both into your `.env.local` file.
4. Go to **SQL Editor → New Query**, paste the **entire contents of `sql/schema.sql`** (included in the project), and click **Run**. This creates:
   - `products` and `orders` tables
   - Auto-updating `updated_at` triggers
   - Row Level Security (RLS) policies so each user only ever sees their own data
5. Go to **Authentication → Providers** and confirm **Email** is enabled (it is by default).
6. (Optional but recommended for local dev) Go to **Authentication → URL Configuration** and disable "Confirm email" if you want to skip email verification while testing, or configure the **Site URL** to `http://localhost:3000` and add `http://localhost:3000/auth/callback` as a redirect URL.

The full schema file is reproduced here for reference:

```sql
-- ============================================================================
-- Merchant Order & Inventory Management - Supabase Schema
-- Run this entire file in the Supabase SQL Editor (Project > SQL Editor > New query)
-- ============================================================================

create extension if not exists "pgcrypto";

-- PRODUCTS
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) > 0),
  sku text not null check (char_length(sku) > 0),
  price numeric(12, 2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, sku)
);
create index if not exists products_user_id_idx on public.products (user_id);

-- ORDERS
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_name text not null check (char_length(customer_name) > 0),
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  status text not null default 'Pending' check (status in ('Pending', 'Processing', 'Completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_status_idx on public.orders (status);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at before update on public.products
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at before update on public.orders
  for each row execute procedure public.set_updated_at();

-- RLS
alter table public.products enable row level security;
alter table public.orders enable row level security;

create policy "Users can view their own products" on public.products
  for select using (auth.uid() = user_id);
create policy "Users can insert their own products" on public.products
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own products" on public.products
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own products" on public.products
  for delete using (auth.uid() = user_id);

create policy "Users can view their own orders" on public.orders
  for select using (auth.uid() = user_id);
create policy "Users can insert their own orders" on public.orders
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own orders" on public.orders
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own orders" on public.orders
  for delete using (auth.uid() = user_id);
```

> The full file with commented-out seed data is at `sql/schema.sql` in the project.

---

## 4. Project Architecture

```
merchant-saas/
├── middleware.ts                     # Protects /dashboard, refreshes Supabase session
├── components.json                   # shadcn CLI config
├── sql/schema.sql                    # Full DB schema + RLS policies
├── types/database.types.ts           # Typed Supabase schema (Product, Order, etc.)
├── lib/
│   ├── utils.ts                      # cn(), formatCurrency(), formatDate()
│   └── supabase/
│       ├── client.ts                 # Browser Supabase client
│       ├── server.ts                 # Server Component / Server Action client
│       └── middleware.ts             # Session refresh + route protection logic
├── actions/
│   ├── auth.ts                       # login / register / logout server actions
│   ├── products.ts                   # createProduct / updateProduct / deleteProduct
│   └── orders.ts                     # createOrder / updateOrderStatus / deleteOrder
├── components/ui/                    # shadcn-style primitives (Button, Dialog, Table, Select...)
├── components/dashboard/sidebar-nav.tsx
└── app/
    ├── page.tsx                      # Landing page
    ├── login/page.tsx                # Login (client form + server action)
    ├── register/page.tsx             # Register (client form + server action)
    ├── auth/callback/route.ts        # Email confirmation callback
    └── dashboard/
        ├── layout.tsx                # Protected shell + sidebar (Server Component)
        ├── page.tsx                  # Summary cards + recent orders
        ├── loading.tsx / error.tsx
        ├── products/
        │   ├── page.tsx              # Server Component: fetches products
        │   ├── product-table.tsx     # Client: search, table, delete confirm
        │   ├── product-dialog.tsx    # Client: create/edit form
        │   └── loading.tsx / error.tsx
        └── orders/
            ├── page.tsx              # Server Component: fetches orders + products
            ├── order-table.tsx       # Client: search, filter, inline status change
            ├── order-dialog.tsx      # Client: create order form
            └── loading.tsx / error.tsx
```

**Why this split works:**
- All data fetching (`page.tsx` files) happens in **Server Components**, directly querying Supabase with the user's session — no client-side loading spinners for initial data, no waterfall requests.
- All interactivity (forms, dialogs, dropdowns, search) lives in **Client Components** (`"use client"`), which call **Server Actions** for mutations. This avoids hydration mismatches and keeps the client JS bundle small.
- **Server Actions** (`actions/*.ts`) always re-check `auth.getUser()` and scope every query with `.eq("user_id", user.id)` — this is defense-in-depth on top of RLS, not a replacement for it.
- Every route segment under `/dashboard` has its own `loading.tsx` (skeleton UI, streamed instantly) and `error.tsx` (catches query failures without crashing the whole app).

---

## 5. Security Notes

- **Row Level Security is the source of truth.** Even if application code had a bug, Postgres itself will reject any row read/write that doesn't belong to `auth.uid()`.
- The Supabase **anon key** is safe to expose client-side — it only grants what RLS policies allow.
- Never expose your Supabase **service_role** key in this app; it isn't used anywhere in this codebase.
- `middleware.ts` redirects unauthenticated users away from `/dashboard/*` and redirects authenticated users away from `/login` and `/register`.

---

## 6. Deploying to Vercel

1. Push this project to a GitHub (or GitLab/Bitbucket) repository:
   ```bash
   cd merchant-saas
   git init
   git add .
   git commit -m "Initial commit: Merchant SaaS"
   git branch -M main
   git remote add origin https://github.com/<your-username>/merchant-saas.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new) and **import** the GitHub repository.
3. Vercel auto-detects Next.js — leave the default build settings (`next build`).
4. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key |
5. Click **Deploy**.
6. Once deployed, go back to **Supabase → Authentication → URL Configuration** and add your production URL (e.g. `https://your-app.vercel.app`) as the **Site URL**, and `https://your-app.vercel.app/auth/callback` as a **Redirect URL** — otherwise email confirmation links will redirect to `localhost`.
7. Done — visit your Vercel URL, register an account, and start managing products/orders.

### Redeploying after changes
Every `git push` to `main` triggers an automatic Vercel deployment. For preview deployments, push to any other branch or open a PR.

---

## 7. What's Implemented vs. What You Might Add Next

**Implemented (per spec):**
- Landing page with hero, features, CTA
- Email/password auth (login, register, logout, email-confirmation callback)
- Protected `/dashboard/*` routes via middleware
- Dashboard analytics: Total Products, Active Orders, Revenue (from completed orders), recent orders feed
- Product CRUD with search, low-stock/out-of-stock badges
- Order creation (auto-decrements product stock, computes total), status updates (Pending → Processing → Completed), search + status filter, delete
- RLS-enforced multi-tenancy
- `loading.tsx` + `error.tsx` at root and every dashboard route
- Fully responsive, mobile-first layout with a collapsible sidebar

**Natural follow-ups (not required by the spec, worth considering later):**
- Pagination for very large product/order lists (currently fetches full lists, fine for typical merchant volumes)
- CSV export for orders/products
- Multi-user teams per tenant (currently one Supabase user = one tenant)
- Stripe billing if you want to charge for the SaaS itself
