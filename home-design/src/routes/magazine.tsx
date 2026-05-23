import React, { useMemo, useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Heart,
  MessageCircle,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchMagazines, type Issue } from "@/lib/magazines";
import navbarLogo from "@/assets/navbar-logo.png";
import regionAmericas from "@/assets/AMERICAS-MAP-Black.webp";
import regionEurope from "@/assets/Europe-MAP-Black.webp";
import regionMea from "@/assets/MEA-MAP-Black.webp";
import regionApac from "@/assets/APAC-MAP-Black.webp";
import regionHall from "@/assets/region-hall.png";
import {
  fetchArticles,
  fetchCategories,
  fetchLeaders,
  fetchPressReleases,
  fetchTrending,
  fetchUpcoming,
  fetchTestimonials,
  type Article,
  type Category,
  type Leader,
  type PressRelease,
  type Trending,
  type Upcoming,
  type Testimonial,
} from "@/lib/content";

const COMPANY_NAME = "CIO Vision";
const RED = "#E11D2A";

/** Upgrade common stock-photo URLs to high-res so covers/thumbnails are sharp. */
function sharpen(url?: string | null, w: number = 1200): string {
  if (!url) return "";
  if (url.includes("unsplash.com")) {
    const base = url.split("?")[0];
    return `${base}?auto=format&fit=crop&w=${w}&q=90`;
  }
  if (/images\.pexels\.com/.test(url)) {
    return url.replace(/[?&](w|h|auto|cs|dpr)=[^&]+/g, "") + `?auto=compress&cs=tinysrgb&w=${w}`;
  }
  return url;
}

const REGIONS = [
  { id: "americas", label: "AMERICAS EDITIONS" },
  { id: "europe", label: "EUROPE EDITIONS" },
  { id: "mea", label: "MEA EDITIONS" },
  { id: "apac", label: "APAC EDITIONS" },
  { id: "hall", label: "HALL OF FAME" },
] as const;

type LoaderData = {
  magazines: Issue[];
  articles: Article[];
  categories: Category[];
  leaders: Leader[];
  press: PressRelease[];
  trending: Trending[];
  upcoming: Upcoming[];
  testimonials: Testimonial[];
};

export const Route = createFileRoute("/magazine")({
  component: MagazinePage,
  loader: async (): Promise<LoaderData> => {
    const [magazines, articles, categories, leaders, press, trending, upcoming, testimonials] =
      await Promise.all([
        fetchMagazines(),
        fetchArticles(),
        fetchCategories(),
        fetchLeaders(),
        fetchPressReleases(),
        fetchTrending(),
        fetchUpcoming(),
        fetchTestimonials(),
      ]);
    return { magazines, articles, categories, leaders, press, trending, upcoming, testimonials };
  },
  pendingComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-3">
        <Loader2 className="h-10 w-10 animate-spin" style={{ color: RED }} />
        <p className="text-sm font-semibold text-neutral-700">Loading the newsroom…</p>
      </div>
    </div>
  ),
  errorComponent: ({ error }: { error: Error }) => (
    <div className="min-h-screen flex items-center justify-center px-6">
      <p className="text-sm text-neutral-600">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => <p>Not found</p>,
  head: () => ({
    meta: [
      { title: `${COMPANY_NAME} — Business Magazine, CXO Stories & Industry Insights` },
      {
        name: "description",
        content: `${COMPANY_NAME}: regional editions, executive interviews, leadership profiles, trending CXO stories, case studies, and press releases.`,
      },
    ],
  }),
});

