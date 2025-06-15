
-- Insert for Upcoming Editions
INSERT INTO public.upcoming_editions (title, description, image_url, release_date, status)
VALUES (
  'A sneak peek at our future editions currently in development',
  'Preview what is coming up in our next issues, featuring exclusive interviews and business insights.',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
  'September 2025',
  'Coming Soon'
);

-- Example Testimonials for "What Industry Leaders Say"
INSERT INTO public.testimonials (name, quote, title, company, avatar_url)
VALUES
('Jonathan Reynolds', 'InsightsBW has been an invaluable resource for our executive team. The in-depth analysis and forward-looking perspectives have directly informed our strategic planning process.', 'Chief Executive Officer', 'Nexus Innovations', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60'),
('Michelle Zhang', 'The quality and depth of market insights provided by InsightsBW is unmatched. Their analysis has helped us identify emerging opportunities ahead of our competitors.', 'Chief Strategy Officer', 'Global Ventures Corp', 'https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?w=500&auto=format&fit=crop&q=60'),
('Sarah Thompson', 'The leadership profiles and interviews in InsightsBW have provided me with practical insights that have directly influenced my management approach.', 'Vice President of Operations', 'Momentum Enterprises', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=60');

