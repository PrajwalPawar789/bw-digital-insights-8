-- Extend leadership_profiles.home_sections allowed values to include 'cxo_article'.
-- The admin UI (src/lib/home-placements.ts) added a "Home — CXO Articles" option
-- after the original constraint was created, causing PATCH 400 (Postgres 23514).

alter table public.leadership_profiles
  drop constraint if exists leadership_home_sections_check;

alter table public.leadership_profiles
  add constraint leadership_home_sections_check
  check (
    home_sections is null
    or home_sections <@ array['cover_story','magazine_profile','video_interview','leadership_talk','cxo_article']::text[]
  );
