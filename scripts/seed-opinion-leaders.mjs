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

// Detailed mappings for leaders
const leadersMap = {
  'how-to-overcome-the-top-10-ai-risks': {
    name: 'Luis E. Taveras, Ph.D.',
    slug: 'luis-e-taveras',
    title: 'Executive VP & Chief Digital & Information Officer',
    company: 'Jefferson Health',
    image_url: '/images/leadership/luis-e-taveras.jpeg',
    linkedin_url: 'https://www.linkedin.com/in/luistaveras',
    areas_of_expertise: 'Technology Modernization, Digital Strategy, Cybersecurity, Data Innovation, Healthcare IT',
    featured: true,
    home_sections: ['cxo_article', 'cover_story'],
    home_order: 1
  },
  'before-you-hire-an-ai-worker': {
    name: 'Roman Hahalev',
    slug: 'roman-hahalev',
    title: 'Chief Technology & Product Officer',
    company: 'AVDO Ltd',
    image_url: '/images/leadership/roman-hahalev.jpeg',
    linkedin_url: 'https://www.linkedin.com/in/hahalev',
    areas_of_expertise: 'Machine Learning, Data Science, AI Product Management, Startup Scaling',
    featured: false,
    home_sections: ['cxo_article'],
    home_order: 2
  },
  'looking-ahead-execution-excellence-in-an-era-of-transformation': {
    name: 'Dr. Jeffrey Mrizek',
    slug: 'jeffrey-mrizek',
    title: 'Founder & CEO',
    company: 'SmartStart AI',
    image_url: '/images/leadership/jeffrey-mrizek.png',
    linkedin_url: 'https://www.linkedin.com/in/jeffreymrizek',
    areas_of_expertise: 'Organizational Psychology, Educational Leadership, Workforce Development, GenAI',
    featured: false,
    home_sections: ['cxo_article'],
    home_order: 3
  },
  'no-one-checks-in-with-reality-we-can-we-should': {
    name: 'Marcus Kirsch',
    slug: 'marcus-kirsch',
    title: 'Founder & Director',
    company: 'The Wicked Company',
    image_url: '/images/leadership/marcus-kirsch.png',
    linkedin_url: 'https://www.linkedin.com/in/marcuskirsch/',
    areas_of_expertise: 'Service Design, Business Innovation, Digital Transformation, Wicked Problems',
    featured: false,
    home_sections: ['cxo_article'],
    home_order: 4
  },
  'the-white-elephant-in-the-room-company-culture-innovation-and-workforce-generation': {
    name: 'Moe Mesbah',
    slug: 'moe-mesbah',
    title: 'Founder & Lead Consultant',
    company: 'Mesbah Consulting',
    image_url: '/images/leadership/moe-mesbah.png',
    linkedin_url: 'https://www.linkedin.com/in/mohamedmesbah/',
    areas_of_expertise: 'Human Capital Management, Organizational Culture, Workforce Development, Strategic HR',
    featured: false,
    home_sections: ['cxo_article'],
    home_order: 5
  },
  'want-to-build-a-better-personal-brand-make-time-to-speak-to-strangers': {
    name: 'Fiona Chorlton-Voong',
    slug: 'fiona-chorlton-voong',
    title: 'Co-founder & COO',
    company: 'The Portfolio Collective',
    image_url: '/images/leadership/fiona-chorlton-voong.png',
    linkedin_url: 'https://www.linkedin.com/in/fionachorltonvoong/',
    areas_of_expertise: 'Commercial Strategy, Business Operations, Personal Branding, Startup Scaling',
    featured: false,
    home_sections: ['cxo_article'],
    home_order: 6
  },
  'female-founders-navigating-alternatives-to-the-glass-ceiling': {
    name: 'Elaine Gold',
    slug: 'elaine-gold',
    title: 'Co-founder & AI Consultant',
    company: 'GEN UK',
    image_url: '/images/leadership/elaine-gold.png',
    linkedin_url: 'https://www.linkedin.com/in/elaine-gold-093856/',
    areas_of_expertise: 'Leadership Development, Executive Coaching, Female Entrepreneurship, AI Integration',
    featured: false,
    home_sections: ['cxo_article'],
    home_order: 7
  },
  'the-evolving-role-of-the-chief-marketing-officer': {
    name: 'Sandrine Desbarbieux-Lloyd',
    slug: 'sandrine-desbarbieux-lloyd',
    title: 'SVP of Global Marketing',
    company: 'Jabra',
    image_url: '/images/leadership/sandrine-desbarbieux-lloyd.jpg',
    linkedin_url: 'https://www.linkedin.com/in/sandrine-desbarbieux-lloyd/',
    areas_of_expertise: 'Digital Sales, Brand Strategy, Global Marketing, Digital Transformation',
    featured: false,
    home_sections: ['cxo_article'],
    home_order: 8
  },
  'entrepreneurial-leadership-harnessing-the-power-of-a-creative-and-innovative-mindset-in-the-age-of-ai': {
    name: 'Claire Koryczan',
    slug: 'claire-koryczan',
    title: 'Founder & Director',
    company: 'Imagine Beyond',
    image_url: '/images/leadership/claire-koryczan.png',
    linkedin_url: 'https://www.linkedin.com/in/claire-koryczan/',
    areas_of_expertise: 'Executive Coaching, Leadership Development, Business Strategy, Creative Innovation',
    featured: false,
    home_sections: ['cxo_article'],
    home_order: 9
  },
  'the-interplay-of-knowledge-and-wisdom-why-wisdom-trumps-all': {
    name: 'Diana Monterrubio',
    slug: 'diana-monterrubio',
    title: 'Global Procurement Director',
    company: 'Teleperformance',
    image_url: '/images/leadership/diana-monterrubio.jpeg',
    linkedin_url: 'https://www.linkedin.com/in/dianamonterrubio/',
    areas_of_expertise: 'Strategic Sourcing, Global Procurement, Vendor Management, Women in Tech',
    featured: false,
    home_sections: ['cxo_article'],
    home_order: 10
  },
  'leadership-in-the-digital-age-navigating-transformation-challenges': {
    name: 'Rinet (Mitrani) Hoşol',
    slug: 'rinet-hosol',
    title: 'Chief Growth Officer',
    company: 'Digital Exchange Agency',
    image_url: '/images/leadership/rinet-hosol.png',
    linkedin_url: 'https://www.linkedin.com/in/rinethosol/',
    areas_of_expertise: 'Digital Marketing, E-commerce, Growth Strategy, Change Leadership',
    featured: false,
    home_sections: ['cxo_article'],
    home_order: 11
  }
};

