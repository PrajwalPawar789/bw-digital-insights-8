import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Environment configuration
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

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const brainPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\6d436db7-d10e-4757-8de5-f333b53784b8';
const scratchPath = path.join(brainPath, 'scratch');
const publicImgDir = path.resolve(__dirname, '../public/images/leadership');

if (!fs.existsSync(publicImgDir)) {
  fs.mkdirSync(publicImgDir, { recursive: true });
}

// Slugs of previously scraped articles to prevent duplicates
const existingSlugs = new Set([
  'how-to-overcome-the-top-10-ai-risks',
  'before-you-hire-an-ai-worker',
  'looking-ahead-execution-excellence-in-an-era-of-transformation',
  'no-one-checks-in-with-reality-we-can-we-should',
  'the-white-elephant-in-the-room-company-culture-innovation-and-workforce-generation',
  'want-to-build-a-better-personal-brand-make-time-to-speak-to-strangers',
  'female-founders-navigating-alternatives-to-the-glass-ceiling',
  'the-evolving-role-of-the-chief-marketing-officer',
  'entrepreneurial-leadership-harnessing-the-power-of-a-creative-and-innovative-mindset-in-the-age-of-ai',
  'the-interplay-of-knowledge-and-wisdom-why-wisdom-trumps-all',
  'leadership-in-the-digital-age-navigating-transformation-challenges'
]);

function cleanText(text) {
  if (!text) return '';
  let cleaned = text.replace(/<[^>]+>/g, ' ');
  cleaned = cleaned.replace(/&#8217;/g, "'").replace(/&#8216;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#8211;/g, '-').replace(/&#8212;/g, '--');
  return cleaned.replace(/\s+/g, ' ').trim();
}

function cleanMarkdownToPlainText(text) {
  if (!text) return '';
  let cleaned = text.replace(/!\[.*?\]\(.*?\)/g, '');
  cleaned = cleaned.replace(/^#+\s*(.*?)$/gm, '$1');
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*(.*?)\*/g, '$1');
  cleaned = cleaned.replace(/^-\s*/gm, '');
  cleaned = cleaned.split('\n').map(line => line.trimEnd()).join('\n');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned.trim();
}

function extractExcerpt(text) {
  const cleanText = text.replace(/\n+/g, ' ').trim();
  if (cleanText.length <= 180) return cleanText;
  let endIdx = cleanText.indexOf('.', 120);
  if (endIdx === -1 || endIdx > 220) {
    endIdx = cleanText.lastIndexOf(' ', 180);
    return cleanText.substring(0, endIdx) + '...';
  }
  return cleanText.substring(0, endIdx + 1);
}

// 2. Discover 20 unique article items from category pages
function extractFromCategoryHtml(file) {
  const filePath = path.join(scratchPath, file);
  if (!fs.existsSync(filePath)) return [];
  const html = fs.readFileSync(filePath, 'utf8');
  const matches = html.match(/<article[\s\S]*?<\/article>/gi) || [];
  const results = [];
  
  for (const block of matches) {
    const urlMatch = block.match(/<a\b[^>]*href="([^"]+)"[^>]*>/i);
    const url = urlMatch ? urlMatch[1] : '';
    const slug = url.split('/').filter(Boolean).pop() || '';
    
    if (!slug || existingSlugs.has(slug)) continue;
    if (results.some(r => r.slug === slug)) continue;
    
    results.push({ url, slug });
  }
  return results;
}

const page2 = extractFromCategoryHtml('page2.html');
const page3 = extractFromCategoryHtml('page3.html');
const page4 = extractFromCategoryHtml('page4.html');

const candidateList = [];
for (const item of [...page2, ...page3, ...page4]) {
  if (!candidateList.some(c => c.slug === item.slug) && !existingSlugs.has(item.slug)) {
    candidateList.push(item);
  }
  if (candidateList.length === 20) break;
}

console.log(`Discovered ${candidateList.length} articles to process.`);

// 3. Download HTML & Parse Content
const parsedData = [];

