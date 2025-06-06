
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Calendar, 
  User, 
  Clock, 
  TrendingUp, 
  Building, 
  Award,
  ChevronRight,
  Briefcase,
  MapPin,
  Users,
  Eye
} from 'lucide-react';
import { newsData } from '../data/newsData';
import { magazineData } from '../data/magazineData';
import { leadershipData } from '../data/leadershipData';
import { pressReleaseData } from '../data/pressReleaseData';
import { useArticles } from '@/hooks/useArticles';
import { useFeaturedPressReleases } from '@/hooks/usePressReleases';
import { useFeaturedLeadership } from '@/hooks/useLeadership';
import { useSettings } from '@/hooks/useSettings';
import { formatDistanceToNow } from 'date-fns';

const Home = () => {
  const { settings } = useSettings();
  const { data: articles = [] } = useArticles();
  const { data: pressReleases = [] } = useFeaturedPressReleases();
  const { data: leaders = [] } = useFeaturedLeadership();

  const [featuredArticles, setFeaturedArticles] = useState(newsData.slice(0, 6));
  const [featuredMagazine, setFeaturedMagazine] = useState(magazineData[0]);
  const [featuredLeaders, setFeaturedLeaders] = useState(leadershipData.slice(0, 3));

  useEffect(() => {
    // Use Supabase data if available, otherwise fallback to static data
    if (articles.length > 0) {
      setFeaturedArticles(articles.slice(0, 6));
    }
    if (leaders.length > 0) {
      setFeaturedLeaders(leaders.slice(0, 3));
    }
  }, [articles, leaders]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-insightBlack via-gray-900 to-insightBlack text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-insightBlack/90 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center px-4 py-2 bg-insightRed/20 border border-insightRed/30 rounded-full text-sm font-medium text-red-200 mb-6">
              <TrendingUp className="mr-2 h-4 w-4" />
              Your Premier Business Intelligence Source
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">{settings.companyName}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl">
              Discover cutting-edge insights, executive leadership profiles, and strategic intelligence 
              that drives business excellence in today's competitive landscape.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="bg-insightRed hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all">
                <Link to="/magazine" className="flex items-center">
                  Explore Latest Magazine <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-insightBlack transition-all">
                <Link to="/leadership" className="flex items-center">
                  Meet Our Leaders <Users className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-red-400 mb-1">500+</div>
                <div className="text-sm text-gray-400">Industry Leaders</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-400 mb-1">50+</div>
                <div className="text-sm text-gray-400">Magazine Issues</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-400 mb-1">1M+</div>
                <div className="text-sm text-gray-400">Monthly Readers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-400 mb-1">25+</div>
                <div className="text-sm text-gray-400">Countries Reached</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-20">
          <div className="w-full h-full bg-gradient-to-tl from-insightRed/30 to-transparent rounded-full blur-3xl"></div>
        </div>
      </section>

      {settings.homepageSections.featuredArticles && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-insightBlack mb-4">Featured Business Intelligence</h2>
                <p className="text-lg text-gray-600">Stay ahead with our latest insights and analysis</p>
              </div>
              <Link 
                to="/articles"
                className="hidden md:flex items-center text-insightRed hover:text-insightBlack font-semibold transition-colors"
              >
                View All Articles <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map(article => (
                <Card key={article.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={article.image_url || article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-0 right-0 m-4">
                      <span className="inline-flex items-center px-3 py-1.5 bg-white/90 backdrop-blur-sm text-insightBlack text-sm font-semibold rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-insightRed transition-colors line-clamp-2">{article.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{article.date}</span>
                      <Link
                        to={`/article/${article.slug}`}
                        className="inline-flex items-center text-insightRed hover:text-insightBlack text-sm font-medium transition-colors"
                      >
                        Read More <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12 md:hidden">
              <Link 
                to="/articles"
                className="inline-flex items-center text-insightRed hover:text-insightBlack font-semibold transition-colors"
              >
                View All Articles <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Executive Leadership Spotlight */}
      {settings.homepageSections.leadershipProfiles && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-insightRed to-red-700 rounded-2xl mb-6 shadow-lg">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-insightBlack mb-4">Executive Leadership Spotlight</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Meet the visionary leaders shaping the future of business and driving innovation across industries
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredLeaders.map((leader, index) => (
                <div key={leader.id} className="group">
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50">
                    <div className="relative">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={leader.image_url || leader.image}
                          alt={leader.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="absolute top-4 right-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                          <Briefcase className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-8 text-center relative">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <div className="w-12 h-12 bg-gradient-to-br from-insightRed to-red-700 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                          <span className="text-white font-bold text-lg">{index + 1}</span>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <h3 className="text-2xl font-bold text-insightBlack mb-2 group-hover:text-insightRed transition-colors">
                          {leader.name}
                        </h3>
                        <p className="text-insightRed font-semibold mb-2 text-lg">{leader.title}</p>
                        {leader.company && (
                          <div className="flex items-center justify-center text-gray-600 mb-4">
                            <Building className="h-4 w-4 mr-2" />
                            <span className="font-medium">{leader.company}</span>
                          </div>
                        )}
                        
                        <div className="mt-6">
                          <Link
                            to={`/leadership/${leader.slug}`}
                            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-insightRed to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl group"
                          >
                            View Profile
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                to="/leadership"
                className="inline-flex items-center px-8 py-4 bg-insightBlack text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Explore All Leaders
                <Users className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {settings.homepageSections.latestMagazine && (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-insightBlack mb-4">Latest Magazine Issue</h2>
              <p className="text-lg text-gray-600">Dive deep into comprehensive business analysis and insights</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-96 md:h-auto">
                  <img
                    src={featuredMagazine?.coverImage}
                    alt={featuredMagazine?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-insightRed text-white">Latest Issue</Badge>
                  </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-insightBlack mb-4">
                    {featuredMagazine?.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredMagazine?.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-6">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{featuredMagazine?.publishDate}</span>
                  </div>
                  <div className="flex gap-4">
                    <Button className="bg-insightRed hover:bg-red-700 text-white">
                      <Link to={`/magazine/${featuredMagazine?.slug}`} className="flex items-center">
                        Read Magazine <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline">
                      <Link to="/magazine">View All Issues</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {settings.homepageSections.pressReleases && (
        <section className="py-16 bg-insightBlack text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Corporate Communications Hub</h2>
              <p className="text-lg text-gray-300">Stay informed with our latest announcements and press releases</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(pressReleases.length > 0 ? pressReleases : pressReleaseData).slice(0, 3).map(release => (
                <Card key={release.id} className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors group">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-insightRed text-white">Press Release</Badge>
                      <span className="text-sm text-gray-400">{release.date}</span>
                    </div>
                    <CardTitle className="text-white group-hover:text-red-400 transition-colors line-clamp-2">
                      {release.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4 line-clamp-3">{release.excerpt}</p>
                    <Link
                      to={`/press-releases/${release.slug}`}
                      className="inline-flex items-center text-insightRed hover:text-red-400 font-medium transition-colors"
                    >
                      Read Full Release <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-insightBlack">
                <Link to="/press-releases">View All Press Releases</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-insightRed to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business Strategy?</h2>
          <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
            Join thousands of executives who rely on {settings.companyName} for cutting-edge business intelligence and strategic insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-insightRed hover:bg-gray-100">
              <Link to="/contact">Get Started Today</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-insightRed">
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
