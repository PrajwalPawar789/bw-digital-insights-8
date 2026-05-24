import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Heart,
  MessageCircle,
  Share2,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Seo from "@/components/seo/Seo";
import { useArticles } from "@/hooks/useArticles";
import { useMagazines } from "@/hooks/useMagazines";
import { useLeadershipProfiles } from "@/hooks/useLeadership";
import { usePressReleases } from "@/hooks/usePressReleases";
import { useSettings } from "@/hooks/useSettings";
import { useUpcomingEditions } from "@/hooks/useUpcomingEditions";
import { useCaseStudies } from "@/hooks/useCaseStudies";
import { useLinkedinPosts } from "@/hooks/useLinkedinPosts";
import { mapMagazine, type Issue } from "@/lib/magazines-map";
import type { Article, Leader, PressRelease, Upcoming } from "@/lib/content-types";
import {
  buildBreadcrumbSchema,
  buildPageSchema,
  getSiteOrigin,
  toAbsoluteUrl,
} from "@/lib/seo";

const RED = "#E11D2A";

const REGIONS = [
  { id: "americas", label: "AMERICAS EDITIONS" },
  { id: "europe", label: "EUROPE EDITIONS" },
  { id: "mea", label: "MEA EDITIONS" },
  { id: "apac", label: "APAC EDITIONS" },
  // { id: "hall", label: "HALL OF FAME" },
] as const;

const REGION_IMAGES: Record<string, string> = {
  americas: "/AMERICAS-MAP-Black.webp",
  europe: "/Europe-MAP-Black.webp",
  mea: "/MEA-MAP-Black.webp",
  apac: "/APAC-MAP-Black.webp",
  // hall: "/region-hall.png",
};

const TRUSTED = [
  { name: "Coca-Cola", logo: "/client-logos/Coca-Cola-Logo.webp" },
  { name: "TransUnion", logo: "/client-logos/TransUnion-Logo.webp" },
  { name: "Adobe", logo: "/client-logos/Adobe-Logo.webp" },
  { name: "Lenovo", logo: "/client-logos/Lenovo-Logo-website.webp" },
  { name: "Dell Technologies", logo: "/client-logos/Dell-Technologies-Logo.webp" },
  { name: "Virgin", logo: "/client-logos/Virgin-Logo.webp" },
  { name: "Adani", logo: "/client-logos/Adani-Logo.webp" },
  { name: "Deloitte", logo: "/client-logos/Deloitte-Logo.webp" },
  { name: "ICICI", logo: "/client-logos/ICICI-Logo-1.webp" },
  { name: "Mobica", logo: "/client-logos/Mobica-Logo.webp" },
  { name: "Valero", logo: "/client-logos/Valero-Logo.webp" },
];

const COL_LABELS = [
  ["Technology", "Healthcare", "Finance"],
  ["Marketing", "Education", "Manufacturing"],
  ["Consulting", "Real Estate", "Legal"],
];

