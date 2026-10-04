create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete set null,
  booking_token text not null unique,
  route text not null,
  tickets integer not null check (tickets > 0),
  payment_method text not null,
  amount numeric(10, 2) not null check (amount >= 0),
  balance_after numeric(10, 2) not null check (balance_after >= 0),
  status text not null default 'completed',
  created_at timestamptz not null default now()
);

alter table public.wallet_transactions
  add column if not exists student_id uuid references public.students(id) on delete set null;

create index if not exists wallet_transactions_created_at_idx
  on public.wallet_transactions (created_at desc);

alter table public.wallet_transactions enable row level security;

drop policy if exists "Allow wallet transaction inserts" on public.wallet_transactions;
create policy "Allow wallet transaction inserts"
  on public.wallet_transactions
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Allow wallet transaction reads" on public.wallet_transactions;
create policy "Allow wallet transaction reads"
  on public.wallet_transactions
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Allow wallet transaction deletes" on public.wallet_transactions;
create policy "Allow wallet transaction deletes"
  on public.wallet_transactions
  for delete
  to anon, authenticated
  using (true);
