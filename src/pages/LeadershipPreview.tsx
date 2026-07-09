import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLeadershipProfiles } from "@/hooks/useLeadership";
import { useCompanyName } from "@/hooks/useDatabaseSettings";
import {
  Linkedin,
  Twitter,
  ArrowRight,
  ArrowUpRight,
  Quote,
  Sparkles,
  Search,
  Users,
  Building2,
  BriefcaseBusiness,
} from "lucide-react";

/**
 * /leadership-preview — "The Power Index" edition.
 *
 * A magazine-grade editorial treatment of the leadership directory that
 * matches the rest of the platform (see Home.tsx): 1280px column, black
 * pill section labels with a hairline, Georgia serif for editorial type,
 * the #E11D2A red accent, sharp corners and object-cover portraiture.
 *
 * Structure, top to bottom:
 *   1. Editorial masthead (dateline + headline + editor's dek)
 *   2. Cover Story — the lead feature interview
 *   3. By the Numbers — live stats computed from the data
 *   4. The Power Index — a ranked, numbered editorial list
 *   5. Industry filter + The Roster grid + Leadership Talks rail
 *   6. Quote of the Issue — full-bleed black band
 *   7. Closing band — read the magazine / get in touch
 *
 * Everything degrades gracefully for any size of dataset.
 */

const RED = "#E11D2A";
const GEORGIA = "Georgia, 'Times New Roman', serif";

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

// First clean sentence of a bio, used for pull quotes / "why they matter" lines.
function firstSentence(text?: string | null, max = 160): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  const dot = clean.indexOf(". ");
  const sentence = dot > 40 ? clean.slice(0, dot + 1) : clean;
  return sentence.length > max ? sentence.slice(0, max).trim() + "…" : sentence;
}

// Rough read-time from bio length — adds an authentic editorial detail.
function readTime(text?: string | null): number {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round(words / 200) + 3);
}

// Editorial "sector" buckets. The data has no industry field, and
// areas_of_expertise is free-form prose (often a full paragraph), so we
// classify each leader into a short, consistent sector from their title +
// company. Ordered by specificity — the first matching rule wins.
const SECTOR_RULES: [string, RegExp][] = [
  ["Customer Experience", /(customer|\bcx\b|client success)/],
  ["Finance", /(\bcfo\b|financ|accounting|treasur|\binvestment)/],
  ["Marketing & Brand", /(marketing|\bcmo\b|\bbrand|communications|growth)/],
  ["People & Culture", /(\bpeople\b|talent|\bhr\b|human resources|culture|workplace|executive search|recruit|employee)/],
  ["Innovation", /(innovation)/],
  ["Technology", /(\bcto\b|chief technology|\bcio\b|chief information|chief digital|technolog|digital|data scien|analytics|artificial intelligence|\bai\b|engineering|software|architect|automation|cloud|cyber|\bproduct)/],
  ["Strategy & Advisory", /(strateg|advisor|advisory|consult|coach|foresight|performance|operating|operations|transformation)/],
];

// A leader's primary sector. Prefers a short explicit `industry` if the data
// ever provides one; otherwise classifies from title + company, always
// returning a clean, short label.
function facetOf(l: any): string {
  const industry = l?.industry ? String(l.industry).trim() : "";
  if (industry && industry.length <= 30) return industry;
  const hay = [l?.title, l?.company].filter(Boolean).join(" ").toLowerCase();
  for (const [label, re] of SECTOR_RULES) {
    if (re.test(hay)) return label;
  }
  return "Executive Leadership";
}

// Section header — black pill + hairline, identical to the Home idiom.
const SectionLabel = ({ label, kicker }: { label: string; kicker?: string }) => (
  <div className="flex items-center gap-4 mb-6">
    <div className="bg-black text-white px-4 py-2 shadow-[8px_8px_0_0_rgba(225,29,42,0.14)]">
      <h2 className="text-[14px] font-bold tracking-wide" style={{ fontFamily: GEORGIA }}>
        {label}
      </h2>
    </div>
    {kicker && (
      <span className="ml-3 mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 hidden sm:inline">
        {kicker}
      </span>
    )}
    <div className="flex-1 h-px bg-gradient-to-r from-neutral-300 to-transparent" />
  </div>
);

