import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useArticles } from "@/hooks/useArticles";
import { Calendar, ArrowRight, Mail } from "lucide-react";
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
function authorOf(a: any) { return a?.author || "Editorial Team"; }

const Home = () => {
  const { data: rawArticles = [] } = useArticles();
  const articles = Array.isArray(rawArticles) ? rawArticles : [];

  const [email, setEmail] = useState("");

  const sorted = useMemo(() => {
    return [...articles].filter(Boolean).sort((a, b) => new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime());
  }, [articles]);

  const categoryGroups = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    sorted.forEach((article) => {
      const cat = categoryOf(article);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(article);
    });
    return groups;
  }, [sorted]);

  const heroPrimary = sorted[0];
  const heroSecondary = sorted.slice(1, 3);

  const businessArticles = categoryGroups["Business"] || [];
  const worldNewsArticles = categoryGroups["World News"] || [];
  const technologyArticles = categoryGroups["Technology"] || [];
  const securityArticles = categoryGroups["Security"] || [];

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email subscribed:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-white text-insightBlack">
      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Main Hero - Large Featured Article */}
            {heroPrimary && (
              <Link to={`/article/${slugOf(heroPrimary)}`} className="lg:col-span-2 group block">
                <article className="relative overflow-hidden rounded-3xl shadow-xl min-h-[400px] bg-black">
                  <div className="absolute inset-0">
                    <img
                      src={imgOf(heroPrimary)}
                      alt={titleOf(heroPrimary)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end p-10 z-10">
                    <div className="space-y-4">
                      <h2 className="text-4xl md:text-5xl font-black text-white leading-tight group-hover:text-insightGold transition-colors">
                        {titleOf(heroPrimary)}
                      </h2>
                      {excerptOf(heroPrimary) && (
                        <p className="text-base text-white/85 max-w-2xl leading-relaxed">
                          {excerptOf(heroPrimary)}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-white/70 text-sm pt-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{dateOf(heroPrimary)}</span>
                        <span>•</span>
                        <span className="font-medium">{authorOf(heroPrimary)}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* Secondary Hero Stories */}
            <div className="flex flex-col gap-4">
              {heroSecondary.map((article, index) => (
                <Link key={`hero-${index}`} to={`/article/${slugOf(article)}`} className="group">
                  <article className="relative overflow-hidden rounded-2xl shadow-lg min-h-[190px] bg-black flex flex-col justify-end p-6">
                    <div className="absolute inset-0">
                      <img
                        src={imgOf(article)}
                        alt={titleOf(article)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    </div>
                    <div className="relative z-10 space-y-2">
                      <div className="inline-block">
                        <Badge className="bg-insightRed text-white text-xs font-bold px-3 py-1">
                          {categoryOf(article)}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-black text-white leading-tight group-hover:text-insightGold transition-colors">
                        {titleOf(article)}
                      </h3>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Business Section */}
      {businessArticles.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <span className="h-1 w-8 bg-yellow-400 rounded-full" />
                <h2 className="text-3xl font-black text-insightBlack">Business</h2>
              </div>
              <Link to="/category/business" className="flex items-center gap-2 bg-insightGold text-insightBlack px-6 py-2 rounded-full font-bold text-sm hover:bg-insightGold/90 transition-colors">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Business Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Featured Business Article */}
              {businessArticles[0] && (
                <Link to={`/article/${slugOf(businessArticles[0])}`} className="lg:col-span-1 group block">
                  <article className="overflow-hidden rounded-2xl shadow-lg">
                    <div className="relative aspect-[1/1] bg-black overflow-hidden">
                      <img
                        src={imgOf(businessArticles[0])}
                        alt={titleOf(businessArticles[0])}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 space-y-3">
                      <h3 className="text-lg font-bold leading-snug group-hover:text-insightRed transition-colors line-clamp-2">
                        {titleOf(businessArticles[0])}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{dateOf(businessArticles[0])}</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {excerptOf(businessArticles[0])}
                      </p>
                    </div>
                  </article>
                </Link>
              )}

              {/* Business Articles List */}
              <div className="lg:col-span-2 space-y-4">
                {businessArticles.slice(1, 5).map((article, index) => (
                  <Link key={`business-${index}`} to={`/article/${slugOf(article)}`} className="group block">
                    <article className="flex gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-insightRed hover:bg-red-50 transition-all">
                      <div className="w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900">
                        <img
                          src={imgOf(article)}
                          alt={titleOf(article)}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold">{categoryOf(article)}</p>
                        <h4 className="font-bold text-base line-clamp-2 group-hover:text-insightRed transition-colors leading-snug">
                          {titleOf(article)}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {excerptOf(article)}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* World News & Technology News */}
      {(worldNewsArticles.length > 0 || technologyArticles.length > 0) && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* World News */}
              {worldNewsArticles.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black text-insightBlack">World News</h3>
                    <Link to="/category/world-news" className="text-insightRed hover:text-insightBlack font-bold text-sm flex items-center gap-1">
                      View all <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {worldNewsArticles.slice(0, 4).map((article, index) => (
                      <Link key={`world-${index}`} to={`/article/${slugOf(article)}`} className="group">
                        <article className="relative overflow-hidden rounded-xl shadow-lg min-h-[200px] bg-black flex flex-col justify-end p-4">
                          <div className="absolute inset-0">
                            <img
                              src={imgOf(article)}
                              alt={titleOf(article)}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                          </div>
                          <div className="relative z-10 space-y-2">
                      {index === 0 && (
                        <Badge className="bg-insightGold text-insightBlack text-xs font-bold w-fit px-2 py-1">
                          Featured
                        </Badge>
                      )}
                      <h4 className="text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-insightGold transition-colors">
                        {titleOf(article)}
                      </h4>
                    </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Technology News */}
              {technologyArticles.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black text-insightBlack">Technology News</h3>
                    <Link to="/category/technology" className="text-insightRed hover:text-insightBlack font-bold text-sm flex items-center gap-1">
                      View all <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {technologyArticles.slice(0, 6).map((article, index) => (
                      <Link key={`tech-${index}`} to={`/article/${slugOf(article)}`} className="group">
                        <article className="flex gap-3 p-3 border border-gray-200 rounded-lg hover:border-insightRed hover:bg-red-50 transition-all">
                          <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900">
                            <img
                              src={imgOf(article)}
                              alt={titleOf(article)}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold">News</p>
                            <h4 className="font-bold text-sm line-clamp-2 group-hover:text-insightRed transition-colors leading-snug">
                              {titleOf(article)}
                            </h4>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Security Section */}
      {securityArticles.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <span className="h-1 w-8 bg-yellow-400 rounded-full" />
                <h2 className="text-3xl font-black text-insightBlack">Security</h2>
              </div>
              <Link to="/category/security" className="flex items-center gap-2 bg-insightGold text-insightBlack px-6 py-2 rounded-full font-bold text-sm hover:bg-insightGold/90 transition-colors">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Security Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Featured Security Article */}
              {securityArticles[0] && (
                <Link to={`/article/${slugOf(securityArticles[0])}`} className="lg:col-span-2 group block">
                  <article className="relative overflow-hidden rounded-2xl shadow-lg min-h-[300px] bg-black flex flex-col justify-end p-8">
                    <div className="absolute inset-0">
                      <img
                        src={imgOf(securityArticles[0])}
                        alt={titleOf(securityArticles[0])}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    </div>
                    <div className="relative z-10 space-y-4">
                      <div className="inline-block">
                        <Badge className="bg-insightRed text-white text-xs font-bold px-3 py-1">
                          {categoryOf(securityArticles[0])}
                        </Badge>
                      </div>
                      <h3 className="text-3xl font-black text-white leading-tight group-hover:text-yellow-300 transition-colors">
                        {titleOf(securityArticles[0])}
                      </h3>
                      {excerptOf(securityArticles[0]) && (
                        <p className="text-base text-white/80 max-w-2xl leading-relaxed">
                          {excerptOf(securityArticles[0])}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              )}

              {/* Security Articles List */}
              <div className="space-y-4">
                {securityArticles.slice(1, 4).map((article, index) => (
                  <Link key={`security-${index}`} to={`/article/${slugOf(article)}`} className="group block">
                    <article className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
                      <div className="relative aspect-video bg-black overflow-hidden">
                        <img
                          src={imgOf(article)}
                          alt={titleOf(article)}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 bg-white space-y-2">
                        <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold">News</p>
                        <h4 className="font-bold text-base line-clamp-2 group-hover:text-insightRed transition-colors">
                          {titleOf(article)}
                        </h4>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-insightBlack text-white border-t border-gray-200">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black leading-tight">Join our news later</h2>
            <p className="text-lg text-white/80 leading-relaxed">
              Get the latest news and updates delivered straight to your inbox
            </p>
          </div>
          <form onSubmit={handleEmailSubmit} className="flex gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/10 border border-white/30 text-white placeholder:text-white/60 rounded-lg focus:border-yellow-400 transition-all"
            />
            <Button type="submit" className="bg-yellow-400 text-insightBlack hover:bg-yellow-500 font-bold px-6">
              <Mail className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
