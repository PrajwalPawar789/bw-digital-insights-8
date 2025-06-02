
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, FileText, TrendingUp, Star, Calendar, User, Globe, Award, Zap, Target, ChevronRight, Play, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ClientLogos from "@/components/ClientLogos";
import { useFeaturedArticles } from "@/hooks/useArticles";
import { useFeaturedMagazines } from "@/hooks/useMagazines";
import { useFeaturedLeadership } from "@/hooks/useLeadership";

const Home = () => {
  const { data: featuredArticles = [] } = useFeaturedArticles();
  const { data: featuredMagazines = [] } = useFeaturedMagazines();
  const { data: featuredLeaders = [] } = useFeaturedLeadership();

  const stats = [
    {
      icon: <Globe className="h-8 w-8 text-insightRed" />,
      value: "50+",
      label: "Countries Reached",
      description: "Global executive readership across continents"
    },
    {
      icon: <Users className="h-8 w-8 text-insightRed" />,
      value: "500+",
      label: "C-Suite Leaders",
      description: "Featured executives from Fortune 500 companies"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-insightRed" />,
      value: "50+",
      label: "Magazine Issues",
      description: "Quarterly publications with industry insights"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-insightRed" />,
      value: "2M+",
      label: "Monthly Readers",
      description: "Trusted by executives worldwide"
    }
  ];

  const testimonials = [
    {
      quote: "Executive Insights has transformed how I approach strategic decision-making. The depth of analysis and forward-thinking perspectives are unmatched.",
      author: "Sarah Chen",
      title: "CEO, TechVenture Corp",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100"
    },
    {
      quote: "This magazine consistently delivers the strategic insights I need to stay ahead in today's rapidly evolving business landscape.",
      author: "Marcus Rodriguez",
      title: "Chief Strategy Officer, Global Dynamics",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-insightBlack via-gray-900 to-insightBlack text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2074&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-insightBlack/80 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-insightRed/20 border border-insightRed/30 rounded-full text-sm font-medium">
                <Award className="h-4 w-4 mr-2 text-insightRed" />
                Trusted by Fortune 500 Leaders
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Strategic
                <span className="text-insightRed block"> Insights</span>
                <span className="text-gray-300 text-3xl md:text-4xl block mt-4">
                  for Visionary Leaders
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                Unlock transformative strategies, cutting-edge innovations, and exclusive leadership insights from the world's most influential C-suite executives.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Button size="lg" className="bg-insightRed hover:bg-red-700 text-white px-8 py-4 text-lg group">
                  <Link to="/magazine" className="flex items-center">
                    Explore Premium Content
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-insightBlack px-8 py-4 text-lg group">
                  <Play className="h-5 w-5 mr-2" />
                  <Link to="/leadership">Watch Leadership Stories</Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">2M+</div>
                  <div className="text-sm text-gray-400">Global Readers</div>
                </div>
                <div className="w-px h-8 bg-gray-600"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-gray-400">C-Suite Leaders</div>
                </div>
                <div className="w-px h-8 bg-gray-600"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm text-gray-400">Countries</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                {featuredMagazines.slice(0, 4).map((magazine, index) => (
                  <Link 
                    key={magazine.id} 
                    to={`/magazine/${magazine.slug}`} 
                    className={`relative group ${index % 2 === 1 ? 'mt-12' : ''} transform hover:scale-105 transition-all duration-300`}
                  >
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                      <img
                        src={magazine.cover_image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
                        alt={magazine.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-semibold text-sm mb-1">{magazine.title}</p>
                        <div className="flex items-center text-white/80 text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(magazine.publish_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-insightRed text-white text-xs">
                          Issue #{magazine.issue_number}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-insightRed/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-blue-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-insightBlack mb-6">
              Trusted by Global Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join the executive community that relies on our insights to drive innovation and transformation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-insightRed/10 rounded-2xl group-hover:bg-insightRed/20 transition-colors">
                      {stat.icon}
                    </div>
                  </div>
                  <CardTitle className="text-4xl font-bold text-insightBlack mb-2">{stat.value}</CardTitle>
                  <h3 className="font-semibold text-insightBlack text-lg">{stat.label}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Picks Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="p-3 bg-insightRed/10 rounded-full mr-4">
                <Star className="h-8 w-8 text-insightRed" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-insightBlack">
                Editorial Excellence
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Handpicked articles by our editorial team featuring the most impactful insights, strategies, and thought leadership from industry pioneers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredArticles.slice(0, 3).map((article, index) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 group border-0 shadow-lg bg-white">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={article.image_url || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-insightRed text-white shadow-lg">
                      <Star className="h-3 w-3 mr-1" />
                      Editor's Choice
                    </Badge>
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <Badge variant="secondary" className="bg-white/95 text-insightBlack font-medium">
                      {article.category}
                    </Badge>
                  </div>
                  <div className="absolute top-6 right-6">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl group-hover:text-insightRed transition-colors line-clamp-2 leading-tight">
                    <Link to={`/article/${article.slug}`}>
                      {article.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-gray-600 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span className="font-medium">{article.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Link
                    to={`/article/${article.slug}`}
                    className="inline-flex items-center text-insightRed hover:text-insightBlack font-semibold text-sm group"
                  >
                    Read Full Article
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" className="border-2 border-insightRed text-insightRed hover:bg-insightRed hover:text-white px-8 py-4 text-lg group">
              <Link to="/articles" className="flex items-center">
                Explore All Articles
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Leadership Excellence */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-insightBlack mb-6">
              Visionary Leadership
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Meet the transformational leaders who are reshaping industries, driving innovation, and setting new standards for executive excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredLeaders.slice(0, 3).map((leader, index) => (
              <Card key={leader.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 group border-0 shadow-lg">
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={leader.image_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400'}
                    alt={leader.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{leader.name}</h3>
                    <p className="text-lg opacity-90 mb-2">{leader.title}</p>
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 mr-2 text-insightRed" />
                      <span className="text-sm">Featured Leader</span>
                    </div>
                  </div>
                  <div className="absolute top-6 right-6">
                    <Badge className="bg-insightRed text-white">
                      Executive
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {leader.bio.substring(0, 120)}...
                  </p>
                  <Link
                    to={`/leadership/${leader.slug}`}
                    className="inline-flex items-center text-insightRed hover:text-insightBlack font-semibold text-sm group"
                  >
                    Read Full Profile
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" className="border-2 border-insightRed text-insightRed hover:bg-insightRed hover:text-white px-8 py-4 text-lg group">
              <Link to="/leadership" className="flex items-center">
                Meet All Leaders
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-insightBlack text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See what top executives are saying about Executive Insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-8">
                  <Quote className="h-8 w-8 text-insightRed mb-4" />
                  <p className="text-lg leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-gray-300 text-sm">{testimonial.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <ClientLogos />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-insightBlack via-gray-900 to-insightBlack text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2074&q=80')] bg-cover bg-center opacity-5"></div>
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center px-6 py-3 bg-insightRed/20 border border-insightRed/30 rounded-full text-sm font-medium mb-8">
            <Target className="h-4 w-4 mr-2 text-insightRed" />
            Join the Executive Network
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Ready to Transform Your
            <span className="text-insightRed block">Leadership Journey?</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-4xl mx-auto">
            Join thousands of C-suite executives who rely on our strategic insights to drive innovation, growth, and transformational change in their organizations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-insightRed hover:bg-red-700 text-white px-10 py-4 text-lg group">
              <Link to="/magazine" className="flex items-center">
                Start Your Subscription
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-insightBlack px-10 py-4 text-lg">
              <Link to="/contact">
                Schedule a Consultation
              </Link>
            </Button>
          </div>

          <div className="mt-12 text-center text-gray-400">
            <p className="text-sm">Trusted by executives at</p>
            <div className="flex items-center justify-center gap-8 mt-4 opacity-60">
              <span className="text-lg font-semibold">Fortune 500</span>
              <div className="w-px h-4 bg-gray-600"></div>
              <span className="text-lg font-semibold">Global 2000</span>
              <div className="w-px h-4 bg-gray-600"></div>
              <span className="text-lg font-semibold">Unicorn Startups</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
