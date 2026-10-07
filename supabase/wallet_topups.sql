create table if not exists public.wallet (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null unique references public.students(id) on delete restrict,
  amount numeric(10, 2) not null check (amount > 0),
  created_at timestamptz not null default now()
);

create unique index if not exists wallet_student_id_idx
  on public.wallet (student_id);

create or replace function public.create_student_wallet()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.wallet (student_id, amount)
  values (new.id, 1000)
  on conflict (student_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_student_created_wallet on public.students;

create trigger on_student_created_wallet
  after insert on public.students
  for each row execute procedure public.create_student_wallet();

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

drop policy if exists "Students can view their wallet" on public.wallet;
create policy "Students can view their wallet"
  on public.wallet
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.students
      where students.id = wallet.student_id
        and students.auth_user_id = auth.uid()
    )
  );

drop policy if exists "Students can update their wallet" on public.wallet;
create policy "Students can update their wallet"
  on public.wallet
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.students
      where students.id = wallet.student_id
        and students.auth_user_id = auth.uid()
    )
  )
  with check (amount > 0);