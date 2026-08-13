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

const todayArticles = [
  {
    title: "Google DeepMind Leadership Shift: Koray Kavukcuoglu Takes Helm as Demis Hassabis Steps to Chair",
    slug: "google-deepmind-leadership-shift-koray-kavukcuoglu-takes-helm",
    excerpt: "Demis Hassabis steps aside as Google DeepMind chief to become executive chair, with Koray Kavukcuoglu taking over operational leadership amid intense global AI competition.",
    content: `In a significant organizational shift within artificial intelligence leadership, Google DeepMind founder Demis Hassabis has stepped aside as chief executive to assume the role of executive chair. His long-time deputy, Koray Kavukcuoglu, has been appointed as the new chief executive officer to lead day-to-day operations and strategic execution.

The leadership transition comes as Google seeks to accelerate its AI model development and deployment cadence. Industry observers note that the restructuring aims to streamline decision-making as Google DeepMind competes against rival models in next-generation multimodal capabilities and enterprise AI integration.

Under Kavukcuoglu's leadership, the division is expected to focus on scaling Gemini model architectures, deepening integration with Google Cloud services, and advancing frontier AI safety research across enterprise applications.`,
    author: "Tech Business Review",
    date: "2026-08-13T06:00:00.000Z",
    category: "Technology",
    image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    featured: true
  },
  {
    title: "Cisco Systems Projects Strong Sales Surge Driven by Global AI Infrastructure Boom",
    slug: "cisco-systems-projects-strong-sales-surge-ai-infrastructure",
    excerpt: "Networking giant Cisco issues an upbeat financial outlook powered by record enterprise demand for AI data center switching and high-speed networking equipment.",
    content: `Cisco Systems has issued a stronger-than-expected sales forecast for its upcoming quarter, citing record demand for high-performance networking infrastructure required to power artificial intelligence workloads.

The enterprise technology provider reported broad-based order growth across hyperscale cloud providers and corporate data centers upgrading their network backbones. Demand for 800G switching platforms and AI-optimized Ethernet solutions has surged significantly over the past two quarters.

Cisco leadership noted that the migration toward hybrid cloud environments combined with generative AI deployment is creating sustained demand for resilient, high-speed switching hardware and integrated security platforms.`,
    author: "Global Markets Daily",
    date: "2026-08-13T05:30:00.000Z",
    category: "Business",
    image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    featured: true
  },
  {
    title: "Norway Sovereign Wealth Fund Reports Record $184 Billion Profit Fueled by Tech Investments",
    slug: "norway-sovereign-wealth-fund-reports-record-184-billion-profit",
    excerpt: "The world's largest sovereign wealth fund posts massive first-half gains driven by a sustained rally in major U.S. technology equities.",
    content: `Norway’s $2.3 trillion Sovereign Wealth Fund, Norges Bank Investment Management, has recorded a historic first-half profit of 1.753 trillion Norwegian kroner ($184.7 billion), driven by strong returns in global equity markets.

The fund's massive earnings were heavily propelled by its portfolio of major U.S. technology companies, including Nvidia, Microsoft, Apple, and Alphabet. Equity investments generated the bulk of the returns as tech sector valuations expanded amidst global enterprise AI deployment.

Fund executives highlighted that while market volatility remains present across sovereign bond and real estate sectors, strategic long-term allocation in global innovation leaders has continued to generate substantial value for the fund.`,
    author: "Financial Executive Insights",
    date: "2026-08-13T05:00:00.000Z",
    category: "Finance",
    image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236e3?auto=format&fit=crop&w=1200&q=80",
    featured: true
  },
  {
    title: "Tata Sons Leadership Transition: N. Chandrasekaran Steps Down as Chairman",
    slug: "tata-sons-leadership-transition-n-chandrasekaran-steps-down",
    excerpt: "N. Chandrasekaran concludes a landmark tenure at Tata Sons, prompting executive transition across conglomerate boardrooms.",
    content: `In a major corporate development within global conglomerate leadership, N. Chandrasekaran has concluded his tenure as Chairman of Tata Sons after leading the salt-to-software group through a period of rapid expansion and digital modernization.

During his leadership, Chandrasekaran spearheaded major strategic initiatives including the consolidation of Tata's aviation assets under Air India, expansion into EV technology and semiconductor manufacturing, and digital transformation across retail and financial services.

The board of Tata Sons has initiated an executive transition process to select the next leader to guide the multinational conglomerate's growth strategy across electric mobility, green energy, and global technology services.`,
    author: "Executive Leadership Journal",
    date: "2026-08-13T04:45:00.000Z",
    category: "Leadership",
    image_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    featured: false
  },
  {
    title: "Kioxia and Western Digital Unveil Next-Gen QLC 3D Flash Storage for Enterprise AI Data Centers",
    slug: "kioxia-western-digital-unveil-next-gen-qlc-3d-flash-storage",
    excerpt: "New high-density memory architecture engineered to handle ultra-high data throughput required for AI model training and real-time inference.",
    content: `Memory technology innovators Kioxia and SanDisk (Western Digital) have unveiled their latest high-performance QLC 3D flash memory architectures, specifically engineered to satisfy the intense data storage demands of AI data centers.

The new high-density storage modules feature enhanced transfer speeds, lower power consumption, and expanded endurance ratings tailored for large-scale AI model training and real-time inferencing workloads.

As artificial intelligence datasets grow exponentially, high-capacity solid-state storage solutions are becoming a critical link in eliminating data bottlenecks within high-performance computing (HPC) clusters.`,
    author: "Silicon & Systems Weekly",
    date: "2026-08-13T04:15:00.000Z",
    category: "Innovation",
    image_url: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80",
    featured: false
  },
  {
    title: "Devastating 6.8 Magnitude Earthquake Strikes Western Colombia: Emergency Operations Underway",
    slug: "earthquake-strikes-western-colombia-emergency-operations-underway",
    excerpt: "International disaster assistance and medical rescue teams mobilize following a powerful earthquake in western Colombia.",
    content: `Emergency operations and humanitarian relief efforts are underway in western Colombia after a powerful 6.8 magnitude earthquake struck the region early Thursday.

Search and rescue units accompanied by medical disaster teams have been deployed to urban and rural centers across the affected zone. National authorities and international aid organizations are coordinating supply lines to provide shelter, medical supplies, and emergency communications infrastructure.

Global leaders have expressed solidarity and offered immediate support to assist the Colombian government in relief and infrastructure recovery operations.`,
    author: "Global Wire Services",
    date: "2026-08-13T03:50:00.000Z",
    category: "News",
    image_url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    featured: false
  },
  {
    title: "Global Telecom & IT Contract Renewal Wave Reaches $13 Billion Milestone",
    slug: "global-telecom-it-contract-renewal-wave-reaches-13-billion",
    excerpt: "Enterprise IT modernization accelerates as major global corporate contracts reach renewal deadlines heading into late 2026.",
    content: `Global enterprise IT services providers are competing for over $13 billion in major technology infrastructure and managed services contracts slated for renewal through the end of 2026.

Industry research indicates that enterprise clients are actively restructuring legacy contracts to incorporate cloud-native architectures, automated cybersecurity frameworks, and generative AI workflow automation.

IT services leadership across North America, Europe, and Asia-Pacific are positioning their consulting and implementation capabilities to secure long-term digital transformation partnerships with Fortune 500 corporations.`,
    author: "Enterprise Technology Insights",
    date: "2026-08-13T03:30:00.000Z",
    category: "Technology",
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    featured: false
  },
  {
    title: "Breakthrough Clinical Trials Highlight Advances in Next-Gen Allergy Therapies and Pediatric Care",
    slug: "breakthrough-clinical-trials-next-gen-allergy-therapies",
    excerpt: "New therapeutic frameworks and preventive healthcare policies aim to transform pediatric clinical safety and treatment accessibility globally.",
    content: `Medical researchers and public health experts have released promising clinical trial results for next-generation desensitization therapies aimed at severe pediatric food allergies.

The clinical advancements coincide with new global healthcare policy initiatives establishing mandatory emergency auto-injector protocols and comprehensive allergy management standards in educational institutions.

Healthcare leaders emphasize that combining innovative biomedical treatments with preventive institutional policies will significantly reduce severe allergic reactions and improve emergency response outcomes.`,
    author: "Healthcare Innovations Today",
    date: "2026-08-13T03:00:00.000Z",
    category: "Healthcare",
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=1200&q=80",
    featured: false
  },
  {
    title: "Resideo Technologies Posts Record $1.98 Billion Revenue Driven by Smart Building Automation Demand",
    slug: "resideo-technologies-posts-record-1-98-billion-revenue",
    excerpt: "Smart home and industrial energy management systems drive historic quarterly earnings performance for Resideo.",
    content: `Resideo Technologies has reported record financial results for its second quarter of 2026, achieving net revenue of $1.98 billion behind strong commercial and residential demand for intelligent building control systems.

Growth was anchored by rapid adoption of smart HVAC energy optimization controls, integrated security solutions, and grid-responsive home energy management hardware.

Company executives noted that commercial facility operators and homeowners are increasingly prioritizing energy efficiency and automated climate management solutions to offset rising utility costs.`,
    author: "Industrial Business Brief",
    date: "2026-08-13T02:30:00.000Z",
    category: "Business",
    image_url: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80",
    featured: false
  },
  {
    title: "Electric Mobility Platform Yulu Secures $93 Million Series C Funding to Expand EV Fleet Operations",
    slug: "electric-mobility-yulu-secures-93-million-series-c-funding",
    excerpt: "Urban micro-mobility startup expands battery swapping network and last-mile delivery fleet across major urban logistics hubs.",
    content: `Electric micro-mobility company Yulu has raised $93 million in a Series C funding round led by global mobility and clean energy investors.

The fresh capital will be deployed to expand Yulu's battery swapping infrastructure network, increase its electric two-wheeler fleet, and scale last-mile delivery partnerships across major urban logistics hubs.

As cities worldwide push toward decarbonization and zero-emission transportation targets, scalable electric micro-mobility services are becoming a core pillar of sustainable urban transit.`,
    author: "CleanTech & Trends",
    date: "2026-08-13T02:00:00.000Z",
    category: "Top Trending News",
    image_url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
    featured: true
  }
];

async function seedToday() {
  console.log("Seeding today's articles into database (August 13, 2026)...");
  let inserted = 0;
  let updated = 0;

  for (const article of todayArticles) {
    try {
      const { data: existing, error: checkError } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', article.slug)
        .maybeSingle();

      if (checkError) {
        console.error(`Check error for "${article.slug}":`, checkError);
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
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (updateError) {
          console.error(`Update error for "${article.title}":`, updateError);
        } else {
          console.log(`Updated: "${article.title}"`);
          updated++;
        }
      } else {
        const { error: insertError } = await supabase
          .from('articles')
          .insert([article]);

        if (insertError) {
          console.error(`Insert error for "${article.title}":`, insertError);
        } else {
          console.log(`Inserted: "${article.title}"`);
          inserted++;
        }
      }
    } catch (err) {
      console.error(`Error processing "${article.title}":`, err);
    }
  }

  console.log(`\nToday's seeding completed. Inserted: ${inserted}, Updated: ${updated}`);
}

seedToday();
