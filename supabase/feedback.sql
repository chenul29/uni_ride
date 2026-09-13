create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  feedback text not null,
  rating integer not null check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

drop policy if exists "Anyone can submit feedback" on public.feedback;
create policy "Anyone can submit feedback"
  on public.feedback for insert
  with check (
    char_length(trim(student_name)) between 2 and 100
    and char_length(trim(feedback)) between 1 and 2000
  );

drop policy if exists "Authenticated users can view feedback" on public.feedback;
drop policy if exists "Admins can view feedback" on public.feedback;
create policy "Admins can view feedback"
  on public.feedback for select
  using (true);

drop policy if exists "Admins can delete feedback" on public.feedback;
create policy "Admins can delete feedback"
  on public.feedback for delete
  using (true);