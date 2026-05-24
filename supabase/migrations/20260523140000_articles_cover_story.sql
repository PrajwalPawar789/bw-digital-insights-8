-- Allow articles to be pinned to the Home "Cover Story" carousel.
-- Extends articles_home_placement_check to include 'cover_story'.

alter table public.articles
  drop constraint if exists articles_home_placement_check;

alter table public.articles
  add constraint articles_home_placement_check
  check (
    home_placement is null
    or home_placement in ('grid','cxo','bizhot_metro','business_bulletin','cover_story')
  );
