import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Building2, Globe, TrendingUp, Calendar, User, ExternalLink } from 'lucide-react';
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

  // Realistic and genuine statistics
  const stats = [
    { icon: Users, label: "Global Subscribers", value: "47,500+", description: "Business leaders worldwide" },
    { icon: Building2, label: "Featured Companies", value: "850+", description: "Fortune 1000 & emerging leaders" },
    { icon: Globe, label: "Countries", value: "42", description: "International readership" },
    { icon: TrendingUp, label: "Monthly Readers", value: "125K+", description: "Digital & print combined" },
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-insightBlack via-gray-900 to-insightBlack text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-insightRed/20 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              The Voice of Business
              <span className="block text-insightRed">Leadership</span>
            </h1>
            <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
              Exclusive insights from Fortune 500 CEOs, emerging market leaders, and industry pioneers shaping tomorrow's business landscape.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/magazine">
                <Button size="lg" className="bg-insightRed hover:bg-red-700 text-white px-8 py-4 text-lg">
                  Read Latest Issue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-insightBlack px-8 py-4 text-lg">
                  About Us
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-insightRed" />
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-gray-400">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      {settings.homepageSections.featuredArticles && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4">Featured Articles</h2>
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4">Industry News & Analysis</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay informed with the latest developments across key business sectors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {newsLoading ? (
              // Loading skeleton
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
                View All Industry News
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Magazine Section */}
      {settings.homepageSections.latestMagazine && featuredMagazines.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4">Latest Magazine Issue</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover exclusive interviews and deep-dive analysis in our quarterly publication.
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
                  Browse All Issues
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Leadership Spotlight</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Meet the visionary leaders driving innovation and transformation across industries.
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
                        Read Profile
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
                  View All Leaders
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
              <h2 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4">Latest Press Releases</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Breaking news and announcements from leading companies and organizations.
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
                        Read Release
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
                  View All Press Releases
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Subscription Section */}
      <section className="py-16 bg-gradient-to-r from-insightRed to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Ahead of the Curve</h2>
          <p className="text-xl mb-8 text-red-100">
            Join 47,500+ business leaders who receive our weekly insights newsletter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-insightRed hover:bg-gray-100 px-8 py-3">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-red-200 mt-4">
            Free weekly insights • Unsubscribe anytime • No spam
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
