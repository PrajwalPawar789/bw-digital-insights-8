import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useArticles, useFeaturedArticles } from "@/hooks/useArticles";
import { useMagazines } from "@/hooks/useMagazines";
import { useLeadershipProfiles } from "@/hooks/useLeadership";
import { usePressReleases } from "@/hooks/usePressReleases";
import { useSettings } from "@/hooks/useSettings";
import { useCategories, useArticlesByCategory } from "@/hooks/useCategories";
import { Calendar, ChevronRight, Search, Newspaper, BookOpen, ArrowRight, Shield, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

function imgOf(a: any) { return a?.image_url || "/placeholder.svg"; }
function titleOf(a: any) { return a?.title || "Untitled"; }
function slugOf(a: any) { return a?.slug || ""; }
function dateOf(a: any) {
  const d = a?.date ? new Date(a.date) : null;
  return d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
}
function categoryOf(a: any) { return a?.category || "Business"; }
function excerptOf(a: any) { return a?.excerpt || ""; }

const Home = () => {
  const { data: rawArticles = [] } = useArticles();
  const { data: rawMagazines = [] } = useMagazines();
  const { data: featured = [] } = useFeaturedArticles();
  const { settings } = useSettings();
  const { data: categories = [] } = useCategories();
  const { data: leadership = [] } = useLeadershipProfiles();
  const { data: press = [] } = usePressReleases();

  const articles = Array.isArray(rawArticles) ? rawArticles : [];
  const magazines = Array.isArray(rawMagazines) ? rawMagazines : [];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredArticles = useMemo(() => {
    let filtered = articles;
    
    if (selectedCategory) {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        titleOf(a).toLowerCase().includes(query) || 
        excerptOf(a).toLowerCase().includes(query) ||
        categoryOf(a).toLowerCase().includes(query)
      );
    }
    
    return filtered.sort((a, b) => new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime());
  }, [articles, searchQuery, selectedCategory]);

  const { mainStory, secondaryStories, trendingArticles, latestMagazine } = useMemo(() => {
    const sorted = [...articles].filter(Boolean).sort((a, b) => new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime());
    const mainStory = sorted[0] || null;
    const secondaryStories = sorted.slice(1, 5);
    const trendingArticles = sorted.slice(0, 10);
    const latestMagazine = magazines[0] || null;
    return { mainStory, secondaryStories, trendingArticles, latestMagazine };
  }, [articles, magazines]);

  const categoryBreakdown = useMemo(() => {
    const breakdown: { [key: string]: any[] } = {};
    articles.forEach(article => {
      const cat = categoryOf(article);
      if (!breakdown[cat]) breakdown[cat] = [];
      breakdown[cat].push(article);
    });
    return breakdown;
  }, [articles]);

  return (
    <div className="min-h-screen bg-white text-insightBlack">
      {/* Header Banner */}
      <section className="bg-insightBlack text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-insightRed mb-2">Premium News & Insights</p>
              <h1 className="text-4xl md:text-5xl font-bold">Breaking Business News</h1>
              <p className="text-white/70 mt-2">Your daily source for leadership insights, market trends, and industry updates</p>
            </div>
            <div className="hidden md:block text-right">
              <Newspaper className="h-16 w-16 text-insightRed opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-2 flex-wrap">
            <div className="flex-1 min-w-[280px] relative">
              <Input
                type="text"
                placeholder="Search articles, topics, and insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-lg border border-gray-300"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            <Button 
              onClick={() => setSelectedCategory("")}
              variant={selectedCategory === "" ? "default" : "outline"}
              className="whitespace-nowrap"
            >
              All Categories
            </Button>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            {categories.slice(0, 6).map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name === selectedCategory ? "" : cat.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.name
                    ? "bg-insightRed text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-insightRed"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Article - Magazine Cover Style */}
            {mainStory && (
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-8 bg-insightRed" />
                  <h2 className="text-2xl font-bold">Featured Story</h2>
                </div>

                <Link to={`/article/${slugOf(mainStory)}`} className="group block">
                  <article className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-gray-900 to-insightBlack">
                    <div className="aspect-[16/9] flex items-center justify-center overflow-hidden">
                      <img
                        src={imgOf(mainStory)}
                        alt={titleOf(mainStory)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-insightBlack/95 via-insightBlack/40 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-8">
                      <Badge className="bg-insightRed text-white mb-4 text-xs font-bold uppercase tracking-widest">
                        {categoryOf(mainStory)}
                      </Badge>
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-insightRed/90 transition-colors">
                        {titleOf(mainStory)}
                      </h3>
                      <p className="text-white/80 text-lg mb-4 line-clamp-2">
                        {excerptOf(mainStory)}
                      </p>
                      <div className="flex items-center gap-4 text-white/70">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {dateOf(mainStory)}
                        </span>
                        <span>•</span>
                        <span>{mainStory.author || "Editorial Team"}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              </section>
            )}

            {/* Secondary Stories Grid */}
            {secondaryStories.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-8 bg-insightRed" />
                  <h2 className="text-2xl font-bold">Latest News</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {secondaryStories.map((article: any, index: number) => (
                    <Link
                      key={slugOf(article) + index}
                      to={`/article/${slugOf(article)}`}
                      className="group"
                    >
                      <Card className="h-full overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="aspect-[16/10] bg-gray-100 flex items-center justify-center overflow-hidden">
                          <img
                            src={imgOf(article)}
                            alt={titleOf(article)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <CardContent className="p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {categoryOf(article)}
                            </Badge>
                            <span className="text-xs text-gray-500">{dateOf(article)}</span>
                          </div>
                          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-insightRed transition-colors">
                            {titleOf(article)}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {excerptOf(article)}
                          </p>
                          <div className="flex items-center text-insightRed text-sm font-semibold">
                            Read more <ChevronRight className="ml-1 h-4 w-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Category Sections */}
            {categories.length > 0 && (
              <section className="space-y-8">
                {categories.slice(0, 3).map((category: any) => {
                  const categoryArticles = (categoryBreakdown[category.name] || []).slice(0, 4);
                  if (categoryArticles.length === 0) return null;

                  return (
                    <div key={category.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-8 bg-insightRed" />
                          <h3 className="text-2xl font-bold">{category.name}</h3>
                        </div>
                        <Link
                          to={`/category/${category.slug}`}
                          className="text-insightRed hover:text-insightBlack font-semibold flex items-center"
                        >
                          View all <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {categoryArticles.map((article: any, idx: number) => (
                          <Link
                            key={slugOf(article) + idx}
                            to={`/article/${slugOf(article)}`}
                            className="group flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-insightRed hover:bg-insightRed/5 transition-all"
                          >
                            <div className="w-24 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                              <img
                                src={imgOf(article)}
                                alt={titleOf(article)}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                <Calendar className="h-3 w-3" />
                                {dateOf(article)}
                              </div>
                              <h4 className="font-semibold line-clamp-2 group-hover:text-insightRed transition-colors">
                                {titleOf(article)}
                              </h4>
                              <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                                {excerptOf(article)}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </section>
            )}

            {/* No Results */}
            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <Newspaper className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No articles found matching your search.</p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Latest Magazine */}
            {latestMagazine && (
              <Card className="overflow-hidden border border-gray-200 shadow-lg sticky top-24">
                <div className="bg-insightBlack text-white p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-insightRed" />
                    <h3 className="font-bold uppercase tracking-wider">Latest Issue</h3>
                  </div>
                  <Link to="/magazine" className="block group">
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden mb-4 shadow-lg">
                      <img
                        src={latestMagazine.cover_image_url || "/placeholder.svg"}
                        alt={latestMagazine.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-bold text-lg group-hover:text-insightRed transition-colors">
                      {latestMagazine.title}
                    </h4>
                    <p className="text-sm text-white/70 mt-2 line-clamp-2">
                      {latestMagazine.description}
                    </p>
                  </Link>
                  <Link to="/magazine">
                    <Button className="w-full bg-insightRed hover:bg-insightRed/90 text-white">
                      Read Magazine
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            {/* Trending Articles */}
            {trendingArticles.length > 0 && (
              <Card className="overflow-hidden border border-gray-200">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-insightRed" />
                    <h3 className="font-bold uppercase tracking-wider">Trending Now</h3>
                  </div>
                </div>
                <ul className="divide-y divide-gray-200">
                  {trendingArticles.slice(0, 6).map((article: any, index: number) => (
                    <li key={slugOf(article) + index} className="hover:bg-gray-50 transition-colors">
                      <Link
                        to={`/article/${slugOf(article)}`}
                        className="flex gap-3 p-4 group"
                      >
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-insightRed/10 text-insightRed font-bold flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-insightRed transition-colors">
                            {titleOf(article)}
                          </h4>
                          <div className="text-xs text-gray-500 mt-1">{dateOf(article)}</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Newsletter CTA */}
            <Card className="bg-gradient-to-br from-insightRed to-insightBlack text-white overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">Newsletter</h3>
                  <p className="text-sm text-white/80">
                    Get the latest business news delivered to your inbox.
                  </p>
                </div>
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                  <Button className="w-full bg-white text-insightRed hover:bg-gray-100 font-semibold">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border border-gray-200">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                <Link to="/magazine" className="block text-insightRed hover:text-insightBlack font-semibold">
                  → Magazine
                </Link>
                <Link to="/articles" className="block text-insightRed hover:text-insightBlack font-semibold">
                  → All Articles
                </Link>
                <Link to="/leadership" className="block text-insightRed hover:text-insightBlack font-semibold">
                  → Leadership
                </Link>
                <Link to="/about" className="block text-insightRed hover:text-insightBlack font-semibold">
                  → About Us
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* Newsletter Subscription CTA */}
      <section className="bg-insightBlack text-white py-16 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-white/80 text-lg mb-8">
            Never miss breaking news, industry insights, or exclusive stories. Subscribe to {settings?.companyName || "our"} newsletter.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white text-insightBlack"
            />
            <Button className="bg-insightRed hover:bg-insightRed/90">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
