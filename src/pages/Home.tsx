
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      icon: <Users className="h-8 w-8 text-insightRed" />,
      value: "500+",
      label: "Industry Leaders",
      description: "C-suite executives and thought leaders featured"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-insightRed" />,
      value: "50+",
      label: "Magazine Issues",
      description: "Quarterly publications with cutting-edge insights"
    },
    {
      icon: <FileText className="h-8 w-8 text-insightRed" />,
      value: "1000+",
      label: "Articles Published",
      description: "In-depth analysis and strategic content"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-insightRed" />,
      value: "2M+",
      label: "Global Readership",
      description: "Professionals across 50+ countries"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-insightBlack via-gray-900 to-insightBlack text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2074&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Executive
                <span className="text-insightRed"> Insights</span>
                <br />
                for Tomorrow's Leaders
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                Discover cutting-edge strategies, innovative technologies, and transformative leadership insights from the world's most influential executives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-insightRed hover:bg-red-700 text-white px-8 py-3">
                  <Link to="/magazine" className="flex items-center">
                    Explore Magazines
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-insightBlack px-8 py-3">
                  <Link to="/leadership">Meet Our Leaders</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {featuredMagazines.slice(0, 2).map((magazine, index) => (
                  <Link key={magazine.id} to={`/magazine/${magazine.slug}`} className={`relative ${index === 1 ? 'mt-8' : ''} group`}>
                    <img
                      src={magazine.cover_image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
                      alt={magazine.title}
                      className="w-full rounded-lg shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-semibold">{magazine.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-4">
                    {stat.icon}
                  </div>
                  <CardTitle className="text-3xl font-bold text-insightBlack">{stat.value}</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-insightBlack mb-2">{stat.label}</h3>
                  <p className="text-gray-600 text-sm">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4">
              Latest Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay ahead with our latest articles featuring strategic insights, technology trends, and leadership perspectives.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredArticles.slice(0, 3).map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image_url || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-insightRed text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {article.category}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-insightRed transition-colors">
                    <Link to={`/article/${article.slug}`}>
                      {article.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By {article.author}</span>
                    <span>{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" className="border-insightRed text-insightRed hover:bg-insightRed hover:text-white">
              <Link to="/magazine" className="flex items-center">
                View All Articles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Leadership */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4">
              Leadership Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the visionary leaders driving innovation and transformation across industries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredLeaders.slice(0, 3).map((leader) => (
              <Card key={leader.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={leader.image_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400'}
                    alt={leader.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{leader.name}</h3>
                    <p className="text-sm opacity-90">{leader.title}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {leader.bio.substring(0, 120)}...
                  </p>
                  <Link
                    to={`/leadership/${leader.slug}`}
                    className="text-insightRed hover:text-insightBlack font-semibold text-sm flex items-center"
                  >
                    Read Full Profile
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" className="border-insightRed text-insightRed hover:bg-insightRed hover:text-white">
              <Link to="/leadership" className="flex items-center">
                Meet All Leaders
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Client Logos Section */}
      <ClientLogos />

      {/* CTA Section */}
      <section className="py-16 bg-insightBlack text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Leadership?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of executives who rely on our insights to drive innovation and growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-insightRed hover:bg-red-700 text-white px-8 py-3">
              <Link to="/magazine">
                Subscribe Now
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-insightBlack px-8 py-3">
              <Link to="/contact">
                Get in Touch
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
