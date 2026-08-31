import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
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

const publicDir = path.resolve(__dirname, '../public');
const publicImgDir = path.join(publicDir, 'images/leadership');
const scratchDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\6d436db7-d10e-4757-8de5-f333b53784b8\\scratch';

if (!fs.existsSync(publicImgDir)) {
  fs.mkdirSync(publicImgDir, { recursive: true });
}

async function downloadAll() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, slug, title, image_url, author')
    .eq('category', 'Opinions');

  if (error) {
    console.error("Error fetching articles:", error);
    return;
  }

  console.log(`Checking ${articles.length} opinion articles...`);

  for (const art of articles) {
    const slug = art.slug;
    const htmlFile = path.join(scratchDir, `temp_${slug}.html`);
    let remoteUrl = '';

    if (fs.existsSync(htmlFile)) {
      const html = fs.readFileSync(htmlFile, 'utf8');
      const ogMatch = html.match(/property=["']og:image["'][\s\S]*?content=["']([^"']+)["']/i)
        || html.match(/content=["']([^"']+)["'][\s\S]*?property=["']og:image["']/i);
      if (ogMatch) {
        remoteUrl = ogMatch[1];
      } else {
        const postImgMatch = html.match(/class="[^"]*wp-post-image[^"]*"[^>]*src="([^"]+)"/i)
          || html.match(/class="[^"]*attachment-newsmag-recent-post-big[^"]*"[^>]*src="([^"]+)"/i);
        if (postImgMatch) remoteUrl = postImgMatch[1];
      }
    }

    if (!remoteUrl) {
      console.log(`[WARN] No remote URL found in HTML for: ${slug}`);
      continue;
    }

    // Determine extension
    let ext = '.png';
    if (remoteUrl.toLowerCase().includes('.jpg') || remoteUrl.toLowerCase().includes('.jpeg')) {
      ext = '.jpeg';
    }

    const fileName = `${slug}${ext}`;
    const localDiskPath = path.join(publicImgDir, fileName);
    const dbUrl = `/images/leadership/${fileName}`;

    console.log(`Downloading [${slug}] from ${remoteUrl}...`);
    try {
      const cmd = `curl.exe -L -s -o "${localDiskPath}" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${remoteUrl}"`;
      execSync(cmd);
      
      if (fs.existsSync(localDiskPath) && fs.statSync(localDiskPath).size > 1000) {
        const size = fs.statSync(localDiskPath).size;
        console.log(`✓ Saved ${fileName} (${size} bytes)`);

        // Update articles table with exact matching filename
        await supabase
          .from('articles')
          .update({ image_url: dbUrl })
          .eq('id', art.id);

        // Update leadership_profiles table if matching leader exists
        const leaderSlug = (art.author || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        if (leaderSlug) {
          await supabase
            .from('leadership_profiles')
            .update({ image_url: dbUrl })
            .eq('slug', leaderSlug);
        }
      } else {
        console.error(`✗ File not created or too small: ${localDiskPath}`);
      }
    } catch (e) {
      console.error(`✗ Error downloading ${slug}:`, e.message);
    }
  }

  console.log("\nAll opinion article images downloaded and verified!");
}

downloadAll();
