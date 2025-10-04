import { Link } from "react-router-dom";
import { useArticles } from "@/hooks/useArticles";
import { useMagazines } from "@/hooks/useMagazines";
import { useLeadershipProfiles } from "@/hooks/useLeadership";
import { usePressReleases } from "@/hooks/usePressReleases";
import { useSettings } from "@/hooks/useSettings";
import { useTestimonials } from "@/hooks/useTestimonials";
import { Quote, Award, TrendingUp, Users, Shield, ArrowRight, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Home = () => {
  const { data: articles = [], isLoading: articlesLoading } = useArticles();
  const { data: magazines = [], isLoading: magazinesLoading } = useMagazines();
  const { settings } = useSettings();
  const { data: leadership = [] } = useLeadershipProfiles();
  const { data: press = [] } = usePressReleases();
  const { data: testimonials = [] } = useTestimonials();

  const featuredBrands = [
    { name: "Brand 1", logo: "/placeholder.svg" },
    { name: "Brand 2", logo: "/placeholder.svg" },
    { name: "Brand 3", logo: "/placeholder.svg" },
    { name: "Brand 4", logo: "/placeholder.svg" },
    { name: "Brand 5", logo: "/placeholder.svg" },
    { name: "Brand 6", logo: "/placeholder.svg" },
  ];

  const features = [
    { icon: Award, title: "Expert Insights", description: "Industry-leading analysis and perspectives" },
    { icon: TrendingUp, title: "Marketing Metrics", description: "Data-driven strategies for growth" },
    { icon: Users, title: "Community Network", description: "Connect with business leaders" },
    { icon: Shield, title: "Sustainable Impact", description: "Building responsible businesses" },
  ];

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
      {/* Hero Section - Testimonial Quote */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Quote className="w-16 h-16 text-insightRed opacity-80" />
              <blockquote className="text-3xl md:text-4xl font-light leading-relaxed">
                "Discovering ideas that will inspire your reality for
                <span className="text-insightRed font-semibold"> tomorrow </span>
                and scale it to achieve
                <span className="text-insightRed font-semibold"> success</span>."
              </blockquote>
              <div className="pt-4">
                <p className="text-xl font-semibold">Michelle Oquma</p>
                <p className="text-gray-400">CEO & Founder</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-insightRed to-red-900 rounded-2xl transform rotate-3"></div>
                <img 
                  src="/placeholder.svg" 
                  alt="Michelle Oquma" 
                  className="relative rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Magazines */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-insightBlack">LATEST MAGAZINES</h2>
            <Link to="/magazine" className="text-insightRed hover:text-insightRed/80 font-semibold flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {magazines.slice(0, 4).map((mag: any) => (
              <Link key={mag.id} to={`/magazine/${mag.slug}`} className="group">
                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <img 
                    src={mag.cover_image_url || "/placeholder.svg"} 
                    alt={mag.title}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="mt-3 text-center">
                  <p className="font-semibold text-sm uppercase tracking-wide">{mag.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(mag.publication_date).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">FEATURED BRANDS</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
            {featuredBrands.map((brand, idx) => (
              <div key={idx} className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                <img src={brand.logo} alt={brand.name} className="h-12 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cover Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-insightBlack mb-12">COVER STORY</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadership.slice(0, 6).map((leader: any) => (
              <Link key={leader.id} to={`/leadership/${leader.slug}`} className="group">
                <Card className="overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-900 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img 
                      src={leader.image_url || "/placeholder.svg"} 
                      alt={leader.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-1">{leader.name}</h3>
                      <p className="text-sm text-gray-300">{leader.title}</p>
                      {leader.company && <p className="text-xs text-gray-400 mt-1">{leader.company}</p>}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Business Minds Media Stands Out */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-insightBlack mb-4">
            {settings.companyName} STANDS OUT
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover what makes us the leading platform for business insights and leadership excellence
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="text-center group">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-insightRed to-red-700 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-insightBlack mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Business News & Press Releases Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Business News - 2/3 width */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-insightBlack">BUSINESS NEWS</h2>
                <Link to="/articles" className="text-insightRed hover:text-insightRed/80 font-semibold flex items-center gap-2">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.slice(0, 4).map((article: any) => (
                  <Link key={article.id} to={`/article/${article.slug}`} className="group">
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                      <div className="aspect-video overflow-hidden bg-gray-900">
                        <img 
                          src={article.image_url || "/placeholder.svg"} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-insightRed font-semibold uppercase tracking-wide mb-2">
                          {article.category}
                        </p>
                        <h3 className="font-bold text-lg line-clamp-2 group-hover:text-insightRed transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(article.date).toLocaleDateString()}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Press Releases - 1/3 width */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-insightBlack">PRESS RELEASES</h2>
              </div>
              
              <div className="space-y-4">
                {press.slice(0, 5).map((item: any) => (
                  <Link 
                    key={item.id} 
                    to={`/press-releases/${item.slug}`}
                    className="block p-4 border-l-4 border-insightRed hover:bg-gray-50 transition-colors"
                  >
                    <p className="text-xs text-insightRed font-semibold uppercase mb-1">{item.category}</p>
                    <h4 className="font-semibold text-sm line-clamp-2 mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blogs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-insightBlack">BLOGS</h2>
            <Link to="/articles" className="text-insightRed hover:text-insightRed/80 font-semibold flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.slice(4, 7).map((article: any) => (
              <Card key={article.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="aspect-video overflow-hidden bg-gradient-to-br from-slate-900 to-slate-700 relative">
                  <img 
                    src={article.image_url || "/placeholder.svg"} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <Link to={`/article/${article.slug}`}>
                      <h3 className="text-white font-bold text-lg line-clamp-2 group-hover:text-insightRed transition-colors">
                        {article.title}
                      </h3>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-insightBlack mb-12">CLIENT TESTIMONIALS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial: any) => (
              <div key={testimonial.id} className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-insightRed shadow-lg mx-auto">
                    <img 
                      src={testimonial.image_url || "/placeholder.svg"} 
                      alt={testimonial.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h4 className="font-bold text-lg text-insightBlack mb-1">{testimonial.author}</h4>
                <p className="text-sm text-gray-500 mb-4">{testimonial.role}</p>
                <p className="text-gray-700 italic leading-relaxed">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonial */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">VIDEO TESTIMONIAL</h2>
          
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
            <img 
              src="/placeholder.svg" 
              alt="Video Thumbnail" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-insightRed flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-10 h-10 text-white ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-20 bg-gradient-to-br from-red-900 via-insightRed to-red-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Subscribe Now</h2>
              <p className="text-xl text-white/90 mb-8">
                Get the latest insights delivered to your inbox monthly
              </p>
              <Link to="/magazine">
                <Button size="lg" className="bg-white text-insightRed hover:bg-gray-100 font-bold px-8 py-6 text-lg">
                  Subscribe Today <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {magazines.slice(0, 3).map((mag: any) => (
                <div key={mag.id} className="transform hover:-translate-y-2 transition-transform duration-300">
                  <img 
                    src={mag.cover_image_url || "/placeholder.svg"} 
                    alt={mag.title}
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