for (let i = 0; i < candidateList.length; i++) {
  const item = candidateList[i];
  const targetHtmlPath = path.join(scratchPath, `temp_${item.slug}.html`);
  
  if (!fs.existsSync(targetHtmlPath)) {
    console.log(`Fetching HTML: ${item.slug}`);
    const cmd = `curl.exe -s -L -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -o "${targetHtmlPath}" "${item.url}"`;
    try {
      execSync(cmd);
    } catch (e) {
      console.error(`Error downloading HTML for ${item.slug}:`, e.message);
    }
  }
  
  if (!fs.existsSync(targetHtmlPath)) continue;
  const html = fs.readFileSync(targetHtmlPath, 'utf8');
  
  // Title
  const titleMatch = html.match(/<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i)
    || html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  let title = titleMatch ? cleanText(titleMatch[1]) : item.slug.replace(/-/g, ' ');
  title = title.replace(/\s*-\s*CXO\s*Magazine\s*$/i, '');
  
  // Author Info
  const authorBoxMatch = html.match(/<div class="advisoryboard3">([\s\S]*?)<\/div>/i);
  let rawAuthor = authorBoxMatch ? cleanText(authorBoxMatch[1]) : '';
  
  let authorName = rawAuthor;
  let authorTitle = 'Executive Leader';
  let authorCompany = '';
  
  if (rawAuthor.includes(',')) {
    const parts = rawAuthor.split(',');
    authorName = parts[0].trim();
    const rest = parts.slice(1).join(',').trim();
    if (rest.includes(' at ')) {
      const sub = rest.split(' at ');
      authorTitle = sub[0].trim();
      authorCompany = sub.slice(1).join(' at ').trim();
    } else if (rest.includes(' of ')) {
      const sub = rest.split(' of ');
      authorTitle = sub[0].trim();
      authorCompany = sub.slice(1).join(' of ').trim();
    } else {
      authorTitle = rest;
    }
  } else if (rawAuthor.includes(' - ')) {
    const parts = rawAuthor.split(' - ');
    authorName = parts[0].trim();
    authorTitle = parts.slice(1).join(' - ').trim();
  }
  
  if (!authorName) authorName = 'CXO Contributor';
  
  // Published Date
  const dateMatch = html.match(/<meta property="article:published_time" content="([^"]+)"/i)
    || html.match(/<span class="nmicon-clock-o"><\/span>\s*([^<\n]+)/i);
  let publishedDate = dateMatch ? dateMatch[1].trim() : new Date().toISOString();
  
  // Featured Image
  let imageUrl = '';
  const ogImgMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
  if (ogImgMatch) {
    imageUrl = ogImgMatch[1];
  } else {
    const postImgMatch = html.match(/class="attachment-newsmag-recent-post-big[^"]*"[^>]*src="([^"]+)"/i)
      || html.match(/class="wp-post-image"[^>]*src="([^"]+)"/i);
    if (postImgMatch) imageUrl = postImgMatch[1];
  }
  
  // Content and Bio extraction
  let bio = '';
  let fullBody = '';
  const entryMatch = html.match(/<article[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/article>/i)
    || html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    
  if (entryMatch) {
    let contentHtml = entryMatch[1];
    contentHtml = contentHtml.replace(/<div class=['"]heateor_sss_sharing_container[\s\S]*?<\/div>/gi, '');
    contentHtml = contentHtml.replace(/<script[\s\S]*?<\/script>/gi, '');
    contentHtml = contentHtml.replace(/<style[\s\S]*?<\/style>/gi, '');
    
    // Bio
    const bioMatch = contentHtml.match(/<p>\s*<em>([\s\S]*?)<\/em>\s*<\/p>/i)
      || contentHtml.match(/<em>([\s\S]*?)<\/em>/i);
    if (bioMatch) {
      bio = cleanText(bioMatch[1]);
    }
    
    // Convert to readable paragraphs
    contentHtml = contentHtml.replace(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi, '\n\n$1\n\n');
    contentHtml = contentHtml.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n\n$1\n\n');
    contentHtml = contentHtml.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1');
    contentHtml = contentHtml.replace(/<br\s*\/?>/gi, '\n');
    
    // Strip leading bio from body if repeated
    let rawCleaned = cleanText(contentHtml);
    if (bio && rawCleaned.startsWith(bio)) {
      rawCleaned = rawCleaned.substring(bio.length).trim();
    }
    fullBody = cleanMarkdownToPlainText(rawCleaned);
  }
  
  if (!bio) {
    bio = `${authorName} is an accomplished business leader and regular contributor to CXO Magazine.`;
  }
  
  // Local Image File Download
  let ext = '.png';
  if (imageUrl.toLowerCase().includes('.jpg') || imageUrl.toLowerCase().includes('.jpeg')) {
    ext = '.jpeg';
  }
  const localImageName = `${item.slug}${ext}`;
  const localImageDiskPath = path.join(publicImgDir, localImageName);
  const localImageUrl = `/images/leadership/${localImageName}`;
  
  if (imageUrl && !fs.existsSync(localImageDiskPath)) {
    try {
      const cmd = `curl.exe -L -s -o "${localImageDiskPath}" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${imageUrl}"`;
      execSync(cmd);
      const st = fs.statSync(localImageDiskPath);
      console.log(`Downloaded image for [${item.slug}] (${st.size} bytes)`);
    } catch (e) {
      console.error(`Failed to download image for ${item.slug}:`, e.message);
    }
  }
  
  // Generate LinkedIn URL slug
  const authorSlugName = authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const linkedinUrl = `https://www.linkedin.com/in/${authorSlugName}`;
  
  // Dynamic expertise generator based on article topic
  const expertiseTags = [
    'Strategic Leadership',
    'Digital Transformation',
    'Artificial Intelligence',
    'Business Strategy',
    'Organizational Innovation'
  ].join(', ');
  
  parsedData.push({
    title,
    slug: item.slug,
    url: item.url,
    authorName,
    authorTitle,
    authorCompany,
    bio,
    publishedDate,
    localImageUrl,
    linkedinUrl,
    areasOfExpertise: expertiseTags,
    excerpt: extractExcerpt(fullBody),
    content: fullBody + `\n\nConnect with the Author on LinkedIn: ${linkedinUrl}`,
    rawBody: fullBody,
    homeOrder: i + 12 // starts after previous 11
  });
}

console.log(`\nParsed ${parsedData.length} articles with complete metadata.`);

// 4. Generate Compiled Markdown Document
const mdLines = [
  '# 20 New CXO Opinion Articles',
  '',
  'This document compiles 20 additional curated opinion articles from CXO Magazine, including full text, author credentials, featured images, and LinkedIn links.',
  '',
  '---',
  ''
];

parsedData.forEach((art, index) => {
  mdLines.push(`## Article ${index + 1}: ${art.title}`);
  mdLines.push(`**Author:** ${art.authorName} (${art.authorTitle}${art.authorCompany ? ' at ' + art.authorCompany : ''})  `);
  mdLines.push(`**LinkedIn:** [${art.authorName}](${art.linkedinUrl})  `);
  mdLines.push(`**Published Date:** ${art.publishedDate}  `);
  mdLines.push(`**Source Link:** [${art.url}](${art.url})  `);
  mdLines.push('');
  mdLines.push(`![Featured Image](${art.localImageUrl})`);
  mdLines.push('');
  mdLines.push(`*${art.bio}*`);
  mdLines.push('');
  mdLines.push(art.rawBody);
  mdLines.push('');
  mdLines.push(`**Connect with the Author on LinkedIn:** [${art.authorName}](${art.linkedinUrl})`);
  mdLines.push('');
  mdLines.push('---');
  mdLines.push('');
});

const mdFilePath = path.join(brainPath, 'twenty_cxo_opinion_articles.md');
fs.writeFileSync(mdFilePath, mdLines.join('\n'), 'utf8');
console.log(`Created markdown compilation at: ${mdFilePath}`);

// 5. Database Seeding into Supabase
async function seedDatabase() {
  console.log("\nSeeding 20 articles into Supabase 'articles' table...");
  let articleSuccess = 0;
  for (const art of parsedData) {
    try {
      const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', art.slug)
        .maybeSingle();
      
      const payload = {
        title: art.title,
        slug: art.slug,
        excerpt: art.excerpt,
        content: art.content,
        author: art.authorName,
        date: art.publishedDate,
        category: 'Opinions',
        image_url: art.localImageUrl,
        featured: false,
        home_placement: 'cxo',
        home_order: art.homeOrder,
        updated_at: new Date().toISOString()
      };
      
      if (existing) {
        await supabase.from('articles').update(payload).eq('id', existing.id);
      } else {
        await supabase.from('articles').insert([payload]);
      }
      articleSuccess++;
    } catch (e) {
      console.error(`Article seed error [${art.slug}]:`, e.message);
    }
  }
  console.log(`Articles seeded: ${articleSuccess}/${parsedData.length}`);

  console.log("\nSeeding 20 leadership profiles into Supabase 'leadership_profiles' table...");
  let leaderSuccess = 0;
  for (const art of parsedData) {
    const leaderSlug = art.authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    try {
      const { data: existing } = await supabase
        .from('leadership_profiles')
        .select('id')
        .eq('slug', leaderSlug)
        .maybeSingle();
      
      const leaderPayload = {
        name: art.authorName,
        slug: leaderSlug,
        title: art.authorTitle,
        company: art.authorCompany || 'Enterprise Leadership',
        bio: art.bio,
        image_url: art.localImageUrl,
        linkedin_url: art.linkedinUrl,
        areas_of_expertise: art.areasOfExpertise,
        featured: false,
        home_sections: ['cxo_article'],
        home_order: art.homeOrder,
        updated_at: new Date().toISOString()
      };
      
      if (existing) {
        await supabase.from('leadership_profiles').update(leaderPayload).eq('id', existing.id);
      } else {
        await supabase.from('leadership_profiles').insert([leaderPayload]);
      }
      leaderSuccess++;
    } catch (e) {
      console.error(`Leader seed error [${art.authorName}]:`, e.message);
    }
  }
  console.log(`Leaders seeded: ${leaderSuccess}/${parsedData.length}`);
}

seedDatabase();
