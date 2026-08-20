-- Rode no SQL Editor do Supabase (projeto gratuito serve)

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  customer_name text not null,
  customer_phone text not null,
  address text not null,
  region text default '',
  freight numeric not null default 0,
  payment_method text not null,
  notes text default '',
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null default 0,
  total numeric not null default 0,
  status text not null default 'recebido'
    check (status in ('recebido', 'preparo', 'saiu', 'entregue')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

alter table public.orders enable row level security;

-- Fase 1 econômica: app do cliente e painel usam a anon key.
-- (Depois dá para endurecer com login Supabase Auth.)
create policy "Permitir insert de pedidos"
  on public.orders for insert
  to anon, authenticated
  with check (true);

create policy "Permitir leitura de pedidos"
  on public.orders for select
  to anon, authenticated
  using (true);

create policy "Permitir update de pedidos"
  on public.orders for update
  to anon, authenticated
  using (true)
  with check (true);

-- Realtime (painel atualiza sozinho)
alter publication supabase_realtime add table public.orders;
