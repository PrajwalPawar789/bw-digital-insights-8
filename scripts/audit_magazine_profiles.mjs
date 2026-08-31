import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const firstEquals = trimmed.indexOf('=');
    if (firstEquals === -1) continue;
    const key = trimmed.slice(0, firstEquals).trim();
    let val = trimmed.slice(firstEquals + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function auditMagazineProfiles() {
  const { data: magazines } = await supabase.from('magazines').select('id, title, slug, cover_image_url, featured_article_id');
  const { data: magArticles } = await supabase.from('magazine_articles').select('id, magazine_id, article_id, featured, page_number');
  const { data: articles } = await supabase.from('articles').select('id, title, slug, category, author');
  const { data: leaders } = await supabase.from('leadership_profiles').select('id, name, slug, home_sections, article_title');

  console.log(`Magazines (${magazines.length}):`);
  console.log(JSON.stringify(magazines, null, 2));

  console.log(`\nMagazine Articles relationships (${magArticles.length}):`);
  console.log(JSON.stringify(magArticles, null, 2));

  const magProfileLeaders = leaders.filter(l => (l.home_sections || []).includes('magazine_profile'));
  console.log(`\nLeadership Profiles in 'magazine_profile' (${magProfileLeaders.length}):`);
  console.log(JSON.stringify(magProfileLeaders.map(l => ({ name: l.name, slug: l.slug, article_title: l.article_title })), null, 2));
}

auditMagazineProfiles();