const CITY_REPORTS_DEFAULT = [
  { city: "Busan", title: "Busan: After the Credits, A City in Full Take", img: "https://images.unsplash.com/photo-1538485399081-7c8978d4cdf6?auto=format&fit=crop&w=900&q=70" },
  { city: "Cape Town", title: "Cape Town: Where Oceans Meet, Stories Settle, and an Economy…", img: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=900&q=70" },
  { city: "Munich", title: "Walking through Munich: A City Lived and Re-imagined", img: "https://images.unsplash.com/photo-1599982646137-bbabe6e90b6f?auto=format&fit=crop&w=900&q=70" },
  { city: "Austin", title: "Austin in Focus: A Fast-Growing Metro Coming to Manage Its Own…", img: "https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=900&q=70" },
];

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

function ContinentMap({ region }: { region: string }) {
  const src = REGION_IMAGES[region] || REGION_IMAGES.americas;
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <img
        key={region}
        src={src}
        alt={`${region} region`}
        width={1024}
        height={1024}
        loading="lazy"
        decoding="async"
        className="relative z-10 w-[88%] h-[88%] object-contain"
        style={{
          animation:
            "region-fade 800ms cubic-bezier(0.22,1,0.36,1) both, region-float 8s ease-in-out 800ms infinite",
        }}
      />
      <style>{`
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

function pickRegion(m: Issue): (typeof REGIONS)[number]["id"] {
  const sum = Array.from(m.id).reduce((a, c) => a + c.charCodeAt(0), 0);
  return REGIONS[sum % REGIONS.length].id;
}

const Home = () => {
  const navigate = useNavigate();
  const { data: rawMagazines = [], isLoading: magsLoading } = useMagazines();
  const { data: rawArticles = [], isLoading: articlesLoading } = useArticles();
  const { data: rawLeaders = [] } = useLeadershipProfiles();
  const { data: rawPress = [] } = usePressReleases();
  const { data: rawUpcoming = [] } = useUpcomingEditions();
  const { data: caseStudies = [] } = useCaseStudies();
  const { data: linkedinPosts = [] } = useLinkedinPosts();
  const { settings } = useSettings();

  const companyName = settings?.companyName || "CIO Vision";
  const siteOrigin = getSiteOrigin();

  // ---- Newsletter ----
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      toast({
        title: "Email is required",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setNewsletterLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email: newsletterEmail.trim() }]);
      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already Subscribed",
            description: "This email is already subscribed to the newsletter.",
            variant: "default",
          });
        } else {
          toast({
            title: "Subscription failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Thank you for subscribing!",
          description: "You have been added to our newsletter.",
          variant: "default",
        });
        setNewsletterEmail("");
      }
    } catch (err: any) {
      toast({
        title: "Subscription failed",
        description: err.message,
        variant: "destructive",
      });
    }
    setNewsletterLoading(false);
  };

  const magazines: Issue[] = useMemo(
    () => (Array.isArray(rawMagazines) ? rawMagazines.map(mapMagazine) : []),
    [rawMagazines]
  );
  const articles: Article[] = Array.isArray(rawArticles) ? rawArticles : [];
  const leaders: Leader[] = Array.isArray(rawLeaders) ? rawLeaders : [];
  const press: PressRelease[] = Array.isArray(rawPress) ? rawPress : [];
  const upcoming: Upcoming[] = Array.isArray(rawUpcoming) ? rawUpcoming : [];

  // ---- Region tabs ----
  const [activeRegion, setActiveRegion] =
    useState<(typeof REGIONS)[number]["id"]>("americas");

  const regionalMags = useMemo(() => {
    const grouped: Record<string, Issue[]> = {};
    REGIONS.forEach((r) => {
      // A magazine appears under its tagged region; an untagged magazine
      // (region = null) is treated as global and shown on every tab.
      const list = magazines.filter((m) => !m.region || m.region === r.id);
      // Fallback: if a tab has no magazines yet, show all so it is never blank.
      grouped[r.id] = list.length ? list : magazines;
    });
    return grouped;
  }, [magazines]);

  const visibleMags = regionalMags[activeRegion] || [];

  // ---- Coverflow state ----
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => { setActiveIdx(0); }, [activeRegion]);
  useEffect(() => {
    if (visibleMags.length < 2) return;
    const t = setInterval(() => {
      setActiveIdx((i) => (i + 1) % visibleMags.length);
    }, 3500);
    return () => clearInterval(t);
  }, [visibleMags.length]);

  // ---- Articles grid (3×3) — only articles tagged "grid" ----
  const gridArticles = useMemo(() => {
    const tagged = articles
      .filter((a) => a.home_placement === "grid")
      .sort((a, b) => (a.home_order ?? 0) - (b.home_order ?? 0));
    // Fallback to the latest articles if nothing is tagged yet.
    return (tagged.length ? tagged : articles).slice(0, 9);
  }, [articles]);

  const colArticles = useMemo(() => {
    const cols: Article[][] = [[], [], []];
    gridArticles.forEach((a, i) => cols[i % 3].push(a));
    return cols;
  }, [gridArticles]);

  // ---- Cover stories carousel — leaders tagged "cover_story" + articles tagged "cover_story" ----
  const coverStoryItems = useMemo(() => {
    const leaderItems = leaders
      .filter((l) => l.home_sections?.includes("cover_story"))
      .map((l) => ({
        id: `l-${l.id}`,
        title: l.name,
        image: l.image_url as string,
        link: "/leadership",
        order: l.home_order ?? 0,
      }));
    const articleItems = articles
      .filter((a) => a.home_placement === "cover_story")
      .map((a) => ({
        id: `a-${a.id}`,
        title: a.title,
        image: (a.image_url as string) || "",
        link: a.slug ? `/article/${a.slug}` : "/articles",
        order: a.home_order ?? 0,
      }));
    const combined = [...leaderItems, ...articleItems]
      .filter((it) => !!it.image)
      .sort((a, b) => a.order - b.order);
    if (combined.length) return combined;
    return leaders
      .filter((l) => !!l?.image_url)
      .map((l) => ({
        id: `l-${l.id}`,
        title: l.name,
        image: l.image_url as string,
        link: "/leadership",
        order: 0,
      }));
  }, [leaders, articles]);
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

  // ---- CXO Articles — articles tagged "cxo" + leaders tagged "cxo_article" ----
  const cxoArticles = useMemo(() => {
    const taggedArticles = articles
      .filter((a) => a.home_placement === "cxo")
      .map((a: any) => ({
        id: `a-${a.id}`,
        title: a.title,
        image_url: a.image_url,
        slug: a.slug || "",
        kind: "article" as const,
        order: a.home_order ?? 0,
      }));
    const taggedLeaders = leaders
      .filter((l) => l.home_sections?.includes("cxo_article"))
      .map((l: any) => ({
        id: `l-${l.id}`,
        title: l.name,
        image_url: l.image_url,
        slug: l.slug || "",
        kind: "leader" as const,
        order: l.home_order ?? 0,
      }));
    const tagged = [...taggedArticles, ...taggedLeaders].sort((a, b) => a.order - b.order);
    if (tagged.length) return tagged.slice(0, 4);
    return articles.slice(0, 4).map((a: any) => ({
      id: `a-${a.id}`,
      title: a.title,
      image_url: a.image_url,
      slug: a.slug || "",
      kind: "article" as const,
      order: 0,
    }));
  }, [articles, leaders]);

  // ---- Magazine Profiles — leaders tagged "magazine_profile" ----
  const magProfiles = useMemo(() => {
    const tagged = leaders
      .filter((l) => l.home_sections?.includes("magazine_profile"))
      .sort((a, b) => (a.home_order ?? 0) - (b.home_order ?? 0));
    return tagged.length ? tagged : leaders;
  }, [leaders]);
  const magProfileLead = magProfiles[0];
  const magProfileSecondary = magProfiles.slice(1, 5);

  // ---- Video Interviews — leaders tagged "video_interview" ----
  const videoLeaders = useMemo(() => {
    const tagged = leaders
      .filter((l) => l.home_sections?.includes("video_interview"))
      .sort((a, b) => (a.home_order ?? 0) - (b.home_order ?? 0));
    return (tagged.length ? tagged : leaders).slice(0, 5);
  }, [leaders]);

  // ---- Leadership Talks — leaders tagged "leadership_talk" ----
  const talkLeaders = useMemo(() => {
    const tagged = leaders
      .filter((l) => l.home_sections?.includes("leadership_talk"))
      .sort((a, b) => (a.home_order ?? 0) - (b.home_order ?? 0));
    return tagged.length ? tagged : leaders;
  }, [leaders]);

  // ---- Bizhot Metros — articles tagged "bizhot_metro" ----
  const cityReports = useMemo(() => {
    const tagged = articles
      .filter((a) => a.home_placement === "bizhot_metro")
      .sort((a, b) => (a.home_order ?? 0) - (b.home_order ?? 0));
    return CITY_REPORTS_DEFAULT.map((c, i) => {
      const t = tagged[i];
      return t ? { city: c.city, title: t.title, img: t.image_url || c.img } : c;
    });
  }, [articles]);

  // ---- Business Bulletin — articles tagged "business_bulletin" ----
  const businessBulletin = useMemo(() => {
    const tagged = articles
      .filter((a) => a.home_placement === "business_bulletin")
      .sort((a, b) => (a.home_order ?? 0) - (b.home_order ?? 0));
    return (tagged.length ? tagged : articles).slice(0, 2);
  }, [articles]);

  // ---- SEO ----
  const seoDescription = `${companyName} delivers executive interviews, market intelligence, and leadership insights for business leaders across the globe.`;
  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([{ name: "Home", url: siteOrigin }])
    : undefined;
  const homeSchema = siteOrigin
    ? buildPageSchema({
        type: "WebPage",
        name: companyName,
        description: seoDescription,
        image: toAbsoluteUrl(magazines[0]?.cover || "/ciovision-logo.svg", siteOrigin),
        url: siteOrigin,
      })
    : undefined;

  const isLoading = magsLoading && articlesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="h-10 w-10 animate-spin" style={{ color: RED }} />
          <p className="text-sm font-semibold text-neutral-700">Loading the newsroom…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={companyName}
        description={seoDescription}
        schema={[breadcrumbSchema, homeSchema].filter(Boolean) as Record<string, unknown>[]}
      />
      <div className="min-h-screen bg-white text-neutral-900 font-sans">

        {/* ============== REGION TABS ============== */}
        <div className="bg-white">
          <div className="max-w-[1280px] mx-auto px-4 pt-4">
            <div className="grid grid-cols-4 gap-0">
              {REGIONS.map((r) => {
                const active = activeRegion === r.id;
                const label = r.id === "hall" ? "Hall of Fame" : r.label.replace(" EDITIONS", " Editions");
                return (
                  <button
                    key={r.id}
                    onClick={() => setActiveRegion(r.id)}
                    className={`relative h-[52px] text-[13px] md:text-[15px] font-semibold whitespace-nowrap transition-colors border border-neutral-300 ${
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

                {/* Coverflow */}
                <div
                  className="relative h-[400px] flex items-center justify-center select-none"
                  style={{ perspective: "1600px" }}
                >
                  {visibleMags.map((m, i) => {
                    const len = visibleMags.length;
                    let offset = i - activeIdx;
                    if (offset > len / 2) offset -= len;
                    if (offset < -len / 2) offset += len;
                    const abs = Math.abs(offset);
                    if (abs > 3) return null;
                    const scale = abs === 0 ? 1 : abs === 1 ? 0.82 : abs === 2 ? 0.66 : 0.52;
                    // Per-depth offsets tuned so each magazine in the fan stays
                    // visibly separated (~75% of every outer cover stays visible).
                    const translateX =
                      offset === 0
                        ? 0
                        : Math.sign(offset) * [0, 156, 286, 388][abs];
                    const z = 30 - abs;
                    const opacity = 1;
                    const sharpCover = sharpen(m.cover, 1400);
                    const isActive = offset === 0;
                    return (
                      <button
                        key={`${m.id}-${i}`}
                        type="button"
                        onClick={() => {
                          if (isActive && m.slug) {
                            navigate(`/magazine/${m.slug}`);
                          } else {
                            setActiveIdx(i);
                          }
                        }}
                        aria-label={isActive ? `Open ${m.title}` : `Show ${m.title}`}
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
                          className="relative w-[224px] aspect-[3/4] overflow-hidden bg-neutral-100 rounded-sm"
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
                  <Link
                    to="/magazine"
                    className="px-8 py-3 bg-black text-white text-[13px] font-bold tracking-wide hover:bg-neutral-800 transition"
                  >
                    Read All Magazines
                  </Link>
                </div>
              </div>

              {/* RIGHT: continent map */}
              <div className="hidden lg:block relative">
                <div className="h-[420px] flex items-center justify-center">
                  <ContinentMap region={activeRegion} />
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
                  {[
                    { icon: Linkedin, bg: "#0A66C2", href: "https://www.linkedin.com/company/theciovision", external: true },
                    // { icon: Twitter, bg: "#000", href: "#", external: false },
                    // { icon: Facebook, bg: "#1877F2", href: "#", external: false },
                    // { icon: Youtube, bg: "#FF0000", href: "#", external: false },
                    { icon: Instagram, bg: "#E1306C", href: "https://www.instagram.com/theciovisionmagazine", external: true },
                  ].map(({ icon: Icon, bg, href, external }, i) => (
                    <a
                      key={i}
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
        <section className="bg-white">
          <div className="max-w-[1200px] mx-auto px-4 py-6">
            <div className="bg-black inline-block px-4 py-2 mb-3">
              <p
                className="text-white text-[15px] font-bold italic"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Trusted Brands of {companyName}
              </p>
            </div>
            <div className="trusted-marquee overflow-hidden relative">
              <div className="trusted-marquee-track flex gap-3 w-max">
                {[...TRUSTED, ...TRUSTED].map((b, i) => (
                  <div
                    key={`${b.name}-${i}`}
                    className="h-20 w-[170px] shrink-0 flex items-center justify-center bg-white border border-neutral-300 px-3"
                  >
                    <img
                      src={b.logo}
                      alt={b.name}
                      loading="lazy"
                      decoding="async"
                      className="max-h-12 max-w-full object-contain"
                    />
                  </div>
                ))}
              </div>
              <style>{`
                .trusted-marquee-track {
                  animation: trusted-scroll 30s linear infinite;
                }
                .trusted-marquee:hover .trusted-marquee-track {
                  animation-play-state: paused;
                }
                @keyframes trusted-scroll {
                  from { transform: translateX(0); }
                  to { transform: translateX(-50%); }
                }
              `}</style>
            </div>
          </div>
        </section>

        {/* ============== ARTICLES GRID 3×3 + NEWSLETTER ============== */}
        <section className="bg-white py-6 border-b border-neutral-200">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-9">
                <div className="grid grid-cols-3 gap-4">
                  {COL_LABELS.map((rowLabels, rowIdx) =>
                    rowLabels.map((label, colIdx) => {
                      const a = colArticles[colIdx]?.[rowIdx];
                      if (!a) return null;
                      return (
                        <div key={`${rowIdx}-${colIdx}`} className="flex flex-col">
                          <span className="self-start bg-black text-white px-3 py-1 text-[11px] font-semibold tracking-wide">
                            {label}
                          </span>
                          <Link to={`/article/${a.slug || ""}`} className="group block">
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
                    })
                  )}
                </div>
              </div>

              {/* Newsletter card */}
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
            {/* Cover Story */}
            <div>
              <div className="relative mb-3 flex items-center">
                <div className="absolute inset-x-0 top-1/2 h-px bg-neutral-300" />
                <span className="relative bg-white pr-3 text-[13px] font-semibold text-neutral-900">
                  Cover Story
                </span>
              </div>

              {coverStoryItems.length > 0 && (
                <div className="relative bg-neutral-900 overflow-hidden group">
                  <div className="relative aspect-[3/2]">
                    {coverStoryItems.map((item, i) => (
                      <Link
                        key={`cs-hero-${item.id}-${i}`}
                        to={item.link}
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

              {/* Thumbnail strip */}
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
                          isActive ? "ring-2 ring-[#E11D2A]" : "ring-neutral-200 group-hover:ring-[#E11D2A]"
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

            {/* CXO Articles */}
            <div>
              <div className="relative mb-3 flex items-center">
                <div className="absolute inset-x-0 top-1/2 h-px bg-neutral-300" />
                <span className="relative bg-white pr-3 text-[13px] font-semibold text-neutral-900">
                  CXO Articles
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-6">
                {cxoArticles.map((a) => {
                  const href = a.kind === "leader" ? `/leadership/${a.slug}` : `/article/${a.slug}`;
                  return (
                    <Link key={a.id} to={href} className="group block">
                      <div className="relative aspect-[3/2] overflow-hidden bg-neutral-900 ring-1 ring-neutral-200">
                        <img
                          src={sharpen(a.image_url, 800)}
                          alt={a.title}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      </div>
                      <h3
                        className="mt-2 text-[13px] font-bold leading-snug line-clamp-2 group-hover:underline text-neutral-900"
                        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                      >
                        {a.title}
                      </h3>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ============== MEDIA PARTNERSHIPS (commented out) ============== */}
        {/*
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
                  <span className="text-white text-[12px] font-semibold tracking-wide">{p.n}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        */}

        {/* ============== CASE STUDIES + MAGAZINE PROFILES ============== */}
        <section className="bg-white py-6 border-b border-neutral-200">
          <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8">
            {/* Case Studies */}
            <div>
              <div className="bg-black text-white inline-block px-3 py-1.5 mb-3">
                <h2 className="text-[13px] font-semibold tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
                  Case Studies
                </h2>
              </div>
              {/* Cards managed from the admin panel (Case Studies tab) */}
              <div className="space-y-5">
                {caseStudies.map((cs) => (
                  <div key={cs.id}>
                    <div className="aspect-[16/9] overflow-hidden bg-neutral-100 shadow-sm">
                      {cs.image_url ? (
                        <img
                          src={sharpen(cs.image_url, 700)}
                          alt={cs.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                          Image coming soon
                        </div>
                      )}
                    </div>
                    <p className="text-[12px] font-bold mt-2 leading-snug text-neutral-900 line-clamp-2">
                      {cs.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Magazine Profiles */}
            <div>
              <div className="flex items-end mb-4">
                <div className="bg-black text-white px-4 py-2">
                  <h2
                    className="text-[14px] font-bold tracking-wide"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Magazine Profiles
                  </h2>
                </div>
                <div className="flex-1 h-px bg-neutral-300" />
              </div>
              {magProfileLead && (
                <Link
                  to={`/leadership/${magProfileLead.slug || ""}`}
                  className="group grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 pb-5 border-b border-neutral-200"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-black">
                    <img
                      src={sharpen(magProfileLead.image_url, 900)}
                      alt={magProfileLead.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex flex-col justify-center">
                    <h3
                      className="text-[18px] font-extrabold leading-snug group-hover:underline text-neutral-900"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {magProfileLead.name}: Passion, Purpose, Leadership and Professional Healthcare and Pharmaceutical Excellence
                    </h3>
                    <p
                      className="text-[13px] text-neutral-700 mt-3 leading-relaxed line-clamp-5"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {magProfileLead.bio || "Leadership anchored in science, ethics, and purpose. A distinct leadership archetype grounded in professional excellence and industry impact."}
                    </p>
                  </div>
                </Link>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {magProfileSecondary.map((l) => (
                  <Link
                    key={l.id}
                    to={`/leadership/${l.slug || ""}`}
                    className="group grid grid-cols-[140px_1fr] gap-3 items-start"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-black self-start">
                      <img
                        src={sharpen(l.image_url, 400)}
                        alt={l.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4
                        className="text-[13px] font-extrabold leading-tight line-clamp-2 group-hover:underline text-neutral-900"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {l.name}
                        {l.title ? `: ${l.title.split(" ").slice(0, 6).join(" ")}` : ""}
                      </h4>
                      <p
                        className="text-[11px] text-neutral-600 mt-1.5 leading-snug line-clamp-3"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {l.company || "Driving change across the industry with conviction and clarity."}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============== VIDEO INTERVIEWS (commented out) ============== */}
        {/*
        <section className="bg-white py-6 border-b border-neutral-200">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3" style={{ backgroundColor: RED }} />
              <h2 className="text-[14px] font-extrabold uppercase tracking-wider">Video Interviews</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {videoLeaders.map((l, i) => {
                const bgs = [
                  { bg: "#1F2937" },
                  { bg: "#2196F3" },
                  { bg: "#FFC107" },
                  { bg: "#F472B6" },
                  { bg: "#EAB308" },
                ];
                const meta = bgs[i % bgs.length];
                return (
                  <Link key={l.id} to={`/leadership/${l.slug || ""}`} className="group block">
                    <div
                      className="aspect-[4/5] relative overflow-hidden"
                      style={{ backgroundColor: meta.bg }}
                    >
                      <img
                        src={l.image_url || ""}
                        alt={l.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-90"
                      />
                      <div className="absolute top-2 left-2 right-2 flex items-center gap-1">
                        <span
                          className="text-[8px] italic font-extrabold text-white px-1 bg-black/60"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          {companyName.split(" ")[0]}
                          <span style={{ color: RED }}>.</span>
                          {companyName.split(" ").slice(1).join(" ")}
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
        */}

        {/* ============== LEADERSHIP TALKS + LINKEDIN ============== */}
        <section className="bg-white py-6 border-b border-neutral-200">
          <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                {/* <span className="w-3 h-3" style={{ backgroundColor: RED }} /> */}
                <h2 className="text-[14px] font-extrabold uppercase tracking-wider">Leadership Talks</h2>
              </div>
              {talkLeaders[0] && (
                <div className="border border-neutral-200 p-5 flex gap-5 items-center bg-white relative overflow-hidden">
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[180px]"
                    style={{ backgroundColor: RED, clipPath: "polygon(0 0, 100% 0, 60% 100%, 0 100%)" }}
                  />
                  <div className="relative w-32 flex flex-col items-center text-white z-10">
                    <span
                      className="text-[9px] italic font-extrabold mb-1"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {companyName.split(" ")[0]}
                      <span style={{ color: "#fff" }}>.</span>
                      {companyName.split(" ").slice(1).join(" ")}
                    </span>
                    <p className="text-[10px] font-extrabold uppercase mt-2 text-center leading-tight">
                      {talkLeaders[0].name?.split(" ").slice(0, 2).join(" ").toUpperCase()}
                    </p>
                    <p className="text-[8px] uppercase mt-1 text-center opacity-80 leading-tight">
                      {talkLeaders[0].title?.slice(0, 30)}
                    </p>
                  </div>
                  <div
                    className="w-32 h-32 rounded-full overflow-hidden shrink-0 z-10"
                    style={{ boxShadow: `0 0 0 4px ${RED}, 0 0 0 7px white` }}
                  >
                    <img
                      src={talkLeaders[0].image_url || ""}
                      alt={talkLeaders[0].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 z-10">
                    <h3 className="text-[16px] font-extrabold leading-tight mb-2">
                      {talkLeaders[0].name}: Where Venture Capital Meets Venture Philanthropy
                    </h3>
                    <p className="text-[11px] text-neutral-700 leading-relaxed line-clamp-4">
                      {talkLeaders[0].bio || "An exclusive feature on a leader redefining the boundaries of impact and capital."}
                    </p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4">
                {talkLeaders.slice(1, 5).map((l) => (
                  <Link key={l.id} to={`/leadership/${l.slug || ""}`} className="flex gap-3 group">
                    <div
                      className="w-12 h-12 rounded-full overflow-hidden shrink-0"
                      style={{ boxShadow: `0 0 0 2px ${RED}` }}
                    >
                      <img
                        src={l.image_url || ""}
                        alt={l.name}
                        className="w-full h-full object-cover"
                      />
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

            {/* LinkedIn */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Linkedin className="h-4 w-4" style={{ color: "#0A66C2" }} />
                <h2
                  className="text-[14px] font-extrabold uppercase tracking-wider"
                  style={{ color: "#0A66C2" }}
                >
                  Follow on LinkedIn
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {linkedinPosts.map((p) => (
                  <a
                    key={p.id}
                    href={p.href || p.embed_url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="block bg-white border border-neutral-200 hover:shadow-md transition"
                  >
                    <div className="px-2.5 py-1.5 flex items-center gap-2 border-b border-neutral-100">
                      <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center shrink-0">
                        <span
                          className="text-[8px] italic font-extrabold text-white"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          E<span style={{ color: RED }}>.</span>W
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-neutral-700 truncate">
                        {companyName}
                      </span>
                    </div>
                    {p.image_url && (
                      <div className="aspect-[16/9] overflow-hidden bg-neutral-100">
                        <img
                          src={p.image_url}
                          alt=""
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <p className="px-2.5 pt-2 text-[11px] text-neutral-700 leading-snug line-clamp-3">
                      {p.body}
                    </p>
                    <div className="px-2.5 py-1.5 flex items-center gap-2 text-neutral-500">
                      <Heart className="h-3 w-3" />
                      <span className="text-[10px]">{p.likes}</span>
                      <MessageCircle className="h-3 w-3" />
                      <Share2 className="h-3 w-3 ml-auto" />
                    </div>
                  </a>
                ))}
                {linkedinPosts.length === 0 && (
                  <div className="text-[11px] text-neutral-400 border border-dashed rounded p-4 text-center">
                    No LinkedIn posts yet. Add some from the admin panel.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============== CITY REPORTS ============== */}
        <section className="bg-white py-6 border-b border-neutral-200">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="flex items-center gap-2 mb-3">
              {/* <span className="w-3 h-3" style={{ backgroundColor: RED }} /> */}
              <h2 className="text-[14px] font-extrabold uppercase tracking-wider">Bizhot Metros</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {cityReports.map((c, i) => (
                <Link key={i} to="/articles" className="group block">
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100 relative">
                    <img
                      src={c.img}
                      alt={c.city}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
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
                {/* <span className="w-3 h-3" style={{ backgroundColor: RED }} /> */}
                <h2 className="text-[14px] font-extrabold uppercase tracking-wider">Business Bulletin</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {businessBulletin.map((t) => (
                  <Link key={t.id} to="/articles" className="group block">
                    <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                      <img
                        src={t.image_url || ""}
                        alt={t.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="mt-2 text-[11px] font-bold leading-snug line-clamp-3 group-hover:underline">
                      {t.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
            {/*
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3" style={{ backgroundColor: RED }} />
                <h2 className="text-[14px] font-extrabold uppercase tracking-wider">Press Release</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {press.slice(0, 2).map((p) => (
                  <Link key={p.id} to={`/press-releases/${p.slug || ""}`} className="group block">
                    <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                      <img
                        src={p.image_url || ""}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="mt-2 text-[11px] font-bold leading-snug line-clamp-3 group-hover:underline">
                      {p.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
            */}
          </div>
        </section>

        {/* ============== UPCOMING BAR ============== */}
        {upcoming[0] && (
          <section className="bg-gradient-to-r from-neutral-900 to-black text-white py-4">
            <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between gap-4">
              <p className="text-[12px]">
                <span className="font-bold" style={{ color: RED }}>Coming up:</span>{" "}
                {upcoming[0].title} —{" "}
                <span className="text-neutral-400">{upcoming[0].release_date}</span>
              </p>
              <Link to="/magazine" className="text-[11px] font-bold underline">
                See all upcoming →
              </Link>
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
            <form onSubmit={handleNewsletterSubscribe} className="flex gap-0">
              <Input
                type="email"
                placeholder="Email Address"
                className="rounded-none border-neutral-300 focus-visible:ring-0 h-10"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                disabled={newsletterLoading}
                required
              />
              <Button
                type="submit"
                className="rounded-none h-10 px-6 text-white font-bold text-[11px] uppercase"
                style={{ backgroundColor: "#000" }}
                disabled={newsletterLoading}
              >
                {newsletterLoading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;
