import { useArticles } from "@/hooks/useArticles";
import { Loader2 } from "lucide-react";
import EditorialList from "@/components/articles/EditorialList";
import Seo from "@/components/seo/Seo";
import { buildBreadcrumbSchema, getSiteOrigin } from "@/lib/seo";

const Articles = () => {
  const { data: articles = [], isLoading, error } = useArticles();

  if (isLoading) {
    return (
      <>
        <Seo title="Articles" noindex />
        <div className="min-h-screen py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-insightRed mr-2" />
              <span className="text-lg">Loading articles...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Seo title="Articles" noindex />
        <div className="min-h-screen py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Failed to load articles</p>
              <button onClick={() => window.location.reload()} className="text-insightRed hover:underline">
                Try again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const siteOrigin = getSiteOrigin();
  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: "Articles", url: `${siteOrigin}/articles` },
      ])
    : undefined;

  return (
    <>
      <Seo
        title="Articles"
        description="Insights, strategies, and leadership stories for modern executives."
        schema={breadcrumbSchema ? [breadcrumbSchema] : undefined}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Premium hero strip */}
      <section className="relative bg-gradient-to-br from-insightBlack via-gray-900 to-insightBlack text-white py-16">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold">Editorial <span className="text-insightRed">Articles</span></h1>
          <p className="text-lg text-gray-300 max-w-3xl mt-3">Insights, strategies, and leadership stories for modern executives.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EditorialList articles={articles} />
        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles found.</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Articles;
