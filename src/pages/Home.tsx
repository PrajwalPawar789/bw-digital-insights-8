import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, BookOpen, TrendingUp, Users, Award, Globe, ArrowRight, Play, Quote, Calendar, Eye, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ClientLogos from "@/components/ClientLogos";
import { useMagazines } from "@/hooks/useMagazines";
import { useArticles } from "@/hooks/useArticles";
import { useTestimonials } from "@/hooks/useTestimonials";
import { useUpcomingEditions } from "@/hooks/useUpcomingEditions";

// Enhanced utility functions with fallbacks
function safeGetMagCover(magObj: any) {
  return magObj?.cover_image_url || magObj?.coverImage || magObj?.image_url || "/placeholder.svg";
}

function safeGetMagTitle(magObj: any) {
  return magObj?.title || magObj?.name || "Untitled Edition";
}

function safeGetMagDesc(magObj: any) {
  return magObj?.description || "Exclusive insights for digital leaders";
}

function safeGetMagDate(magObj: any) {
  return magObj?.publish_date || magObj?.publicationDate || new Date().toISOString();
}

function formatDate(dateString: string) {
  if (!dateString) return "Recent";
  try {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  } catch {
    return "Recent";
  }
}

const Home = () => {
  const { data: magazines = [], isLoading: magazinesLoading } = useMagazines();
  const { data: articles = [], isLoading: articlesLoading } = useArticles();
  const { data: testimonials = [], isLoading: testimonialsLoading } = useTestimonials();
  const { data: upcomingEditions = [], isLoading: upcomingLoading } = useUpcomingEditions();
  
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  // Get featured content
  const featuredMagazine = magazines.find(mag => mag.featured) || magazines[0];
  const latestArticles = articles.slice(0, 3);
  const currentTestimonialData = testimonials[currentTestimonial];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Executive Leadership Focus */}
      <section className="hero-executive relative overflow-hidden">
        <div className="container-executive relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            <div className="space-y-8 animate-slide-up-elegant">
              <div className="space-y-4">
                <Badge className="bg-executive-crimson text-white px-4 py-2 text-sm font-medium">
                  Executive Edition
                </Badge>
                <h1 className="text-editorial text-5xl lg:text-7xl font-bold text-white leading-tight">
                  <span className="block">Digital</span>
                  <span className="block text-executive-gold">Leadership</span>
                  <span className="block">Redefined</span>
                </h1>
                <p className="text-xl text-white/90 font-executive max-w-lg leading-relaxed">
                  Exclusive insights, strategic perspectives, and transformative ideas 
                  for today's most influential technology executives.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="btn-authority">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Latest Issue
                </Button>
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Executive Briefing
                </Button>
              </div>

              {/* Executive Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-executive-gold">500K+</div>
                  <div className="text-white/80 text-sm font-executive">Executive Readers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-executive-gold">150+</div>
                  <div className="text-white/80 text-sm font-executive">Fortune 500 Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-executive-gold">25+</div>
                  <div className="text-white/80 text-sm font-executive">Industry Awards</div>
                </div>
              </div>
            </div>

            {/* Featured Magazine Cover */}
            <div className="flex justify-center lg:justify-end">
              {featuredMagazine && (
                <div className="magazine-cover-executive max-w-md animate-fade-in-scale">
                  <img
                    src={safeGetMagCover(featuredMagazine)}
                    alt={safeGetMagTitle(featuredMagazine)}
                    className="w-full h-auto object-cover rounded-xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-editorial font-bold mb-2">
                      {safeGetMagTitle(featuredMagazine)}
                    </h3>
                    <p className="text-sm text-white/90 mb-3">
                      {formatDate(safeGetMagDate(featuredMagazine))}
                    </p>
                    <Button size="sm" className="btn-luxury">
                      Read Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Executive Insights Section */}
      <section className="section-executive bg-executive-platinum">
        <div className="container-executive">
          <div className="text-center mb-16">
            <h2 className="text-editorial text-4xl lg:text-5xl font-bold text-executive-navy mb-6">
              Executive Insights & Analysis
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-executive">
              Deep-dive analysis, strategic frameworks, and actionable intelligence 
              from the world's most successful technology leaders.
            </p>
          </div>

          <Tabs defaultValue="magazines" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12 bg-white shadow-depth-1">
              <TabsTrigger value="magazines" className="font-executive font-medium">
                <BookOpen className="mr-2 h-4 w-4" />
                Magazine Library
              </TabsTrigger>
              <TabsTrigger value="articles" className="font-executive font-medium">
                <TrendingUp className="mr-2 h-4 w-4" />
                Trending Articles
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="font-executive font-medium">
                <Calendar className="mr-2 h-4 w-4" />
                Upcoming Editions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="magazines" className="space-y-8">
              {magazinesLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="card-executive p-6 loading-executive h-80" />
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {magazines.slice(0, 6).map((magazine, index) => (
                    <Card key={magazine.id} className="card-executive group overflow-hidden animate-fade-in-scale" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="relative">
                        <img
                          src={safeGetMagCover(magazine)}
                          alt={safeGetMagTitle(magazine)}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-executive-crimson text-white">
                            <Eye className="mr-1 h-3 w-3" />
                            Premium
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-editorial text-xl font-bold text-executive-navy group-hover:text-executive-crimson transition-colors">
                              {safeGetMagTitle(magazine)}
                            </h3>
                            <p className="text-muted-foreground text-sm font-executive mt-2">
                              {formatDate(safeGetMagDate(magazine))}
                            </p>
                          </div>
                          <p className="text-foreground/80 line-clamp-3 font-executive">
                            {safeGetMagDesc(magazine)}
                          </p>
                          <Link
                            to={`/magazine/${magazine.slug}`}
                            className="inline-flex items-center text-executive-crimson hover:text-executive-navy font-semibold transition-colors group"
                          >
                            Read Full Issue
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="articles" className="space-y-8">
              {articlesLoading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="card-executive p-8 loading-executive h-32" />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {latestArticles.map((article, index) => (
                    <Card key={article.id} className="card-executive hover:shadow-authority transition-all duration-300 animate-slide-up-elegant" style={{ animationDelay: `${index * 150}ms` }}>
                      <CardContent className="p-8">
                        <div className="flex flex-col lg:flex-row gap-6 items-start">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-4">
                              <Badge variant="outline" className="border-executive-sapphire text-executive-sapphire">
                                {article.category || "Executive Briefing"}
                              </Badge>
                              <span className="text-sm text-muted-foreground font-executive">
                                {formatDate(article.created_at)}
                              </span>
                            </div>
                            <h3 className="text-editorial text-2xl font-bold text-executive-navy hover:text-executive-crimson transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-foreground/80 font-executive leading-relaxed">
                              {article.excerpt || article.content?.substring(0, 200) + "..."}
                            </p>
                            <Link
                              to={`/article/${article.slug}`}
                              className="inline-flex items-center text-executive-crimson hover:text-executive-navy font-semibold transition-colors group"
                            >
                              Continue Reading
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </div>
                          {article.image_url && (
                            <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden">
                              <img
                                src={article.image_url}
                                alt={article.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/placeholder.svg";
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-8">
              {upcomingLoading ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="card-executive p-6 loading-executive h-48" />
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {upcomingEditions.slice(0, 4).map((edition, index) => (
                    <Card key={edition.id} className="card-luxury text-white overflow-hidden animate-authority-glow" style={{ animationDelay: `${index * 200}ms` }}>
                      <CardContent className="p-8">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge className="bg-executive-gold text-executive-navy">
                              Coming Soon
                            </Badge>
                            <Calendar className="h-5 w-5 text-executive-gold" />
                          </div>
                          <h3 className="text-editorial text-xl font-bold">
                            {edition.title}
                          </h3>
                          <p className="text-white/90 font-executive">
                            {edition.description}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-white/20">
                            <span className="text-sm text-white/80 font-executive">
                              {formatDate(edition.release_date)}
                            </span>
                            <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20">
                              Notify Me
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Executive Testimonials */}
      {testimonials.length > 0 && currentTestimonialData && (
        <section className="section-executive bg-executive-navy text-white">
          <div className="container-executive">
            <div className="text-center max-w-4xl mx-auto">
              <Quote className="h-16 w-16 text-executive-gold mx-auto mb-8 opacity-60" />
              <blockquote className="text-editorial text-2xl lg:text-3xl font-medium leading-relaxed mb-8 animate-fade-in-scale">
                "{currentTestimonialData.quote}"
              </blockquote>
              <div className="flex items-center justify-center space-x-4 animate-slide-up-elegant">
                {currentTestimonialData.avatar_url && (
                  <img
                    src={currentTestimonialData.avatar_url}
                    alt={currentTestimonialData.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-executive-gold"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                )}
                <div className="text-left">
                  <div className="font-executive font-semibold text-lg text-executive-gold">
                    {currentTestimonialData.name}
                  </div>
                  <div className="text-white/80 font-executive">
                    {currentTestimonialData.title} • {currentTestimonialData.company}
                  </div>
                </div>
              </div>
              
              {/* Testimonial Navigation */}
              <div className="flex justify-center space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-executive-gold' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Client Logos Section */}
      <section className="py-16 bg-white">
        <div className="container-executive">
          <div className="text-center mb-12">
            <h2 className="text-editorial text-3xl font-bold text-executive-navy mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-muted-foreground font-executive">
              Executives from the world's most innovative companies rely on our insights
            </p>
          </div>
          <ClientLogos />
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-executive bg-gradient-authority text-white">
        <div className="container-executive text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-editorial text-4xl lg:text-5xl font-bold">
              Join the Executive Circle
            </h2>
            <p className="text-xl font-executive leading-relaxed text-white/90">
              Get exclusive access to executive briefings, strategic insights, and 
              transformative ideas that drive the future of technology leadership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-luxury">
                <Star className="mr-2 h-5 w-5" />
                Start Free Executive Trial
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/20">
                <Users className="mr-2 h-5 w-5" />
                Request Executive Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;