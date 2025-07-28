import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Building2, Globe, TrendingUp, Calendar, User, ExternalLink, Star, Award, Target, Zap, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSettings } from '@/hooks/useSettings';
import { useFeaturedMagazines } from '@/hooks/useMagazines';
import { useIndustryNews } from '@/hooks/useIndustryNews';
import { useFeaturedArticles } from '@/hooks/useArticles';
import { useFeaturedLeadership } from '@/hooks/useLeadership';
import { useFeaturedPressReleases } from '@/hooks/usePressReleases';
import { formatDistanceToNow } from 'date-fns';

const Home = () => {
  const { settings } = useSettings();
  const { data: featuredMagazines = [], isLoading: magazinesLoading } = useFeaturedMagazines();
  const { data: industryNews = [], isLoading: newsLoading } = useIndustryNews();
  const { data: featuredArticles = [], isLoading: articlesLoading } = useFeaturedArticles();
  const { data: featuredLeadership = [], isLoading: leadershipLoading } = useFeaturedLeadership();
  const { data: featuredPressReleases = [], isLoading: pressReleasesLoading } = useFeaturedPressReleases();

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
              {articlesLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                featuredArticles.slice(0, 3).map((article) => (
                  <Card key={article.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={article.image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600'}
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
                          5 min read
                        </div>
                      </div>
                      <Link to={`/articles/${article.slug}`}>
                        <Button variant="outline" className="w-full group-hover:bg-insightRed group-hover:text-white group-hover:border-insightRed">
                          Read Full Article
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
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

      {/* Latest Premium Edition Section */}
      {settings.homepageSections.latestMagazine && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4">
                Real-Time Market Intelligence
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Stay informed with the latest market developments, financial insights, and business trends as they happen.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Latest Magazine */}
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-insightBlack mb-6 flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-insightRed" />
                  Latest Magazine Issue
                </h3>
                {magazinesLoading ? (
                  <div className="animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-lg"></div>
                  </div>
                ) : featuredMagazines?.[0] ? (
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow border-0 shadow-lg">
                    <div className="md:flex">
                      {featuredMagazines[0].cover_image_url && (
                        <div className="md:w-48 h-64 bg-gray-100 overflow-hidden">
                          <img 
                            src={featuredMagazines[0].cover_image_url} 
                            alt={featuredMagazines[0].title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary">Issue #{featuredMagazines[0].issue_number}</Badge>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{formatDistanceToNow(new Date(featuredMagazines[0].publish_date), { addSuffix: true })}</span>
                            </div>
                          </div>
                          <CardTitle className="text-2xl text-insightBlack">
                            {featuredMagazines[0].title}
                          </CardTitle>
                          <CardDescription className="text-gray-600">
                            {featuredMagazines[0].description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button className="bg-insightRed hover:bg-red-700">
                            <Link to={`/magazine/${featuredMagazines[0].slug}`} className="flex items-center">
                              Read Full Issue
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No magazine issues available
                  </div>
                )}
              </div>

              {/* Market Trends */}
              <div>
                <h3 className="text-2xl font-bold text-insightBlack mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-insightRed" />
                  Market Trends
                </h3>
                <div className="space-y-4">
                  <Card className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-insightBlack">Tech Sector Growth</p>
                        <p className="text-sm text-gray-600">+12.5% this quarter</p>
                      </div>
                      <div className="text-green-600 font-bold text-lg">↗</div>
                    </div>
                  </Card>
                  <Card className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-insightBlack">AI Investment</p>
                        <p className="text-sm text-gray-600">$2.8B in funding</p>
                      </div>
                      <div className="text-green-600 font-bold text-lg">↗</div>
                    </div>
                  </Card>
                  <Card className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-insightBlack">ESG Adoption</p>
                        <p className="text-sm text-gray-600">68% increase YoY</p>
                      </div>
                      <div className="text-green-600 font-bold text-lg">↗</div>
                    </div>
                  </Card>
                </div>
              </div>
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

      {/* Executive Leadership Spotlight Section - Redesigned */}
      {settings.homepageSections.leadershipProfiles && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-insightRed/10 text-insightRed border-insightRed/20 text-sm px-6 py-2 font-semibold">
                EXECUTIVE SPOTLIGHT
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-insightBlack mb-6 leading-tight">
                Leadership Excellence
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Meet the visionary leaders driving innovation and transformation across industries worldwide.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {leadershipLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="animate-pulse border-0 shadow-lg">
                    <div className="h-80 bg-gray-200 rounded-lg"></div>
                    <CardHeader className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                featuredLeadership.slice(0, 3).map((leader) => (
                  <Card key={leader.id} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
                    <div className="relative">
                      <div className="h-80 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        <img
                          src={leader.image_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400'}
                          alt={leader.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <Badge className="bg-insightRed/90 text-white border-none mb-2">
                          FEATURED EXECUTIVE
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="p-6 bg-white">
                      <CardTitle className="text-2xl font-bold text-insightBlack group-hover:text-insightRed transition-colors duration-300 mb-2">
                        {leader.name}
                      </CardTitle>
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-insightRed">
                          {leader.title}
                        </p>
                        {leader.company && (
                          <p className="text-gray-600 font-medium">
                            {leader.company}
                          </p>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <Link to={`/leadership/${leader.slug}`}>
                        <Button 
                          className="w-full bg-gradient-to-r from-insightRed to-red-700 hover:from-red-700 hover:to-insightRed text-white font-semibold py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          View Executive Profile
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            <div className="text-center">
              <Link to="/leadership">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-insightRed text-insightRed hover:bg-insightRed hover:text-white px-12 py-4 text-lg font-semibold transition-all duration-300"
                >
                  View All Leadership Profiles
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Corporate Announcements & Market Movers Section */}
      {settings.homepageSections.pressReleases && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4">
                Corporate Announcements & Market Movers
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Stay updated with the latest corporate news, strategic partnerships, and market-moving announcements.
              </p>
            </div>

            {pressReleasesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPressReleases?.slice(0, 3).map((release) => (
                  <Card key={release.id} className="overflow-hidden hover:shadow-xl transition-shadow group border-0 shadow-lg">
                    {release.image_url && (
                      <div className="h-48 bg-gray-100 overflow-hidden">
                        <img 
                          src={release.image_url} 
                          alt={release.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">Press Release</Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDistanceToNow(new Date(release.date), { addSuffix: true })}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl group-hover:text-insightRed transition-colors line-clamp-2">
                        <Link to={`/press-releases/${release.slug}`}>
                          {release.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-gray-600 line-clamp-3">
                        {release.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-4 w-4 mr-1" />
                          <span>{release.author}</span>
                        </div>
                        <Link
                          to={`/press-releases/${release.slug}`}
                          className="text-insightRed hover:text-insightBlack font-semibold text-sm flex items-center"
                        >
                          Read More
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Button size="lg" variant="outline" className="border-insightRed text-insightRed hover:bg-insightRed hover:text-white">
                <Link to="/press-releases" className="flex items-center">
                  View All Announcements
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Newsletter Subscription Section */}
      <section className="py-20 bg-gradient-to-r from-insightRed to-red-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-pattern"></div>
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
