drop policy if exists "Students can update their own profile" on public.students;
create policy "Students can update their own profile"
  on public.students for update
  to authenticated
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

grant update (full_name, photo_url) on public.students to authenticated;

alter table public.students
  add column if not exists photo_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'student-profile-photos',
  'student-profile-photos',
  true,
  3145728,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Students can view their profile photo object" on storage.objects;
create policy "Students can view their profile photo object"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'student-profile-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Students can upload their profile photo" on storage.objects;
create policy "Students can upload their profile photo"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'student-profile-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Students can update their profile photo" on storage.objects;
create policy "Students can update their profile photo"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'student-profile-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'student-profile-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Students can delete their profile photo" on storage.objects;
create policy "Students can delete their profile photo"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'student-profile-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );