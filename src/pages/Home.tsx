import { Link } from "react-router-dom";
import { useArticles } from "@/hooks/useArticles";
import { useMagazines } from "@/hooks/useMagazines";
import { useSettings } from "@/hooks/useSettings";
import { Quote } from "lucide-react";

const Home = () => {
  const { data: articles = [], isLoading: articlesLoading } = useArticles();
  const { data: magazines = [], isLoading: magazinesLoading } = useMagazines();
  const { settings } = useSettings();

  if (articlesLoading || magazinesLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-insightRed mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Executive Quote */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-insightRed rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl"></div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Quote */}
            <div className="space-y-8">
              <div className="inline-block">
                <Quote className="w-16 h-16 md:w-20 md:h-20 text-insightRed opacity-80" />
              </div>
              
              <div className="space-y-6">
                <blockquote className="text-2xl md:text-4xl lg:text-5xl font-light leading-relaxed">
                  <span className="block mb-4">
                    Discovering ideas that will inspire your reality for
                  </span>
                  <span className="text-insightRed font-semibold">tomorrow</span>
                  <span className="block mt-4">
                    and scale it to achieve
                  </span>
                  <span className="text-insightRed font-semibold">success</span>
                  <span>.</span>
                </blockquote>
                
                <div className="pt-6 border-t border-white/20">
                  <p className="text-xl md:text-2xl font-semibold mb-2">Michelle Oquma</p>
                  <p className="text-gray-400 text-lg">CEO & Founder</p>
                </div>
              </div>
            </div>
            
            {/* Right Column - Image */}
            <div className="relative">
              <div className="relative w-full max-w-lg mx-auto lg:ml-auto">
                {/* Decorative background element */}
                <div className="absolute -inset-4 bg-gradient-to-br from-insightRed/30 to-purple-600/30 rounded-3xl transform rotate-3 blur-xl"></div>
                
                {/* Main image container */}
                <div className="relative bg-gradient-to-br from-insightRed to-red-800 rounded-2xl p-1 transform hover:scale-105 transition-transform duration-500">
                  <div className="bg-gray-900 rounded-2xl overflow-hidden">
                    <img 
                      src="/placeholder.svg" 
                      alt="Michelle Oquma - CEO & Founder" 
                      className="w-full h-auto aspect-[3/4] object-cover"
                    />
                  </div>
                </div>
                
                {/* Floating accent */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-insightRed rounded-full opacity-20 blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Temporary placeholder for other sections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">More sections coming...</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((article: any) => (
              <Link 
                key={article.id} 
                to={`/article/${article.slug}`}
                className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
              >
                <img 
                  src={article.image_url || "/placeholder.svg"} 
                  alt={article.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600">{article.category}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
