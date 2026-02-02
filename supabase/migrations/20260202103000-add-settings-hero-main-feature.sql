-- Ensure settings table exists and allow public read/write (adjust as needed)
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Keep updated_at fresh on updates
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_settings_updated_at on public.settings;
create trigger set_settings_updated_at
before update on public.settings
for each row execute function public.set_updated_at();

alter table public.settings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'settings'
      and policyname = 'Allow all select on settings'
  ) then
    create policy "Allow all select on settings" on public.settings for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'settings'
      and policyname = 'Allow all insert on settings'
  ) then
    create policy "Allow all insert on settings" on public.settings for insert with check (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'settings'
      and policyname = 'Allow all update on settings'
  ) then
    create policy "Allow all update on settings" on public.settings for update using (true);
  end if;
end $$;

-- Seed key for hero main article selection (nullable)
insert into public.settings (key, value, description)
values ('hero_main_article_id', null, 'Article ID used as the homepage hero main feature')
on conflict (key) do nothing;
