-- Home page placement tags
-- Adds explicit "where does this content appear on the Home page" fields so the
-- Home page maps content by tag instead of by slice()/modulo (which caused repeats).

-- 1. Magazines: which region tab a magazine appears under (NULL = shows on every tab)
alter table public.magazines
  add column if not exists region text;
alter table public.magazines
  drop constraint if exists magazines_region_check;
alter table public.magazines
  add constraint magazines_region_check
  check (region is null or region in ('americas','europe','mea','apac','hall'));

-- 2. Articles: which Home section an article is pinned to (NULL = not on Home)
alter table public.articles
  add column if not exists home_placement text;
alter table public.articles
  drop constraint if exists articles_home_placement_check;
alter table public.articles
  add constraint articles_home_placement_check
  check (home_placement is null or home_placement in ('grid','cxo','bizhot_metro','business_bulletin'));
alter table public.articles
  add column if not exists home_order integer;

-- 3. Leadership profiles: which Home section(s) a profile appears in
alter table public.leadership_profiles
  add column if not exists home_sections text[];
alter table public.leadership_profiles
  drop constraint if exists leadership_home_sections_check;
alter table public.leadership_profiles
  add constraint leadership_home_sections_check
  check (
    home_sections is null
    or home_sections <@ array['cover_story','magazine_profile','video_interview','leadership_talk']::text[]
  );
alter table public.leadership_profiles
  add column if not exists home_order integer;

-- ---------------------------------------------------------------------------
-- Backfill: tag the existing rows so the Home page has correct data on day one.
-- The admin UI can change any of these afterwards.
-- ---------------------------------------------------------------------------

-- Magazines -> region tab (2 per region)
update public.magazines set region = 'americas'
  where id in ('47091ddc-a8c9-47d9-82fa-4d324956042c','24dc433e-d10b-43aa-b539-f2ff41e6c1ed');
update public.magazines set region = 'europe'
  where id in ('62cd1a5a-a69a-44eb-a05f-c71955780113','0582a478-5c00-41da-8f05-e7d823d7b961');
update public.magazines set region = 'mea'
  where id in ('6a6e35a2-df38-4ef2-a098-7f7e44b60fde','70c53727-13f9-4071-9178-006298d8f966');
update public.magazines set region = 'apac'
  where id in ('6963bedf-732f-41a9-920a-e4df4bff8a8f','26e0a989-f861-4396-ab35-723696b7e228');

-- Articles -> Home section (home_order = position within the section)
update public.articles set home_placement = 'cxo', home_order = t.ord
  from (values
    ('2be801dc-6271-4dbe-85b1-00e7c655734b'::uuid,0),
    ('91fe1344-63fa-4e6d-8d5b-373088d3039b'::uuid,1),
    ('e185c55c-841b-443e-a28f-1d139f01e054'::uuid,2),
    ('0a351902-7dc0-4ed3-98a1-84c7b251305b'::uuid,3)
  ) as t(id,ord) where articles.id = t.id;

update public.articles set home_placement = 'grid', home_order = t.ord
  from (values
    ('3f7276c3-c915-4484-a588-9d18f03bd56d'::uuid,0),
    ('894be57b-3e47-4477-b857-d9be42c8893d'::uuid,1),
    ('57446111-dd79-44ff-9dde-4ea2d58c8ce4'::uuid,2),
    ('4f12d667-e96b-4673-94f1-b0617cbafede'::uuid,3),
    ('bf2a865b-2afd-418f-91ee-8055516e37f1'::uuid,4),
    ('d284eee2-9a2f-4b30-9666-8680a05869bb'::uuid,5),
    ('38deca4c-0961-4e7f-ab25-698bb510b647'::uuid,6),
    ('3f120510-d286-4a39-9541-029e214cb7f9'::uuid,7),
    ('e3e28718-d51d-4677-84dd-c14d09beb112'::uuid,8)
  ) as t(id,ord) where articles.id = t.id;

update public.articles set home_placement = 'bizhot_metro', home_order = t.ord
  from (values
    ('9547d024-b0e5-4068-bc08-5336174c5d40'::uuid,0),
    ('b89019d3-81ca-4ad9-b631-4bf44aa8c768'::uuid,1),
    ('5e5acf9e-0bb5-43ec-95d6-a8e5f1853631'::uuid,2),
    ('2498f8c2-3ad8-4bea-803b-2d10fb13c4bf'::uuid,3)
  ) as t(id,ord) where articles.id = t.id;

update public.articles set home_placement = 'business_bulletin', home_order = t.ord
  from (values
    ('4d111604-a404-487c-a150-003ad578451b'::uuid,0),
    ('5865cb3a-e291-4271-92c6-5b265f76b640'::uuid,1)
  ) as t(id,ord) where articles.id = t.id;

-- Leadership profiles -> Home section(s)
update public.leadership_profiles set home_sections = array['cover_story'], home_order = t.ord
  from (values
    ('5ac77be9-a632-434f-8c1f-88254524ff69'::uuid,0),
    ('d0efd9bb-699c-44ad-83b5-a16b119229d0'::uuid,1),
    ('08f5bd56-f023-426f-a565-8ab8cf0fee6b'::uuid,2)
  ) as t(id,ord) where leadership_profiles.id = t.id;

update public.leadership_profiles set home_sections = array['magazine_profile'], home_order = t.ord
  from (values
    ('df803d0e-e91a-4d90-98b0-2ca630ffb877'::uuid,0),
    ('8e993c7a-ced9-425d-a0c3-27beebf282c8'::uuid,1),
    ('6cd4bdfc-d559-467f-ad01-e4c8176bf50e'::uuid,2)
  ) as t(id,ord) where leadership_profiles.id = t.id;

update public.leadership_profiles set home_sections = array['video_interview'], home_order = t.ord
  from (values
    ('f9e74962-68d4-4584-82a8-47e727d73c62'::uuid,0),
    ('656aa309-7c59-4d69-b846-176949b7f133'::uuid,1)
  ) as t(id,ord) where leadership_profiles.id = t.id;

update public.leadership_profiles set home_sections = array['leadership_talk'], home_order = t.ord
  from (values
    ('b9daf28a-adb7-49bc-8340-fe9442df31a6'::uuid,0),
    ('ffb77a3a-47f9-4b22-8963-3ab1d9ef672c'::uuid,1)
  ) as t(id,ord) where leadership_profiles.id = t.id;