/* ============================ Helpers ============================ */
function fmt(d: string | null | undefined): string {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

function pickRegion(m: Issue): (typeof REGIONS)[number]["id"] {
  const sum = Array.from(m.id).reduce((a, c) => a + c.charCodeAt(0), 0);
  return REGIONS[sum % REGIONS.length].id;
}

const TRUSTED = [
  { name: "Lenovo", color: "#E2231A", italic: true },
  { name: "Valero", color: "#0A4595", italic: false },
  { name: "Coca-Cola", color: "#F40009", italic: true },
  { name: "TransUnion", color: "#003865", italic: false },
  { name: "Adobe", color: "#FA0F00", italic: false },
  { name: "Philippine Airlines", color: "#00529C", italic: false },
];

const COL_LABELS = [
  ["Technology", "Healthcare", "Finance"],
  ["Marketing", "Education", "Manufacturing"],
  ["Consulting", "Real Estate", "Legal"],
];

const LINKEDIN_POSTS = [
  {
    body: "Inside the boardroom: why CIOs are now the chief storytellers of digital transformation.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=70",
    likes: 142,
  },
  {
    body: "Cover story: the leaders rewriting the AI playbook in regulated industries.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=70",
    likes: 98,
  },
  {
    body: "Sustainability in the cloud — 7 CTOs share blueprints they wish they had 5 years ago.",
    image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=600&q=70",
    likes: 211,
  },
  {
    body: "Hall of Fame announcement Friday. Hint: she rebuilt a Fortune 100 stack in 18 months.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=70",
    likes: 67,
  },
];

const CITY_REPORTS_DEFAULT = [
  { city: "Busan", title: "Busan: After the Credits, A City in Full Take", img: "https://images.unsplash.com/photo-1538485399081-7c8978d4cdf6?auto=format&fit=crop&w=900&q=70" },
  { city: "Cape Town", title: "Cape Town: Where Oceans Meet, Stories Settle, and an Economy…", img: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=900&q=70" },
  { city: "Munich", title: "Walking through Munich: A City Lived and Re-imagined", img: "https://images.unsplash.com/photo-1599982646137-bbabe6e90b6f?auto=format&fit=crop&w=900&q=70" },
  { city: "Austin", title: "Austin in Focus: A Fast-Growing Metro Coming to Manage Its Own…", img: "https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=900&q=70" },
];

/* ============================ Brand wordmarks (SVG) ============================ */
function BrandWordmark({ name, color, italic }: { name: string; color: string; italic: boolean }) {
  return (
    <span
      className={`text-2xl font-extrabold tracking-tight ${italic ? "italic" : ""}`}
      style={{ color, fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {name}
    </span>
  );
}

/* Premium 3D region visuals — glossy obsidian landmasses with crimson rim glow */
const REGION_IMAGES: Record<string, string> = {
  americas: regionAmericas,
  europe: regionEurope,
  mea: regionMea,
  apac: regionApac,
  hall: regionHall,
};

function ContinentMap({ region }: { region: string }) {
  const src = REGION_IMAGES[region] || REGION_IMAGES.americas;
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Soft champagne ambient halo */}
      <div
        aria-hidden
        className="absolute inset-0 m-auto w-[82%] h-[82%] rounded-full blur-3xl opacity-70"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(232,200,170,0.55) 0%, rgba(225,29,42,0.10) 40%, rgba(0,0,0,0) 72%)",
        }}
      />
      {/* Faint concentric rings */}
      <div
        aria-hidden
        className="absolute w-[92%] h-[92%] rounded-full border border-[#E8C8AA]/25"
        style={{ animation: "region-spin 38s linear infinite" }}
      />
      <div
        aria-hidden
        className="absolute w-[72%] h-[72%] rounded-full border border-[#E8C8AA]/15"
        style={{ animation: "region-spin 56s linear infinite reverse" }}
      />
      {/* Soft pedestal shadow */}
      <div
        aria-hidden
        className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[55%] h-6 rounded-[50%] blur-2xl opacity-50"
        style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.55), transparent 70%)" }}
      />

      {/* Crossfading region image — keyed for smooth swap */}
      <img
        key={region}
        src={src}
        alt={`${region} region`}
        width={1024}
        height={1024}
        loading="lazy"
        decoding="async"
        className="relative z-10 w-[88%] h-[88%] object-contain drop-shadow-[0_30px_55px_rgba(232,200,170,0.35)]"
        style={{
          animation:
            "region-fade 800ms cubic-bezier(0.22,1,0.36,1) both, region-float 8s ease-in-out 800ms infinite",
        }}
      />

      <style>{`
        @keyframes region-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes region-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes region-fade {
          from { opacity: 0; transform: scale(0.96); filter: blur(6px); }
          to { opacity: 1; transform: scale(1); filter: blur(0); }
        }
      `}</style>
    </div>
  );
}

