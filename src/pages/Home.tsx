
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, FileText, Calendar, User, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useFeaturedMagazines } from "@/hooks/useMagazines";
import { useFeaturedArticles } from "@/hooks/useArticles";
import { useFeaturedLeadership } from "@/hooks/useLeadership";
import { useFeaturedPressReleases } from "@/hooks/usePressReleases";

const Home = () => {
  const { data: featuredMagazines, isLoading: magazinesLoading } = useFeaturedMagazines();
  const { data: featuredArticles, isLoading: articlesLoading } = useFeaturedArticles();
  const { data: featuredLeaders, isLoading: leadersLoading } = useFeaturedLeadership();
  const { data: featuredPressReleases, isLoading: pressReleasesLoading } = useFeaturedPressReleases();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-insightBlack via-gray-900 to-insightBlack text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Business <span className="text-insightRed">Insights</span> Magazine
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Delivering strategic intelligence and leadership insights for today's business leaders. 
              Stay ahead with expert analysis, industry trends, and actionable strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-insightRed hover:bg-red-700 text-white px-8 py-4 text-lg">
                Explore Latest Issue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-insightBlack px-8 py-4 text-lg"
              >
                Free Sample Issue
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Business Intelligence */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4">
              Featured Business Intelligence
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Curated insights and analysis from our expert editorial team covering the most critical business developments.
            </p>
          </div>

          {articlesLoading ? (
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
              {featuredArticles?.slice(0, 3).map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-shadow group border-0 shadow-lg">
                  {article.image_url && (
                    <div className="h-48 bg-gray-100 overflow-hidden">
                      <img 
                        src={article.image_url} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDistanceToNow(new Date(article.date), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-insightRed transition-colors line-clamp-2">
                      <Link to={`/articles/${article.slug}`}>
                        {article.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-gray-600 line-clamp-3">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        <span>{article.author}</span>
                      </div>
                      <Link
                        to={`/articles/${article.slug}`}
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
              <Link to="/articles" className="flex items-center">
                View All Articles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Real-Time Market Intelligence */}
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
        </div>
      </section>

      {/* Executive Leadership Spotlight */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4">
              Executive Leadership Spotlight
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the visionary leaders driving innovation and transformation across industries. Get exclusive access to their strategies and insights.
            </p>
          </div>

          {leadersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredLeaders?.slice(0, 3).map((leader) => (
                <Card key={leader.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-0 shadow-lg">
                  <div className="relative">
                    {leader.image_url ? (
                      <div className="h-64 bg-gray-100 overflow-hidden">
                        <img 
                          src={leader.image_url} 
                          alt={leader.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-64 bg-gradient-to-br from-insightRed to-red-700 flex items-center justify-center">
                        <User className="h-20 w-20 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-insightBlack group-hover:text-insightRed transition-colors">
                      <Link to={`/leadership/${leader.slug}`}>
                        {leader.name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      <span className="font-medium">{leader.title}</span>
                      {leader.company && <span className="block text-sm">{leader.company}</span>}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {leader.bio}
                    </p>
                    <Link
                      to={`/leadership/${leader.slug}`}
                      className="inline-flex items-center text-insightRed hover:text-insightBlack font-semibold text-sm transition-colors"
                    >
                      View Profile
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-insightRed text-insightRed hover:bg-insightRed hover:text-white">
              <Link to="/leadership" className="flex items-center">
                Explore All Leaders
                <Users className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Corporate Announcements & Market Movers */}
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
              {featuredPressReleases?.map((release) => (
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

      {/* Call to Action */}
      <section className="py-16 bg-insightBlack text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Business Strategy?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join thousands of business leaders who rely on our insights to drive growth, 
            innovation, and competitive advantage in today's dynamic market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-insightRed hover:bg-red-700 text-white px-8 py-4 text-lg">
              Subscribe Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-insightBlack px-8 py-4 text-lg">
              <Link to="/contact">
                Contact Our Team
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
