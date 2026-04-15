import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Seo from "@/components/seo/Seo";
import { useArticles } from "@/hooks/useArticles";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
  buildPageSchema,
  getLatestDate,
  getSiteOrigin,
  toAbsoluteUrl,
  truncateText,
} from "@/lib/seo";
import { normalizeCategorySlug } from "@/lib/articleCategories";

const formatCategoryLabel = (value?: string | null) =>
  (value || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const { data: articles = [], isLoading, error } = useArticles();
  const siteOrigin = getSiteOrigin();

  const normalizedParam = decodeURIComponent(categoryName || "").trim().toLowerCase();

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const category = article.category || "";
      return (
        category.trim().toLowerCase() === normalizedParam ||
        normalizeCategorySlug(category) === normalizedParam
      );
    });
  }, [articles, normalizedParam]);

  const categoryLabel = filteredArticles[0]?.category || formatCategoryLabel(normalizedParam);
  const canonicalPathSegment = normalizeCategorySlug(categoryLabel);
  const canonicalUrl =
    siteOrigin && canonicalPathSegment
      ? `${siteOrigin}/category/${canonicalPathSegment}`
      : undefined;

  if (isLoading) {
    return (
      <>
        <Seo title="Category" noindex />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-insightRed" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Seo title="Category" noindex />
        <div className="min-h-screen bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-insightBlack mb-4">Category Unavailable</h1>
              <p className="text-lg text-gray-600 mb-8">
                We couldn&apos;t load this category right now.
              </p>
              <Link
                to="/articles"
                className="inline-flex items-center px-6 py-3 bg-insightRed text-white rounded-md font-medium hover:bg-red-700 transition-colors"
              >
                Browse Articles
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (filteredArticles.length === 0) {
    return (
      <>
        <Seo title={`${categoryLabel || "Category"} Articles`} noindex />
        <div className="min-h-screen bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-insightBlack mb-4">No Articles Found</h1>
              <p className="text-lg text-gray-600 mb-8">
                We couldn&apos;t find any articles in the {categoryLabel || "selected"} category.
              </p>
              <Link
                to="/articles"
                className="inline-flex items-center px-6 py-3 bg-insightRed text-white rounded-md font-medium hover:bg-red-700 transition-colors"
              >
                Browse All Articles
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const pageDescription = truncateText(
    `Explore ${filteredArticles.length} ${categoryLabel.toLowerCase()} articles covering business insights, leadership strategies, and market trends.`
  );
  const modifiedTime = getLatestDate(
    ...filteredArticles.map((article: any) => article?.updated_at || article?.date)
  );
  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: "Articles", url: `${siteOrigin}/articles` },
        { name: categoryLabel, url: canonicalUrl || `${siteOrigin}/category/${normalizedParam}` },
      ])
    : undefined;
  const pageSchema = canonicalUrl
    ? buildPageSchema({
        type: "CollectionPage",
        name: `${categoryLabel} Articles`,
        description: pageDescription,
        url: canonicalUrl,
        dateModified: modifiedTime,
      })
    : undefined;
  const itemListSchema = canonicalUrl
    ? buildItemListSchema(
        `${categoryLabel} Article Directory`,
        filteredArticles.slice(0, 12).map((article: any, index: number) => ({
          name: article.title,
          url: `${siteOrigin}/article/${article.slug}`,
          image: toAbsoluteUrl(article.image_url || "/placeholder.svg", siteOrigin),
          description: truncateText(article.excerpt || article.title),
          datePublished: article.date,
          position: index + 1,
          itemType: "Article",
        })),
        canonicalUrl
      )
    : undefined;

  return (
    <>
      <Seo
        title={`${categoryLabel} Articles`}
        description={pageDescription}
        canonical={canonicalUrl}
        modifiedTime={modifiedTime}
        keywords={[categoryLabel, `${categoryLabel} articles`, "business insights", "executive analysis"]}
        schema={[breadcrumbSchema, pageSchema, itemListSchema].filter(Boolean) as Record<string, unknown>[]}
      />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-insightBlack mb-4">
              {categoryLabel} Articles
            </h1>
            <p className="text-lg text-gray-600">
              Explore our collection of {filteredArticles.length} articles in the {categoryLabel} category
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
              >
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={article.image_url || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-0 right-0 m-4">
                    <span className="inline-flex items-center px-3 py-1.5 bg-white/90 backdrop-blur-sm text-insightBlack text-sm font-semibold rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-3 group-hover:text-insightRed transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(article.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <Link
                      to={`/article/${article.slug}`}
                      className="inline-flex items-center text-insightRed hover:text-insightBlack text-sm font-medium transition-colors"
                    >
                      Read Full Article <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
