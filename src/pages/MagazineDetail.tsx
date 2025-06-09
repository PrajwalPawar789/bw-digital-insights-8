import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMagazineBySlug } from '@/hooks/useMagazines';
import { useMagazineArticles } from '@/hooks/useMagazineArticles';
import { useArticles } from '@/hooks/useArticles';
import { ChevronLeft, Download, Loader2, BookOpen, ArrowRight } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MagazinePDFViewer from '@/components/MagazinePDFViewer';

const MagazineDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: magazine, isLoading, error } = useMagazineBySlug(slug || '');
  const { data: magazineArticles = [], isLoading: articlesLoading } = useMagazineArticles(magazine?.id || '');
  const { data: allArticles = [] } = useArticles();
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [featuredArticle, setFeaturedArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);

  // Add console logs for debugging
  useEffect(() => {
    console.log("Magazine slug:", slug);
    console.log("Magazine data:", magazine);
    console.log("Loading state:", isLoading);
    console.log("Error state:", error);
  }, [slug, magazine, isLoading, error]);

  useEffect(() => {
    if (magazine && allArticles.length > 0) {
      // Get featured article if exists
      if (magazine.featured_article_id) {
        const featured = allArticles.find(article => article.id === magazine.featured_article_id);
        setFeaturedArticle(featured || null);
      }

      // Get related articles from the same category as magazine articles
      const magazineCategories = magazineArticles.map(ma => ma.articles.category);
      const related = allArticles
        .filter(article => 
          !magazineArticles.some(ma => ma.articles.id === article.id) && // Not already in magazine
          (!magazine.featured_article_id || article.id !== magazine.featured_article_id) && // Not the featured article
          magazineCategories.includes(article.category) // Same category as magazine articles
        )
        .slice(0, 6);
      setRelatedArticles(related);
    }
  }, [magazine, allArticles, magazineArticles]);

  const downloadPdf = async () => {
    if (!magazine?.pdf_url) {
      toast({
        title: "No PDF available",
        description: "This magazine doesn't have a PDF file.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Downloading PDF from:", magazine.pdf_url);
      const response = await fetch(magazine.pdf_url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${magazine.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: "The PDF download has begun.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "Failed to download the PDF file.",
        variant: "destructive",
      });
    }
  };

  const toggleFullScreen = () => setFullScreen(!fullScreen);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-insightRed" />
          <span className="text-lg">Loading magazine...</span>
        </div>
      </div>
    );
  }

  if (error || !magazine) {
    console.log("Magazine not found, redirecting...");
    return (
      <div className="min-h-screen py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-insightBlack mb-4">Magazine Not Found</h1>
          <p className="mb-6 text-gray-600">The magazine you're looking for doesn't exist or the URL is invalid.</p>
          <div className="mb-6">
            <p className="text-sm text-gray-500">Requested slug: <code className="bg-gray-100 px-2 py-1 rounded">{slug}</code></p>
          </div>
          <Link
            to="/magazine"
            className="inline-flex items-center bg-insightRed hover:bg-insightBlack text-white px-6 py-3 rounded-md text-sm font-medium transition-colors"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Magazines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen py-12 transition-all duration-300 bg-white",
      fullScreen ? "fixed inset-0 z-50 p-4 overflow-auto" : ""
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Magazine Header */}
        {!fullScreen && (
          <>
            <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
              <div className="md:w-1/3">
                <img
                  src={magazine.cover_image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'}
                  alt={magazine.title}
                  className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                />
              </div>
              <div className="md:w-2/3">
                <div className="mb-4">
                  <Link
                    to="/magazine"
                    className="inline-flex items-center text-insightRed hover:text-insightBlack transition-colors text-sm font-medium"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" /> Back to Magazines
                  </Link>
                </div>
                <h1 className="text-4xl font-bold text-insightBlack mb-4">{magazine.title}</h1>
                {magazine.issue_number && (
                  <div className="flex items-center gap-4 mb-4">
                    <span className="inline-block px-3 py-1 text-sm font-semibold bg-insightRed text-white rounded-md">
                      Issue {magazine.issue_number}
                    </span>
                    {magazine.featured && (
                      <span className="inline-block px-3 py-1 text-sm font-semibold bg-green-100 text-green-800 rounded-md">
                        Featured
                      </span>
                    )}
                  </div>
                )}
                <p className="text-gray-700 text-lg leading-relaxed mb-6">{magazine.description}</p>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-gray-500">
                    Published: {new Date(magazine.publish_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <div className="flex gap-3">
                    {magazine.pdf_url && (
                      <Button
                        onClick={downloadPdf}
                        className="inline-flex items-center bg-insightBlack hover:bg-insightRed text-white px-6 py-3 rounded-md text-sm font-medium transition-colors"
                      >
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                      </Button>
                    )}
                    <Button
                      onClick={() => document.getElementById('pdf-viewer')?.scrollIntoView({ behavior: 'smooth' })}
                      className="inline-flex items-center bg-insightRed hover:bg-insightBlack text-white px-6 py-3 rounded-md text-sm font-medium transition-colors"
                    >
                      <BookOpen className="mr-2 h-4 w-4" /> Read Online
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Article Section */}
            {featuredArticle && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-insightBlack mb-6">Featured Article</h2>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={featuredArticle.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
                        alt={featuredArticle.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <span className="inline-block px-3 py-1 text-sm font-semibold bg-insightRed text-white rounded-md mb-3">
                        Featured
                      </span>
                      <h3 className="text-xl font-bold mb-3">{featuredArticle.title}</h3>
                      <p className="text-gray-600 mb-4">{featuredArticle.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">By {featuredArticle.author}</span>
                        <Link
                          to={`/article/${featuredArticle.slug}`}
                          className="text-insightRed hover:text-insightBlack font-medium flex items-center"
                        >
                          Read Full Article <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Magazine Articles Section */}
            {!articlesLoading && magazineArticles.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-insightBlack mb-6">Articles in This Issue</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {magazineArticles.map((magazineArticle) => (
                    <div key={magazineArticle.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-gray-200 overflow-hidden">
                        <img
                          src={magazineArticle.articles.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
                          alt={magazineArticle.articles.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-insightRed">
                            Page {magazineArticle.page_number}
                          </span>
                          {magazineArticle.featured && (
                            <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{magazineArticle.articles.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{magazineArticle.articles.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">By {magazineArticle.articles.author}</span>
                          <Link
                            to={`/article/${magazineArticle.articles.slug}`}
                            className="text-insightRed hover:text-insightBlack font-medium text-sm flex items-center"
                          >
                            Read Article <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Articles Section */}
            {relatedArticles.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-insightBlack mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedArticles.map((article) => (
                    <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-gray-200 overflow-hidden">
                        <img
                          src={article.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
                          alt={article.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <span className="text-xs font-medium text-gray-500 mb-2 block">{article.category}</span>
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{article.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">By {article.author}</span>
                          <Link
                            to={`/article/${article.slug}`}
                            className="text-insightRed hover:text-insightBlack font-medium text-sm flex items-center"
                          >
                            Read Article <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* PDF Viewer */}
        <div id="pdf-viewer" className="mb-12">
          <MagazinePDFViewer
            fileUrl={magazine.pdf_url || "/sample-magazine.pdf"}
            title={magazine.title}
            onDownload={downloadPdf}
            onFullScreen={toggleFullScreen}
            fullScreen={fullScreen}
          />
        </div>

        {/* Magazine Information */}
        {!fullScreen && (
          <div>
            <h2 className="text-2xl font-bold text-insightBlack mb-6">About This Issue</h2>
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-700 leading-relaxed text-lg mb-6">
                    {magazine.description || "This magazine issue contains cutting-edge insights and analysis from industry leaders and technology experts."}
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm"><strong className="text-insightBlack">Issue:</strong> {magazine.issue_number || 'Latest'}</p>
                    <p className="text-sm"><strong className="text-insightBlack">Published:</strong> {new Date(magazine.publish_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                    <p className="text-sm"><strong className="text-insightBlack">Articles:</strong> {magazineArticles.length} featured articles</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-semibold mb-4">Online Reading</h3>
                  <div className="space-y-3">
                    <Button
                      onClick={() => window.print()}
                      variant="outline"
                      className="w-full"
                    >
                      Print Current Page
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MagazineDetail;
