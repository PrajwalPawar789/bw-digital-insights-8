alter table public.leadership_profiles enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'leadership_profiles'
      and policyname = 'Allow public read on leadership_profiles'
  ) then
    create policy "Allow public read on leadership_profiles"
    on public.leadership_profiles
    for select
    using (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'leadership_profiles'
      and policyname = 'Allow public insert on leadership_profiles'
  ) then
    create policy "Allow public insert on leadership_profiles"
    on public.leadership_profiles
    for insert
    with check (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'leadership_profiles'
      and policyname = 'Allow public update on leadership_profiles'
  ) then
    create policy "Allow public update on leadership_profiles"
    on public.leadership_profiles
    for update
    using (true)
    with check (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'leadership_profiles'
      and policyname = 'Allow public delete on leadership_profiles'
  ) then
    create policy "Allow public delete on leadership_profiles"
    on public.leadership_profiles
    for delete
    using (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Allow public read website-images'
  ) then
    create policy "Allow public read website-images"
    on storage.objects
    for select
    using (bucket_id = 'website-images');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Allow public insert website-images'
  ) then
    create policy "Allow public insert website-images"
    on storage.objects
    for insert
    with check (bucket_id = 'website-images');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Allow public update website-images'
  ) then
    create policy "Allow public update website-images"
    on storage.objects
    for update
    using (bucket_id = 'website-images')
    with check (bucket_id = 'website-images');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Allow public delete website-images'
  ) then
    create policy "Allow public delete website-images"
    on storage.objects
    for delete
    using (bucket_id = 'website-images');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Allow public read magazine-pdfs'
  ) then
    create policy "Allow public read magazine-pdfs"
    on storage.objects
    for select
    using (bucket_id = 'magazine-pdfs');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Allow public insert magazine-pdfs'
  ) then
    create policy "Allow public insert magazine-pdfs"
    on storage.objects
    for insert
    with check (bucket_id = 'magazine-pdfs');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Allow public update magazine-pdfs'
  ) then
    create policy "Allow public update magazine-pdfs"
    on storage.objects
    for update
    using (bucket_id = 'magazine-pdfs')
    with check (bucket_id = 'magazine-pdfs');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Allow public delete magazine-pdfs'
  ) then
    create policy "Allow public delete magazine-pdfs"
    on storage.objects
    for delete
    using (bucket_id = 'magazine-pdfs');
  end if;
end $$;