// Bios extracted from files
const brainPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\6d436db7-d10e-4757-8de5-f333b53784b8';

function cleanBioMarkdown(text) {
  return text.replace(/\*/g, '').trim();
}

// 1. Get Luis Taveras bio
const taverasPath = path.join(brainPath, 'how_to_overcome_the_top_10_ai_risks.md');
if (fs.existsSync(taverasPath)) {
  const md = fs.readFileSync(taverasPath, 'utf8');
  // Bio is the text between the first image and the separator ***
  const bioMatch = md.match(/!\[Luis Taveras\]\(.*?\)\s*\n*([\s\S]*?)\n*\*\*\*/);
  if (bioMatch) {
    leadersMap['how-to-overcome-the-top-10-ai-risks'].bio = cleanBioMarkdown(bioMatch[1]);
  } else {
    leadersMap['how-to-overcome-the-top-10-ai-risks'].bio = "Luis E. Taveras, Ph.D., is a distinguished technology and digital-transformation executive with a career spanning over four decades. He currently serves as the Executive VP & Chief Digital & Information Officer at Jefferson.";
  }
}

// 2. Get other bios
const tenPath = path.join(brainPath, 'ten_cxo_opinion_articles.md');
if (fs.existsSync(tenPath)) {
  const md = fs.readFileSync(tenPath, 'utf8');
  const rawSegments = md.split(/## Article \d+:\s*/);
  
  for (let i = 1; i < rawSegments.length; i++) {
    const segment = rawSegments[i].trim();
    const lines = segment.split('\n');
    
    // Find URL to determine the slug
    let url = '';
    for (const line of lines) {
      if (line.startsWith('**Source Link:**')) {
        url = line.match(/\(([^)]+)\)/)?.[1] || '';
        break;
      }
    }
    
    const slug = url.split('/').filter(Boolean).pop();
    if (slug && leadersMap[slug]) {
      // Bio is the first paragraph that is italicized starting with *
      const bioMatch = segment.match(/\*([\s\S]*?)\*/);
      if (bioMatch) {
        leadersMap[slug].bio = cleanBioMarkdown(bioMatch[1]);
      } else {
        leadersMap[slug].bio = `${leadersMap[slug].name} is an industry expert and regular contributor to CXO Magazine.`;
      }
    }
  }
}

const leaders = Object.values(leadersMap);

async function seedLeaders() {
  console.log(`Seeding ${leaders.length} leadership profiles into Supabase...`);
  
  let successCount = 0;
  for (const leader of leaders) {
    try {
      const { data: existing, error: checkError } = await supabase
        .from('leadership_profiles')
        .select('id')
        .eq('slug', leader.slug)
        .maybeSingle();
      
      if (checkError) {
        console.error(`Error checking slug "${leader.slug}":`, checkError.message);
        continue;
      }
      
      const leaderPayload = {
        name: leader.name,
        slug: leader.slug,
        title: leader.title,
        company: leader.company,
        bio: leader.bio,
        image_url: leader.image_url,
        linkedin_url: leader.linkedin_url,
        areas_of_expertise: leader.areas_of_expertise,
        featured: leader.featured,
        home_sections: leader.home_sections,
        home_order: leader.home_order,
        updated_at: new Date().toISOString()
      };
      
      if (existing) {
        // Update
        const { error: updateError } = await supabase
          .from('leadership_profiles')
          .update(leaderPayload)
          .eq('id', existing.id);
        
        if (updateError) {
          console.error(`Error updating "${leader.name}":`, updateError.message);
        } else {
          console.log(`Updated leader: "${leader.name}"`);
          successCount++;
        }
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from('leadership_profiles')
          .insert([leaderPayload]);
        
        if (insertError) {
          console.error(`Error inserting "${leader.name}":`, insertError.message);
        } else {
          console.log(`Inserted leader: "${leader.name}"`);
          successCount++;
        }
      }
    } catch (e) {
      console.error(`Exception processing leader "${leader.name}":`, e.message);
    }
  }
  
  console.log(`\nSeeding completed. Successfully processed ${successCount}/${leaders.length} leaders.`);
}

seedLeaders();
