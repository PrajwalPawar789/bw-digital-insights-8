do $$
declare
  target_table text;
  target_tables text[] := array[
    'articles',
    'magazines',
    'press_releases',
    'testimonials',
    'client_logos',
    'settings',
    'magazine_articles',
    'upcoming_editions'
  ];
begin
  foreach target_table in array target_tables
  loop
    execute format('alter table public.%I enable row level security', target_table);

    if not exists (
      select 1
      from pg_policies
      where schemaname = 'public'
        and tablename = target_table
        and policyname = format('Allow public insert on %s', target_table)
    ) then
      execute format(
        'create policy %I on public.%I for insert with check (true)',
        format('Allow public insert on %s', target_table),
        target_table
      );
    end if;

    if not exists (
      select 1
      from pg_policies
      where schemaname = 'public'
        and tablename = target_table
        and policyname = format('Allow public update on %s', target_table)
    ) then
      execute format(
        'create policy %I on public.%I for update using (true) with check (true)',
        format('Allow public update on %s', target_table),
        target_table
      );
    end if;

    if not exists (
      select 1
      from pg_policies
      where schemaname = 'public'
        and tablename = target_table
        and policyname = format('Allow public delete on %s', target_table)
    ) then
      execute format(
        'create policy %I on public.%I for delete using (true)',
        format('Allow public delete on %s', target_table),
        target_table
      );
    end if;
  end loop;
end $$;
