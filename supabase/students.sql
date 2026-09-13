create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.students enable row level security;

create or replace function public.handle_new_student()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.students (auth_user_id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Student'), new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_student on auth.users;

create trigger on_auth_user_created_student
  after insert on auth.users
  for each row execute procedure public.handle_new_student();

-- The current admin portal uses its own admins table, so these policies allow
-- the dashboard to read/delete student profiles with the configured anon key.

drop policy if exists "Students can create their profile" on public.students;
create policy "Students can create their profile"
  on public.students for insert
  with check (auth.uid() = auth_user_id);

drop policy if exists "Students can view profiles" on public.students;
create policy "Students can view profiles"
  on public.students for select
  using (true);

drop policy if exists "Admins can delete student profiles" on public.students;
create policy "Admins can delete student profiles"
  on public.students for delete
  using (true);
