import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { useLeadershipProfiles } from "@/hooks/useLeadership";
import { useMagazines } from "@/hooks/useMagazines";
import type { Database } from "@/integrations/supabase/types";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
  buildPageSchema,
  getLatestDate,
  getSiteOrigin,
  toAbsoluteUrl,
  truncateText,
} from "@/lib/seo";

const DIRECTORY_FILTERS = [
  "All",
  "Business",
  "Consulting",
  "Education",
  "Finance",
  "Healthcare",
  "Manufacturing",
  "Marketing",
  "Others",
  "Technology",
] as const;

type DirectoryFilter = (typeof DIRECTORY_FILTERS)[number];
type LeadershipRecord = Database["public"]["Tables"]["leadership_profiles"]["Row"];
type MagazineRecord = Database["public"]["Tables"]["magazines"]["Row"];

const FILTER_PATTERNS: Partial<Record<DirectoryFilter, RegExp>> = {
  Business: /business|enterprise|entrepreneur|founder|executive|leadership|strategy|growth/i,
  Consulting: /consult|advisor|advisory|coach/i,
  Education: /education|academic|school|university|learning|training/i,
  Finance: /finance|financial|bank|capital|investment|fintech|insurance/i,
  Healthcare: /health|medical|pharma|clinical|care|biotech/i,
  Manufacturing: /manufactur|industrial|supply chain|operations|automotive/i,
  Marketing: /marketing|brand|media|communications|sales/i,
  Technology: /technology|digital|software|data|cyber|artificial intelligence|\bai\b|tech/i,
};

const leaderText = (leader: LeadershipRecord) =>
  [
    leader.name,
    leader.title,
    leader.company,
    leader.bio,
    leader.areas_of_expertise,
    leader.industry_impact,
  ]
    .filter(Boolean)
    .join(" ");

const matchesDirectoryFilter = (leader: LeadershipRecord, filter: DirectoryFilter) => {
  if (filter === "All") return true;

  const content = leaderText(leader);
  if (filter === "Others") {
    return !Object.values(FILTER_PATTERNS).some((pattern) => pattern?.test(content));
  }

  return FILTER_PATTERNS[filter]?.test(content) ?? false;
};

