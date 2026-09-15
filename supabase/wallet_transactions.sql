create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  booking_token text not null unique,
  route text not null,
  tickets integer not null check (tickets > 0),
  payment_method text not null,
  amount numeric(10, 2) not null check (amount >= 0),
  balance_after numeric(10, 2) not null check (balance_after >= 0),
  status text not null default 'completed',
  created_at timestamptz not null default now()
);

create index if not exists wallet_transactions_created_at_idx
  on public.wallet_transactions (created_at desc);

alter table public.wallet_transactions enable row level security;

drop policy if exists "Allow wallet transaction inserts" on public.wallet_transactions;
create policy "Allow wallet transaction inserts"
  on public.wallet_transactions
  for insert
  to anon, authenticated
  with check (true);
