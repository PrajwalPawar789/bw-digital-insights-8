
-- Create a settings table for dynamic content management
CREATE TABLE public.settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert default settings
INSERT INTO public.settings (key, value, description) VALUES
('company_name', 'Insights Business Magazine', 'Company name displayed across the website'),
('breaking_news_enabled', 'true', 'Enable/disable breaking news section on homepage'),
('breaking_news_title', 'Breaking Business News', 'Title for breaking news section'),
('breaking_news_subtitle', 'Latest updates from the business world', 'Subtitle for breaking news section');

-- Add featured_article_id column to magazines table
ALTER TABLE public.magazines 
ADD COLUMN featured_article_id uuid REFERENCES public.articles(id);

-- Enable RLS on settings table
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for settings (publicly readable)
CREATE POLICY "Settings are publicly readable"
  ON public.settings
  FOR SELECT
  TO public
  USING (true);

-- Create RLS policies for authenticated users to manage settings
CREATE POLICY "Authenticated users can manage settings"
  ON public.settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger to update updated_at column
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
