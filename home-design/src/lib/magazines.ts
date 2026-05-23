// Read-only client for the external Supabase project (theciovision.com).
// Uses the publishable (anon) key — safe to embed in client code.
// We hit the PostgREST endpoint directly with fetch so we don't need the
// @supabase/supabase-js SDK as a dependency.

const SUPABASE_URL = "https://elrnafeyidalkswgdqvx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_BrARkeKvbHQIhIylLCFMgA_Z9k-ckDF";

export type RemoteMagazine = {
  id: string;
  title: string;
  slug: string | null;
  issue_number: number | null;
  description: string | null;
  cover_image_url: string | null;
  pdf_url: string | null;
  publish_date: string | null;
  featured: boolean | null;
  featured_article_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Issue = {
  id: string;
  title: string;
  edition: string;
  date: string;
  readTime: string;
  category: string;
  cover: string;
  accent: string;
  excerpt: string;
  author: string;
  role: string;
  pdfUrl?: string | null;
  slug?: string | null;
  featured?: boolean;
};

const ACCENTS = [
  "from-amber-300/40 via-orange-400/20 to-rose-500/30",
  "from-sky-400/40 via-indigo-500/30 to-violet-600/30",
  "from-emerald-300/40 via-teal-500/30 to-cyan-600/30",
  "from-rose-300/40 via-pink-500/30 to-fuchsia-600/30",
  "from-yellow-300/40 via-amber-500/30 to-orange-600/30",
  "from-green-300/40 via-emerald-500/30 to-teal-600/30",
];

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80";

function formatDate(d: string | null): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

function deriveCategory(m: RemoteMagazine): string {
  const text = `${m.title} ${m.description ?? ""}`.toLowerCase();
  if (/\bai\b|tech|cyber|cio|digital|software|engineer/i.test(text))
    return "Technology";
  if (/cfo|finance|capital|invest|bank/i.test(text)) return "Finance";
  if (/governance|risk|compliance|board/i.test(text)) return "Governance";
  if (/sustain|climate|esg|green/i.test(text)) return "Sustainability";
  if (/culture|people|hr|talent|coach|women|career/i.test(text))
    return "Culture";
  return "Leadership";
}

function readTimeFromText(t: string | null): string {
  const words = (t ?? "").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(8, Math.round(words / 200) + 12);
  return `${minutes} min`;
}

// Storage host stored in the DB (xafgvakclkwjivgfzljq.supabase.co) is dead.
// theciovision.com proxies the same /storage/v1/... paths and works.
function rewriteImageUrl(url: string | null | undefined): string {
  if (!url) return FALLBACK_COVER;
  return url.replace(
    /^https?:\/\/[^/]+\.supabase\.co\/storage\/v1\//i,
    "https://theciovision.com/supabase-proxy.php/storage/v1/",
  );
}

export function mapMagazine(m: RemoteMagazine, index: number): Issue {
  return {
    id: m.id,
    title: m.title,
    edition: m.issue_number
      ? `Issue ${String(m.issue_number).padStart(2, "0")}`
      : `Edition ${index + 1}`,
    date: formatDate(m.publish_date ?? m.created_at),
    readTime: readTimeFromText(m.description),
    category: deriveCategory(m),
    cover: rewriteImageUrl(m.cover_image_url),
    accent: ACCENTS[index % ACCENTS.length],
    excerpt: m.description ?? "An exclusive edition for senior executives.",
    author: "The Editorial Board",
    role: "CIO Vision",
    pdfUrl: m.pdf_url,
    slug: m.slug,
    featured: !!m.featured,
  };
}

export async function fetchMagazines(): Promise<Issue[]> {
  const url = `${SUPABASE_URL}/rest/v1/magazines?select=*&order=publish_date.desc.nullslast`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to load magazines (${res.status})`);
  }
  const rows = (await res.json()) as RemoteMagazine[];
  return rows.map(mapMagazine);
}
