create extension if not exists pgcrypto;

create table if not exists public.ticket_verifications (
  id uuid primary key default gen_random_uuid(),
  booking_token text not null,
  ticket_number text not null,
  route text not null,
  tickets integer not null check (tickets > 0),
  payment_method text not null,
  amount numeric not null check (amount >= 0),
  facility_code text not null,
  verified_at timestamptz not null default now()
);

create index if not exists ticket_verifications_booking_token_idx
  on public.ticket_verifications (booking_token);

create unique index if not exists ticket_verifications_booking_token_unique_idx
  on public.ticket_verifications (booking_token);

alter table public.ticket_verifications enable row level security;

drop policy if exists "Allow conductor verification inserts" on public.ticket_verifications;
create policy "Allow conductor verification inserts"
  on public.ticket_verifications for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Allow conductor verification updates" on public.ticket_verifications;
create policy "Allow conductor verification updates"
  on public.ticket_verifications for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Allow conductor verification reads" on public.ticket_verifications;
create policy "Allow conductor verification reads"
  on public.ticket_verifications for select
  to anon, authenticated
  using (true);
