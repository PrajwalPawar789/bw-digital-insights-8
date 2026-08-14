import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple manual .env parser
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

// Author & Date Mappings
const authorMap = {
  'before-you-hire-an-ai-worker': 'Roman Hahalev',
  'looking-ahead-execution-excellence-in-an-era-of-transformation': 'Dr. Jeffrey Mrizek',
  'no-one-checks-in-with-reality-we-can-we-should': 'Marcus Kirsch',
  'the-white-elephant-in-the-room-company-culture-innovation-and-workforce-generation': 'Moe Mesbah',
  'want-to-build-a-better-personal-brand-make-time-to-speak-to-strangers': 'Fiona Chorlton-Voong',
  'female-founders-navigating-alternatives-to-the-glass-ceiling': 'Elaine Gold',
  'the-evolving-role-of-the-chief-marketing-officer': 'Sandrine Desbarbieux-Lloyd & Angie French',
  'entrepreneurial-leadership-harnessing-the-power-of-a-creative-and-innovative-mindset-in-the-age-of-ai': 'Claire Koryczan',
  'the-interplay-of-knowledge-and-wisdom-why-wisdom-trumps-all': 'Diana Monterrubio',
  'leadership-in-the-digital-age-navigating-transformation-challenges': 'Rinet (Mitrani) Hoşol',
  'how-to-overcome-the-top-10-ai-risks': 'Luis E. Taveras, Ph.D.'
};

const dateMap = {
  'before-you-hire-an-ai-worker': '2025-07-17T00:00:00.000Z',
  'looking-ahead-execution-excellence-in-an-era-of-transformation': '2025-01-15T00:00:00.000Z',
  'no-one-checks-in-with-reality-we-can-we-should': '2024-06-03T00:00:00.000Z',
  'the-white-elephant-in-the-room-company-culture-innovation-and-workforce-generation': '2024-10-10T00:00:00.000Z',
  'want-to-build-a-better-personal-brand-make-time-to-speak-to-strangers': '2024-01-11T00:00:00.000Z',
  'female-founders-navigating-alternatives-to-the-glass-ceiling': '2024-05-03T00:00:00.000Z',
  'the-evolving-role-of-the-chief-marketing-officer': '2024-04-08T00:00:00.000Z',
  'entrepreneurial-leadership-harnessing-the-power-of-a-creative-and-innovative-mindset-in-the-age-of-ai': '2024-04-05T00:00:00.000Z',
  'the-interplay-of-knowledge-and-wisdom-why-wisdom-trumps-all': '2023-10-25T00:00:00.000Z',
  'leadership-in-the-digital-age-navigating-transformation-challenges': '2023-11-20T00:00:00.000Z',
  'how-to-overcome-the-top-10-ai-risks': '2024-05-29T00:00:00.000Z'
};

const imagesMap = {
  'before-you-hire-an-ai-worker': '/images/leadership/roman-hahalev.jpeg',
  'looking-ahead-execution-excellence-in-an-era-of-transformation': '/images/leadership/jeffrey-mrizek.png',
  'no-one-checks-in-with-reality-we-can-we-should': '/images/leadership/marcus-kirsch.png',
  'the-white-elephant-in-the-room-company-culture-innovation-and-workforce-generation': '/images/leadership/moe-mesbah.png',
  'want-to-build-a-better-personal-brand-make-time-to-speak-to-strangers': '/images/leadership/fiona-chorlton-voong.png',
  'female-founders-navigating-alternatives-to-the-glass-ceiling': '/images/leadership/elaine-gold.png',
  'the-evolving-role-of-the-chief-marketing-officer': '/images/leadership/sandrine-desbarbieux-lloyd.jpg',
  'entrepreneurial-leadership-harnessing-the-power-of-a-creative-and-innovative-mindset-in-the-age-of-ai': '/images/leadership/claire-koryczan.png',
  'the-interplay-of-knowledge-and-wisdom-why-wisdom-trumps-all': '/images/leadership/diana-monterrubio.jpeg',
  'leadership-in-the-digital-age-navigating-transformation-challenges': '/images/leadership/rinet-hosol.png',
  'how-to-overcome-the-top-10-ai-risks': '/images/leadership/luis-e-taveras.jpeg'
};

const linkedinMap = {
  'before-you-hire-an-ai-worker': 'https://www.linkedin.com/in/hahalev',
  'looking-ahead-execution-excellence-in-an-era-of-transformation': 'https://www.linkedin.com/in/jeffreymrizek',
  'no-one-checks-in-with-reality-we-can-we-should': 'https://www.linkedin.com/in/marcuskirsch/',
  'the-white-elephant-in-the-room-company-culture-innovation-and-workforce-generation': 'https://www.linkedin.com/in/mohamedmesbah/',
  'want-to-build-a-better-personal-brand-make-time-to-speak-to-strangers': 'https://www.linkedin.com/in/fionachorltonvoong/',
  'female-founders-navigating-alternatives-to-the-glass-ceiling': 'https://www.linkedin.com/in/elaine-gold-093856/',
  'the-evolving-role-of-the-chief-marketing-officer': 'https://www.linkedin.com/in/sandrine-desbarbieux-lloyd/',
  'entrepreneurial-leadership-harnessing-the-power-of-a-creative-and-innovative-mindset-in-the-age-of-ai': 'https://www.linkedin.com/in/claire-koryczan/',
  'the-interplay-of-knowledge-and-wisdom-why-wisdom-trumps-all': 'https://www.linkedin.com/in/dianamonterrubio/',
  'leadership-in-the-digital-age-navigating-transformation-challenges': 'https://www.linkedin.com/in/rinethosol/',
  'how-to-overcome-the-top-10-ai-risks': 'https://www.linkedin.com/in/luistaveras'
};

