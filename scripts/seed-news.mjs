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

const articlesToSeed = [
  {
    title: "Shelter-in-place order at Azteca over severe weather before Mexico-England",
    slug: "shelter-in-place-order-at-azteca-over-severe-weather-before-mexico-england",
    excerpt: "Supporters are told to stay in their seats as an electrical storm approaches the Azteca Stadium before Mexico v England in the last 16 of the World Cup.",
    content: `The Azteca Stadium has issued a shelter-in-place order because of severe weather before the last-16 World Cup tie between Mexico and England. The match in Mexico City is set to kick off at 18:00 local time on Sunday (01:00 BST Monday).

There has been heavy rain in the city during the day and reports of lightning above the stadium. The current advice for supporters and media inside the ground is to remain in their seats.

FIFA held talks with the English and Mexican football associations on Friday after proposing the match be moved to 19:00 BST on Sunday (12:00 local time) before a U-turn resulted in the kick-off time remaining unchanged.

Thunderstorms and shower clouds have been developing around Mexico City in the last few hours. On social media there are reports of downpours affecting parts of the city, however it is difficult to verify if lightning has been occurring close to the football ground itself. The showers are likely to continue to grow, threatening disruption. Any storms are likely to linger for hours.`,
    author: "BBC Sports",
    date: "2026-07-05T21:52:07.000Z",
    category: "News",
    image_url: "/images/news/news_image_1_big.jpg",
    featured: false
  },
  {
    title: "EasyJet reaches 'agreement in principle' over potential takeover",
    slug: "easyjet-reaches-agreement-in-principle-over-potential-takeover",
    excerpt: "The low-cost airline had previously rejected four takeover offers from US investment firm Castlelake.",
    content: `EasyJet has reached an agreement in principle with a US investment firm over a potential takeover offer worth around £5.2 billion. The low-cost Luton-based airline had previously rejected four takeover offers from Castlelake, which owns a stake of about 2.14% in EasyJet through the funds it manages. It said those offers had been worth £6.50, £5.60, £6 and £6.25 a share, and has previously accused Castlelake of trying to buy it "on the cheap".

On Sunday, EasyJet's board of directors and Castlelake said they had reached an agreement in principle on a proposal put forward on July 4, worth £6.90 per share.

This does not mean a deal has been confirmed. Castlelake now needs to get regulatory clearances and the approvals required for the transaction to go ahead. One significant regulatory hurdle is that EasyJet is a European company, so by EU rules it needs to be 51% owned by a European company. Castlelake is a US firm, although it has previously outlined how it would endeavour to comply with this rule. It has until 17:00 BST on August 3 to either announce a firm intention to make an offer or say it does not intend to do so. If an offer is made, it would need to be put to a shareholder vote.

EasyJet is one of Europe's largest airlines. It employs more than 19,000 people and flies around 1,200 routes across 35 European countries. It has previously said its share price had been "temporarily depressed" - partly due to the impact of the US-Israel war with Iran on the travel sector. EasyJet shares closed on Friday at £5.58 each.`,
    author: "BBC Business",
    date: "2026-07-05T17:30:55.000Z",
    category: "Business",
    image_url: "/images/news/news_image_2_big.jpg",
    featured: false
  },
  {
    title: "Reform denies rules broken by Farage after benefits from ally not declared",
    slug: "reform-denies-rules-broken-by-farage-after-benefits-from-ally-not-declared",
    excerpt: "The Sunday Times says the Reform UK leader failed to register the support supplied by a cryptocurrency entrepreneur who had been convicted of fraud.",
    content: `Reform UK has insisted that no rules have been broken after it emerged Nigel Farage did not declare benefits provided by an ally once convicted of fraud in the US. The Sunday Times says George Cottrell supplied support including security and social media staff who worked on Farage's online content in the year before he was elected. It also claims Farage used a property rented by Cottrell near Buckingham Palace.

Robert Jenrick, Reform's Treasury spokesman, told the BBC that Farage did not need to register the support as it was in a "purely personal capacity" before he became an MP. The Liberal Democrats have asked the parliamentary standards commissioner to investigate. In a statement late on Sunday, Farage reiterated that he had "done no wrongdoing" and followed the rules, and said he was considering legal action against the Sunday Times.

Farage is already facing a parliamentary probe over a £5m gift from a billionaire Reform UK donor which was not registered. He has argued that money was for personal security and was not political because it was received when he was not involved in politics. His team have made a similar argument for why the "in kind" - non-cash - benefits allegedly from Cottrell were not registered.

Cottrell, 32, who admitted a count of wire fraud in the US in 2017, is a long-standing ally of Farage. He was involved with UKIP as a volunteer in the run-up to the Brexit referendum. In 2017, Cottrell was jailed for eight months in the US after pleading guilty to a charge of wire fraud after admitting attempting to defraud criminals on the dark web by posing as a money launderer.`,
    author: "BBC Politics",
    date: "2026-07-05T21:43:43.000Z",
    category: "News",
    image_url: "/images/news/news_image_3_big.jpg",
    featured: false
  },
  {
    title: "Emotion and politics merge in Tehran at funeral of former supreme leader",
    slug: "emotion-and-politics-merge-in-tehran-at-funeral-of-former-supreme-leader",
    excerpt: "The BBC's chief international correspondent Lyse Doucet is in Tehran, where funeral events are taking place in honour of Iran's former leader, Ayatollah Ali Khamenei.",
    content: `Vast crowds loyal to the Islamic Republic have gathered in Tehran at a funeral ceremony for Iran's former supreme leader, Ayatollah Ali Khamenei, who was killed in joint US-Israeli strikes at the start of the war.

His second son and successor, Supreme Leader Mojtaba Khamenei, was conspicuously absent from his father's funeral. Ali Khamenei's other three sons - Masoud, Mostafa, and Meysam - all attended the service held in the capital on Sunday.

Iranian state media say six days of ceremonies will span several locations across Iran and neighbouring Iraq, before the late ayatollah is buried in his hometown of Mashhad on Thursday.

The BBC's chief international correspondent Lyse Doucet is reporting from Tehran on condition that none of her material is used on the BBC's Persian Service. These restrictions apply to all international media organisations operating in Iran.`,
    author: "Lyse Doucet",
    date: "2026-07-05T17:54:47.000Z",
    category: "News",
    image_url: "/images/news/news_image_4_big.jpg",
    featured: false
  },
  {
    title: "Catherine shares photos reuniting with family after Three Peaks Challenge",
    slug: "catherine-shares-photos-reuniting-with-family-after-three-peaks-challenge",
    excerpt: "The princess completed the challenge in aid of the hospital where she was treated for cancer.",
    content: `Catherine, Princess of Wales has released new images showing her reuniting with her family after completing the Three Peaks Challenge in aid of the hospital where she was treated for cancer. She is pictured alongside her children Prince George, Princess Charlotte, and Prince Louis, and her husband the Prince of Wales after scaling Yr Wyddfa (Snowdon) in north Wales last week.

Catherine, 44, previously said the challenge, which involves climbing the highest peaks in England, Scotland, and Wales within 24 hours, had been a "chance to explore life beyond diagnosis and to give something back". The princess revealed she was having cancer treatment in 2024 and said she was in remission at the start of 2025. In the photos released on social media on Sunday, she is also joined by her parents, Carole and Michael Middleton, her brother James, and a golden retriever. 

Catherine's brother also wrote on Instagram that he was "incredibly proud" of his sister, saying it had been an "honour" to have completed the challenge alongside her. "Two years ago, I told you we'd climb this mountain together," he said in a post. "We talked about climbing mountains while you were in hospital, and about the incredible healing power that nature can have for both the body and the mind."

After completing the challenge, the princess paid tribute to the charity as "a place that holds great meaning for me and whose care and expertise are life changing for so many people". Catherine summitted England's Scafell Pike, Scotland's Ben Nevis, and finished on Yr Wyddfa where the reunion was held.`,
    author: "BBC Royal Correspondent",
    date: "2026-07-05T19:56:41.000Z",
    category: "News",
    image_url: "/images/news/news_image_5_big.jpg",
    featured: false
  },
  {
    title: "Trump thanks Fifa after USA striker Balogun's ban suspended",
    slug: "trump-thanks-fifa-after-usa-striker-baloguns-ban-suspended",
    excerpt: "Folarin Balogun is available to play for the United States in their World Cup last-16 tie against Belgium after his one-game ban is suspended by Fifa.",
    content: `Folarin Balogun is available to play for the United States in their World Cup last-16 tie against Belgium after his one-game ban was suspended by Fifa. The 25-year-old striker was shown a straight red card for a foul on Bosnia-Herzegovina defender Tarik Muharemovic as the co-hosts won their last-32 tie 2-0.

Fifa said the automatic one-match ban would be suspended for a year. No reasoning behind the move was provided, beyond citing a rule which allows punishments to be suspended. The Royal Belgian Football Association (RBFA) said it is "astonished" by Fifa's decision and is "investigating all potential options" in response.

US President Donald Trump thanked Fifa for "reversing a great injustice" in a post on Truth Social. Trump wrote: "Thank you to Fifa for doing what was right, and reversing a great injustice! President DONALD J. TRUMP." Reports indicate Trump called Fifa president Gianni Infantino earlier this week to ask for the red card to be reviewed.

USA forward Christian Pulisic said the squad learned the one-game ban had been suspended on the bus to training on Sunday and said Balogun was "super happy". Balogun has been a key figure for the US at the World Cup, scoring twice for Mauricio Pochettino's side.`,
    author: "BBC Sports",
    date: "2026-07-05T19:36:11.000Z",
    category: "News",
    image_url: "/images/news/news_image_6_big.jpg",
    featured: false
  },
  {
    title: "Young woman dies in skydiving incident near airfield",
    slug: "young-woman-dies-in-skydiving-incident-near-airfield",
    excerpt: "The woman, 22, was found in a nearby field and pronounced dead at the scene, police say.",
    content: `A young woman has died in a skydiving incident near an airfield in Nottinghamshire. Emergency services were called to the scene near Langar Airfield at 12:13 BST on Sunday.

The woman, 22, was found in a nearby field and pronounced dead at the scene, Nottinghamshire Police said.

Det Insp Rachel Mayfield said: "This was a tragic incident, and we are working with partners to understand what happened. As our investigations continue at the scene, our thoughts are with the woman's family and everyone else who has been affected by this incident."`,
    author: "BBC News",
    date: "2026-07-05T19:29:32.000Z",
    category: "News",
    image_url: "/images/news/news_image_7_big.jpg",
    featured: false
  },
  {
    title: "Benedict's Law to overhaul school allergy training",
    slug: "benedicts-law-to-overhaul-school-allergy-training",
    excerpt: "Benedict Blythe died after an accidental exposure to an allergen at school in 2021.",
    content: `Life-saving allergy pens will be stored in all UK schools from September following a campaign by the parents of a five-year-old boy who died after drinking contaminated milk.

Under Benedict's Law, schools will also need to have a whole-school allergy policy, provide training to all staff and ensure individual healthcare plans for pupils with allergies, the Department for Education said. Benedict Blythe died after an accidental exposure to an allergen - cow's milk protein - while at Barnack Primary School, between Stamford and Peterborough, in December 2021.

Benedict's mother, Helen Blythe, said children would be "stepping into an education system far safer than the one that has come before. We think this is something that will keep not just children safe, but people who work in schools as well. It will give them [staff] the confidence to know what to do in an emergency."

According to research by Benedict Blythe Foundation, 50% of schools in England do not have any spare medication, a third have no allergy policy and 70% do not have all the measures now being introduced. While the statutory guidance comes into effect from September, Benedict's Law will go further. From 2027, the same measures will be made into statutory duties and will apply to state schools, independent schools and fee-paying special schools, legally requiring them to implement changes.`,
    author: "BBC Health",
    date: "2026-07-05T21:30:10.000Z",
    category: "Healthcare",
    image_url: "/images/news/news_image_8_big.jpg",
    featured: false
  },
  {
    title: "Australia probes mystery space balls that washed up on beach",
    slug: "australia-probes-mystery-space-balls-that-washed-up-on-beach",
    excerpt: "Officials are searching for the origins of six pieces of space debris discovered on Forrest Beach in Queensland.",
    content: `The authorities in Australia are investigating the origins of mysterious large spheres that washed up on a beach in northern Queensland this weekend. 

The six solid objects discovered on Forrest Beach, to the north of Townsville, are thought to be space debris, and the Australian Space Agency (ASA) is now trying to determine where they came from. Queensland authorities warned local residents that the spheres could be "potentially hazardous objects" and should not be touched until safety checks are completed.`,
    author: "BBC Science",
    date: "2026-07-05T12:55:58.000Z",
    category: "News",
    image_url: "/images/news/news_image_9_big.jpg",
    featured: false
  },
  {
    title: "Guests react to Taylor Swift and Travis Kelce's wedding in New York",
    slug: "guests-react-to-taylor-swift-and-travis-kelces-wedding-in-new-york",
    excerpt: "Some of the famous guests have been posting on social media about the big day in New York.",
    content: `A-list guests have taken to social media to share reactions and details from Taylor Swift and Travis Kelce's star-studded wedding in New York. The wedding, which was officiated by actor Adam Sandler, was described by attendees as "magical," "emotional," and "intimate" despite the massive scale of the event.

Actress Niecy Nash posted: "The Betts pulled up to the Travis Kelce & Taylor Swift wedding. A time was had. The love in the room was palpable. Wowwwwwww is the best way to describe it. From beginning to end, no detail was spared!"

Music video director Joseph Kahn shared: "What I will say about the wedding was it was so much funnier and emotional than expected, and as big as it was, it also felt very intimate. And yes, literally everyone was there. It was like living in the internet." Kahn also added he achieved a lifelong dream of discussing filmmaking with guest Steven Spielberg.

Other prominent stars spotted or confirming their attendance via social media included Suki Waterhouse, Adam Scott, Paul Rudd, Selena Gomez, Camila Cabello, Hugh Grant, Gigi Hadid, Tom Hanks, and Maren Morris. Donna Kelce, mother of the groom, added that the ceremony was "magical, man, magical."`,
    author: "BBC Entertainment",
    date: "2026-07-05T15:48:20.000Z",
    category: "Top Trending News",
    image_url: "/images/news/news_image_10_big.jpg",
    featured: false
  }
];

async function seed() {
  console.log("Seeding articles in database...");
  let successCount = 0;
  let updateCount = 0;

  for (const article of articlesToSeed) {
    try {
      // Check if already exists
      const { data: existing, error: checkError } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', article.slug)
        .maybeSingle();

      if (checkError) {
        console.error(`Error checking slug "${article.slug}":`, checkError);
        continue;
      }

      if (existing) {
        // Update
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
          console.error(`Error updating "${article.title}":`, updateError);
        } else {
          console.log(`Updated article: "${article.title}"`);
          updateCount++;
        }
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from('articles')
          .insert([article]);

        if (insertError) {
          console.error(`Error inserting "${article.title}":`, insertError);
        } else {
          console.log(`Inserted article: "${article.title}"`);
          successCount++;
        }
      }
    } catch (err) {
      console.error(`Failed to process article "${article.title}":`, err);
    }
  }

  console.log(`\nSeeding completed. Inserted: ${successCount}, Updated: ${updateCount}`);
}

seed();