const Leadership = () => {
  const { data: leaders = [], isLoading } = useLeadershipProfiles();
  const { data: magazines = [] } = useMagazines();
  const [filter, setFilter] = useState<DirectoryFilter>("All");
  const [visibleCount, setVisibleCount] = useState(12);

  const allLeaders = useMemo<LeadershipRecord[]>(
    () => (Array.isArray(leaders) ? (leaders as LeadershipRecord[]) : []),
    [leaders]
  );
  const allMagazines = useMemo<MagazineRecord[]>(
    () => (Array.isArray(magazines) ? (magazines as MagazineRecord[]) : []),
    [magazines]
  );

  const filteredLeaders = useMemo(
    () =>
      allLeaders
        .filter((leader) => matchesDirectoryFilter(leader, filter))
        .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))),
    [allLeaders, filter]
  );

  const backdropImages = useMemo(() => {
    const magazineCovers = allMagazines
      .map((magazine) => magazine.cover_image_url)
      .filter((url): url is string => Boolean(url))
      .slice(0, 8);
    const coverProfiles = allLeaders
      .filter((leader) => leader.featured || leader.home_sections?.includes("cover_story"))
      .map((leader) => leader.image_url)
      .filter((url): url is string => Boolean(url))
      .slice(0, 8);
    const remainingProfiles = allLeaders
      .map((leader) => leader.image_url)
      .filter((url): url is string => Boolean(url));
    const uniqueImages = [...new Set([...magazineCovers, ...coverProfiles, ...remainingProfiles])];

    if (uniqueImages.length === 0) return ["/placeholder.svg"];
    return Array.from({ length: 16 }, (_, index) => uniqueImages[index % uniqueImages.length]);
  }, [allLeaders, allMagazines]);

  const visibleLeaders = filteredLeaders.slice(0, visibleCount);
  const hasMore = visibleCount < filteredLeaders.length;
  const siteOrigin = getSiteOrigin();
  const pageDescription =
    "Meet influential founders, executives, and business leaders through The CIO Vision leadership profiles.";
  const modifiedTime = getLatestDate(...allLeaders.map((leader) => leader.updated_at));
  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: "Leadership", url: `${siteOrigin}/leadership` },
      ])
    : undefined;
  const pageSchema = siteOrigin
    ? buildPageSchema({
        type: "CollectionPage",
        name: "Leadership Profiles",
        description: pageDescription,
        url: `${siteOrigin}/leadership`,
        dateModified: modifiedTime,
      })
    : undefined;
  const itemListSchema = siteOrigin
    ? buildItemListSchema(
        "Leadership Profiles",
        allLeaders.slice(0, 12).map((leader, index) => ({
          name: leader.name,
          url: `${siteOrigin}/leadership/${leader.slug}`,
          image: toAbsoluteUrl(leader.image_url || "/placeholder.svg", siteOrigin),
          description: truncateText(leader.bio || `${leader.name} leadership profile.`),
          position: index + 1,
          itemType: "Person",
        })),
        `${siteOrigin}/leadership`
      )
    : undefined;

  if (isLoading) {
    return (
      <>
        <Seo title="Leadership" noindex />
        <div className="flex min-h-[65vh] items-center justify-center bg-black">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/25 border-t-white" />
        </div>
      </>
    );
  }

  return (
    <>
      <Seo
        title="Leadership Profiles"
        description={pageDescription}
        modifiedTime={modifiedTime}
        keywords={["leadership profiles", "executive interviews", "business leaders", "C-suite insights"]}
        schema={[breadcrumbSchema, pageSchema, itemListSchema].filter(Boolean) as Record<string, unknown>[]}
      />

      <main className="min-h-screen bg-black text-white">
        <section className="relative min-h-[278px] overflow-hidden bg-black">
          <div
            className="absolute inset-[-32px] grid grid-cols-4 grid-rows-4 gap-[3px] -rotate-[1.5deg] scale-[1.08] sm:grid-cols-6 sm:grid-rows-3 lg:grid-cols-8 lg:grid-rows-2"
            aria-hidden="true"
          >
            {backdropImages.map((imageUrl, index) => (
              <div
                key={`${imageUrl}-${index}`}
                className={`overflow-hidden bg-neutral-900 ${index % 3 === 1 ? "translate-y-3" : index % 3 === 2 ? "-translate-y-2" : ""}`}
              >
                <img
                  src={imageUrl}
                  alt=""
                  decoding="async"
                  className="h-full w-full object-cover object-top grayscale-[15%]"
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-black/70" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/68 to-black/72" aria-hidden="true" />

          <div className="relative mx-auto flex min-h-[278px] max-w-[1072px] flex-col justify-center px-4 py-10 lg:px-0">
            <h1 className="text-[34px] font-extrabold leading-none tracking-[-0.025em] text-white sm:text-[40px]">
              Leadership Profiles
            </h1>
            <div className="mt-5 space-y-4 text-[11px] leading-[1.55] text-white sm:text-[12px]" style={{ fontFamily: "Georgia, serif" }}>
              <p>
                The CIO Vision is a business magazine and a platform for influential business minds to share their stories of success, the challenges they overcame, and the ideas shaping tomorrow&apos;s enterprise world.
              </p>
              <p>
                Leadership Profiles is our dedicated editorial section, spotlighting founders, executives, and change-makers across Technology, Healthcare, Finance, Manufacturing, Education, Marketing, and Consulting. We bring their journeys, insights, and leadership lessons to our valued readers.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-black pb-16">
          <div className="mx-auto max-w-[1072px] px-4 lg:px-0">
            <div className="flex flex-wrap gap-[9px] py-[18px]" role="group" aria-label="Filter leadership profiles">
              {DIRECTORY_FILTERS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setFilter(option);
                    setVisibleCount(12);
                  }}
                  aria-pressed={filter === option}
                  className={`h-7 border px-[11px] text-[10px] font-medium leading-none transition-colors ${
                    filter === option
                      ? "border-white bg-white text-black"
                      : "border-white bg-black text-white hover:bg-white hover:text-black"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {visibleLeaders.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-x-[5px] gap-y-5 md:grid-cols-3 lg:grid-cols-4" role="list">
                  {visibleLeaders.map((leader) => (
                    <article key={leader.id} className="group min-w-0 bg-[#303030]" role="listitem">
                      <Link
                        to={`/leadership/${leader.slug}`}
                        className="relative block aspect-[3/2] overflow-hidden bg-neutral-800"
                        aria-label={`Read ${leader.name}'s leadership profile`}
                      >
                        <img
                          src={leader.image_url || "/placeholder.svg"}
                          alt={leader.name}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.025]"
                        />
                      </Link>
                      <div className="min-h-[108px] px-[7px] py-[6px]">
                        <h2 className="line-clamp-3 text-[11px] font-extrabold leading-[1.38] text-white sm:text-[12px]">
                          <Link to={`/leadership/${leader.slug}`} className="hover:underline">
                            {leader.name}: {leader.title}
                            {leader.company ? ` at ${leader.company}` : ""}
                          </Link>
                        </h2>
                        <p
                          className="mt-[5px] line-clamp-4 text-[10px] leading-[1.35] text-white sm:text-[11px]"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          {leader.bio || `${leader.name} shares insights on leadership, strategy, and lasting business impact.`}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((count) => count + 12)}
                      className="border border-white bg-black px-6 py-2.5 text-[11px] font-bold text-white transition-colors hover:bg-white hover:text-black"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="border border-white/35 py-14 text-center">
                <Users className="mx-auto mb-3 h-9 w-9 text-white/45" />
                <h2 className="text-base font-bold text-white">No profiles found</h2>
                <p className="mt-1 text-xs text-white/65">No profiles currently match this category.</p>
                <button
                  type="button"
                  onClick={() => setFilter("All")}
                  className="mt-4 border border-white bg-white px-5 py-2 text-[10px] font-bold text-black"
                >
                  Show All
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Leadership;
