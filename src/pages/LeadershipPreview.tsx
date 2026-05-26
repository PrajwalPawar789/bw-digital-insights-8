import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLeadershipProfiles } from "@/hooks/useLeadership";
import { useCompanyName } from "@/hooks/useDatabaseSettings";
import { Linkedin, Twitter, ArrowRight, Quote } from "lucide-react";

/**
 * /leadership-preview — "The Boardroom Edition" design.
 * Newspaper / business-magazine treatment that matches the rest of the
 * site (Home.tsx). Once approved we copy this into /leadership.
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

// Small reusable section header — black pill + horizontal hairline.
const SectionLabel = ({ label }: { label: string }) => (
  <div className="flex items-end mb-4">
    <div className="bg-black text-white px-4 py-2">
      <h2 className="text-[14px] font-bold tracking-wide" style={{ fontFamily: GEORGIA }}>
        {label}
      </h2>
    </div>
    <div className="flex-1 h-px bg-neutral-300" />
  </div>
);


const LeadershipPreview = () => {
  const { data: leaders, isLoading } = useLeadershipProfiles();
  const companyName = useCompanyName();
  const all = Array.isArray(leaders) ? leaders : [];

  // Cover = first featured leader (or first leader)
  const cover = useMemo(() => all.find((l: any) => l.featured) || all[0], [all]);

  // Power List = top 5 featured (excluding cover), falling back to non-cover leaders
  const powerList = useMemo(() => {
    const featured = all.filter((l: any) => l.featured && l.id !== cover?.id);
    const pool = featured.length >= 5 ? featured : all.filter((l: any) => l.id !== cover?.id);
    return pool.slice(0, 5);
  }, [all, cover]);

  const industries = useMemo(() => {
    const set = new Set<string>();
    all.forEach((l: any) => { if (l.industry) set.add(l.industry); });
    return ["All", ...Array.from(set)];
  }, [all]);

  const [activeIndustry, setActiveIndustry] = useState<string>("All");

  const powerListIds = new Set(powerList.map((l: any) => l.id));
  // Roster = everyone not on the Cover and not in the Power List
  const rosterPool = useMemo(() => {
    return all.filter((l: any) => l.id !== cover?.id && !powerListIds.has(l.id));
  }, [all, cover, powerListIds]);

  const filteredRoster = useMemo(() => {
    if (activeIndustry === "All") return rosterPool;
    return rosterPool.filter((l: any) => l.industry === activeIndustry);
  }, [rosterPool, activeIndustry]);

  const talksMain = rosterPool[0] || all[0];
  const talksRest = rosterPool.slice(1, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[color:var(--insight-red,#E11D2A)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ============== COVER STORY (no section label) ============== */}
      {cover && (
        <section className="bg-white py-10 border-b border-neutral-200">
          <div className="max-w-[1280px] mx-auto px-4">
            <Link to={`/leadership/${cover.slug}`} className="group grid grid-cols-1 md:grid-cols-[440px_1fr] gap-10 items-center">
              {/* Portrait */}
              <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden ring-1 ring-neutral-200">
                <img
                  src={sharpen(cover.image_url, 1000)}
                  alt={cover.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                {cover.industry && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-white text-neutral-900 text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                      {cover.industry}
                    </span>
                  </div>
                )}
              </div>

              {/* Quote + meta */}
              <div className="max-w-2xl">
                {/* Editorial dek */}
                <div className="flex items-center gap-3 mb-4 text-[11px] uppercase tracking-[0.25em] font-bold text-neutral-500">
                  <span style={{ color: RED }}>Feature Interview</span>
                  <span className="w-1 h-1 rounded-full bg-neutral-400" />
                  <span>8 min read</span>
                </div>
                <Quote className="h-8 w-8 mb-3" style={{ color: RED }} />
                <blockquote
                  className="text-[22px] md:text-[28px] leading-[1.3] italic text-neutral-900"
                  style={{ fontFamily: GEORGIA }}
                >
                  &ldquo;{(cover.bio || "Leadership begins where comfort ends.").slice(0, 220).trim()}&hellip;&rdquo;
                </blockquote>
                <div className="mt-7 flex items-center gap-4">
                  <div className="h-px w-10" style={{ backgroundColor: RED }} />
                  <div>
                    <div
                      className="text-[16px] font-extrabold text-neutral-900 group-hover:underline"
                      style={{ fontFamily: GEORGIA }}
                    >
                      {cover.name}
                    </div>
                    <div className="text-[12px] text-neutral-600 uppercase tracking-wider mt-0.5">
                      {cover.title}{cover.company ? ` · ${cover.company}` : ""}
                    </div>
                  </div>
                </div>
                <div className="mt-7 inline-flex items-center gap-2 text-[13px] font-bold text-neutral-900 border-b-2 pb-0.5" style={{ borderColor: RED }}>
                  Read the full interview <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ============== POWER LIST ============== */}
      {powerList.length > 0 && (
        <section className="bg-white py-8 border-b border-neutral-200">
          <div className="max-w-[1280px] mx-auto px-4">
            <SectionLabel label="Power List" />
            {/* Editorial dek */}
            <p
              className="text-[15px] italic text-neutral-700 mb-6 max-w-2xl leading-relaxed border-l-2 border-neutral-900 pl-4"
              style={{ fontFamily: GEORGIA }}
            >
              Five executives whose decisions are reshaping their industries this quarter.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {powerList.map((l: any) => (
                <Link key={l.id} to={`/leadership/${l.slug}`} className="group block">
                  <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden ring-1 ring-neutral-200">
                    <img
                      src={sharpen(l.image_url, 600)}
                      alt={l.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    />
                    {l.industry && (
                      <span className="absolute top-2 left-2 bg-white text-neutral-900 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                        {l.industry}
                      </span>
                    )}
                  </div>
                  {/* Thin red rule marks Power List cards as 'editor's selects' without being shouty */}
                  <div className="mt-3 pt-3 border-t-2" style={{ borderColor: RED }}>
                    <h3
                      className="text-[15px] font-extrabold leading-snug text-neutral-900 group-hover:underline"
                      style={{ fontFamily: GEORGIA }}
                    >
                      {l.name}
                    </h3>
                    <p className="text-[11px] text-neutral-600 uppercase tracking-wider mt-1 line-clamp-2">
                      {l.title}{l.company ? ` · ${l.company}` : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============== INDUSTRY TABS ============== */}
      {industries.length > 1 && (
        <section className="bg-white border-b border-neutral-200">
          <div className="max-w-[1280px] mx-auto px-4 py-4">
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
              <span
                className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 shrink-0"
                style={{ fontFamily: GEORGIA }}
              >
                Browse by industry —
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
        </section>
      )}

      {/* ============== THE ROSTER + LEADERSHIP TALKS ============== */}
      <section className="bg-white py-8 border-b border-neutral-200">
        <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* MAIN: Roster grid */}
          <div>
            <SectionLabel label="The Roster" />
            {filteredRoster.length === 0 ? (
              <div className="border border-dashed border-neutral-300 p-10 text-center text-[13px] text-neutral-500" style={{ fontFamily: GEORGIA }}>
                No leaders in this industry yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8 divide-neutral-200">
                {filteredRoster.map((l: any) => (
                  <Link key={l.id} to={`/leadership/${l.slug}`} className="group block">
                    <div className="flex flex-col h-full">
                      {l.industry && (
                        <span className="self-start bg-black text-white px-3 py-1 text-[10px] font-semibold tracking-wider uppercase">
                          {l.industry}
                        </span>
                      )}
                      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900 ring-1 ring-neutral-200">
                        <img
                          src={sharpen(l.image_url, 700)}
                          alt={l.name}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      </div>
                      <h3
                        className="mt-3 text-[15px] font-extrabold leading-snug text-neutral-900 group-hover:underline line-clamp-2"
                        style={{ fontFamily: GEORGIA }}
                      >
                        {l.name}
                      </h3>
                      <p className="text-[10px] text-neutral-600 uppercase tracking-[0.15em] mt-1">
                        {l.title}{l.company ? ` · ${l.company}` : ""}
                      </p>
                      <p
                        className="text-[12px] text-neutral-700 mt-2 leading-relaxed line-clamp-2"
                        style={{ fontFamily: GEORGIA }}
                      >
                        {l.bio}
                      </p>
                      {/* Footer: socials + read affordance, pushed to bottom */}
                      <div className="mt-auto pt-3 flex items-center justify-between">
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
                ))}
              </div>
            )}
          </div>

          {/* SIDEBAR: Leadership Talks (reuses Home idiom) */}
          <aside className="lg:sticky lg:top-4">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-[14px] font-extrabold uppercase tracking-wider">Leadership Talks</h2>
            </div>

            {talksMain && (
              <div className="border border-neutral-200 p-4 flex gap-4 items-center bg-white relative overflow-hidden mb-4">
                <div
                  className="absolute left-0 top-0 bottom-0 w-[120px]"
                  style={{ backgroundColor: RED, clipPath: "polygon(0 0, 100% 0, 60% 100%, 0 100%)" }}
                />
                <div className="relative w-20 flex flex-col items-center text-white z-10">
                  <span
                    className="text-[8px] italic font-extrabold mb-1"
                    style={{ fontFamily: GEORGIA }}
                  >
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
                  <img
                    src={sharpen(talksMain.image_url, 400)}
                    alt={talksMain.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 z-10 min-w-0">
                  <Link to={`/leadership/${talksMain.slug}`} className="block">
                    <h3 className="text-[13px] font-extrabold leading-tight mb-1.5 hover:underline">
                      {talksMain.name}: {talksMain.title?.split(" ").slice(0, 6).join(" ")}
                    </h3>
                  </Link>
                  <p className="text-[10px] text-neutral-700 leading-relaxed line-clamp-3">
                    {talksMain.bio || "An exclusive feature on a leader redefining the boundaries of impact."}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {talksRest.map((l: any) => (
                <Link key={l.id} to={`/leadership/${l.slug}`} className="flex gap-3 group">
                  <div
                    className="w-12 h-12 rounded-full overflow-hidden shrink-0"
                    style={{ boxShadow: `0 0 0 2px ${RED}` }}
                  >
                    <img
                      src={sharpen(l.image_url, 200)}
                      alt={l.name}
                      className="w-full h-full object-cover"
                    />
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
          </aside>
        </div>
      </section>

      {/* Empty state for whole page */}
      {all.length === 0 && (
        <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
          <p className="text-[14px] text-neutral-500" style={{ fontFamily: GEORGIA }}>
            No leadership profiles available yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default LeadershipPreview;
