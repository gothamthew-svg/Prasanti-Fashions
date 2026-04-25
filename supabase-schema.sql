-- ============================================================
-- Pra Fashions — Supabase Database Schema
-- Run this ONCE in Supabase → SQL Editor → New Query → Run
-- ============================================================

-- Products table
create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  name           text not null,
  price          integer not null,         -- USD cents
  original_price integer,                  -- USD cents, null if not on sale
  category       text not null,
  material       text not null default '',
  description    text not null default '',
  details        text[] not null default '{}',
  images         text[] not null default '{}',
  badge          text,                     -- 'Bestseller' | 'New' | 'Premium' | 'Sale' | null
  in_stock       boolean not null default true,
  sku            text not null default '',
  weight         text not null default '',
  status         text not null default 'draft' check (status in ('draft', 'published')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  created_by     text not null default ''  -- admin email
);

-- Auto-update updated_at on every row change
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function update_updated_at();

-- Row Level Security
alter table public.products enable row level security;

-- Public can only read published products
create policy "Public read published products"
  on public.products for select
  using (status = 'published');

-- Service role (used by our API routes) can do everything
-- This is handled by using the service role key in API routes.
-- No additional policy needed — service role bypasses RLS.

-- Index for fast slug lookups
create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_status_idx on public.products (status);
create index if not exists products_category_idx on public.products (category);

-- ============================================================
-- Optional: seed with sample data to test (delete when done)
-- ============================================================
-- insert into public.products (slug, name, price, category, material, description, details, images, badge, in_stock, sku, status) values
-- ('test-necklace', 'Test Necklace', 4900, 'Necklaces', '22K Gold Plated', 'A test product.', array['Detail 1', 'Detail 2'], array['https://placehold.co/800x800'], 'New', true, 'PF-TEST-001', 'published');

-- ============================================================
-- Reviews table (run this in Supabase SQL Editor)
-- ============================================================
create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products(id) on delete cascade,
  reviewer_name text not null,
  rating        integer not null check (rating >= 1 and rating <= 5),
  title         text,
  body          text not null,
  approved      boolean not null default false,
  created_at    timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "Public read approved reviews"
  on public.reviews for select
  using (approved = true);

create index if not exists reviews_product_idx on public.reviews (product_id);

-- ============================================================
-- Color variants & enhanced product fields
-- Run this in Supabase SQL Editor after the initial schema
-- ============================================================

-- Add color variants to products table
alter table public.products
  add column if not exists color_variants jsonb not null default '[]',
  add column if not exists occasion text[] not null default '{}',
  add column if not exists metal_type text not null default '',
  add column if not exists gemstone text not null default '',
  add column if not exists collection_name text not null default '';

-- color_variants format:
-- [{ "name": "Gold", "hex": "#d4a017", "images": ["url1", "url2"] }, ...]

-- Orders table for analytics
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  stripe_session  text unique,
  customer_email  text,
  customer_name   text,
  amount_total    integer not null,  -- cents
  status          text not null default 'pending',
  items           jsonb not null default '[]',
  created_at      timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Index for analytics queries
create index if not exists orders_created_at_idx on public.orders (created_at);
create index if not exists orders_status_idx on public.orders (status);

-- Analytics summary view
create or replace view public.analytics_summary as
select
  count(*)                                          as total_orders,
  coalesce(sum(amount_total), 0)                   as total_revenue,
  coalesce(avg(amount_total), 0)                   as avg_order_value,
  count(distinct customer_email)                   as unique_customers,
  count(*) filter (where created_at > now() - interval '30 days') as orders_30d,
  coalesce(sum(amount_total) filter (where created_at > now() - interval '30 days'), 0) as revenue_30d,
  count(*) filter (where created_at > now() - interval '7 days')  as orders_7d,
  coalesce(sum(amount_total) filter (where created_at > now() - interval '7 days'), 0)  as revenue_7d
from public.orders
where status = 'paid';
