import { toCurrentStorageUrl } from "@/lib/storageUrl";

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
  region?: string | null;
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
    return new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  } catch {
    return d;
  }
}

function deriveCategory(m: any): string {
  const text = `${m.title ?? ""} ${m.description ?? ""}`.toLowerCase();
  if (/\bai\b|tech|cyber|cio|digital|software|engineer/i.test(text)) return "Technology";
  if (/cfo|finance|capital|invest|bank/i.test(text)) return "Finance";
  if (/governance|risk|compliance|board/i.test(text)) return "Governance";
  if (/sustain|climate|esg|green/i.test(text)) return "Sustainability";
  if (/culture|people|hr|talent|coach|women|career/i.test(text)) return "Culture";
  return "Leadership";
}

function readTimeFromText(t: string | null): string {
  const words = (t ?? "").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(8, Math.round(words / 200) + 12);
  return `${minutes} min`;
}

export function mapMagazine(m: any, index: number): Issue {
  const coverUrl = toCurrentStorageUrl(m.cover_image_url) ?? FALLBACK_COVER;
  return {
    id: m.id,
    title: m.title,
    edition: m.issue_number
      ? `Issue ${String(m.issue_number).padStart(2, "0")}`
      : `Edition ${index + 1}`,
    date: formatDate(m.publish_date ?? m.created_at),
    readTime: readTimeFromText(m.description),
    category: deriveCategory(m),
    cover: coverUrl || FALLBACK_COVER,
    accent: ACCENTS[index % ACCENTS.length],
    excerpt: m.description ?? "An exclusive edition for senior executives.",
    author: "The Editorial Board",
    role: "CIO Vision",
    pdfUrl: m.pdf_url,
    slug: m.slug,
    featured: !!m.featured,
    region: m.region ?? null,
  };
}
