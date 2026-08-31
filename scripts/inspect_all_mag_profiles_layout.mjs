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

async function inspect() {
  const { data: magazines } = await supabase.from('magazines').select('*');
  const { data: leaders } = await supabase.from('leadership_profiles').select('*');
  const { data: articles } = await supabase.from('articles').select('*');

  console.log("=== All Magazines and their Cover Stories ===");
  for (const m of magazines) {
    const featArt = articles.find(a => a.id === m.featured_article_id);
    console.log(`\nMagazine: "${m.title}"`);
    console.log(`  Cover Story: "${featArt?.title}" (Author: ${featArt?.author}, Slug: ${featArt?.slug})`);
    console.log(`  Cover Image: ${m.cover_image_url}`);
  }
}

inspect();
