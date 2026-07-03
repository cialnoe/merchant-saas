-- ============================================================================
-- Merchant Order & Inventory Management - Supabase Schema
-- Run this entire file in the Supabase SQL Editor (Project > SQL Editor > New query)
-- ============================================================================

-- Extension needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. PRODUCTS TABLE
-- ============================================================================
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

-- ============================================================================
-- 2. ORDERS TABLE
-- ============================================================================
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

-- ============================================================================
-- 3. UPDATED_AT AUTO-UPDATE TRIGGER
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- Ensures each merchant (tenant) can only see and modify their own data.
-- ============================================================================
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- ---- PRODUCTS POLICIES ----
drop policy if exists "Users can view their own products" on public.products;
create policy "Users can view their own products"
  on public.products for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own products" on public.products;
create policy "Users can insert their own products"
  on public.products for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own products" on public.products;
create policy "Users can update their own products"
  on public.products for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own products" on public.products;
create policy "Users can delete their own products"
  on public.products for delete
  using (auth.uid() = user_id);

-- ---- ORDERS POLICIES ----
drop policy if exists "Users can view their own orders" on public.orders;
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own orders" on public.orders;
create policy "Users can insert their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own orders" on public.orders;
create policy "Users can update their own orders"
  on public.orders for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own orders" on public.orders;
create policy "Users can delete their own orders"
  on public.orders for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- 5. OPTIONAL SEED DATA
-- Uncomment and replace <YOUR_USER_ID> with a real auth.users.id (from
-- Authentication > Users in the Supabase dashboard) if you want sample rows.
-- ============================================================================
-- insert into public.products (user_id, name, sku, price, stock) values
--   ('<YOUR_USER_ID>', 'Wireless Mouse', 'WM-001', 19.99, 120),
--   ('<YOUR_USER_ID>', 'Mechanical Keyboard', 'MK-002', 89.99, 45),
--   ('<YOUR_USER_ID>', 'USB-C Hub', 'UC-003', 34.50, 0);
--
-- insert into public.orders (user_id, customer_name, product_name, quantity, total_amount, status) values
--   ('<YOUR_USER_ID>', 'Alice Johnson', 'Wireless Mouse', 2, 39.98, 'Pending'),
--   ('<YOUR_USER_ID>', 'Bob Smith', 'Mechanical Keyboard', 1, 89.99, 'Processing'),
--   ('<YOUR_USER_ID>', 'Carla Diaz', 'USB-C Hub', 3, 103.50, 'Completed');
