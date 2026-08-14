import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { useMagazines } from "@/hooks/useMagazines";
import { useCompanyName } from "@/hooks/useDatabaseSettings";
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

type MagazineRecord = Database["public"]["Tables"]["magazines"]["Row"];

const ITEMS_PER_PAGE = 48;

const Magazine = () => {
  const { data: magazines = [], isLoading } = useMagazines();
  const [currentPage, setCurrentPage] = useState(1);
  const companyName = useCompanyName();

  const allMagazines = useMemo<MagazineRecord[]>(
    () => (Array.isArray(magazines) ? (magazines as MagazineRecord[]) : []),
    [magazines]
  );
  const totalPages = Math.max(1, Math.ceil(allMagazines.length / ITEMS_PER_PAGE));
  const firstItemIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMagazines = allMagazines.slice(firstItemIndex, firstItemIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const siteOrigin = getSiteOrigin();
  const pageDescription = `Explore ${companyName} magazine issues featuring executive interviews, industry analysis, and leadership insights.`;
  const modifiedTime = getLatestDate(
    ...allMagazines.map((magazine) => magazine.updated_at || magazine.publish_date)
  );
  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: "Magazine", url: `${siteOrigin}/magazine` },
      ])
    : undefined;
  const pageSchema = siteOrigin
    ? buildPageSchema({
        type: "CollectionPage",
        name: `${companyName} Magazine`,
        description: pageDescription,
        url: `${siteOrigin}/magazine`,
        dateModified: modifiedTime,
      })
    : undefined;
  const itemListSchema = siteOrigin
    ? buildItemListSchema(
        "Magazine Archive",
        allMagazines.slice(0, 12).map((magazine, index) => ({
          name: magazine.title,
          url: `${siteOrigin}/magazine/${magazine.slug}`,
          image: toAbsoluteUrl(magazine.cover_image_url || "/placeholder.svg", siteOrigin),
          description: truncateText(
            magazine.description || `${companyName} magazine issue ${magazine.title}`
          ),
          datePublished: magazine.publish_date,
          position: index + 1,
          itemType: "PublicationIssue",
        })),
        `${siteOrigin}/magazine`
      )
    : undefined;

  if (isLoading) {
    return (
      <>
        <Seo title="Magazine" noindex />
        <div className="flex min-h-[65vh] items-center justify-center bg-black">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/25 border-t-white" />
        </div>
      </>
    );
  }

  return (
    <>
      <Seo
        title="Magazine"
        description={pageDescription}
        modifiedTime={modifiedTime}
        keywords={["business magazine", "executive magazine", "leadership magazine", "industry analysis"]}
        schema={[breadcrumbSchema, pageSchema, itemListSchema].filter(Boolean) as Record<string, unknown>[]}
      />

      <main className="min-h-screen bg-black pb-16 text-white">
        <section className="mx-auto max-w-[1065px] px-4 lg:px-0">
          <div className="border-t border-[#626262]">
            <h1
              className="relative -top-px inline-block bg-white px-[6px] py-[3px] text-[16px] font-bold leading-[24px] text-black"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Magazines
            </h1>
          </div>

          {currentMagazines.length > 0 ? (
            <div className="mt-[2px] grid grid-cols-2 gap-x-[17px] gap-y-[14px] md:grid-cols-3 lg:grid-cols-4" role="list">
              {currentMagazines.map((magazine, index) => (
                <article key={magazine.id} className="min-w-0" role="listitem">
                  <Link
                    to={`/magazine/${magazine.slug}`}
                    className="group block aspect-[880/1155] overflow-hidden border border-[#555] bg-black"
                    aria-label={`Read ${magazine.title}`}
                  >
                    <img
                      src={magazine.cover_image_url || "/placeholder.svg"}
                      alt={magazine.title}
                      loading={index < 4 ? "eager" : "lazy"}
                      decoding="async"
                      className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.015]"
                    />
                  </Link>

                  <div className="mt-[4px] flex min-h-[98px] flex-col bg-[#333] px-[7px] py-[6px]">
                    <h2 className="line-clamp-2 text-[11px] font-extrabold leading-[1.35] text-white sm:text-[12px]">
                      <Link to={`/magazine/${magazine.slug}`} className="hover:underline">
                        {magazine.title}
                      </Link>
                    </h2>
                    <p className="mt-[7px] text-[12px] leading-none text-white">…</p>
                    <div className="mt-auto pt-[6px]">
                      <Link
                        to={`/magazine/${magazine.slug}`}
                        className="inline-flex min-h-[23px] items-center bg-white px-[8px] py-[5px] text-[9px] font-bold leading-none text-black hover:bg-neutral-200"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-[2px] border border-white/30 py-16 text-center">
              <BookOpen className="mx-auto mb-3 h-10 w-10 text-white/45" />
              <h2 className="text-base font-bold text-white">No magazines available</h2>
              <p className="mt-1 text-xs text-white/65">New magazine issues will appear here.</p>
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-7 flex flex-wrap items-center justify-center gap-1 text-[10px]" aria-label="Magazine pagination">
              <span className="mr-2 border border-white/50 px-2.5 py-1.5 text-white/80">
                {currentPage} / {totalPages}
              </span>
              {Array.from({ length: Math.min(4, totalPages) }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={`min-h-7 min-w-7 border px-2 ${
                    currentPage === page
                      ? "border-white bg-white text-black"
                      : "border-white/50 bg-black text-white hover:border-white"
                  }`}
                >
                  {page}
                </button>
              ))}
              {totalPages > 4 && (
                <button
                  type="button"
                  onClick={() => handlePageChange(totalPages)}
                  className="inline-flex min-h-7 items-center gap-1 border border-white/50 px-2.5 text-white hover:border-white"
                >
                  Last <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </nav>
          )}
        </section>
      </main>
    </>
  );
};

export default Magazine;