/* ============================ Page ============================ */
function MagazinePage() {
  const { magazines, articles, leaders, press, trending, upcoming } =
    Route.useLoaderData() as LoaderData;

  const [activeRegion, setActiveRegion] =
    useState<(typeof REGIONS)[number]["id"]>("americas");

  const regionalMags = useMemo(() => {
    // Always show all magazines per region (cycled to fill the fan if few exist)
    const grouped: Record<string, Issue[]> = {};
    REGIONS.forEach((r, ri) => {
      // Rotate the list so each region tab feels distinct
      const rotated = magazines.length
        ? [...magazines.slice(ri % magazines.length), ...magazines.slice(0, ri % magazines.length)]
        : [];
      // Pad to at least 7 by cycling
      const padded: Issue[] = [];
      const target = Math.max(7, rotated.length);
      for (let i = 0; i < target; i++) padded.push(rotated[i % Math.max(1, rotated.length)]);
      grouped[r.id] = padded.filter(Boolean);
    });
    return grouped;
  }, [magazines]);

  const visibleMags = regionalMags[activeRegion] || [];

  // Coverflow carousel state — active index for the magazine stack
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    setActiveIdx(0);
  }, [activeRegion]);
  useEffect(() => {
    if (visibleMags.length < 2) return;
    const t = setInterval(() => {
      setActiveIdx((i) => (i + 1) % visibleMags.length);
    }, 3500);
    return () => clearInterval(t);
  }, [visibleMags.length]);

  const colArticles = useMemo(() => {
    const cols: Article[][] = [[], [], []];
    articles.forEach((a, i) => cols[i % 3].push(a));
    return cols;
  }, [articles]);

  const coverStoryItems = useMemo(() => {
    const pool = leaders.length >= 5 ? leaders.slice(0, 8) : leaders;
    return pool
      .filter((l) => !!l?.image_url)
      .map((l) => ({ id: l.id, title: l.name, image: l.image_url as string }));
  }, [leaders]);
  const [coverIndex, setCoverIndex] = useState(0);
  useEffect(() => {
    if (coverStoryItems.length < 2) return;
    const t = setInterval(() => {
      setCoverIndex((i) => (i + 1) % coverStoryItems.length);
    }, 4000);
    return () => clearInterval(t);
  }, [coverStoryItems.length]);
  useEffect(() => {
    if (coverIndex >= coverStoryItems.length) setCoverIndex(0);
  }, [coverStoryItems.length, coverIndex]);
  const featuredCover = coverStoryItems[coverIndex]
    ? { image_url: coverStoryItems[coverIndex].image, name: coverStoryItems[coverIndex].title }
    : leaders[0];
  const cxoArticles = articles.slice(0, 4);
  const caseStudies = articles.slice(0, 4);
  const magProfileLead = leaders[1] || leaders[0];
  const magProfileSecondary = leaders.slice(2, 6);

  const cityReports = useMemo(() => {
    return CITY_REPORTS_DEFAULT.map((c, i) => {
      const t = trending[i];
      return t
        ? { city: c.city, title: t.title, img: t.image_url }
        : c;
    });
  }, [trending]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      {/* ============== TOP NAV ============== */}
      <header className="bg-black text-white">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-[56px]">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={navbarLogo} alt="The CIO Vision logo" className="h-9 w-9 object-contain" />
            <span className="text-[20px] font-extrabold tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
              The <span style={{ color: RED }}>CIO</span> Vision
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-[11px] uppercase font-semibold tracking-wider">
            <Link to="/" className="hover:opacity-70">Home</Link>
            <Link to="/magazine" style={{ color: RED }}>The Magazine Library</Link>
            <Link to="/" className="hover:opacity-70">Reviews</Link>
            <Link to="/" className="hover:opacity-70">Subscribe</Link>
          </nav>
          <div className="flex items-center gap-3 text-neutral-400">
            <Search className="h-4 w-4" />
            <span className="text-[11px]">▾</span>
          </div>
        </div>
      </header>

      {/* ============== REGION TABS (folder-style) ============== */}
      <div className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 pt-4">
          <div className="grid grid-cols-5 gap-0">
            {REGIONS.map((r) => {
              const active = activeRegion === r.id;
              const label = r.id === "hall" ? "Hall of Fame" : r.label.replace(" EDITIONS", " Editions");
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveRegion(r.id)}
                  className={`relative h-[52px] text-[15px] font-semibold whitespace-nowrap transition-colors border border-neutral-300 ${
                    active
                      ? "bg-white border-b-white z-10"
                      : "bg-neutral-100 text-neutral-800 hover:bg-neutral-50 border-b-neutral-300"
                  }`}
                  style={{
                    color: active ? RED : undefined,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    marginLeft: -1,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div className="border-b border-neutral-300 -mt-px" />
        </div>
      </div>

      {/* ============== HERO ============== */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 pt-6 pb-2">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
            {/* LEFT */}
            <div>
              <div className="grid grid-cols-[200px_1fr] gap-6 items-start mb-6">
                <div>
                  <h1 className="text-[18px] font-extrabold tracking-wide text-neutral-900 pb-2 border-b-2 border-neutral-800">
                    {REGIONS.find((r) => r.id === activeRegion)?.label}
                  </h1>
                </div>
                <p className="text-[13px] text-neutral-800 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                  {activeRegion === "americas"
                    ? "The Americas is home to some of the world's most influential business minds and groundbreaking companies. Our Americas edition showcases their journeys, ideas, and impact on the global business landscape."
                    : activeRegion === "europe"
                    ? "Europe blends heritage and innovation. Our Europe edition spotlights the leaders shaping the continent's industries — from finance and luxury to deep tech and sustainability."
                    : activeRegion === "mea"
                    ? "From Dubai to Lagos, the MEA region is rewriting the rules of growth. Meet the visionaries powering one of the world's fastest-evolving business landscapes."
                    : activeRegion === "apac"
                    ? "Asia-Pacific is where speed meets scale. Our APAC edition profiles the leaders engineering the next era of technology, manufacturing, and consumer markets."
                    : "Our Hall of Fame celebrates the most accomplished business leaders of our time — pioneers whose work has redefined entire industries."}
                </p>
              </div>

              {/* Coverflow — big center, progressively smaller sides, all sharp & visible */}
              <div
                className="relative h-[560px] flex items-center justify-center select-none"
                style={{ perspective: "1600px" }}
              >
                {visibleMags.map((m, i) => {
                  const len = visibleMags.length;
                  let offset = i - activeIdx;
                  if (offset > len / 2) offset -= len;
                  if (offset < -len / 2) offset += len;
                  const abs = Math.abs(offset);
                  if (abs > 3) return null;
                  // progressive shrink
                  const scale = abs === 0 ? 1 : abs === 1 ? 0.82 : abs === 2 ? 0.66 : 0.52;
                  // tighter overlap so side covers are partially hidden behind center
                  const translateX =
                    offset === 0
                      ? 0
                      : Math.sign(offset) * (160 + (abs - 1) * 110);
                  const z = 30 - abs;
                  const opacity = abs === 0 ? 1 : abs === 1 ? 1 : abs === 2 ? 0.9 : 0.7;
                  const sharpCover = sharpen(m.cover, 1400);
                  return (
                    <button
                      key={`${m.id}-${i}`}
                      type="button"
                      onClick={() => setActiveIdx(i)}
                      aria-label={`Show ${m.title}`}
                      className="absolute top-1/2 left-1/2 cursor-pointer"
                      style={{
                        transform: `translate3d(-50%, -50%, 0) translateX(${translateX}px) scale(${scale})`,
                        zIndex: z,
                        opacity,
                        willChange: "transform, opacity",
                        transition:
                          "transform 800ms cubic-bezier(0.22, 1, 0.36, 1), opacity 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                        transformOrigin: "center center",
                      }}
                    >
                      <div
                        className="relative w-[320px] aspect-[3/4] overflow-hidden bg-neutral-100 rounded-sm"
                        style={{
                          boxShadow:
                            abs === 0
                              ? "0 35px 70px -20px rgba(0,0,0,0.55), 0 12px 30px -12px rgba(0,0,0,0.45)"
                              : "0 20px 40px -18px rgba(0,0,0,0.4)",
                        }}
                      >
                        <img
                          src={sharpCover}
                          alt={m.title}
                          loading="eager"
                          decoding="async"
                          draggable={false}
                          className="w-full h-full object-contain bg-black"
                          style={{ filter: "none", backfaceVisibility: "hidden" }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Pagination dots */}
              <div className="flex justify-center gap-1.5 mt-4">
                {visibleMags.slice(0, Math.min(10, visibleMags.length)).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: i === activeIdx % Math.min(10, visibleMags.length) ? 22 : 6,
                      backgroundColor:
                        i === activeIdx % Math.min(10, visibleMags.length) ? RED : "#d4d4d4",
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <button
                  className="px-8 py-3 bg-black text-white text-[13px] font-bold tracking-wide hover:bg-neutral-800 transition"
                >
                  Read All Magazines
                </button>
              </div>
            </div>

            {/* RIGHT: continent silhouette */}
            <div className="hidden lg:block relative">
              <div className="h-[420px] flex items-center justify-center">
                <ContinentMap region={activeRegion} />
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
                {[
                  { icon: Linkedin, bg: "#0A66C2" },
                  { icon: Twitter, bg: "#000" },
                  { icon: Facebook, bg: "#1877F2" },
                  { icon: Youtube, bg: "#FF0000" },
                  { icon: Instagram, bg: "#E1306C" },
                ].map(({ icon: Icon, bg }, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-7 h-7 flex items-center justify-center hover:opacity-90"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon className="h-3.5 w-3.5 text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== TRUSTED BRANDS ============== */}
      <section className="bg-white border-y border-neutral-200">
        <div className="max-w-[1200px] mx-auto px-4 py-5">
          <p className="text-[13px] font-bold mb-4" style={{ color: RED }}>
            Trusted Brands of {COMPANY_NAME}
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
            {TRUSTED.map((b) => (
              <div
                key={b.name}
                className="h-12 flex items-center justify-center"
              >
                <BrandWordmark name={b.name} color={b.color} italic={b.italic} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== ARTICLES GRID 3×3 + NEWSLETTER ============== */}
      <section className="bg-white py-6 border-b border-neutral-200">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-12 gap-4">
            {/* Three rows × three article columns */}
            <div className="col-span-12 md:col-span-9">
              <div className="grid grid-cols-3 gap-4">
                {COL_LABELS.map((rowLabels, rowIdx) =>
                  rowLabels.map((label, colIdx) => {
                    const a =
                      colArticles[colIdx]?.[rowIdx] ||
                      articles[(rowIdx * 3 + colIdx) % Math.max(1, articles.length)];
                    if (!a) return null;
                    return (
                      <div key={`${rowIdx}-${colIdx}`} className="flex flex-col">
                        <p
                          className="text-[10px] font-extrabold uppercase tracking-wider mb-1.5"
                          style={{ color: RED }}
                        >
                          ▮ {label}
                        </p>
                        <Link to="/" className="group block">
                          <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
                            <img
                              src={sharpen(a.image_url, 700)}
                              alt={a.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <h3 className="mt-2 text-[12px] font-bold leading-snug text-neutral-900 group-hover:underline line-clamp-3">
                            {a.title}
                          </h3>
                        </Link>
                      </div>
                    );
                  }),
                )}
              </div>
            </div>

            {/* Newsletter card spanning 3 rows on right */}
            <div className="col-span-12 md:col-span-3">
              <div className="bg-black text-white p-6 h-full flex flex-col">
                <div className="self-start bg-white text-black px-4 py-1.5 mb-6 text-[12px] font-semibold" style={{ fontFamily: "Georgia, serif" }}>
                  Subscribe
                </div>
                <h3 className="text-[34px] font-extrabold leading-[1.05] mb-5 text-white" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                  Join The<br />Newsletter
                </h3>
                <div className="mb-6 flex justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=900&q=90"
                    alt="Magazine on devices"
                    className="w-full max-w-[220px] object-contain"
                  />
                </div>
                <p className="text-[13px] text-white/90 mb-5 text-center leading-relaxed flex-1" style={{ fontFamily: "Georgia, serif" }}>
                  Subscribe to our newsletter now<br />and stay informed!
                </p>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="bg-transparent border border-white/70 px-3 py-3 text-[13px] text-white placeholder-white/60 focus:outline-none focus:border-white"
                  style={{ fontFamily: "Georgia, serif" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== COVER STORIES + CXO ARTICLES ============== */}
      <section className="bg-white py-8 border-b border-neutral-200">
        <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ---------- Cover Story ---------- */}
          <div>
            {/* Section heading bar — thin line with label tab on the left */}
            <div className="relative mb-3 flex items-center">
              <div className="absolute inset-x-0 top-1/2 h-px bg-neutral-300" />
              <span className="relative bg-white pr-3 text-[13px] font-semibold text-neutral-900">
                Cover Story
              </span>
            </div>

            {/* Hero cover image — auto-rotating carousel with crossfade */}
            {coverStoryItems.length > 0 && (
              <div className="relative bg-neutral-900 overflow-hidden group">
                <div className="relative aspect-[3/2]">
                  {coverStoryItems.map((item, i) => (
                    <Link
                      key={`cs-hero-${item.id}-${i}`}
                      to="/"
                      aria-hidden={i !== coverIndex}
                      tabIndex={i === coverIndex ? 0 : -1}
                      className="absolute inset-0 block"
                      style={{
                        opacity: i === coverIndex ? 1 : 0,
                        transition: "opacity 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                        pointerEvents: i === coverIndex ? "auto" : "none",
                      }}
                    >
                      <img
                        src={sharpen(item.image, 1400)}
                        alt={item.title}
                        decoding="async"
                        loading={i === 0 ? "eager" : "lazy"}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </Link>
                  ))}
                </div>

                {/* Prev / next arrows */}
                {coverStoryItems.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous cover story"
                      onClick={() =>
                        setCoverIndex((i) => (i - 1 + coverStoryItems.length) % coverStoryItems.length)
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next cover story"
                      onClick={() => setCoverIndex((i) => (i + 1) % coverStoryItems.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Thumbnail strip — click to jump, active is highlighted */}
            <div className="grid grid-cols-5 gap-2 mt-2">
              {coverStoryItems.slice(0, 5).map((item, i) => {
                const isActive = i === coverIndex % Math.max(1, Math.min(5, coverStoryItems.length));
                return (
                  <button
                    key={`cs-thumb-${item.id}-${i}`}
                    type="button"
                    onClick={() => setCoverIndex(i)}
                    className="block group text-left"
                    aria-label={`Show ${item.title}`}
                  >
                    <div
                      className={`aspect-[3/2] overflow-hidden bg-neutral-900 ring-1 transition ${
                        isActive
                          ? "ring-2 ring-[#E11D2A]"
                          : "ring-neutral-200 group-hover:ring-[#E11D2A]"
                      }`}
                    >
                      <img
                        src={sharpen(item.image, 500)}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className={`w-full h-full object-cover transition ${
                          isActive ? "" : "opacity-80 group-hover:opacity-100"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ---------- CXO Articles ---------- */}
          <div>
            <div className="relative mb-3 flex items-center">
              <div className="absolute inset-x-0 top-1/2 h-px bg-neutral-300" />
              <span className="relative bg-white pr-3 text-[13px] font-semibold text-neutral-900">
                CXO Articles
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-6">
              {cxoArticles.map((a) => (
                <Link key={a.id} to="/" className="group block">
                  <div className="relative aspect-[3/2] overflow-hidden bg-neutral-900 ring-1 ring-neutral-200">
                    <img
                      src={sharpen(a.image_url, 800)}
                      alt={a.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <h3 className="mt-2 text-[13px] font-bold leading-snug line-clamp-2 group-hover:underline text-neutral-900" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                    {a.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============== MEDIA PARTNERSHIPS ============== */}
      <section className="bg-white py-5 border-b border-neutral-200">
        <div className="max-w-[1200px] mx-auto px-4">
          <p className="text-[13px] font-bold mb-3" style={{ color: RED }}>
            Media Partnerships
          </p>
          <div className="bg-black py-5 px-6 grid grid-cols-2 md:grid-cols-5 gap-6 items-center">
            {[
              { n: "WorldStage", c: "#8FC73E" },
              { n: "Leader Innov", c: "#F2C641" },
              { n: "BizConnect", c: "#3FB6C9" },
              { n: "FutureMedia", c: "#9DC34E" },
              { n: "FutureTechEvents", c: "#7E57C2" },
            ].map((p) => (
              <div key={p.n} className="flex items-center gap-2 justify-center">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: p.c }} />
                <span className="text-white text-[12px] font-semibold tracking-wide">
                  {p.n}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== CASE STUDIES + MAGAZINE PROFILES ============== */}
      <section className="bg-white py-6 border-b border-neutral-200">
        <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8">
          {/* Case Studies — stacked cards */}
          <div>
            <div className="bg-black text-white inline-block px-3 py-1.5 mb-3">
              <h2 className="text-[13px] font-semibold tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
                Case Studies
              </h2>
            </div>
            {/* Yellow IKEA card */}
            <div className="mb-2">
              <div className="bg-[#FFD500] aspect-[4/3] p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[56px] font-extrabold leading-[0.85] tracking-tight text-[#0033A0]" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                    IKEA
                  </h3>
                  <div className="text-right pt-1">
                    <p className="text-[14px] font-extrabold leading-tight text-black">INSIDE OUT:</p>
                    <p className="text-[10px] font-semibold leading-tight text-black">Design, Strategy,<br />and Global Reach</p>
                  </div>
                </div>
                {/* IKEA furniture icons */}
                <svg viewBox="0 0 220 80" className="w-full h-20 mt-2">
                  {/* Chair */}
                  <rect x="6" y="20" width="22" height="6" fill="#0033A0" />
                  <rect x="6" y="26" width="6" height="30" fill="#0033A0" />
                  <rect x="22" y="26" width="6" height="30" fill="#0033A0" />
                  {/* Table */}
                  <rect x="40" y="30" width="34" height="5" fill="#0033A0" />
                  <rect x="42" y="35" width="4" height="22" fill="#0033A0" />
                  <rect x="68" y="35" width="4" height="22" fill="#0033A0" />
                  {/* Lamp */}
                  <polygon points="90,18 110,18 105,32 95,32" fill="#0033A0" />
                  <rect x="99" y="32" width="2" height="22" fill="#0033A0" />
                  <ellipse cx="100" cy="56" rx="8" ry="2" fill="#0033A0" />
                  {/* Shelf */}
                  <rect x="125" y="14" width="22" height="44" fill="none" stroke="#0033A0" strokeWidth="3" />
                  <line x1="125" y1="28" x2="147" y2="28" stroke="#0033A0" strokeWidth="2" />
                  <line x1="125" y1="42" x2="147" y2="42" stroke="#0033A0" strokeWidth="2" />
                  {/* Plant */}
                  <path d="M165 40 Q170 18 180 38 Q190 18 195 40" fill="none" stroke="#0033A0" strokeWidth="3" />
                  <path d="M170 40 L190 40 L186 56 L174 56 Z" fill="#0033A0" />
                  {/* Sofa */}
                  <rect x="6" y="60" width="40" height="14" fill="#0033A0" />
                  <rect x="6" y="56" width="40" height="6" fill="#0033A0" />
                </svg>
              </div>
              <p className="text-[12px] font-bold mt-2 text-neutral-900">
                IKEA Inside Out: Design, Strategy, and Global Reach
              </p>
            </div>
            {/* Red SHEIN card */}
            <div className="mt-3">
              <div className="relative aspect-[4/3] overflow-hidden bg-red-700">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=70"
                  alt="SHEIN"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${RED}CC 0%, #8B0F1A99 70%, transparent 100%)` }} />
                <div className="relative h-full p-5 flex flex-col justify-between text-white">
                  <h3 className="text-[58px] font-extrabold uppercase italic leading-[0.85] tracking-tight" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                    SHEIN
                  </h3>
                  <div className="self-end bg-white/95 text-black px-3 py-1.5 max-w-[180px] text-right rotate-[-4deg] shadow-lg">
                    <p className="text-[10px] font-bold leading-tight italic">
                      The Industrialization<br />of Digital Fashion
                    </p>
                    <p className="text-[8px] mt-1 leading-tight">Scale, Acceleration, and Structural Advantage</p>
                  </div>
                </div>
              </div>
              <p className="text-[12px] font-bold mt-2 text-neutral-900">
                SHEIN — The Industrialization of Digital Fashion
              </p>
            </div>
          </div>

          {/* Magazine Profiles */}
          <div>
            <div className="bg-black text-white inline-block px-3 py-1.5 mb-3">
              <h2 className="text-[13px] font-semibold tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
                Magazine Profiles
              </h2>
            </div>
            {magProfileLead && (
              <Link to="/" className="group grid grid-cols-[210px_1fr] gap-5 mb-5 pb-5 border-b border-neutral-200">
                <div className="aspect-[3/4] overflow-hidden bg-black shadow-md">
                  <img
                    src={sharpen(magProfileLead.image_url, 800)}
                    alt={magProfileLead.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-[16px] font-extrabold leading-snug group-hover:underline text-neutral-900" style={{ fontFamily: "Georgia, serif" }}>
                    {magProfileLead.name}: Passion, Purpose, Leadership and Professional Healthcare and Pharmaceutical Excellence
                  </h3>
                  <p className="text-[12px] text-neutral-700 mt-3 leading-relaxed line-clamp-5" style={{ fontFamily: "Georgia, serif" }}>
                    {magProfileLead.bio || "Leadership Anchored in Science, Ethics, and Purpose. In a pharmaceutical industry often characterised by speed, scale, and commercial urgency, this leader represents a distinct leadership archetype, one grounded in scientific dis…"}
                  </p>
                </div>
              </Link>
            )}
            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              {magProfileSecondary.map((l) => (
                <Link key={l.id} to="/" className="group grid grid-cols-[64px_1fr] gap-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 self-start" style={{ boxShadow: `0 0 0 3px ${RED}` }}>
                    <img src={sharpen(l.image_url, 300)} alt={l.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[12px] font-extrabold leading-tight line-clamp-2 group-hover:underline text-neutral-900">
                      {l.name}: {l.title?.split(" ").slice(0, 6).join(" ")}
                    </h4>
                    <p className="text-[10px] text-neutral-600 mt-1 leading-snug line-clamp-2">
                      {l.company || "Driving change across the industry with conviction and clarity."}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============== VIDEO INTERVIEWS ============== */}
      <section className="bg-white py-6 border-b border-neutral-200">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3" style={{ backgroundColor: RED }} />
            <h2 className="text-[14px] font-extrabold uppercase tracking-wider">Video Interviews</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {leaders.slice(0, 5).map((l, i) => {
              const bgs = [
                { bg: "#1F2937", text: "GAYLE WESTLEY" },
                { bg: "#2196F3", text: "THOMAS HAGER" },
                { bg: "#FFC107", text: "Lenovo" },
                { bg: "#F472B6", text: "Featured" },
                { bg: "#EAB308", text: "Insight" },
              ];
              const meta = bgs[i % bgs.length];
              return (
                <Link key={l.id} to="/" className="group block">
                  <div className="aspect-[4/5] relative overflow-hidden" style={{ backgroundColor: meta.bg }}>
                    <img
                      src={l.image_url || ""}
                      alt={l.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-90"
                    />
                    <div className="absolute top-2 left-2 right-2 flex items-center gap-1">
                      <span className="text-[8px] italic font-extrabold text-white px-1 bg-black/60" style={{ fontFamily: "Georgia, serif" }}>
                        {COMPANY_NAME.split(" ")[0]}<span style={{ color: RED }}>.</span>{COMPANY_NAME.split(" ")[1]}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-[9px] font-extrabold uppercase text-white tracking-wide drop-shadow">
                        {l.name?.toUpperCase().slice(0, 18)}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== LEADERSHIP TALKS + LINKEDIN ============== */}
      <section className="bg-white py-6 border-b border-neutral-200">
        <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3" style={{ backgroundColor: RED }} />
              <h2 className="text-[14px] font-extrabold uppercase tracking-wider">Leadership Talks</h2>
            </div>
            {leaders[0] && (
              <div className="border border-neutral-200 p-5 flex gap-5 items-center bg-white relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[180px]" style={{ backgroundColor: RED, clipPath: "polygon(0 0, 100% 0, 60% 100%, 0 100%)" }} />
                <div className="relative w-32 flex flex-col items-center text-white z-10">
                  <span className="text-[9px] italic font-extrabold mb-1" style={{ fontFamily: "Georgia, serif" }}>
                    {COMPANY_NAME.split(" ")[0]}<span style={{ color: "#fff" }}>.</span>{COMPANY_NAME.split(" ")[1]}
                  </span>
                  <p className="text-[10px] font-extrabold uppercase mt-2 text-center leading-tight">
                    {leaders[0].name?.split(" ").slice(0, 2).join(" ").toUpperCase()}
                  </p>
                  <p className="text-[8px] uppercase mt-1 text-center opacity-80 leading-tight">
                    {leaders[0].title?.slice(0, 30)}
                  </p>
                </div>
                <div className="w-32 h-32 rounded-full overflow-hidden shrink-0 z-10" style={{ boxShadow: `0 0 0 4px ${RED}, 0 0 0 7px white` }}>
                  <img src={leaders[0].image_url || ""} alt={leaders[0].name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 z-10">
                  <h3 className="text-[16px] font-extrabold leading-tight mb-2">
                    {leaders[0].name}: Where Venture Capital Meets Venture Philanthropy
                  </h3>
                  <p className="text-[11px] text-neutral-700 leading-relaxed line-clamp-4">
                    {leaders[0].bio || "An exclusive feature on a leader redefining the boundaries of impact and capital."}
                  </p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4">
              {leaders.slice(1, 5).map((l) => (
                <Link key={l.id} to="/" className="flex gap-3 group">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0" style={{ boxShadow: `0 0 0 2px ${RED}` }}>
                    <img src={l.image_url || ""} alt={l.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-bold line-clamp-2 group-hover:underline leading-tight">
                      {l.name}: {l.title}
                    </h4>
                    <p className="text-[10px] text-neutral-500 line-clamp-2 mt-0.5">{l.company}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* LinkedIn column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Linkedin className="h-4 w-4" style={{ color: "#0A66C2" }} />
              <h2 className="text-[14px] font-extrabold uppercase tracking-wider" style={{ color: "#0A66C2" }}>
                Follow on LinkedIn
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LINKEDIN_POSTS.map((p, i) => (
                <a
                  key={i}
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-white border border-neutral-200 hover:shadow-md transition"
                >
                  <div className="px-2 py-1.5 flex items-center gap-1.5 border-b border-neutral-100">
                    <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                      <span className="text-[7px] italic font-extrabold text-white" style={{ fontFamily: "Georgia, serif" }}>
                        E<span style={{ color: RED }}>.</span>W
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-neutral-700">{COMPANY_NAME}</span>
                  </div>
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                    <img src={p.image} alt="" loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <p className="px-2 pt-1.5 text-[9px] text-neutral-700 line-clamp-2">{p.body}</p>
                  <div className="px-2 py-1 flex items-center gap-2 text-neutral-500">
                    <Heart className="h-2.5 w-2.5" />
                    <span className="text-[8px]">{p.likes}</span>
                    <MessageCircle className="h-2.5 w-2.5" />
                    <Share2 className="h-2.5 w-2.5 ml-auto" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============== CITY REPORTS ============== */}
      <section className="bg-white py-6 border-b border-neutral-200">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3" style={{ backgroundColor: RED }} />
            <h2 className="text-[14px] font-extrabold uppercase tracking-wider">Bizhot Metros</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {cityReports.map((c, i) => (
              <Link key={i} to="/" className="group block">
                <div className="aspect-[4/3] overflow-hidden bg-neutral-100 relative">
                  <img src={c.img} alt={c.city} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 bg-white/90 px-2 py-0.5">
                    <span className="text-[18px] font-extrabold italic tracking-tight" style={{ color: RED, fontFamily: "Georgia, serif" }}>
                      {c.city}
                    </span>
                  </div>
                </div>
                <h3 className="mt-2 text-[12px] font-bold leading-snug line-clamp-2 group-hover:underline">
                  {c.title}
                </h3>
                <p className="text-[10px] text-neutral-500 mt-1 line-clamp-2">
                  Discover the city through the lens of business, culture and momentum.
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============== BUSINESS BULLETIN + PRESS RELEASE ============== */}
      <section className="bg-white py-6 border-b border-neutral-200">
        <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3" style={{ backgroundColor: RED }} />
              <h2 className="text-[14px] font-extrabold uppercase tracking-wider">Business Bulletin</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {trending.slice(0, 2).map((t) => (
                <Link key={t.id} to="/" className="group block">
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                    <img src={t.image_url} alt={t.title} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="mt-2 text-[11px] font-bold leading-snug line-clamp-3 group-hover:underline">
                    {t.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3" style={{ backgroundColor: RED }} />
              <h2 className="text-[14px] font-extrabold uppercase tracking-wider">Press Release</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {press.slice(0, 2).map((p) => (
                <Link key={p.id} to="/" className="group block">
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                    <img src={p.image_url} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="mt-2 text-[11px] font-bold leading-snug line-clamp-3 group-hover:underline">
                    {p.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============== UPCOMING BAR ============== */}
      {upcoming[0] && (
        <section className="bg-gradient-to-r from-neutral-900 to-black text-white py-4">
          <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between gap-4">
            <p className="text-[12px]">
              <span className="font-bold" style={{ color: RED }}>Coming up:</span>{" "}
              {upcoming[0].title} — <span className="text-neutral-400">{upcoming[0].release_date}</span>
            </p>
            <Link to="/" className="text-[11px] font-bold underline">See all upcoming →</Link>
          </div>
        </section>
      )}

      {/* ============== INLINE NEWSLETTER ============== */}
      <section className="bg-white py-5 border-y border-neutral-200">
        <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-[16px] font-extrabold">Join The Newsletter</h3>
            <p className="text-[11px] text-neutral-600">
              Subscribe to our newsletter and stay updated.
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-0">
            <Input
              type="email"
              placeholder="Email Address"
              className="rounded-none border-neutral-300 focus-visible:ring-0 h-10"
            />
            <Button
              type="submit"
              className="rounded-none h-10 px-6 text-white font-bold text-[11px] uppercase"
              style={{ backgroundColor: "#000" }}
            >
              Submit
            </Button>
          </form>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="bg-black text-neutral-300">
        <div className="max-w-[1200px] mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-12 gap-6 text-[11px]">
          <div className="col-span-2 md:col-span-4">
            <p className="text-[24px] font-extrabold italic text-white mb-3" style={{ fontFamily: "Georgia, serif" }}>
              {COMPANY_NAME.split(" ")[0]}<span style={{ color: RED }}>.</span>{COMPANY_NAME.split(" ")[1]}
            </p>
            <p className="text-neutral-400 leading-relaxed mb-4">
              {COMPANY_NAME} is a business magazine — a platform for business
              leaders to share their stories, strategies, and insights. We aim to
              be the source of inspiration for executives across the globe.
            </p>
            <div className="flex gap-2">
              {[Facebook, Twitter, Linkedin, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-7 h-7 flex items-center justify-center hover:opacity-80"
                  style={{ backgroundColor: RED }}
                >
                  <Icon className="h-3.5 w-3.5 text-white" />
                </a>
              ))}
            </div>
          </div>
          <div className="col-span-1 md:col-span-2">
            <p className="text-white font-bold mb-3">Quick Links</p>
            <ul className="space-y-1.5">
              <li><Link to="/" className="hover:text-white">Newsroom</Link></li>
              <li><Link to="/" className="hover:text-white">Magazines</Link></li>
              <li><Link to="/" className="hover:text-white">About Us</Link></li>
              <li><Link to="/" className="hover:text-white">Press Release</Link></li>
              <li><Link to="/" className="hover:text-white">Become an Author</Link></li>
              <li><Link to="/" className="hover:text-white">Contact</Link></li>
              <li><Link to="/" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="col-span-1 md:col-span-3">
            <p className="text-white font-bold mb-3">Contact Us</p>
            <p className="text-neutral-400">Phone:</p>
            <p className="flex items-center gap-2 mb-2"><Phone className="h-3 w-3" />+1 (415) 226-1149</p>
            <p className="text-neutral-400 mt-2">Email:</p>
            <p className="flex items-center gap-2 mb-2"><Mail className="h-3 w-3" />info@theciovision.com</p>
            <p className="text-neutral-400 mt-2">Address:</p>
            <p className="flex items-start gap-2"><MapPin className="h-3 w-3 mt-0.5" />Columbus, Ohio, USA</p>
          </div>
          <div className="col-span-2 md:col-span-3">
            <p className="text-white font-bold mb-3">Outreach Partner</p>
            <div className="bg-white p-3 inline-flex items-center gap-2 mb-3">
              <span className="text-[18px]" style={{ color: "#7E57C2" }}>◆</span>
              <div>
                <p className="text-black text-[12px] font-extrabold leading-none">GlobeNewswire</p>
                <p className="text-neutral-500 text-[9px] mt-0.5">by notified</p>
              </div>
            </div>
            <div className="bg-white text-black px-3 py-2 inline-flex items-center gap-2 border border-neutral-300">
              <ShieldCheck className="h-7 w-7" style={{ color: RED }} />
              <div>
                <p className="text-[14px] font-extrabold leading-none" style={{ color: RED }}>SAFE!</p>
                <p className="text-[8px] text-neutral-600">Verified Site<br />2024</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-800">
          <div className="max-w-[1200px] mx-auto px-4 py-4 text-center text-[10px] text-neutral-500">
            Copyright © {new Date().getFullYear()} {COMPANY_NAME}. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