// Lightweight scroll-reveal wrapper — opacity + lift, runs once per element.
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const LeadershipPreview = () => {
  const { data: leaders, isLoading } = useLeadershipProfiles();
  const companyName = useCompanyName();
  const all = Array.isArray(leaders) ? leaders : [];

  // Dateline — "JUNE 2026" style, computed live.
  const dateline = useMemo(
    () => new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase(),
    []
  );

  // Cover = first featured leader (or first leader).
  const cover = useMemo(() => all.find((l: any) => l.featured) || all[0], [all]);

  // Power Index = featured leaders after the cover; falls back to non-cover leaders.
  const powerIndex = useMemo(() => {
    const featured = all.filter((l: any) => l.featured && l.id !== cover?.id);
    const pool = featured.length >= 3 ? featured : all.filter((l: any) => l.id !== cover?.id);
    return pool.slice(0, 6);
  }, [all, cover]);

  // Quote of the issue — a featured voice that isn't the cover or top of the index.
  const quoteLeader = useMemo(() => {
    const used = new Set([cover?.id, ...powerIndex.slice(0, 1).map((l: any) => l.id)]);
    return all.find((l: any) => l.featured && !used.has(l.id) && l.bio) || powerIndex[0] || cover;
  }, [all, cover, powerIndex]);

  // Industry facets for the filter rail — ordered by how many leaders sit in
  // each sector, so the busiest sectors lead the bar.
  const industries = useMemo(() => {
    const counts = new Map<string, number>();
    all.forEach((l: any) => {
      const f = facetOf(l);
      counts.set(f, (counts.get(f) || 0) + 1);
    });
    const ordered = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label]) => label);
    return ["All", ...ordered.slice(0, 10)];
  }, [all]);

  const [activeIndustry, setActiveIndustry] = useState<string>("All");
  const [query, setQuery] = useState("");

  const indexIds = useMemo(() => new Set(powerIndex.map((l: any) => l.id)), [powerIndex]);
  // Roster = everyone not on the cover and not in the Power Index.
  const rosterPool = useMemo(
    () => all.filter((l: any) => l.id !== cover?.id && !indexIds.has(l.id)),
    [all, cover, indexIds]
  );

  const filteredRoster = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return rosterPool.filter((l: any) => {
      if (activeIndustry !== "All" && facetOf(l) !== activeIndustry) return false;
      if (!normalizedQuery) return true;
      return [l.name, l.title, l.company, l.bio, facetOf(l)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [rosterPool, activeIndustry, query]);

  const talksMain = rosterPool[0] || all[0];
  const talksRest = rosterPool.slice(1, 5);

  // Live "By the Numbers" stats.
  const stats = useMemo(() => {
    const sectors = new Set<string>();
    const companies = new Set<string>();
    all.forEach((l: any) => {
      const f = facetOf(l);
      if (f) sectors.add(f);
      if (l.company) companies.add(String(l.company).trim());
    });
    return [
      { value: all.length, label: "Leaders Profiled", icon: Users },
      { value: all.filter((l: any) => l.featured).length, label: "Featured Voices", icon: Sparkles },
      { value: sectors.size, label: "Sectors Covered", icon: BriefcaseBusiness },
      { value: companies.size, label: "Companies Represented", icon: Building2 },
    ];
  }, [all]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E11D2A]" />
      </div>
    );
  }

  if (all.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1280px] mx-auto px-4 py-24 text-center">
          <p className="text-[14px] text-neutral-500" style={{ fontFamily: GEORGIA }}>
            No leadership profiles available yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* ============== EDITORIAL MASTHEAD ============== */}
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(225,29,42,0.28),transparent_30%),linear-gradient(135deg,#050505_0%,#151515_52%,#27070a_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
        <div className="relative max-w-[1280px] mx-auto px-4 pt-8 pb-14 md:pb-20">
          {/* Dateline rule */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/25 pt-4">
            <span
              className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/80"
              style={{ fontFamily: GEORGIA }}
            >
              {companyName} · Leadership
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/70">
              The Power Index · {dateline}
            </span>
          </div>

          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-x-14 gap-y-10 items-center mt-12">
              <div>
                <p
                  className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.25em] text-white/65 mb-5"
                >
                  <Sparkles className="h-3.5 w-3.5" style={{ color: RED }} />
                  The leaders setting the agenda
                </p>
                <h1
                  className="text-[42px] sm:text-[60px] lg:text-[76px] font-extrabold leading-[0.94] tracking-tight"
                  style={{ fontFamily: GEORGIA }}
                >
                  Leaders Defining
                  <br />
                  What Comes <span style={{ color: RED }}>Next</span>.
                </h1>
              </div>
              <p
                className="text-[15px] leading-relaxed text-white/76 border-l-2 pl-5"
                style={{ fontFamily: GEORGIA, borderColor: RED }}
              >
                Each edition, {companyName} sits down with the executives, founders and
                visionaries rewriting the rules of their industries — the people setting
                the agenda, in their own words and on the record.
              </p>
            </div>
          </Reveal>

          <div className="mt-8 h-px bg-neutral-300" />
        </div>
      </section>

      {/* ============== COVER STORY ============== */}
      {cover && (
        <section className="bg-white pb-12">
          <div className="max-w-[1280px] mx-auto px-4">
            <SectionLabel label="Cover Story" kicker="The Feature Interview" />
            <Reveal>
              <Link
                to={`/leadership/${cover.slug}`}
                className="group grid grid-cols-1 md:grid-cols-[460px_1fr] gap-10 items-stretch"
              >
                {/* Portrait */}
                <div className="relative aspect-[4/5] md:aspect-auto bg-neutral-900 overflow-hidden ring-1 ring-neutral-200">
                  <img
                    src={sharpen(cover.image_url, 1000)}
                    alt={cover.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  {facetOf(cover) && (
                    <span className="absolute top-3 left-3 bg-white text-neutral-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                      {facetOf(cover)}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-80">In conversation</p>
                  </div>
                </div>

                {/* Quote + nameplate */}
                <div className="flex flex-col justify-center py-2">
                  <div className="flex items-center gap-3 mb-5 text-[11px] uppercase tracking-[0.25em] font-bold text-neutral-500">
                    <span style={{ color: RED }}>Feature Interview</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-400" />
                    <span>{readTime(cover.bio)} min read</span>
                  </div>
                  <Quote className="h-9 w-9 mb-4" style={{ color: RED }} />
                  <blockquote
                    className="text-[24px] md:text-[30px] leading-[1.32] italic text-neutral-900"
                    style={{ fontFamily: GEORGIA }}
                  >
                    &ldquo;{firstSentence(cover.bio, 220) || "Leadership begins where comfort ends"}&rdquo;
                  </blockquote>

                  <div className="mt-8 flex items-center gap-4">
                    <div className="h-px w-12" style={{ backgroundColor: RED }} />
                    <div>
                      <div
                        className="text-[19px] font-extrabold text-neutral-900 group-hover:underline"
                        style={{ fontFamily: GEORGIA }}
                      >
                        {cover.name}
                      </div>
                      <div className="text-[12px] text-neutral-600 uppercase tracking-wider mt-0.5">
                        {cover.title}
                        {cover.company ? ` · ${cover.company}` : ""}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center gap-5">
                    <span
                      className="inline-flex items-center gap-2 text-[13px] font-bold text-white px-5 py-2.5 transition-all group-hover:gap-3"
                      style={{ backgroundColor: RED }}
                    >
                      Read the full interview <ArrowRight className="h-4 w-4" />
                    </span>
                    <div className="flex items-center gap-3 text-neutral-400">
                      {cover.linkedin_url && <Linkedin className="h-4 w-4" />}
                      {cover.twitter_url && <Twitter className="h-4 w-4" />}
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ============== BY THE NUMBERS ============== */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 -mt-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
              <Reveal key={s.label} delay={i * 90}>
                <div className="h-full border border-neutral-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.45)]">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center bg-neutral-950 text-white">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span
                    className="text-[42px] md:text-[50px] font-extrabold leading-none tracking-tight text-neutral-950"
                    style={{ fontFamily: GEORGIA, color: i === 1 ? RED : undefined }}
                  >
                    {s.value}
                    {i === 1 ? "" : "+"}
                  </span>
                  <span className="block text-[11px] uppercase tracking-[0.2em] text-neutral-500 mt-3">
                    {s.label}
                  </span>
                </div>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== THE POWER INDEX ============== */}
      {powerIndex.length > 0 && (
        <section className="bg-white py-12 border-b border-neutral-200">
          <div className="max-w-[1280px] mx-auto px-4">
            <SectionLabel label="The Power Index" kicker="Editors' Selection" />
            <p
              className="text-[15px] italic text-neutral-700 mb-8 max-w-2xl leading-relaxed border-l-2 border-neutral-900 pl-4"
              style={{ fontFamily: GEORGIA }}
            >
              The executives whose decisions are reshaping their markets this quarter —
              ranked by our editors for the breadth of their impact.
            </p>

            <div className="divide-y divide-neutral-200 border-t border-neutral-200">
              {powerIndex.map((l: any, i: number) => (
                <Reveal key={l.id} delay={i * 60}>
                  <Link
                    to={`/leadership/${l.slug}`}
                    className="group grid grid-cols-[44px_64px_1fr_auto] sm:grid-cols-[88px_88px_1fr_auto] gap-3 sm:gap-6 items-center py-5 hover:bg-neutral-50 transition-colors -mx-2 px-2"
                  >
                    {/* Rank numeral */}
                    <span
                      className="text-[34px] sm:text-[52px] font-extrabold leading-none tabular-nums text-neutral-200 group-hover:text-[color:var(--c)] transition-colors"
                      style={{ fontFamily: GEORGIA, ["--c" as any]: RED }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* Portrait */}
                    <div className="relative w-16 h-16 sm:w-[88px] sm:h-[88px] overflow-hidden bg-neutral-900 ring-1 ring-neutral-200">
                      <img
                        src={sharpen(l.image_url, 240)}
                        alt={l.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {/* Name + why they matter */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3
                          className="text-[17px] sm:text-[20px] font-extrabold leading-tight text-neutral-900 group-hover:underline"
                          style={{ fontFamily: GEORGIA }}
                        >
                          {l.name}
                        </h3>
                        {facetOf(l) && (
                          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-500 border border-neutral-300 px-2 py-0.5">
                            {facetOf(l)}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-600 uppercase tracking-wider mt-1 line-clamp-1">
                        {l.title}
                        {l.company ? ` · ${l.company}` : ""}
                      </p>
                      <p
                        className="hidden sm:block text-[13px] text-neutral-700 mt-2 leading-relaxed line-clamp-1"
                        style={{ fontFamily: GEORGIA }}
                      >
                        {firstSentence(l.industry_impact || l.bio, 150)}
                      </p>
                    </div>
                    {/* Arrow */}
                    <span
                      className="shrink-0 w-9 h-9 hidden sm:flex items-center justify-center border border-neutral-300 text-neutral-400 group-hover:bg-black group-hover:text-white group-hover:border-black transition-colors"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============== INDUSTRY FILTER ============== */}
      {industries.length > 1 && (
        <section className="bg-white/92 border-y border-neutral-200 sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/85">
          <div className="max-w-[1280px] mx-auto px-4 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 items-center">
              <label className="relative block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search leaders, companies, sectors"
                  className="h-11 w-full border border-neutral-300 bg-white pl-10 pr-3 text-[13px] outline-none transition focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10"
                />
              </label>
              <div className="flex items-center gap-5 overflow-x-auto no-scrollbar">
              <span
                className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 shrink-0"
                style={{ fontFamily: GEORGIA }}
              >
                Browse by sector
              </span>
              <div className="flex gap-1">
                {industries.map((ind) => {
                  const active = ind === activeIndustry;
                  return (
                    <button
                      key={ind}
                      onClick={() => setActiveIndustry(ind)}
                      className={`text-[12px] font-bold uppercase tracking-wider px-3 py-2 whitespace-nowrap transition border-b-2 ${
                        active
                          ? "text-neutral-900"
                          : "text-neutral-500 hover:text-neutral-900 border-transparent"
                      }`}
                      style={active ? { borderColor: RED } : undefined}
                    >
                      {ind}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        </section>
      )}

      {/* ============== THE ROSTER + LEADERSHIP TALKS ============== */}
      <section id="leadership-roster" className="bg-white py-12 border-b border-neutral-200 scroll-mt-24">
        <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">
          {/* MAIN: Roster grid */}
          <div>
            <SectionLabel label="The Full Roster" kicker={`${filteredRoster.length} profiles`} />
            {filteredRoster.length === 0 ? (
              <div
                className="border border-dashed border-neutral-300 p-12 text-center text-[13px] text-neutral-500"
                style={{ fontFamily: GEORGIA }}
              >
                No leaders match your current search or sector filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRoster.map((l: any, i: number) => (
                  <Reveal key={l.id} delay={(i % 3) * 70}>
                    <Link to={`/leadership/${l.slug}`} className="group block h-full">
                      <div className="flex h-full flex-col border border-neutral-200 bg-white p-3 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_55px_-35px_rgba(0,0,0,0.65)]">
                        {facetOf(l) && (
                          <span className="mb-3 self-start bg-black text-white px-3 py-1 text-[10px] font-semibold tracking-wider uppercase">
                            {facetOf(l)}
                          </span>
                        )}
                        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900 ring-1 ring-neutral-200">
                          <img
                            src={sharpen(l.image_url, 700)}
                            alt={l.name}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h3
                          className="mt-4 px-1 text-[18px] font-extrabold leading-snug text-neutral-900 group-hover:underline line-clamp-2"
                          style={{ fontFamily: GEORGIA }}
                        >
                          {l.name}
                        </h3>
                        <p className="px-1 text-[10px] text-neutral-600 uppercase tracking-[0.15em] mt-1 line-clamp-1">
                          {l.title}
                          {l.company ? ` · ${l.company}` : ""}
                        </p>
                        <p
                          className="px-1 text-[13px] text-neutral-700 mt-3 leading-relaxed line-clamp-3"
                          style={{ fontFamily: GEORGIA }}
                        >
                          {l.bio}
                        </p>
                        <div className="mt-auto flex items-center justify-between border-t border-neutral-200 px-1 pt-4">
                          <div className="flex items-center gap-2 text-neutral-400">
                            {l.linkedin_url && <Linkedin className="h-3.5 w-3.5 hover:text-[#0A66C2]" />}
                            {l.twitter_url && <Twitter className="h-3.5 w-3.5 hover:text-sky-500" />}
                          </div>
                          <span
                            className="text-[10px] font-bold uppercase tracking-[0.2em] inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                            style={{ color: RED }}
                          >
                            Read <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>

          {/* SIDEBAR: Leadership Talks (reuses the Home idiom) */}
          <aside className="lg:sticky lg:top-20">
            <div className="flex items-end mb-4">
              <div className="bg-black text-white px-4 py-2">
                <h2 className="text-[14px] font-bold tracking-wide" style={{ fontFamily: GEORGIA }}>
                  Leadership Talks
                </h2>
              </div>
              <div className="flex-1 h-px bg-neutral-300" />
            </div>

            {talksMain && (
              <Link
                to={`/leadership/${talksMain.slug}`}
                className="border border-neutral-200 p-4 flex gap-4 items-center bg-white relative overflow-hidden mb-4 group"
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-[120px]"
                  style={{ backgroundColor: RED, clipPath: "polygon(0 0, 100% 0, 60% 100%, 0 100%)" }}
                />
                <div className="relative w-20 flex flex-col items-center text-white z-10">
                  <span className="text-[8px] italic font-extrabold mb-1 text-center leading-tight" style={{ fontFamily: GEORGIA }}>
                    {companyName.split(" ")[0]}
                    <span style={{ color: "#fff" }}>.</span>
                    {companyName.split(" ").slice(1).join(" ")}
                  </span>
                  <p className="text-[8px] font-extrabold uppercase mt-1 text-center leading-tight">
                    {talksMain.name?.split(" ").slice(0, 2).join(" ").toUpperCase()}
                  </p>
                </div>
                <div
                  className="w-20 h-20 rounded-full overflow-hidden shrink-0 z-10"
                  style={{ boxShadow: `0 0 0 3px ${RED}, 0 0 0 5px white` }}
                >
                  <img src={sharpen(talksMain.image_url, 400)} alt={talksMain.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 z-10 min-w-0">
                  <h3 className="text-[13px] font-extrabold leading-tight mb-1.5 group-hover:underline">
                    {talksMain.name}: {talksMain.title?.split(" ").slice(0, 6).join(" ")}
                  </h3>
                  <p className="text-[10px] text-neutral-700 leading-relaxed line-clamp-3">
                    {talksMain.bio || "An exclusive feature on a leader redefining the boundaries of impact."}
                  </p>
                </div>
              </Link>
            )}

            <div className="flex flex-col gap-3">
              {talksRest.map((l: any) => (
                <Link key={l.id} to={`/leadership/${l.slug}`} className="flex gap-3 group">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0" style={{ boxShadow: `0 0 0 2px ${RED}` }}>
                    <img src={sharpen(l.image_url, 200)} alt={l.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[12px] font-bold line-clamp-2 group-hover:underline leading-tight">
                      {l.name}: {l.title}
                    </h4>
                    <p className="text-[10px] text-neutral-500 line-clamp-1 mt-0.5">{l.company}</p>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              to="/magazine"
              className="mt-5 flex items-center justify-between border border-neutral-300 px-4 py-3 text-[12px] font-bold uppercase tracking-wider text-neutral-900 hover:bg-black hover:text-white hover:border-black transition-colors"
            >
              In the magazine <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>

      {/* ============== QUOTE OF THE ISSUE ============== */}
      {quoteLeader?.bio && (
        <section className="bg-black text-white">
          <div className="max-w-[1280px] mx-auto px-4 py-16 md:py-20">
            <Reveal>
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.35em] mb-8" style={{ color: RED }}>
                  Quote of the Issue
                </p>
                <Quote className="h-10 w-10 mx-auto mb-6 opacity-90" style={{ color: RED }} />
                <blockquote
                  className="text-[26px] md:text-[40px] leading-[1.3] italic font-medium"
                  style={{ fontFamily: GEORGIA }}
                >
                  &ldquo;{firstSentence(quoteLeader.bio, 260)}&rdquo;
                </blockquote>
                <div className="mt-10 flex items-center justify-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full overflow-hidden shrink-0"
                    style={{ boxShadow: `0 0 0 2px ${RED}, 0 0 0 4px #000` }}
                  >
                    <img src={sharpen(quoteLeader.image_url, 200)} alt={quoteLeader.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <Link
                      to={`/leadership/${quoteLeader.slug}`}
                      className="text-[16px] font-extrabold hover:underline"
                      style={{ fontFamily: GEORGIA }}
                    >
                      {quoteLeader.name}
                    </Link>
                    <p className="text-[11px] uppercase tracking-wider text-neutral-400 mt-0.5">
                      {quoteLeader.title}
                      {quoteLeader.company ? ` · ${quoteLeader.company}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ============== CLOSING BAND ============== */}
      <section className="bg-white py-14">
        <div className="max-w-[1280px] mx-auto px-4">
          <Reveal>
            <div className="border border-neutral-200 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center p-8 md:p-10 relative overflow-hidden">
              <div
                className="absolute left-0 top-0 bottom-0 w-[40%] hidden md:block"
                style={{ backgroundColor: RED, clipPath: "polygon(0 0, 100% 0, 78% 100%, 0 100%)", opacity: 0.06 }}
              />
              <div className="relative z-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-3">
                  On the record
                </p>
                <h3
                  className="text-[26px] md:text-[34px] font-extrabold leading-tight text-neutral-900"
                  style={{ fontFamily: GEORGIA }}
                >
                  Know a leader who belongs in these pages?
                </h3>
                <p className="text-[14px] text-neutral-600 mt-3 max-w-xl leading-relaxed" style={{ fontFamily: GEORGIA }}>
                  Nominate an executive for the next edition of {companyName}, or explore
                  the full library of interviews and cover stories.
                </p>
              </div>
              <div className="relative z-10 flex flex-col sm:flex-row md:flex-col gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 text-[13px] font-bold text-white px-6 py-3 whitespace-nowrap hover:opacity-90 transition"
                  style={{ backgroundColor: RED }}
                >
                  Nominate a leader <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/magazine"
                  className="inline-flex items-center justify-center gap-2 text-[13px] font-bold text-neutral-900 border border-neutral-900 px-6 py-3 whitespace-nowrap hover:bg-neutral-900 hover:text-white transition"
                >
                  Read the magazine
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default LeadershipPreview;
