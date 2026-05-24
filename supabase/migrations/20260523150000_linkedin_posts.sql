-- LinkedIn Posts — admin-managed cards shown in the Home page "Follow on LinkedIn" section.
-- Replaces the previously hardcoded LINKEDIN_POSTS array with CMS-editable content.

create table if not exists public.linkedin_posts (
  id uuid primary key default gen_random_uuid(),
  body text not null,
  image_url text,
  likes integer not null default 0,
  href text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_linkedin_posts_updated_at on public.linkedin_posts;
create trigger set_linkedin_posts_updated_at
before update on public.linkedin_posts
for each row execute function public.set_updated_at();

alter table public.linkedin_posts enable row level security;

drop policy if exists "Public read on linkedin_posts" on public.linkedin_posts;
create policy "Public read on linkedin_posts"
  on public.linkedin_posts
  for select
  using (true);

drop policy if exists "Admin manage linkedin_posts" on public.linkedin_posts;
create policy "Admin manage linkedin_posts"
  on public.linkedin_posts
  using (public.is_admin())
  with check (public.is_admin());

-- Seed with the four cards that used to be hardcoded in Home.tsx so the section is
-- not blank on first deploy. Admins can edit / replace these from the admin panel.
insert into public.linkedin_posts (body, image_url, likes, href, display_order)
values
  (
    'Inside the boardroom: why CIOs are now the chief storytellers of digital transformation.',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=70',
    142,
    'https://www.linkedin.com/posts/theciovision_digitaltransformation-itmanagement-technology-activity-7420970957311332352-aZah',
    0
  ),
  (
    'Cover story: the leaders rewriting the AI playbook in regulated industries.',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=70',
    98,
    'https://www.linkedin.com/posts/info-tech-research-group_cio-itstrategy-digitaltransformation-activity-7414667185844813825-1v3J',
    1
  ),
  (
    'Sustainability in the cloud — 7 CTOs share blueprints they wish they had 5 years ago.',
    'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=600&q=70',
    211,
    'https://www.linkedin.com/posts/samfrmarshall_cio-techleadership-activity-7326407161662558208-ns5Y',
    2
  ),
  (
    'Hall of Fame announcement Friday. Hint: she rebuilt a Fortune 100 stack in 18 months.',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=70',
    67,
    'https://www.linkedin.com/posts/forbes-magazine_the-cios-role-has-fundamentally-changed-activity-7404623558976499714-UGWT',
    3
  );
