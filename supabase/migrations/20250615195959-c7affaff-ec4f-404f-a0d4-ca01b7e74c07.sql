
-- Create table to store newsletter subscribers' emails
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public subscribe), but not select/delete/update
CREATE POLICY "Public can insert newsletter subscribers" ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Allow no select/delete/update by default (for privacy)
REVOKE ALL ON public.newsletter_subscribers FROM PUBLIC;
