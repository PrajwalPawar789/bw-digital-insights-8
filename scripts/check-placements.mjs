import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
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

async function checkPlacements() {
  console.log("Checking home_placement in Supabase...");

  const { data: bbArticles, error: bbError } = await supabase
    .from('articles')
    .select('id, title, home_placement, home_order, slug')
    .eq('home_placement', 'business_bulletin');

  if (bbError) {
    console.error("Error:", bbError);
  } else {
    console.log(`\nArticles with home_placement='business_bulletin' (${bbArticles.length}):`);
    console.table(bbArticles);
  }

  const { data: allPlaced, error: allError } = await supabase
    .from('articles')
    .select('id, title, home_placement, home_order')
    .not('home_placement', 'is', null);

  if (!allError) {
    console.log(`\nAll articles with any home_placement (${allPlaced.length}):`);
    console.table(allPlaced);
  }
}

checkPlacements();
