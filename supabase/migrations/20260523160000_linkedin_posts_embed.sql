-- Switch the Home "Follow on LinkedIn" section to use real LinkedIn iframe embeds.
-- We keep the existing columns so the old card layout still works as a fallback when
-- an embed URL is not provided.

alter table public.linkedin_posts
  add column if not exists embed_url text;

-- Backfill embed URLs for the four seeded posts, derived from their existing
-- activity IDs in `href`. Admins can edit these from the admin panel.
update public.linkedin_posts
set embed_url = 'https://www.linkedin.com/embed/feed/update/urn:li:share:7420970957311332352'
where href like '%activity-7420970957311332352%';

update public.linkedin_posts
set embed_url = 'https://www.linkedin.com/embed/feed/update/urn:li:share:7414667185844813825'
where href like '%activity-7414667185844813825%';

update public.linkedin_posts
set embed_url = 'https://www.linkedin.com/embed/feed/update/urn:li:share:7326407161662558208'
where href like '%activity-7326407161662558208%';

update public.linkedin_posts
set embed_url = 'https://www.linkedin.com/embed/feed/update/urn:li:share:7404623558976499714'
where href like '%activity-7404623558976499714%';
