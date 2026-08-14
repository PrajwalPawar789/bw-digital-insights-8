import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesMap = {
  'before-you-hire-an-ai-worker': {
    url: 'https://www.cxomagazine.com/wp-content/uploads/2025/07/Roman-Hahalev.jpeg',
    localName: 'roman-hahalev.jpeg'
  },
  'looking-ahead-execution-excellence-in-an-era-of-transformation': {
    url: 'https://www.cxomagazine.com/wp-content/uploads/2025/01/Dr.-Jeffrey-Mrizek.png',
    localName: 'jeffrey-mrizek.png'
  },
  'no-one-checks-in-with-reality-we-can-we-should': {
    url: 'https://www.cxomagazine.com/wp-content/uploads/2024/06/Marcus-Kirsch.png',
    localName: 'marcus-kirsch.png'
  },
  'the-white-elephant-in-the-room-company-culture-innovation-and-workforce-generation': {
    url: 'https://www.cxomagazine.com/wp-content/uploads/2024/10/Moe-Mesbah.png',
    localName: 'moe-mesbah.png'
  },
  'want-to-build-a-better-personal-brand-make-time-to-speak-to-strangers': {
    url: 'https://www.cxomagazine.com/wp-content/uploads/2024/01/Fiona-Chorlton.png',
    localName: 'fiona-chorlton-voong.png'
  },
  'female-founders-navigating-alternatives-to-the-glass-ceiling': {
    url: 'https://www.cxomagazine.com/wp-content/uploads/2024/05/Elaine-Gold-2.png',
    localName: 'elaine-gold.png'
  },
  'the-evolving-role-of-the-chief-marketing-officer': {
    url: 'https://www.cxomagazine.com/wp-content/uploads/2024/04/Sandrine-and-Angie.jpg',
    localName: 'sandrine-desbarbieux-lloyd.jpg'
  },
  'entrepreneurial-leadership-harnessing-the-power-of-a-creative-and-innovative-mindset-in-the-age-of-ai': {
    url: 'https://www.cxomagazine.com/wp-content/uploads/2024/04/Claire-Koryczan.png',
    localName: 'claire-koryczan.png'
  },
  'the-interplay-of-knowledge-and-wisdom-why-wisdom-trumps-all': {
    url: 'https://www.cxomagazine.com/wp-content/uploads/2023/10/Diana-Monterrubio-Resized.jpeg',
    localName: 'diana-monterrubio.jpeg'
  },
  'leadership-in-the-digital-age-navigating-transformation-challenges': {
    url: 'https://www.cxomagazine.com/wp-content/uploads/2023/11/Rinet-Mitrani-Hosol-Resized.png',
    localName: 'rinet-hosol.png'
  },
  'how-to-overcome-the-top-10-ai-risks': {
    url: 'https://www.cxomagazine.com/wp-content/uploads/2026/07/Luis-Taveras.jpeg',
    localName: 'luis-e-taveras.jpeg'
  }
};

const outputDir = path.resolve(__dirname, '../public/images/leadership');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log("Downloading leadership images...");

for (const [slug, item] of Object.entries(imagesMap)) {
  const outputPath = path.join(outputDir, item.localName);
  console.log(`Downloading: ${item.url} -> ${item.localName}`);
  
  try {
    const cmd = `curl.exe -L -s -o "${outputPath}" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${item.url}"`;
    execSync(cmd);
    
    // Check if file exists and has size > 0
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      if (stats.size > 1000) {
        console.log(`Successfully downloaded ${item.localName} (${stats.size} bytes)`);
      } else {
        console.warn(`Warning: Downloaded file is too small (${stats.size} bytes), might be blocked/404.`);
      }
    } else {
      console.error(`Error: File was not created: ${item.localName}`);
    }
  } catch (e) {
    console.error(`Failed to download ${item.localName}:`, e.message);
  }
}

console.log("All image downloads completed!");
