
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Building2, Globe, TrendingUp, Calendar, User, ExternalLink, Star, Award, Target, Zap, FileText, Crown, Sparkles, ChevronRight, Play, BookOpen, Trophy } from 'lucide-react';
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
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const { settings } = useSettings();
  const { data: featuredMagazines = [], isLoading: magazinesLoading } = useFeaturedMagazines();
  const { data: industryNews = [], isLoading: newsLoading } = useIndustryNews();
  const { data: featuredArticles = [], isLoading: articlesLoading } = useFeaturedArticles();
  const { data: featuredLeadership = [], isLoading: leadershipLoading } = useFeaturedLeadership();
  const { data: featuredPressReleases = [], isLoading: pressReleasesLoading } = useFeaturedPressReleases();

  // Breaking news slider settings
  const breakingNewsSettings = {
    dots: false,
    arrows: false,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  // Enhanced statistics with social proof
  const stats = [
    { icon: Users, label: "Global Subscribers", value: "125,000+", description: "C-Suite executives trust us", growth: "+23% this quarter" },
    { icon: Building2, label: "Fortune 500 Companies", value: "2,500+", description: "Industry leaders featured", growth: "Exclusive access" },
    { icon: Globe, label: "Countries Reached", value: "75+", description: "Worldwide influence", growth: "Global network" },
    { icon: Trophy, label: "Industry Recognition", value: "15+", description: "Awards & accolades", growth: "Trusted authority" },
  ];

  // Trust indicators for credibility
  const trustIndicators = [
    { icon: Crown, title: "Elite Network", desc: "Exclusive access to C-suite executives" },
    { icon: Sparkles, title: "Premium Intelligence", desc: "Curated insights from industry leaders" },
    { icon: Target, title: "Strategic Impact", desc: "Data that drives billion-dollar decisions" },
    { icon: Zap, title: "First-Mover Advantage", desc: "Breaking news before competitors" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section - Immersive Experience */}
      <section className="relative min-h-screen bg-gradient-to-br from-insightBlack via-gray-900 to-insightBlack text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-insightRed/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Authority Badge */}
          <div className="text-center mb-8">
            <Badge className="mb-6 bg-gradient-to-r from-insightRed to-red-600 text-white border-none text-sm px-6 py-3 shadow-xl animate-fade-in">
              <Crown className="w-4 h-4 mr-2" />
              #1 Global Business Intelligence Magazine
            </Badge>
          </div>

          {/* Hero Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[70vh]">
            {/* Main Hero Content */}
            <div className="lg:col-span-7 space-y-8">
              <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold leading-tight animate-fade-in">
                Where Business
                <span className="block bg-gradient-to-r from-insightRed to-red-400 bg-clip-text text-transparent">
                  Legends Are Made
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl animate-fade-in delay-300">
                Join the exclusive circle of 125,000+ executives who shape industries, drive innovation, and create billion-dollar opportunities with our premium intelligence.
              </p>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4 my-8 animate-fade-in delay-500">
                {trustIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                    <indicator.icon className="w-5 h-5 text-insightRed flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold">{indicator.title}</div>
                      <div className="text-xs text-gray-400">{indicator.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-700">
                <Link to="/magazine">
                  <Button size="lg" className="bg-gradient-to-r from-insightRed to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <Crown className="w-5 h-5 mr-2" />
                    Join Elite Circle - $29/month
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-insightBlack px-8 py-4 text-lg transform hover:scale-105 transition-all duration-300">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Success Stories
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Featured Content */}
            <div className="lg:col-span-5 space-y-6">
              {!articlesLoading && featuredArticles?.[0] && (
                <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-all duration-500 transform hover:scale-105">
                  <div className="relative">
                    <img 
                      src={featuredArticles[0].image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600'} 
                      alt={featuredArticles[0].title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-4 right-4 bg-insightRed">Featured</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{featuredArticles[0].title}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {featuredArticles[0].excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/article/${featuredArticles[0].slug}`}>
                      <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-insightBlack">
                        Read Exclusive Insight
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-insightRed group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-gray-400 mb-1">{stat.description}</div>
                <div className="text-xs text-insightRed font-semibold">{stat.growth}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Breaking News Section */}
      <section className="wpo-breacking-news section-padding bg-gradient-to-r from-insightRed to-red-700">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="row">
            <div className="b-title mb-6">
              <span className="text-white text-2xl font-bold flex items-center">
                <Badge className="bg-white text-insightRed mr-4 font-bold px-4 py-2">BREAKING</Badge>
                Executive Intelligence Updates
              </span>
            </div>
            <div className="wpo-breacking-wrap">
              <Slider {...breakingNewsSettings}>
                {!articlesLoading && featuredArticles.slice(0, 6).map((article, index) => (
                  <div className="wpo-breacking-slide px-2" key={article.id}>
                    <div className="wpo-breacking-item bg-white/10 backdrop-blur-md rounded-lg overflow-hidden hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                      <div className="wpo-breacking-img relative h-40 overflow-hidden">
                        <img 
                          src={article.image_url || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400'} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <Badge className="absolute top-2 left-2 bg-yellow-500 text-black text-xs">
                          {article.category}
                        </Badge>
                      </div>
                      <div className="wpo-breacking-text p-4 text-white">
                        <span className="text-yellow-300 text-sm font-medium flex items-center mb-2">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDistanceToNow(new Date(article.date), { addSuffix: true })}
                        </span>
                        <h3 className="group-hover:text-yellow-300 transition-colors duration-200 font-semibold line-clamp-2">
                          <Link 
                            to={`/article/${article.slug}`}
                            onClick={() => window.scrollTo(0, 0)}
                          >
                            {article.title}
                          </Link>
                        </h3>
                        <p className="text-gray-300 text-sm mt-2 line-clamp-2">{article.excerpt}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-400 flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {article.author}
                          </span>
                          <Link 
                            to={`/article/${article.slug}`}
                            className="text-yellow-300 text-xs hover:text-white transition-colors flex items-center"
                          >
                            Read More <ArrowRight className="w-3 h-3 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Top Highlights */}
      {settings.homepageSections?.featuredArticles && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-insightRed/10 text-insightRed border-insightRed/20 text-sm px-6 py-2">
                TODAY'S INTELLIGENCE
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-insightBlack mb-6">
                Today's Top Highlights
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Critical insights and strategic intelligence that top executives are discussing right now.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articlesLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                featuredArticles.slice(0, 6).map((article, index) => (
                  <Card key={article.id} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={article.image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600'}
                        alt={article.title}
                        className="w-full h-48 object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <Badge className="absolute top-4 left-4 bg-insightRed hover:bg-red-700">
                        {article.category}
                      </Badge>
                      {index < 3 && (
                        <Badge className="absolute top-4 right-4 bg-yellow-500 text-black">
                          <Star className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
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
                      <Link to={`/article/${article.slug}`}>
                        <Button variant="outline" className="w-full group-hover:bg-insightRed group-hover:text-white group-hover:border-insightRed transition-all duration-300">
                          Read Strategic Insight
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/articles">
                <Button size="lg" className="bg-insightRed hover:bg-red-700 text-white px-8 py-3">
                  Access Full Intelligence Hub
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Premium Editions (Magazine Section) */}
      {settings.homepageSections?.latestMagazine && (
        <section className="py-20 bg-gradient-to-br from-gray-900 to-insightBlack text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black border-none text-sm px-6 py-3">
                <Crown className="w-4 h-4 mr-2" />
                PREMIUM EDITIONS
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Exclusive Premium Intelligence
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Deep-dive analysis and strategic insights available only to our premium subscribers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {magazinesLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-700 h-64 rounded-lg mb-4"></div>
                    <div className="bg-gray-700 h-4 rounded mb-2"></div>
                    <div className="bg-gray-700 h-4 rounded w-3/4"></div>
                  </div>
                ))
              ) : (
                featuredMagazines.slice(0, 6).map((magazine, index) => (
                  <Card key={magazine.id} className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-all duration-500 group">
                    <div className="relative overflow-hidden rounded-t-lg">
                      {magazine.cover_image_url ? (
                        <img 
                          src={magazine.cover_image_url} 
                          alt={magazine.title}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-64 bg-gradient-to-br from-insightRed to-red-600 flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-white" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-500 text-black">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-black/50 text-white">
                          Issue #{magazine.issue_number}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl group-hover:text-yellow-400 transition-colors">
                        {magazine.title}
                      </CardTitle>
                      <CardDescription className="text-gray-300 line-clamp-3">
                        {magazine.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDistanceToNow(new Date(magazine.publish_date), { addSuffix: true })}</span>
                        </div>
                        <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                          Exclusive
                        </Badge>
                      </div>
                      <Link to={`/magazine/${magazine.slug}`}>
                        <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700 font-semibold">
                          Access Premium Edition
                          <Crown className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="text-center mt-12">
              <Link to="/magazine">
                <Button size="lg" variant="outline" className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-3">
                  Unlock All Premium Editions
                  <Crown className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Executive Leadership Spotlight */}
      {settings.homepageSections?.leadershipProfiles && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-insightRed/10 text-insightRed border-insightRed/20 text-sm px-6 py-2">
                EXECUTIVE SPOTLIGHT
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-insightBlack mb-6">
                Visionary Leaders Driving Change
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Exclusive interviews and insights from the C-suite executives shaping the future of business.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-insightRed text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <p className="text-sm font-medium">Exclusive Interview Available</p>
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
                        <Button className="w-full bg-gradient-to-r from-insightRed to-red-700 hover:from-red-700 hover:to-insightRed text-white font-semibold py-3 transition-all duration-300 shadow-lg hover:shadow-xl">
                          Read Exclusive Interview
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/leadership">
                <Button size="lg" variant="outline" className="border-2 border-insightRed text-insightRed hover:bg-insightRed hover:text-white px-8 py-3">
                  Meet All Visionary Leaders
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Never Miss Any Update Newsletter */}
      <section className="py-20 bg-gradient-to-r from-insightRed to-red-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 text-sm px-6 py-3">
              <Sparkles className="w-4 h-4 mr-2" />
              EXCLUSIVE ACCESS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Never Miss Any Update!</h2>
            <p className="text-xl mb-4 text-red-100">
              Get the freshest headlines and updates sent uninterrupted to your inbox.
            </p>
            <p className="text-lg text-red-200">
              Join 125,000+ executives who rely on our daily intelligence briefings.
            </p>
          </div>
          
          <div className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your business email"
                className="flex-1 px-6 py-4 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-white text-lg"
              />
              <Button className="bg-white text-insightRed hover:bg-gray-100 px-8 py-4 font-semibold text-lg shadow-xl">
                Subscribe
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-red-200">
            <span className="flex items-center">
              <Star className="h-4 w-4 mr-1" />
              Daily intelligence briefings
            </span>
            <span className="flex items-center">
              <Target className="h-4 w-4 mr-1" />
              Exclusive market insights
            </span>
            <span className="flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              Breaking news alerts
            </span>
            <span className="flex items-center">
              <Crown className="h-4 w-4 mr-1" />
              Premium content access
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
