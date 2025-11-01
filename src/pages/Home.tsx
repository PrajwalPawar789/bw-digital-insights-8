import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useArticles, useFeaturedArticles } from "@/hooks/useArticles";
import { useMagazines } from "@/hooks/useMagazines";
import { useLeadershipProfiles } from "@/hooks/useLeadership";
import { usePressReleases } from "@/hooks/usePressReleases";
import { useSettings } from "@/hooks/useSettings";
import { useCategories } from "@/hooks/useCategories";
import { useHomeSections, HomeSection, HomeSectionItem } from "@/hooks/useHomeSections";
import { Calendar, ChevronRight, Search, Newspaper, BookOpen, TrendingUp, X, ArrowUpRight, Sparkles, Flame } from "lucide-react";
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
  const { data: curatedSections = [] } = useHomeSections();

  const articles = Array.isArray(rawArticles) ? rawArticles : [];
  const magazines = Array.isArray(rawMagazines) ? rawMagazines : [];

  const articleMap = useMemo(() => {
    const map = new Map<string, any>();
    articles.forEach((article) => {
      const slug = slugOf(article);
      if (slug) {
        map.set(slug, article);
      }
    });
    return map;
  }, [articles]);

  const categoryColorMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((cat: any) => {
      if (!cat) return;
      if (cat.slug) {
        map.set(cat.slug, cat.color || "#ef4444");
      }
      if (cat.name) {
        map.set(cat.name, cat.color || "#ef4444");
      }
    });
    return map;
  }, [categories]);

  const mapSectionItemToDisplay = useCallback(
    (item?: HomeSectionItem | null) => {
      if (!item) return null;
      const article = item.article_slug ? articleMap.get(item.article_slug) : undefined;
      const resolvedSlug = item.article_slug || slugOf(article);

      if (!resolvedSlug) {
        return null;
      }

      const badgeLabel = item.badge || (article ? categoryOf(article) : item.badge) || "Feature";
      const accentColor = badgeLabel ? categoryColorMap.get(badgeLabel) : undefined;

      return {
        slug: resolvedSlug,
        title: item.title || titleOf(article),
        summary: item.summary || excerptOf(article),
        image: item.image_url || imgOf(article),
        badge: badgeLabel,
        date: article ? dateOf(article) : "",
        author: article?.author || "Editorial Team",
        actionLabel: item.action_label,
        actionUrl: item.action_url,
        featured: item.featured,
        accentColor: accentColor || "#ef4444",
      };
    },
    [articleMap, categoryColorMap]
  );

  const mapArticleToDisplay = useCallback(
    (article: any) => {
      if (!article) return null;
      const badgeLabel = categoryOf(article);
      const accentColor = badgeLabel ? categoryColorMap.get(badgeLabel) : undefined;

      return {
        slug: slugOf(article),
        title: titleOf(article),
        summary: excerptOf(article),
        image: imgOf(article),
        badge: badgeLabel,
        date: dateOf(article),
        author: article?.author || "Editorial Team",
        actionLabel: undefined,
        actionUrl: undefined,
        featured: false,
        accentColor: accentColor || "#ef4444",
      };
    },
    [categoryColorMap]
  );

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

  const heroSection = useMemo(() => {
    return curatedSections.find((section: HomeSection) => section.layout_type === "hero");
  }, [curatedSections]);

  const heroDisplay = useMemo(() => {
    if (!heroSection) return null;
    const items = heroSection.home_section_items || [];
    if (!items.length) return null;

    const sortedItems = [...items].sort((a, b) => a.order_index - b.order_index);
    const primaryItem = sortedItems.find((item) => item.featured) || sortedItems[0];
    const primary = mapSectionItemToDisplay(primaryItem);
    const secondary = sortedItems
      .filter((item) => item.id !== (primaryItem?.id || ""))
      .map(mapSectionItemToDisplay)
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    if (!primary) return null;

    return {
      primary,
      secondary,
      meta: heroSection,
    };
  }, [heroSection, mapSectionItemToDisplay]);

  const heroPrimary = heroDisplay?.primary || mapArticleToDisplay(mainStory);
  const heroSecondary = heroDisplay?.secondary?.length
    ? heroDisplay.secondary
    : secondaryStories
        .slice(0, 3)
        .map(mapArticleToDisplay)
        .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const categoryBreakdown = useMemo(() => {
    const breakdown: { [key: string]: any[] } = {};
    articles.forEach(article => {
      const cat = categoryOf(article);
      if (!breakdown[cat]) breakdown[cat] = [];
      breakdown[cat].push(article);
    });
    return breakdown;
  }, [articles]);

  const curatedFeatureSections = useMemo(() => {
    return curatedSections.filter((section) => section.layout_type !== "hero");
  }, [curatedSections]);

  return (
    <div className="min-h-screen bg-white text-insightBlack">
      {/* Premium Header Banner */}
      <section className="bg-insightBlack text-white py-10 border-b border-insightRed/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-insightRed font-bold">Premium News & Insights</p>
              <h1 className="text-5xl md:text-6xl font-black leading-tight max-w-2xl">Breaking Business News</h1>
              <p className="text-lg text-white/80 leading-relaxed max-w-xl">
                Your daily source for leadership insights, market trends, and industry updates
              </p>
            </div>
            <div className="hidden lg:flex h-32 w-32 items-center justify-center rounded-lg bg-insightRed/10">
              <Newspaper className="h-20 w-20 text-insightRed opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-3 flex-wrap mb-6">
            <div className="flex-1 min-w-[280px] relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search articles, topics, insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 rounded-lg border border-gray-300 focus:border-insightRed focus:ring-2 focus:ring-insightRed/10 transition-all text-base"
              />
            </div>
            {(searchQuery || selectedCategory) && (
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                }}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold">Filter by Category</p>
            <div className="flex gap-2 flex-wrap">
              {categories.slice(0, 6).map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name === selectedCategory ? "" : cat.name)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    selectedCategory === cat.name
                      ? "bg-insightRed text-white shadow-lg shadow-insightRed/30"
                      : "bg-white border-2 border-gray-200 text-gray-700 hover:border-insightRed hover:text-insightRed"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Featured Article with Premium Styling */}
            {heroPrimary && (
              <section className="space-y-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-8 bg-insightRed rounded-full" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-insightRed font-semibold">
                        {heroDisplay?.meta?.kicker || "Spotlight"}
                      </p>
                      <h2 className="text-3xl font-black tracking-tight">
                        {heroDisplay?.meta?.title || "Feature of the Day"}
                      </h2>
                    </div>
                  </div>
                  {heroDisplay?.meta?.subtitle && (
                    <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
                      {heroDisplay.meta.subtitle}
                    </p>
                  )}
                </div>

                <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                  <Link to={`/article/${heroPrimary.slug}`} className="group block">
                    <article className="relative overflow-hidden rounded-3xl shadow-2xl min-h-[420px] bg-black">
                      <div className="absolute inset-0">
                        <img
                          src={heroPrimary.image}
                          alt={heroPrimary.title}
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                      </div>

                      <div className="relative z-10 flex h-full flex-col justify-end p-10 space-y-5">
                        <div className="flex items-center gap-3">
                          <Badge
                            className="border-0 text-xs font-bold uppercase tracking-widest px-3 py-1 w-fit text-white"
                            style={{ backgroundColor: heroPrimary.accentColor }}
                          >
                            {heroPrimary.badge}
                          </Badge>
                          <span className="hidden md:flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70">
                            <Sparkles className="h-4 w-4 text-amber-300" />
                            {heroDisplay?.meta?.kicker || "Featured"}
                          </span>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-3xl md:text-4xl font-black text-white leading-tight text-balance max-w-3xl group-hover:text-amber-300 transition-colors duration-300">
                            {heroPrimary.title}
                          </h3>
                          {heroPrimary.summary && (
                            <p className="text-base text-white/85 max-w-2xl leading-relaxed line-clamp-3">
                              {heroPrimary.summary}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm pt-2">
                          {heroPrimary.date && (
                            <span className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span className="font-medium">{heroPrimary.date}</span>
                            </span>
                          )}
                          <span className="hidden sm:block">•</span>
                          <span className="font-medium">{heroPrimary.author}</span>
                        </div>
                        {heroPrimary.actionLabel && heroPrimary.actionUrl && (
                          <div>
                            <Button
                              variant="secondary"
                              className="bg-white/10 backdrop-blur hover:bg-white/20 text-white font-bold uppercase tracking-wider"
                              asChild
                            >
                              <Link to={heroPrimary.actionUrl}>
                                {heroPrimary.actionLabel} <ArrowUpRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </article>
                  </Link>

                  {heroSecondary.length > 0 && (
                    <div className="flex flex-col gap-4">
                      {heroSecondary.map((story, index) => (
                        <Link key={`${story.slug}-${index}`} to={`/article/${story.slug}`} className="group">
                          <article className="flex gap-4 rounded-2xl border border-gray-200 bg-white/95 p-5 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="relative w-28 h-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                              <img
                                src={story.image}
                                alt={story.title}
                                className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            <div className="flex-1 space-y-3">
                              <Badge
                                variant="outline"
                                className="border-none text-xs font-semibold uppercase tracking-wide"
                                style={{ color: story.accentColor, backgroundColor: `${story.accentColor}1a` }}
                              >
                                {story.badge}
                              </Badge>
                              <h4 className="text-lg font-bold leading-snug line-clamp-2 group-hover:text-insightRed transition-colors">
                                {story.title}
                              </h4>
                              {story.summary && (
                                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                  {story.summary}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-medium">
                                {story.date && (
                                  <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {story.date}
                                  </span>
                                )}
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                {story.author}
                              </div>
                            </div>
                          </article>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Latest News Grid */}
            {secondaryStories.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-1 w-8 bg-insightRed rounded-full" />
                  <h2 className="text-3xl font-black tracking-tight">Latest News</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {secondaryStories.map((article: any, index: number) => (
                    <Link
                      key={slugOf(article) + index}
                      to={`/article/${slugOf(article)}`}
                      className="group"
                    >
                      <Card className="h-full overflow-hidden border border-gray-200 hover:border-insightRed shadow-md hover:shadow-2xl transition-all duration-300">
                        <div className="aspect-[16/10] bg-gray-900 flex items-center justify-center overflow-hidden">
                          <img
                            src={imgOf(article)}
                            alt={titleOf(article)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <CardContent className="p-6 space-y-4">
                          <div className="flex items-center justify-between gap-2">
                            <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wide">
                              {categoryOf(article)}
                            </Badge>
                            <span className="text-xs text-gray-500 font-medium">{dateOf(article)}</span>
                          </div>
                          <h3 className="text-xl font-bold line-clamp-2 group-hover:text-insightRed transition-colors leading-tight">
                            {titleOf(article)}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                            {excerptOf(article)}
                          </p>
                          <div className="flex items-center text-insightRed text-sm font-bold pt-2 group-hover:gap-2 transition-all">
                            Read more <ChevronRight className="ml-1 h-4 w-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Category Sections with Cards */}
            {categories.length > 0 && (
              <section className="space-y-12">
                {categories.slice(0, 3).map((category: any) => {
                  const categoryArticles = (categoryBreakdown[category.name] || []).slice(0, 4);
                  if (categoryArticles.length === 0) return null;

                  return (
                    <div key={category.id} className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-1 w-8 bg-insightRed rounded-full" />
                          <h3 className="text-3xl font-black tracking-tight">{category.name}</h3>
                        </div>
                        <Link
                          to={`/category/${category.slug}`}
                          className="text-insightRed hover:text-insightBlack font-bold flex items-center gap-1 text-sm uppercase tracking-wide transition-colors group"
                        >
                          View all <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {categoryArticles.map((article: any, idx: number) => (
                          <Link
                            key={slugOf(article) + idx}
                            to={`/article/${slugOf(article)}`}
                            className="group"
                          >
                            <div className="flex gap-5 p-5 border-2 border-gray-200 rounded-xl hover:border-insightRed hover:bg-insightRed/5 transition-all duration-300">
                              <div className="w-28 h-20 flex-shrink-0 bg-gray-900 rounded-lg overflow-hidden shadow-md">
                                <img
                                  src={imgOf(article)}
                                  alt={titleOf(article)}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-600 font-bold uppercase tracking-wide">
                                  <Calendar className="h-3 w-3" />
                                  {dateOf(article)}
                                </div>
                                <h4 className="font-bold text-base line-clamp-2 group-hover:text-insightRed transition-colors leading-snug">
                                  {titleOf(article)}
                                </h4>
                                <p className="text-sm text-gray-600 line-clamp-1">
                                  {excerptOf(article)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </section>
            )}

            {/* No Results State */}
            {filteredArticles.length === 0 && (
              <div className="text-center py-16">
                <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No articles found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria.</p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                  }}
                  className="bg-insightRed hover:bg-insightRed/90"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Latest Magazine Card */}
            {latestMagazine && (
              <Card className="overflow-hidden border-2 border-insightRed/30 shadow-xl sticky top-24">
                <div className="bg-gradient-to-br from-insightBlack to-insightBlack/90 text-white p-6 space-y-5">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-insightRed" />
                    <h3 className="font-black uppercase tracking-widest text-sm">Latest Issue</h3>
                  </div>
                  
                  <Link to="/magazine" className="block group">
                    <div className="aspect-[3/4] bg-gray-300 rounded-xl overflow-hidden mb-5 shadow-2xl">
                      <img
                        src={latestMagazine.cover_image_url || "/placeholder.svg"}
                        alt={latestMagazine.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-xl font-black group-hover:text-amber-300 transition-colors line-clamp-2">
                      {latestMagazine.title}
                    </h4>
                    <p className="text-sm text-white/70 mt-3 line-clamp-2 leading-relaxed">
                      {latestMagazine.description}
                    </p>
                  </Link>
                  
                  <Link to="/magazine" className="block pt-2">
                    <Button className="w-full bg-insightRed hover:bg-insightRed/90 text-white font-bold uppercase tracking-wider">
                      Read Magazine
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            {/* Trending Articles */}
            {trendingArticles.length > 0 && (
              <Card className="overflow-hidden border-2 border-gray-200 shadow-lg">
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-5 border-b-2 border-gray-200">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-insightRed" />
                    <h3 className="font-black uppercase tracking-widest text-sm">Trending Now</h3>
                  </div>
                </div>
                <ul className="divide-y divide-gray-200">
                  {trendingArticles.slice(0, 6).map((article: any, index: number) => (
                    <li key={slugOf(article) + index} className="hover:bg-insightRed/5 transition-colors duration-200">
                      <Link
                        to={`/article/${slugOf(article)}`}
                        className="flex gap-4 p-5 group"
                      >
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-insightRed/10 text-insightRed font-bold flex items-center justify-center text-xs font-black">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="text-sm font-bold line-clamp-2 group-hover:text-insightRed transition-colors leading-snug">
                            {titleOf(article)}
                          </h4>
                          <div className="text-xs text-gray-500 font-medium">{dateOf(article)}</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Newsletter Signup */}
            <Card className="overflow-hidden bg-gradient-to-br from-insightRed to-insightRed/90 text-white border-0 shadow-xl">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-black">Newsletter</h3>
                  <p className="text-sm text-white/90 leading-relaxed">
                    Get the latest business news delivered to your inbox daily.
                  </p>
                </div>
                <div className="space-y-3 pt-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-white/20 border border-white/30 text-white placeholder:text-white/60 rounded-lg font-medium focus:bg-white/30 focus:border-white transition-all"
                  />
                  <Button className="w-full bg-white text-insightRed hover:bg-gray-100 font-bold uppercase tracking-wider">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border-2 border-gray-200">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-black text-lg uppercase tracking-wide">Quick Links</h3>
                <nav className="space-y-3">
                  <Link to="/magazine" className="block text-insightRed hover:text-insightBlack font-bold text-sm uppercase tracking-wider transition-colors group flex items-center gap-2">
                    <span className="h-1 w-1 bg-insightRed rounded-full" />
                    Magazine
                  </Link>
                  <Link to="/articles" className="block text-insightRed hover:text-insightBlack font-bold text-sm uppercase tracking-wider transition-colors group flex items-center gap-2">
                    <span className="h-1 w-1 bg-insightRed rounded-full" />
                    All Articles
                  </Link>
                  <Link to="/leadership" className="block text-insightRed hover:text-insightBlack font-bold text-sm uppercase tracking-wider transition-colors group flex items-center gap-2">
                    <span className="h-1 w-1 bg-insightRed rounded-full" />
                    Leadership
                  </Link>
                  <Link to="/about" className="block text-insightRed hover:text-insightBlack font-bold text-sm uppercase tracking-wider transition-colors group flex items-center gap-2">
                    <span className="h-1 w-1 bg-insightRed rounded-full" />
                    About Us
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* Newsletter CTA Section */}
      <section className="bg-insightBlack text-white py-16 border-t border-insightRed/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black leading-tight">Stay Updated</h2>
            <p className="text-lg text-white/80 leading-relaxed">
              Never miss breaking news, industry insights, or exclusive stories. Subscribe to {settings?.companyName || "our"} newsletter today.
            </p>
          </div>
          <div className="flex gap-3 max-w-sm mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border border-white/30 text-white placeholder:text-white/50 rounded-lg focus:border-insightRed transition-all"
            />
            <Button className="bg-insightRed hover:bg-insightRed/90 text-white font-bold uppercase tracking-wider px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
