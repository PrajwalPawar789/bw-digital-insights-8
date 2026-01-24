import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useArticles } from "@/hooks/useArticles";
import Seo from "@/components/seo/Seo";
import EditorialList from "@/components/articles/EditorialList";
import { buildBreadcrumbSchema, getSiteOrigin } from "@/lib/seo";

const Search = () => {
  const [searchParams] = useSearchParams();
  const q = String(searchParams.get("q") || "").trim();
  const { data: rawArticles = [], isLoading } = useArticles();
  const articles = Array.isArray(rawArticles) ? rawArticles : [];

  const results = useMemo(() => {
    if (!q) return [];
    const term = q.toLowerCase();
    return articles.filter((a: any) => {
      const fields = [a?.title, a?.excerpt, a?.content, a?.category, a?.tags].map((f: any) => String(f || "").toLowerCase());
      return fields.some((f: string) => f.includes(term));
    });
  }, [q, articles]);

  const siteOrigin = getSiteOrigin();
  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: "Search", url: `${siteOrigin}/search?q=${encodeURIComponent(q)}` },
      ])
    : undefined;

  return (
    <>
      <Seo title={q ? `Search: ${q}` : "Search"} description={q ? `Search results for ${q}` : undefined} schema={breadcrumbSchema ? [breadcrumbSchema] : undefined} noindex={false} />

      <div className="min-h-screen bg-white">
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold mb-4">Search results</h1>
            {isLoading ? (
              <p className="text-gray-600">Searching...</p>
            ) : !q ? (
              <p className="text-gray-600">Please enter a search term.</p>
            ) : (
              <>
                <p className="text-gray-700 mb-6">Results for "{q}" — {results.length} found</p>
                {results.length > 0 ? (
                  <EditorialList articles={results} />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No articles matched your search.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Search;
