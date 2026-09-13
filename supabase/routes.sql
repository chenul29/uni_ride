create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  starting_point text not null,
  ending_point text not null,
  ticket_price numeric(10, 2) not null check (ticket_price >= 0),
  created_at timestamptz not null default now()
);

alter table public.routes enable row level security;

drop policy if exists "Admins can view routes" on public.routes;
create policy "Admins can view routes"
  on public.routes for select
  using (true);

drop policy if exists "Admins can create routes" on public.routes;
create policy "Admins can create routes"
  on public.routes for insert
  with check (true);

drop policy if exists "Admins can delete routes" on public.routes;
create policy "Admins can delete routes"
  on public.routes for delete
  using (true);