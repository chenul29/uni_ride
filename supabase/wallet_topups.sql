create table if not exists public.wallet (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete restrict,
  amount numeric(10, 2) not null check (amount > 0),
  created_at timestamptz not null default now()
);

create index if not exists wallet_created_at_idx
  on public.wallet (created_at desc);

alter table public.wallet enable row level security;

drop policy if exists "Admins can view wallet top-ups" on public.wallet;
create policy "Admins can view wallet top-ups"
  on public.wallet
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can create wallet top-ups" on public.wallet;
create policy "Admins can create wallet top-ups"
  on public.wallet
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins can update wallet top-ups" on public.wallet;
create policy "Admins can update wallet top-ups"
  on public.wallet
  for update
  to anon, authenticated
  using (true)
  with check (amount > 0);