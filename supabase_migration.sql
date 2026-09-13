-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  DreamForge Website — Supabase Migration                        ║
-- ║  Run this ONCE in your ERP's Supabase SQL Editor                ║
-- ╚══════════════════════════════════════════════════════════════════╝

-- ─────────────────────────────────────────────────────────────────
-- 1. Create dreamforge_products table
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.dreamforge_products (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  category     text not null check (category in (
    'Gaming & Anime',
    'Pop Culture & Sports',
    'Desk & Functional',
    'Sculptures & Decor',
    'Custom Gifts & Wearables'
  )),
  image_url    text,
  base_price   integer default 0,
  dimensions   text,
  description  text,
  span_class   text not null default 'col-span-1 row-span-1',
  featured     boolean not null default false,
  sort_order   integer not null default 0,
  is_available boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────
-- 2. Auto-update updated_at trigger
-- ─────────────────────────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_dreamforge_products_update on public.dreamforge_products;
create trigger on_dreamforge_products_update
  before update on public.dreamforge_products
  for each row execute procedure public.handle_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- 3. Row Level Security
-- ─────────────────────────────────────────────────────────────────
alter table public.dreamforge_products enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Public read dreamforge_products" on public.dreamforge_products;
drop policy if exists "Auth users can insert dreamforge_products" on public.dreamforge_products;
drop policy if exists "Auth users can update dreamforge_products" on public.dreamforge_products;
drop policy if exists "Auth users can delete dreamforge_products" on public.dreamforge_products;

-- DreamForge website (anon key) can SELECT
create policy "Public read dreamforge_products"
  on public.dreamforge_products for select using (true);

-- Only your ERP's authenticated users can write
create policy "Auth users can insert dreamforge_products"
  on public.dreamforge_products for insert
  with check (auth.role() = 'authenticated');

create policy "Auth users can update dreamforge_products"
  on public.dreamforge_products for update
  using (auth.role() = 'authenticated');

create policy "Auth users can delete dreamforge_products"
  on public.dreamforge_products for delete
  using (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────
-- 4. Performance index
-- ─────────────────────────────────────────────────────────────────
create index if not exists idx_dreamforge_products_featured
  on public.dreamforge_products (featured, sort_order)
  where is_available = true;

-- ─────────────────────────────────────────────────────────────────
-- 5. Enable Realtime (so DreamForge site updates instantly)
-- ─────────────────────────────────────────────────────────────────
alter publication supabase_realtime add table public.dreamforge_products;

-- ─────────────────────────────────────────────────────────────────
-- 6. Supabase Storage bucket policy (run after creating bucket)
--    Bucket name: product-images  (set to Public in dashboard)
-- ─────────────────────────────────────────────────────────────────
-- drop policy if exists "Public read product images" on storage.objects;
-- drop policy if exists "Auth upload product images" on storage.objects;
-- drop policy if exists "Auth delete product images" on storage.objects;
--
-- create policy "Public read product images"
--   on storage.objects for select using (bucket_id = 'product-images');
--
-- create policy "Auth upload product images"
--   on storage.objects for insert
--   with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
--
-- create policy "Auth delete product images"
--   on storage.objects for delete
--   using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────
-- 7. Seed all 38 prints (run once to bootstrap)
--    Update image_url values via your ERP after this.
-- ─────────────────────────────────────────────────────────────────
insert into public.dreamforge_products
  (title, category, base_price, dimensions, span_class, featured, sort_order, is_available)
values
  ('Cyberpunk Concept Car',     'Desk & Functional',           799,  '22cm × 10cm × 7cm',    'col-span-2 row-span-2', true,  1,  true),
  ('Grogu Statue',              'Gaming & Anime',              899,  '14cm × 10cm × 12cm',   'col-span-1 row-span-2', true,  2,  true),
  ('Lionel Messi Bust',         'Pop Culture & Sports',        699,  '18cm × 12cm × 10cm',   'col-span-1 row-span-1', true,  3,  true),
  ('Iron Man Helmet',           'Pop Culture & Sports',        1499, '28cm × 22cm × 28cm',   'col-span-1 row-span-1', true,  4,  true),
  ('Monkey D. Luffy',           'Gaming & Anime',              899,  '18cm × 10cm × 8cm',    'col-span-2 row-span-1', true,  5,  true),
  ('Spider-Man Figurine',       'Pop Culture & Sports',        899,  '20cm × 12cm × 10cm',   'col-span-2 row-span-2', true,  6,  true),
  ('Cristiano Ronaldo Bust',    'Pop Culture & Sports',        699,  '18cm × 12cm × 10cm',   'col-span-2 row-span-2', false, 7,  true),
  ('Low-Poly Lion',             'Sculptures & Decor',          799,  '15cm × 12cm × 10cm',   'col-span-1 row-span-1', false, 8,  true),
  ('Mewtwo Figurine',           'Gaming & Anime',              899,  '16cm × 10cm × 10cm',   'col-span-1 row-span-1', false, 9,  true),
  ('Project Hail Mary Ship',    'Gaming & Anime',              1199, '28cm × 10cm × 10cm',   'col-span-1 row-span-2', false, 10, true),
  ('Controller Mount',          'Desk & Functional',           549,  '20cm × 12cm × 8cm',    'col-span-2 row-span-1', false, 11, true),
  ('Headphone Stand',           'Desk & Functional',           549,  '25cm × 12cm × 12cm',   'col-span-2 row-span-1', false, 12, true),
  ('Faceted Cat Statue',        'Sculptures & Decor',          799,  '14cm × 8cm × 8cm',     'col-span-1 row-span-1', false, 13, true),
  ('Charmander Statue',         'Gaming & Anime',              899,  '12cm × 8cm × 8cm',     'col-span-1 row-span-1', false, 14, true),
  ('Pikachu Statue',            'Gaming & Anime',              899,  '12cm × 8cm × 8cm',     'col-span-1 row-span-1', false, 15, true),
  ('Harry Potter Bust',         'Pop Culture & Sports',        699,  '16cm × 10cm × 10cm',   'col-span-1 row-span-1', false, 16, true),
  ('Spider-Man Wall Pose',      'Pop Culture & Sports',        899,  '18cm × 12cm × 10cm',   'col-span-1 row-span-1', false, 17, true),
  ('Batman & Spidey Diorama',   'Pop Culture & Sports',        1199, '25cm × 18cm × 15cm',   'col-span-1 row-span-1', false, 18, true),
  ('Batman Bust',               'Pop Culture & Sports',        699,  '16cm × 12cm × 10cm',   'col-span-1 row-span-1', false, 19, true),
  ('Tactical Batman',           'Pop Culture & Sports',        699,  '16cm × 12cm × 10cm',   'col-span-1 row-span-1', false, 20, true),
  ('Neymar Jr. Statue',         'Pop Culture & Sports',        699,  '18cm × 12cm × 10cm',   'col-span-2 row-span-1', false, 21, true),
  ('Zekrom Statue',             'Gaming & Anime',              1199, '22cm × 15cm × 12cm',   'col-span-2 row-span-1', false, 22, true),
  ('Chibi Collectible',         'Pop Culture & Sports',        899,  '12cm × 8cm × 8cm',     'col-span-1 row-span-1', false, 23, true),
  ('Film Camera Keychain',      'Custom Gifts & Wearables',    199,  '5cm × 3cm × 1cm',      'col-span-1 row-span-1', false, 24, true),
  ('Iron Man Keychain',         'Custom Gifts & Wearables',    199,  '5cm × 3cm × 1cm',      'col-span-1 row-span-1', false, 25, true),
  ('Slayer Mark Keychain',      'Custom Gifts & Wearables',    199,  '5cm × 3cm × 1cm',      'col-span-1 row-span-1', false, 26, true),
  ('Kawaii Keychain',           'Custom Gifts & Wearables',    199,  '5cm × 3cm × 1cm',      'col-span-1 row-span-1', false, 27, true),
  ('Canine Statue',             'Sculptures & Decor',          799,  '15cm × 10cm × 8cm',    'col-span-1 row-span-1', false, 28, true),
  ('Key Organizer',             'Desk & Functional',           549,  '15cm × 8cm × 4cm',     'col-span-2 row-span-1', false, 29, true),
  ('Wood Key Holder',           'Desk & Functional',           549,  '15cm × 8cm × 4cm',     'col-span-2 row-span-1', false, 30, true),
  ('Luffy Action Figure',       'Gaming & Anime',              899,  '18cm × 10cm × 8cm',    'col-span-1 row-span-1', false, 31, true),
  ('Minion Figurine',           'Pop Culture & Sports',        899,  '14cm × 8cm × 8cm',     'col-span-1 row-span-1', false, 32, true),
  ('Film Clapperboard',         'Desk & Functional',           549,  '18cm × 14cm × 2cm',    'col-span-1 row-span-1', false, 33, true),
  ('Geometric Earrings',        'Custom Gifts & Wearables',    199,  '3cm × 1.5cm',          'col-span-1 row-span-1', false, 34, true),
  ('Spiral Earrings',           'Custom Gifts & Wearables',    199,  '3cm × 1.5cm',          'col-span-1 row-span-1', false, 35, true),
  ('Earring Tree Display',      'Desk & Functional',           549,  '20cm × 10cm × 10cm',   'col-span-1 row-span-1', false, 36, true),
  ('Custom Lithophane',         'Custom Gifts & Wearables',    999,  '15cm × 10cm × 0.5cm',  'col-span-2 row-span-1', false, 37, true),
  ('Father''s Day Plaque',      'Custom Gifts & Wearables',    999,  '18cm × 12cm × 1cm',    'col-span-2 row-span-1', false, 38, true),
  ('Dad Desk Trophy',           'Custom Gifts & Wearables',    999,  '15cm × 8cm × 8cm',     'col-span-1 row-span-1', false, 39, true),
  ('Dual Headphone Hook',       'Desk & Functional',           549,  '22cm × 10cm × 8cm',    'col-span-1 row-span-1', false, 40, true)
on conflict do nothing;

-- ─────────────────────────────────────────────────────────────────
-- 7. Add Website Order Columns to ERP orders table
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_phone text,
ADD COLUMN IF NOT EXISTS customer_email text,
ADD COLUMN IF NOT EXISTS delivery_address text,
ADD COLUMN IF NOT EXISTS order_mode text;

-- Allow anonymous inserts for website quotes/orders
CREATE POLICY "Enable insert for website public" ON public.orders FOR INSERT WITH CHECK (true);
