import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Building2, Globe, TrendingUp, Calendar, User, ExternalLink, Star, Award, Target, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSettings } from '@/hooks/useSettings';
import { useFeaturedMagazines } from '@/hooks/useMagazines';
import { useIndustryNews } from '@/hooks/useIndustryNews';

const Home = () => {
  const { settings } = useSettings();
  const { data: featuredMagazines = [] } = useFeaturedMagazines();
  const { data: industryNews = [], isLoading: newsLoading } = useIndustryNews();

  // Enhanced statistics with credibility focus
  const stats = [
    { icon: Users, label: "Global Subscribers", value: "125,000+", description: "Business leaders worldwide" },
    { icon: Building2, label: "Featured Companies", value: "2,500+", description: "Fortune 500 & emerging leaders" },
    { icon: Globe, label: "Countries", value: "75+", description: "International readership" },
    { icon: Award, label: "Industry Awards", value: "15+", description: "Recognition & excellence" },
  ];

  // Enhanced credibility indicators
  const credibilityFeatures = [
    {
      icon: Star,
      title: "Premium Editorial Quality",
      description: "Curated by industry experts and veteran journalists"
    },
    {
      icon: Target,
      title: "Strategic Business Insights",
      description: "Data-driven analysis that shapes business decisions"
    },
    {
      icon: Zap,
      title: "Exclusive Access",
      description: "Direct interviews with C-suite executives and thought leaders"
    },
    {
      icon: Award,
      title: "Recognized Authority",
      description: "Trusted source for market intelligence and trends"
    }
  ];

  const featuredArticles = [
    {
      id: 1,
      title: "The Future of Digital Banking: How Fintech is Reshaping Financial Services",
      excerpt: "Explore how digital-first banks are revolutionizing customer experience and driving innovation in the financial sector.",
      category: "Finance",
      readTime: "8 min",
      author: "Sarah Johnson",
      date: "2025-01-20",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600",
      slug: "future-digital-banking-fintech-reshaping-financial-services"
    },
    {
      id: 2,
      title: "Sustainable Leadership: CEO Strategies for ESG Implementation",
      excerpt: "Leading CEOs share their strategies for implementing Environmental, Social, and Governance practices that drive both profit and purpose.",
      category: "Leadership",
      readTime: "6 min",
      author: "Michael Chen",
      date: "2025-01-18",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600",
      slug: "sustainable-leadership-ceo-strategies-esg-implementation"
    },
    {
      id: 3,
      title: "AI in Manufacturing: Transforming Production Lines and Supply Chains",
      excerpt: "How artificial intelligence is optimizing manufacturing processes and creating more resilient supply chain networks.",
      category: "Technology",
      readTime: "7 min",
      author: "David Rodriguez",
      date: "2025-01-15",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600",
      slug: "ai-manufacturing-transforming-production-supply-chains"
    }
  ];

  const leadershipProfiles = [
    {
      id: 1,
      name: "Elena Rodriguez",
      title: "CEO, GreenTech Solutions",
      company: "GreenTech Solutions",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
      excerpt: "Leading the charge in renewable energy innovation with breakthrough solar technology solutions.",
      slug: "elena-rodriguez-greentech-solutions-ceo"
    },
    {
      id: 2,
      name: "James Mitchell",
      title: "CTO, DataFlow Systems",
      company: "DataFlow Systems",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      excerpt: "Pioneering data analytics platforms that help enterprises make smarter business decisions.",
      slug: "james-mitchell-dataflow-systems-cto"
    },
    {
      id: 3,
      name: "Priya Patel",
      title: "Founder, HealthBridge",
      company: "HealthBridge",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
      excerpt: "Transforming healthcare delivery through innovative telemedicine and digital health solutions.",
      slug: "priya-patel-healthbridge-founder"
    }
  ];

  const pressReleases = [
    {
      id: 1,
      title: "TechCorp Announces $150M Series C Funding Round",
      excerpt: "Leading enterprise software company secures major funding to accelerate AI-driven product development.",
      date: "2025-01-22",
      company: "TechCorp",
      slug: "techcorp-announces-150m-series-c-funding"
    },
    {
      id: 2,
      title: "Global Manufacturing Leader Acquires Robotics Startup",
      excerpt: "Strategic acquisition aims to enhance automation capabilities and expand into smart manufacturing solutions.",
      date: "2025-01-20",
      company: "IndustrialTech",
      slug: "global-manufacturing-leader-acquires-robotics-startup"
    },
    {
      id: 3,
      title: "Renewable Energy Firm Reports 300% Growth in Q4",
      excerpt: "Solar energy company exceeds projections with record-breaking quarterly performance and expansion plans.",
      date: "2025-01-18",
      company: "SolarDyne",
      slug: "renewable-energy-firm-reports-300-percent-growth-q4"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-insightBlack via-gray-900 to-insightBlack text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-insightRed/20 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-insightRed/20 text-insightRed border-insightRed/30 text-sm px-4 py-2">
              #1 Global Business Intelligence Magazine
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Where Business Leaders
              <span className="block text-insightRed">Get Their Edge</span>
            </h1>
            <p className="max-w-4xl mx-auto text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
              Join 125,000+ executives, entrepreneurs, and industry pioneers who rely on InsightsBW for strategic market intelligence, exclusive interviews, and actionable business insights that drive growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/magazine">
                <Button size="lg" className="bg-insightRed hover:bg-red-700 text-white px-8 py-4 text-lg shadow-xl">
                  Subscribe Now - $29/month
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-insightBlack px-8 py-4 text-lg">
                  Free Sample Issue
                </Button>
              </Link>
            </div>

            {/* Credibility Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {credibilityFeatures.map((feature, index) => (
                <div key={index} className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <feature.icon className="h-6 w-6 mx-auto mb-2 text-insightRed" />
                  <div className="text-sm font-semibold mb-1">{feature.title}</div>
                  <div className="text-xs text-gray-400">{feature.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-insightRed" />
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-gray-400">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4">Why Top Executives Choose InsightsBW</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              In today's fast-paced business environment, staying ahead requires more than just information—it requires intelligence, analysis, and strategic insights that drive real results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-insightRed">
              <CardHeader>
                <Star className="h-8 w-8 text-insightRed mb-2" />
                <CardTitle className="text-xl">Exclusive Access</CardTitle>
                <CardDescription>
                  Direct interviews with Fortune 500 CEOs, emerging market leaders, and industry disruptors sharing their strategies and insights.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-insightRed">
              <CardHeader>
                <Target className="h-8 w-8 text-insightRed mb-2" />
                <CardTitle className="text-xl">Strategic Intelligence</CardTitle>
                <CardDescription>
                  Data-driven market analysis, trend forecasting, and competitive intelligence that inform critical business decisions.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-insightRed">
              <CardHeader>
                <Zap className="h-8 w-8 text-insightRed mb-2" />
                <CardTitle className="text-xl">First-Mover Advantage</CardTitle>
                <CardDescription>
                  Be among the first to discover emerging opportunities, technological breakthroughs, and market shifts before your competitors.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      {settings.homepageSections.featuredArticles && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4">Featured Business Intelligence</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                In-depth analysis and insights from industry experts on the trends shaping business today.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {featuredArticles.map((article) => (
                <Card key={article.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                    />
                    <Badge className="absolute top-4 left-4 bg-insightRed hover:bg-red-700">
                      {article.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-insightRed transition-colors line-clamp-2">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {article.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {article.readTime}
                      </div>
                    </div>
                    <Link to={`/article/${article.slug}`}>
                      <Button variant="outline" className="w-full group-hover:bg-insightRed group-hover:text-white group-hover:border-insightRed">
                        Read Full Article
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/articles">
                <Button size="lg" variant="outline" className="px-8 py-3">
                  View All Articles
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Industry News Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4">Real-Time Market Intelligence</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay informed with the latest developments across key business sectors with our curated news analysis.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {newsLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              industryNews.slice(0, 4).map((news) => (
                <Card key={news.id} className="group hover:shadow-lg transition-all duration-300">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={news.image_url}
                      alt={news.title}
                      className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                    />
                    <Badge className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-xs">
                      {news.industry}
                    </Badge>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm group-hover:text-insightRed transition-colors line-clamp-2">
                      {news.title}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {news.excerpt}
                    </CardDescription>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                      <span>{news.source}</span>
                      <span>{news.date}</span>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
          
          <div className="text-center">
            <Link to="/industry-news">
              <Button size="lg" variant="outline" className="px-8 py-3">
                View All Industry Analysis
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Magazine Section */}
      {settings.homepageSections.latestMagazine && featuredMagazines.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4">Latest Premium Edition</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover exclusive interviews, deep-dive analysis, and strategic insights in our quarterly premium publication.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredMagazines.slice(0, 3).map((magazine, index) => (
                <Card key={magazine.id} className={`group transition-all duration-300 hover:shadow-xl ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
                  <div className={`relative overflow-hidden ${index === 0 ? 'h-80' : 'h-48'}`}>
                    <img
                      src={magazine.cover_image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'}
                      alt={magazine.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <Badge className="absolute top-4 right-4 bg-insightRed hover:bg-red-700">
                      {magazine.issue_number ? `Issue ${magazine.issue_number}` : 'Latest'}
                    </Badge>
                  </div>
                  <CardHeader className={index === 0 ? 'p-8' : 'p-6'}>
                    <CardTitle className={`group-hover:text-insightRed transition-colors ${index === 0 ? 'text-2xl' : 'text-lg'} line-clamp-2`}>
                      {magazine.title}
                    </CardTitle>
                    <CardDescription className={`${index === 0 ? 'text-base' : 'text-sm'} line-clamp-3`}>
                      {magazine.description}
                    </CardDescription>
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                      <span>{new Date(magazine.publish_date).toLocaleDateString()}</span>
                      <Link to={`/magazine/${magazine.slug}`}>
                        <Button size={index === 0 ? 'default' : 'sm'} className="bg-insightRed hover:bg-red-700">
                          Read Issue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link to="/magazine">
                <Button size="lg" variant="outline" className="px-8 py-3">
                  Browse All Premium Issues
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Leadership Profiles Section */}
      {settings.homepageSections.leadershipProfiles && (
        <section className="py-16 bg-insightBlack text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Executive Leadership Spotlight</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Meet the visionary leaders driving innovation and transformation across industries. Get exclusive access to their strategies and insights.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {leadershipProfiles.map((leader) => (
                <Card key={leader.id} className="bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-300">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-56 object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-insightRed transition-colors">
                      {leader.name}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {leader.title}
                    </CardDescription>
                    <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                      {leader.excerpt}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/leadership/${leader.slug}`}>
                      <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-insightBlack">
                        Read Executive Profile
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/leadership">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-insightBlack px-8 py-3">
                  View All Leadership Profiles
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Press Releases Section */}
      {settings.homepageSections.pressReleases && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4">Corporate Announcements & Market Movers</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Breaking news and strategic announcements from leading companies and organizations shaping the business landscape.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {pressReleases.map((release) => (
                <Card key={release.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {release.company}
                      </Badge>
                      <span className="text-xs text-gray-500">{release.date}</span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-insightRed transition-colors line-clamp-2">
                      {release.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {release.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/press-releases/${release.slug}`}>
                      <Button variant="outline" className="w-full group-hover:bg-insightRed group-hover:text-white group-hover:border-insightRed">
                        Read Full Announcement
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/press-releases">
                <Button size="lg" variant="outline" className="px-8 py-3">
                  View All Corporate News
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Newsletter Subscription Section */}
      <section className="py-20 bg-gradient-to-r from-insightRed to-red-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Business Intelligence Elite</h2>
          <p className="text-xl mb-6 text-red-100">
            Get exclusive weekly insights, market intelligence, and strategic analysis delivered to your inbox.
          </p>
          <p className="text-lg mb-8 text-red-200">
            Join 125,000+ CEOs, entrepreneurs, and business leaders who rely on our intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-6">
            <input
              type="email"
              placeholder="Enter your business email"
              className="flex-1 px-6 py-4 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-insightRed hover:bg-gray-100 px-8 py-4 font-semibold">
              Get Free Intelligence
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-6 text-sm text-red-200">
            <span className="flex items-center">
              <Star className="h-4 w-4 mr-1" />
              Free weekly insights
            </span>
            <span className="flex items-center">
              <Target className="h-4 w-4 mr-1" />
              Exclusive market data
            </span>
            <span className="flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              Unsubscribe anytime
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
