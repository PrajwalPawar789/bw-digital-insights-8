
-- Table for Upcoming Editions
CREATE TABLE public.upcoming_editions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  release_date text,
  status text,
  created_at timestamp with time zone DEFAULT now()
);

-- Table for Testimonials
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  name text NOT NULL,
  title text,
  company text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- Table for Client Logos
CREATE TABLE public.client_logos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text NOT NULL,
  website_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- (Optional) Table for Cover Story Highlights, if you want that content editable too
-- Uncomment if needed
-- CREATE TABLE public.cover_story_highlights (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   headline text NOT NULL,
--   content text,
--   order_number integer,
--   created_at timestamp with time zone DEFAULT now()
-- );

-- All RLS policies are open (public for demo/exploration). You can refine later.
ALTER TABLE public.upcoming_editions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all select" ON public.upcoming_editions FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON public.upcoming_editions FOR INSERT WITH CHECK (true);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all select" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON public.testimonials FOR INSERT WITH CHECK (true);

ALTER TABLE public.client_logos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all select" ON public.client_logos FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON public.client_logos FOR INSERT WITH CHECK (true);
