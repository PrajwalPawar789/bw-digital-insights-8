-- Repair URLs that were saved with a localhost proxy prefix (e.g.
-- http://localhost:5173/supabase/storage/v1/object/public/...) instead of the
-- canonical Supabase public storage URL. See useImageUpload.ts: when the
-- direct storage client failed to set its session, the upload fell back to the
-- proxied client which returned a host-bound public URL.

do $$
declare
  canonical text := 'https://atosvqrnlmmlljygfvdf.supabase.co/storage/v1/object/public/';
  localhost_re text := '^https?://(localhost|127\.0\.0\.1|\[?::1\]?)(:\d+)?/supabase/storage/v1/object/public/';
begin
  update public.magazines
     set cover_image_url = regexp_replace(cover_image_url, localhost_re, canonical)
   where cover_image_url ~ localhost_re;

  update public.magazines
     set pdf_url = regexp_replace(pdf_url, localhost_re, canonical)
   where pdf_url ~ localhost_re;

  update public.articles
     set image_url = regexp_replace(image_url, localhost_re, canonical)
   where image_url ~ localhost_re;

  update public.press_releases
     set image_url = regexp_replace(image_url, localhost_re, canonical)
   where image_url ~ localhost_re;

  update public.leadership_profiles
     set image_url = regexp_replace(image_url, localhost_re, canonical)
   where image_url ~ localhost_re;

  update public.case_studies
     set image_url = regexp_replace(image_url, localhost_re, canonical)
   where image_url ~ localhost_re;

  update public.upcoming_editions
     set image_url = regexp_replace(image_url, localhost_re, canonical)
   where image_url ~ localhost_re;

  update public.home_section_items
     set image_url = regexp_replace(image_url, localhost_re, canonical)
   where image_url ~ localhost_re;

  update public.home_sections
     set background_image_url = regexp_replace(background_image_url, localhost_re, canonical)
   where background_image_url ~ localhost_re;

  update public.client_logos
     set logo_url = regexp_replace(logo_url, localhost_re, canonical)
   where logo_url ~ localhost_re;

  update public.testimonials
     set avatar_url = regexp_replace(avatar_url, localhost_re, canonical)
   where avatar_url ~ localhost_re;
end $$;
