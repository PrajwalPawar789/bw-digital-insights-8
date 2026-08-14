-- Editorial metadata used by the reference-style article detail template.
alter table public.articles
  add column if not exists image_source text,
  add column if not exists image_source_url text;

comment on column public.articles.image_source is
  'Human-readable attribution displayed below the featured image.';
comment on column public.articles.image_source_url is
  'Optional source link for the featured image attribution.';
