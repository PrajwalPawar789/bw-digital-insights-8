
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { newsData } from '../data/newsData';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import Seo from "@/components/seo/Seo";
import { buildBreadcrumbSchema, getSiteOrigin, truncateText } from "@/lib/seo";

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [articles, setArticles] = useState(newsData);
  const [loading, setLoading] = useState(true);
  const siteOrigin = getSiteOrigin();

  useEffect(() => {
    // Filter articles by category (case-insensitive)
    const filteredArticles = newsData.filter(
      article => article.category.toLowerCase() === categoryName?.toLowerCase()
    );
    
    setArticles(filteredArticles);
    setLoading(false);
  }, [categoryName]);

  if (loading) {
    return (
      <>
        <Seo title="Category" noindex />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-insightRed"></div>
        </div>
      </>
    );
  }

  if (articles.length === 0) {
    return (
      <>
        <Seo title={`${categoryName || "Category"} Articles`} noindex />
        <div className="min-h-screen bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-insightBlack mb-4">No Articles Found</h1>
              <p className="text-lg text-gray-600 mb-8">
                We couldn't find any articles in the {categoryName} category.
              </p>
              <Link 
                to="/"
                className="inline-flex items-center px-6 py-3 bg-insightRed text-white rounded-md font-medium hover:bg-red-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const formattedCategory = categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : "Category";
  const pageDescription = truncateText(
    `Explore ${articles.length} ${formattedCategory.toLowerCase()} articles covering business insights, leadership strategies, and market trends.`
  );
  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: "Articles", url: `${siteOrigin}/articles` },
        { name: formattedCategory, url: `${siteOrigin}/category/${categoryName || ""}` },
      ])
    : undefined;

  return (
    <>
      <Seo
        title={`${formattedCategory} Articles`}
        description={pageDescription}
        schema={breadcrumbSchema ? [breadcrumbSchema] : undefined}
      />
      <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-insightBlack mb-4 capitalize">
            {categoryName} Articles
          </h1>
          <p className="text-lg text-gray-600">
            Explore our collection of {articles.length} articles in the {categoryName} category
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => (
            <Card key={article.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={article.image}
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
                <h3 className="text-xl font-bold mb-3 group-hover:text-insightRed transition-colors line-clamp-2">{article.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{article.date}</span>
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
