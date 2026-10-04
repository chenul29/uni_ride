create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  feedback text not null,
  rating integer not null check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

-- This also upgrades feedback tables created before account ownership was added.
alter table public.feedback
  add column if not exists auth_user_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'feedback_auth_user_id_fkey'
      and conrelid = 'public.feedback'::regclass
  ) then
    alter table public.feedback
      add constraint feedback_auth_user_id_fkey
      foreign key (auth_user_id) references auth.users(id) on delete cascade;
  end if;
end $$;

alter table public.feedback enable row level security;

drop policy if exists "Anyone can submit feedback" on public.feedback;
drop policy if exists "Authenticated users can submit feedback" on public.feedback;
create policy "Authenticated users can submit feedback"
  on public.feedback for insert
  with check (
    auth_user_id = auth.uid()
    and
    char_length(trim(student_name)) between 2 and 100
    and char_length(trim(feedback)) between 1 and 2000
  );

drop policy if exists "Authenticated users can view feedback" on public.feedback;
drop policy if exists "Admins can view feedback" on public.feedback;
create policy "Admins can view feedback"
  on public.feedback for select
  using (true);

drop policy if exists "Students can update their own feedback" on public.feedback;
create policy "Students can update their own feedback"
  on public.feedback for update
  using (auth_user_id = auth.uid())
  with check (
    auth_user_id = auth.uid()
    and char_length(trim(student_name)) between 2 and 100
    and char_length(trim(feedback)) between 1 and 2000
  );

drop policy if exists "Admins can delete feedback" on public.feedback;
create policy "Admins can delete feedback"
  on public.feedback for delete
  using (true);