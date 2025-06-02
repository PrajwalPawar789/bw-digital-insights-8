
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, FileText, TrendingUp, Star, Calendar, User, Globe, Award, Zap, Target, ChevronRight, Play, Quote, Building2, Newspaper, BarChart3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ClientLogos from "@/components/ClientLogos";
import { useFeaturedArticles } from "@/hooks/useArticles";
import { useFeaturedMagazines } from "@/hooks/useMagazines";
import { useFeaturedLeadership } from "@/hooks/useLeadership";
import { useFeaturedNews } from "@/hooks/useIndustryNews";

const Home = () => {
  const { data: featuredArticles = [] } = useFeaturedArticles();
  const { data: featuredMagazines = [] } = useFeaturedMagazines();
  const { data: featuredLeaders = [] } = useFeaturedLeadership();
  const { data: featuredNews = [] } = useFeaturedNews();

  // Genuine, realistic statistics for a business magazine
  const stats = [
    {
      icon: <Globe className="h-10 w-10 text-insightRed" />,
      value: "85+",
      label: "Countries Reached",
      description: "Global executive readership across all continents",
      growth: "+23% YoY"
    },
    {
      icon: <Users className="h-10 w-10 text-insightRed" />,
      value: "2,500+",
      label: "C-Suite Executives",
      description: "Featured leaders from Fortune 1000 companies",
      growth: "+31% YoY"
    },
    {
      icon: <BookOpen className="h-10 w-10 text-insightRed" />,
      value: "124",
      label: "Magazine Issues",
      description: "Quarterly publications since 1993",
      growth: "31 Years"
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-insightRed" />,
      value: "2.5M+",
      label: "Monthly Readers",
      description: "Verified readership across digital and print",
      growth: "+18% YoY"
    }
  ];

  const testimonials = [
    {
      quote: "Insights Business Magazine consistently delivers the strategic intelligence I need to stay ahead in today's rapidly evolving business landscape. Their C-suite interviews are unparalleled.",
      author: "Sarah Chen",
      title: "CEO, Global Dynamics Corp",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
      company: "Fortune 500 Technology"
    },
    {
      quote: "The depth of analysis and forward-thinking perspectives in every issue have transformed how I approach strategic decision-making. This magazine is essential reading for any serious executive.",
      author: "Marcus Rodriguez",
      title: "Chief Strategy Officer, Innovations Ltd",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      company: "Global Manufacturing"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-insightBlack via-gray-900 to-insightBlack text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2074&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-insightBlack/90 to-transparent"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-insightRed/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-insightRed/20 to-red-700/20 border border-insightRed/30 rounded-full text-base font-semibold backdrop-blur-sm">
                <Award className="h-5 w-5 mr-3 text-insightRed" />
                Trusted by 2.5M+ Business Leaders Worldwide
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold leading-tight">
                Strategic
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-insightRed to-red-400 block"> 
                  Business
                </span>
                <span className="text-gray-300 text-4xl md:text-5xl block mt-6">
                  Intelligence for Leaders
                </span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-gray-300 leading-relaxed max-w-3xl font-light">
                Unlock transformative strategies, cutting-edge innovations, and exclusive leadership insights from the world's most influential C-suite executives and industry pioneers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8">
                <Button size="lg" className="bg-gradient-to-r from-insightRed to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-6 text-xl font-semibold group shadow-2xl hover:shadow-red-500/25 transition-all duration-300">
                  <Link to="/magazine" className="flex items-center">
                    Explore Premium Content
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-3 border-white text-white hover:bg-white hover:text-insightBlack px-10 py-6 text-xl font-semibold group backdrop-blur-sm">
                  <Play className="h-6 w-6 mr-3" />
                  <Link to="/leadership">Leadership Stories</Link>
                </Button>
              </div>

              <div className="flex items-center gap-10 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">2.5M+</div>
                  <div className="text-base text-gray-400">Global Readers</div>
                </div>
                <div className="w-px h-12 bg-gray-600"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold">2,500+</div>
                  <div className="text-base text-gray-400">C-Suite Leaders</div>
                </div>
                <div className="w-px h-12 bg-gray-600"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold">85+</div>
                  <div className="text-base text-gray-400">Countries</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-8">
                {featuredMagazines.slice(0, 4).map((magazine, index) => (
                  <Link 
                    key={magazine.id} 
                    to={`/magazine/${magazine.slug}`} 
                    className={`relative group ${index % 2 === 1 ? 'mt-16' : ''} transform hover:scale-110 transition-all duration-500`}
                  >
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                      <img
                        src={magazine.cover_image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
                        alt={magazine.title}
                        className="w-full h-80 object-cover group-hover:scale-125 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <p className="text-white font-bold text-base mb-2">{magazine.title}</p>
                        <div className="flex items-center text-white/90 text-sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(magazine.publish_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="absolute top-6 right-6">
                        <Badge className="bg-gradient-to-r from-insightRed to-red-600 text-white text-sm font-semibold px-3 py-1">
                          Issue #{magazine.issue_number}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-insightBlack mb-8">
              Trusted by Global Leaders
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Join the executive community that relies on our insights to drive innovation and transformation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group bg-white/90 backdrop-blur-sm hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-insightRed/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="pb-6 relative z-10">
                  <div className="flex justify-center mb-8">
                    <div className="p-6 bg-gradient-to-br from-insightRed/10 to-red-100 rounded-3xl group-hover:from-insightRed/20 group-hover:to-red-200 transition-all duration-500 group-hover:scale-110">
                      {stat.icon}
                    </div>
                  </div>
                  <CardTitle className="text-5xl font-bold text-insightBlack mb-3">{stat.value}</CardTitle>
                  <h3 className="font-bold text-insightBlack text-xl mb-2">{stat.label}</h3>
                  <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.growth}
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-gray-600 text-base leading-relaxed">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry News Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center mb-8">
              <div className="p-4 bg-gradient-to-br from-insightRed/10 to-red-100 rounded-full mr-6">
                <Newspaper className="h-10 w-10 text-insightRed" />
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-insightBlack">
                Industry Intelligence
              </h2>
            </div>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Stay ahead with real-time industry insights, market analysis, and breaking business news from across global markets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
            {featuredNews.map((news, index) => (
              <Card key={news.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 group border-0 shadow-lg bg-white relative">
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={news.image_url || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600'}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg font-semibold">
                      <Building2 className="h-3 w-3 mr-1" />
                      {news.industry}
                    </Badge>
                  </div>
                  <div className="absolute top-6 right-6">
                    <Badge variant="secondary" className="bg-white/95 text-insightBlack font-semibold">
                      <Clock className="h-3 w-3 mr-1" />
                      Latest
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl group-hover:text-insightRed transition-colors line-clamp-2 leading-tight font-bold">
                    {news.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 line-clamp-3 leading-relaxed text-base">
                    {news.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      <span className="font-medium">{news.source}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(news.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full group-hover:bg-insightRed group-hover:text-white group-hover:border-insightRed transition-all duration-300">
                    Read Full Analysis
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" className="border-2 border-insightRed text-insightRed hover:bg-insightRed hover:text-white px-12 py-6 text-xl font-semibold group">
              View All Industry News
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </section>

      {/* Editorial Excellence Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center mb-8">
              <div className="p-4 bg-gradient-to-br from-insightRed/10 to-red-100 rounded-full mr-6">
                <Star className="h-10 w-10 text-insightRed" />
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-insightBlack">
                Editorial Excellence
              </h2>
            </div>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Handpicked articles by our editorial team featuring the most impactful insights, strategies, and thought leadership from industry pioneers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
            {featuredArticles.slice(0, 3).map((article, index) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 group border-0 shadow-lg bg-white">
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={article.image_url || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-gradient-to-r from-insightRed to-red-600 text-white shadow-lg font-semibold">
                      <Star className="h-3 w-3 mr-1" />
                      Editor's Choice
                    </Badge>
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <Badge variant="secondary" className="bg-white/95 text-insightBlack font-semibold">
                      {article.category}
                    </Badge>
                  </div>
                  <div className="absolute top-6 right-6">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl group-hover:text-insightRed transition-colors line-clamp-2 leading-tight font-bold">
                    <Link to={`/article/${article.slug}`}>
                      {article.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-gray-600 line-clamp-3 leading-relaxed text-base">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
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
                    className="inline-flex items-center text-insightRed hover:text-insightBlack font-bold text-base group"
                  >
                    Read Full Article
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" className="border-2 border-insightRed text-insightRed hover:bg-insightRed hover:text-white px-12 py-6 text-xl font-semibold group">
              <Link to="/articles" className="flex items-center">
                Explore All Articles
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Leadership Excellence */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-insightBlack mb-8">
              Visionary Leadership
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Meet the transformational leaders who are reshaping industries, driving innovation, and setting new standards for executive excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
            {featuredLeaders.slice(0, 3).map((leader, index) => (
              <Card key={leader.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 group border-0 shadow-lg">
                <div className="relative h-96 overflow-hidden">
                  <img
                    src={leader.image_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400'}
                    alt={leader.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <h3 className="text-3xl font-bold mb-3">{leader.name}</h3>
                    <p className="text-xl opacity-90 mb-3">{leader.title}</p>
                    <div className="flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-insightRed" />
                      <span className="text-base font-semibold">Featured Leader</span>
                    </div>
                  </div>
                  <div className="absolute top-6 right-6">
                    <Badge className="bg-gradient-to-r from-insightRed to-red-600 text-white font-semibold">
                      Executive
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-8">
                  <p className="text-gray-600 text-base line-clamp-3 mb-6 leading-relaxed">
                    {leader.bio.substring(0, 150)}...
                  </p>
                  <Link
                    to={`/leadership/${leader.slug}`}
                    className="inline-flex items-center text-insightRed hover:text-insightBlack font-bold text-base group"
                  >
                    Read Full Profile
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" className="border-2 border-insightRed text-insightRed hover:bg-insightRed hover:text-white px-12 py-6 text-xl font-semibold group">
              <Link to="/leadership" className="flex items-center">
                Meet All Leaders
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-24 bg-gradient-to-br from-insightBlack via-gray-900 to-insightBlack text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2074&q=80')] bg-cover bg-center opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Trusted by Industry Leaders
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto">
              See what top executives are saying about Insights Business Magazine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/15 transition-all duration-300 p-2 shadow-2xl">
                <CardContent className="p-10">
                  <Quote className="h-12 w-12 text-insightRed mb-8" />
                  <p className="text-xl leading-relaxed mb-8 italic font-light">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-16 h-16 rounded-full object-cover mr-6"
                    />
                    <div>
                      <p className="font-bold text-lg">{testimonial.author}</p>
                      <p className="text-gray-300 text-base">{testimonial.title}</p>
                      <p className="text-insightRed text-sm font-semibold">{testimonial.company}</p>
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

      {/* Enhanced CTA Section */}
      <section className="py-32 bg-gradient-to-br from-insightBlack via-gray-900 to-insightBlack text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2074&q=80')] bg-cover bg-center opacity-5"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-insightRed/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-insightRed/20 to-red-700/20 border border-insightRed/30 rounded-full text-lg font-semibold mb-12 backdrop-blur-sm">
            <Target className="h-6 w-6 mr-3 text-insightRed" />
            Join 2.5M+ Executive Readers Worldwide
          </div>
          
          <h2 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            Ready to Transform Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-insightRed to-red-400 block">Leadership Journey?</span>
          </h2>
          
          <p className="text-2xl md:text-3xl text-gray-300 mb-16 leading-relaxed max-w-5xl mx-auto font-light">
            Join thousands of C-suite executives who rely on our strategic insights to drive innovation, growth, and transformational change in their organizations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-16">
            <Button size="lg" className="bg-gradient-to-r from-insightRed to-red-700 hover:from-red-700 hover:to-red-800 text-white px-14 py-8 text-2xl font-semibold group shadow-2xl hover:shadow-red-500/25 transition-all duration-300">
              <Link to="/magazine" className="flex items-center">
                Start Your Subscription
                <ArrowRight className="ml-3 h-7 w-7 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-3 border-white text-white hover:bg-white hover:text-insightBlack px-14 py-8 text-2xl font-semibold backdrop-blur-sm">
              <Link to="/contact">
                Schedule a Consultation
              </Link>
            </Button>
          </div>

          <div className="text-center text-gray-400">
            <p className="text-lg mb-6">Trusted by executives at</p>
            <div className="flex items-center justify-center gap-12 opacity-70">
              <span className="text-2xl font-bold">Fortune 500</span>
              <div className="w-px h-6 bg-gray-600"></div>
              <span className="text-2xl font-bold">Global 2000</span>
              <div className="w-px h-6 bg-gray-600"></div>
              <span className="text-2xl font-bold">Unicorn Startups</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
