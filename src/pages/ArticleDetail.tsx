
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useArticleBySlug, useArticles } from '@/hooks/useArticles';
import { ChevronLeft, Calendar, User, Clock, Share2, Bookmark, MessageSquare, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from 'date-fns';

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: article, isLoading, error } = useArticleBySlug(slug || '');
  const { data: allArticles = [] } = useArticles();
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (article && allArticles.length > 0) {
      const related = allArticles
        .filter(a => a.slug !== slug && a.category === article.category)
        .slice(0, 3);
      setRelatedArticles(related);
    }
  }, [article, allArticles, slug]);

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

  const handleRelatedArticleClick = (articleSlug: string) => {
    navigate(`/article/${articleSlug}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-insightRed"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-insightBlack mb-4">Article Not Found</h1>
          <p className="mb-6">The article you're looking for doesn't exist or has been removed.</p>
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
    <div className="min-h-screen py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-insightRed hover:text-insightBlack transition-colors text-sm font-medium group"
          >
            <ChevronLeft className="mr-1 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" /> 
            Back to Home
          </Link>
        </div>
        
        <div className="mb-8 animate-fade-in">
          <span className="inline-block px-3 py-1 text-sm font-semibold bg-insightRed text-white rounded-full mb-4">
            {article.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4 mb-6">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" /> {article.author}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" /> {formatDistanceToNow(new Date(article.date), { addSuffix: true })}
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
        
        <div className="rounded-lg overflow-hidden mb-8 shadow-md transform hover:scale-[1.02] transition-transform duration-500">
          <img
            src={article.image_url || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'}
            alt={article.title}
            className="w-full h-auto object-cover"
          />
        </div>
        
        <div className="prose max-w-none text-gray-700 mb-12">
          <div className="space-y-6">
            <div className="text-gray-700 leading-relaxed animate-fade-in whitespace-pre-line">
              {article.content}
            </div>
          </div>
          
          <div className="flex items-center mt-8 mb-4 animate-fade-in">
            <Tag className="h-4 w-4 mr-2 text-gray-600" />
            <div className="flex flex-wrap gap-2">
              {['Industry Insights', 'Business Strategy', 'Market Trends'].map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-12 bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
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
        
        {relatedArticles.length > 0 && (
          <div className="border-t border-gray-200 pt-10 animate-fade-in">
            <h2 className="text-2xl font-bold text-insightBlack mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map(relatedArticle => (
                <div 
                  key={relatedArticle.id}
                  onClick={() => handleRelatedArticleClick(relatedArticle.slug)}
                  className="cursor-pointer group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={relatedArticle.image_url || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400'}
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-insightBlack group-hover:text-insightRed transition-colors mb-2 line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{relatedArticle.excerpt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;
