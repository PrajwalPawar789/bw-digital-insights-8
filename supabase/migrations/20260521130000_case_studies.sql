-- Case Studies — admin-managed cards shown in the Home page "Case Studies" section.
-- Replaces the previously hardcoded IKEA / SHEIN cards with CMS-editable content.

create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh on every edit (function defined in 20260405093000_secure_admin_access.sql).
drop trigger if exists set_case_studies_updated_at on public.case_studies;
create trigger set_case_studies_updated_at
before update on public.case_studies
for each row execute function public.set_updated_at();

-- RLS: public can read, only admins can write (same model as the other content tables).
alter table public.case_studies enable row level security;

drop policy if exists "Public read on case_studies" on public.case_studies;
create policy "Public read on case_studies"
  on public.case_studies
  for select
  using (true);

drop policy if exists "Admin manage case_studies" on public.case_studies;
create policy "Admin manage case_studies"
  on public.case_studies
  using (public.is_admin())
  with check (public.is_admin());

-- Seed the two cards so the Home section is populated on first deploy.
-- Admins upload the artwork from the admin panel and can edit/replace these afterwards.
insert into public.case_studies (title, image_url, display_order)
values
  ('Jollibee Foods: Building a Global Fast-Food Empire Rooted in Cultural Identity', null, 0),
  ('Rolex: The Story Behind the Crown that Became a Symbol of Luxury Watchmaking', null, 1);
