-- Editorial fields used by the Leadership Talks story template.
-- The directory portrait remains in image_url; the wide story artwork is optional.
alter table public.leadership_profiles
  add column if not exists article_title text,
  add column if not exists featured_image_url text;

comment on column public.leadership_profiles.article_title is
  'Optional editorial headline for the individual Leadership Talks story.';

comment on column public.leadership_profiles.featured_image_url is
  'Optional wide featured artwork for the Leadership Talks story; falls back to image_url.';