function cleanMarkdownToPlainText(text) {
  // 1. Remove markdown image syntax
  let cleaned = text.replace(/!\[.*?\]\(.*?\)/g, '');
  
  // 2. Remove headers syntax but keep the header text
  cleaned = cleaned.replace(/^#+\s*(.*?)$/gm, '$1');
  
  // 3. Remove bold and italics markings
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*(.*?)\*/g, '$1');
  
  // 4. Clean list item dash indicators
  cleaned = cleaned.replace(/^-\s*/gm, '');
  
  // 5. Trim trailing whitespace on lines
  cleaned = cleaned.split('\n').map(line => line.trimEnd()).join('\n');
  
  // 6. Collapse excessive empty lines to max 2
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

// Read and parse articles
const brainPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\6d436db7-d10e-4757-8de5-f333b53784b8';
const articles = [];

// 1. Parse Luis Taveras article
const taverasPath = path.join(brainPath, 'how_to_overcome_the_top_10_ai_risks.md');
if (fs.existsSync(taverasPath)) {
  const md = fs.readFileSync(taverasPath, 'utf8');
  const parts = md.split('***');
  const bodyText = parts[parts.length - 1] || md;
  
  const cleanBodyRaw = cleanMarkdownToPlainText(bodyText);
  const slug = 'how-to-overcome-the-top-10-ai-risks';
  
  let cleanBody = cleanBodyRaw;
  if (linkedinMap[slug]) {
    cleanBody += `\n\nConnect with the Author on LinkedIn: ${linkedinMap[slug]}`;
  }
  
  articles.push({
    title: 'How to Overcome the Top 10 AI Risks',
    slug,
    excerpt: extractExcerpt(cleanBodyRaw),
    content: cleanBody,
    author: authorMap[slug],
    date: dateMap[slug],
    category: 'Opinions',
    image_url: imagesMap[slug],
    featured: true,
    home_placement: 'cxo',
    home_order: 1
  });
}

// 2. Parse 10 compiled articles
const tenArticlesPath = path.join(brainPath, 'ten_cxo_opinion_articles.md');
if (fs.existsSync(tenArticlesPath)) {
  const md = fs.readFileSync(tenArticlesPath, 'utf8');
  const rawSegments = md.split(/## Article \d+:\s*/);
  
  for (let i = 1; i < rawSegments.length; i++) {
    const segment = rawSegments[i].trim();
    const lines = segment.split('\n');
    
    const titleLine = lines[0].trim();
    let author = 'CXO Contributor';
    let url = '';
    let bodyLines = [];
    
    for (let j = 1; j < lines.length; j++) {
      const line = lines[j].trim();
      if (line.startsWith('**Author:**')) {
        author = line.replace('**Author:**', '').trim();
      } else if (line.startsWith('**Source Link:**')) {
        url = line.match(/\(([^)]+)\)/)?.[1] || '';
      } else if (!line.startsWith('![Featured Image]')) {
        bodyLines.push(lines[j]);
      }
    }
    
    const rawBody = bodyLines.join('\n').trim();
    const cleanBodyRaw = rawBody.replace(/^\*([\s\S]*?)\*\n*/, '');
    const cleanBodyParsed = cleanMarkdownToPlainText(cleanBodyRaw);
    
    const slug = url.split('/').filter(Boolean).pop() || titleLine.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    let cleanBody = cleanBodyParsed;
    if (linkedinMap[slug]) {
      cleanBody += `\n\nConnect with the Author on LinkedIn: ${linkedinMap[slug]}`;
    }
    
    articles.push({
      title: titleLine,
      slug,
      excerpt: extractExcerpt(cleanBodyParsed),
      content: cleanBody,
      author: authorMap[slug] || author,
      date: dateMap[slug] || new Date().toISOString(),
      category: 'Opinions',
      image_url: imagesMap[slug] || null,
      featured: false,
      home_placement: 'cxo',
      home_order: i + 1
    });
  }
}

async function seed() {
  console.log(`Seeding ${articles.length} articles with LinkedIn URLs into the database...`);
  
  let successCount = 0;
  for (const article of articles) {
    try {
      const { data: existing, error: checkError } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', article.slug)
        .maybeSingle();
      
      if (checkError) {
        console.error(`Error checking slug "${article.slug}":`, checkError.message);
        continue;
      }
      
      if (existing) {
        const { error: updateError } = await supabase
          .from('articles')
          .update({
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            author: article.author,
            date: article.date,
            category: article.category,
            image_url: article.image_url,
            featured: article.featured,
            home_placement: article.home_placement,
            home_order: article.home_order,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
        
        if (updateError) {
          console.error(`Error updating "${article.title}":`, updateError.message);
        } else {
          console.log(`Updated: "${article.title}"`);
          successCount++;
        }
      } else {
        const { error: insertError } = await supabase
          .from('articles')
          .insert([article]);
        
        if (insertError) {
          console.error(`Error inserting "${article.title}":`, insertError.message);
        } else {
          console.log(`Inserted: "${article.title}"`);
          successCount++;
        }
      }
    } catch (e) {
      console.error(`Exception processing "${article.title}":`, e.message);
    }
  }
  
  console.log(`\nSeeding completed. Successfully processed ${successCount}/${articles.length} articles.`);
}

seed();
