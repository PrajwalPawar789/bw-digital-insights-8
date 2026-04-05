create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  user_id uuid unique,
  full_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_users_user_id_fkey
    foreign key (user_id)
    references auth.users (id)
    on delete set null
);

alter table public.admin_users
  alter column email set not null;

update public.admin_users
set email = lower(trim(email))
where email is not null
  and email <> lower(trim(email));

create unique index if not exists admin_users_email_lower_key
  on public.admin_users (lower(email));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_admin_users_updated_at on public.admin_users;
create trigger set_admin_users_updated_at
before update on public.admin_users
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where is_active = true
      and (
        user_id = auth.uid()
        or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  );
$$;

grant execute on function public.is_admin() to anon, authenticated, service_role;

alter table public.admin_users enable row level security;

drop policy if exists "Service role can manage admin_users" on public.admin_users;
create policy "Service role can manage admin_users"
on public.admin_users
as permissive
for all
to service_role
using (true)
with check (true);

do $$
declare
  target_table text;
  legacy_policy_name text;
  target_tables text[] := array[
    'articles',
    'client_logos',
    'leadership_profiles',
    'magazine_articles',
    'magazines',
    'press_releases',
    'settings',
    'testimonials',
    'upcoming_editions'
  ];
  legacy_policy_names text[];
begin
  foreach target_table in array target_tables
  loop
    execute format('alter table public.%I enable row level security', target_table);

    legacy_policy_names := array[
      format('Allow public read on %s', target_table),
      format('Allow public insert on %s', target_table),
      format('Allow public update on %s', target_table),
      format('Allow public delete on %s', target_table),
      format('Allow all select on %s', target_table),
      format('Allow all insert on %s', target_table),
      format('Allow all update on %s', target_table),
      format('Allow all delete on %s', target_table),
      'Allow all select',
      'Allow all insert',
      'Allow all update',
      'Allow all delete',
      'Allow all select on settings',
      'Allow all insert on settings',
      'Allow all update on settings',
      format('Public read on %s', target_table),
      format('Admin manage %s', target_table)
    ];

    foreach legacy_policy_name in array legacy_policy_names
    loop
      execute format('drop policy if exists %I on public.%I', legacy_policy_name, target_table);
    end loop;

    execute format(
      'create policy %I on public.%I for select using (true)',
      format('Public read on %s', target_table),
      target_table
    );

    execute format(
      'create policy %I on public.%I using (public.is_admin()) with check (public.is_admin())',
      format('Admin manage %s', target_table),
      target_table
    );
  end loop;
end $$;

drop policy if exists "Allow public read website-images" on storage.objects;
drop policy if exists "Allow public insert website-images" on storage.objects;
drop policy if exists "Allow public update website-images" on storage.objects;
drop policy if exists "Allow public delete website-images" on storage.objects;
drop policy if exists "Public read website-images" on storage.objects;
drop policy if exists "Admin manage website-images" on storage.objects;

create policy "Public read website-images"
on storage.objects
for select
using (bucket_id = 'website-images');

create policy "Admin manage website-images"
on storage.objects
using (bucket_id = 'website-images' and public.is_admin())
with check (bucket_id = 'website-images' and public.is_admin());

drop policy if exists "Allow public read magazine-pdfs" on storage.objects;
drop policy if exists "Allow public insert magazine-pdfs" on storage.objects;
drop policy if exists "Allow public update magazine-pdfs" on storage.objects;
drop policy if exists "Allow public delete magazine-pdfs" on storage.objects;
drop policy if exists "Public read magazine-pdfs" on storage.objects;
drop policy if exists "Admin manage magazine-pdfs" on storage.objects;

create policy "Public read magazine-pdfs"
on storage.objects
for select
using (bucket_id = 'magazine-pdfs');

create policy "Admin manage magazine-pdfs"
on storage.objects
using (bucket_id = 'magazine-pdfs' and public.is_admin())
with check (bucket_id = 'magazine-pdfs' and public.is_admin());
