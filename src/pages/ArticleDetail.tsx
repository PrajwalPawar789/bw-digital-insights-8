
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { newsData } from '../data/newsData';
import { ChevronLeft, Calendar, User, Clock, Share2, Bookmark, MessageSquare, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState(newsData.find(article => article.id === Number(id)));
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<typeof newsData>([]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    // Find related articles (same category)
    if (article) {
      const related = newsData
        .filter(a => a.id !== article.id && a.category === article.category)
        .slice(0, 3);
      setRelatedArticles(related);
    }
    
    return () => clearTimeout(timer);
  }, [article]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Article link copied to clipboard",
        duration: 3000,
      });
    }
  };

  const handleBookmark = () => {
    toast({
      title: "Article bookmarked!",
      description: "This article has been saved to your bookmarks",
      duration: 3000,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-insightRed"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-insightBlack mb-4">Article Not Found</h1>
          <p className="mb-6">The article you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-flex items-center bg-insightRed hover:bg-insightBlack text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-insightRed hover:text-insightBlack transition-colors text-sm font-medium"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Home
          </Link>
        </div>
        
        {/* Article Header */}
        <div className="mb-8">
          <span className="inline-block px-3 py-1 text-sm font-semibold bg-insightRed text-white rounded-md mb-4">
            {article.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4 leading-tight">{article.title}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4 mb-6">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" /> {article.author}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" /> {article.date}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" /> 5 min read
            </div>
          </div>
          
          <p className="text-lg text-gray-700 leading-relaxed">{article.excerpt}</p>
          
          <div className="flex items-center mt-6 space-x-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" /> Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleBookmark}>
              <Bookmark className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        </div>
        
        {/* Featured Image */}
        <div className="rounded-lg overflow-hidden mb-8 shadow-md">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Article Content */}
        <div className="prose max-w-none text-gray-700 mb-12">
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">{article.content}</p>
            
            {/* Add some more content paragraphs to make the article look more realistic */}
            <p className="text-gray-700 leading-relaxed">
              Industry experts have been closely monitoring these developments, with many pointing to significant 
              implications for market dynamics in the coming quarters. "This represents a pivotal shift in how 
              businesses approach their strategic planning," notes financial analyst Sarah Chen.
            </p>
            
            <h2 className="text-2xl font-bold text-insightBlack mt-8 mb-4">Market Impact Analysis</h2>
            
            <p className="text-gray-700 leading-relaxed">
              The immediate market response has been cautiously optimistic, with key indicators suggesting a 
              measured approach from investors. Long-term projections, however, point to substantial growth 
              potential particularly in emerging market segments.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              As companies navigate this changing landscape, adaptation and innovation remain critical success 
              factors. Those able to leverage these insights will likely emerge as industry leaders in the 
              next wave of market evolution.
            </p>
          </div>
          
          {/* Tags */}
          <div className="flex items-center mt-8 mb-4">
            <Tag className="h-4 w-4 mr-2 text-gray-600" />
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">Industry Insights</span>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">Business Strategy</span>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">Market Trends</span>
            </div>
          </div>
          
          {/* Comments Section Teaser */}
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-5 w-5 mr-2 text-insightRed" />
              <h3 className="text-xl font-semibold text-insightBlack">Join the Conversation</h3>
            </div>
            <p className="text-gray-600 mb-4">Share your thoughts on this article and connect with other readers.</p>
            <Button className="bg-insightRed hover:bg-insightBlack text-white transition-colors">
              Leave a Comment
            </Button>
          </div>
        </div>
        
        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-bold text-insightBlack mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map(relatedArticle => (
                <Link 
                  key={relatedArticle.id} 
                  to={`/article/${relatedArticle.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-insightBlack group-hover:text-insightRed transition-colors mb-2 line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{relatedArticle.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;
