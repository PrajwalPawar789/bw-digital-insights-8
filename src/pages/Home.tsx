import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useArticles, useFeaturedArticles } from "@/hooks/useArticles";
import { useMagazines } from "@/hooks/useMagazines";
import { useLeadershipProfiles } from "@/hooks/useLeadership";
import { usePressReleases } from "@/hooks/usePressReleases";
import { useSettings } from "@/hooks/useSettings";
import { Calendar, ChevronRight, Newspaper, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  const { data: rawArticles = [], isLoading: articlesLoading } = useArticles();
  const { data: rawMagazines = [], isLoading: magazinesLoading } = useMagazines();
  const { data: featured = [] } = useFeaturedArticles();
  const { settings } = useSettings();
  const { data: leadership = [] } = useLeadershipProfiles();
  const { data: press = [] } = usePressReleases();

  const articles = Array.isArray(rawArticles) ? rawArticles : [];
  const magazines = Array.isArray(rawMagazines) ? rawMagazines : [];

  const { main, secondary, headlines, mostRead, latestGrid, latestMagazine } = useMemo(() => {
    const byDate = [...articles].filter(Boolean).sort((a, b) => new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime());
    const featuredFirst = [...byDate].sort((a, b) => (b?.featured ? 1 : 0) - (a?.featured ? 1 : 0));
    const main = featuredFirst[0];
    const secondary = featuredFirst.slice(1, 3);
    const headlines = featuredFirst.slice(3, 11);
    const mostRead = byDate.slice(0, 5);
    const latestGrid = byDate.slice(11, 15);
    const latestMagazine = magazines[0] || null;
    return { main, secondary, headlines, mostRead, latestGrid, latestMagazine };
  }, [articles, magazines]);

  if (articlesLoading || magazinesLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-insightRed mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Premium News Ticker */}
      <div className="bg-insightBlack text-white overflow-hidden border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-3">
            <Badge className="bg-insightRed text-white hover:bg-insightRed/90 font-semibold uppercase tracking-wider">
              <Newspaper className="w-3.5 h-3.5 mr-1.5" /> Breaking News
            </Badge>
            <div className="relative flex-1 overflow-hidden">
              <div className="whitespace-nowrap animate-marquee">
                {[...(headlines.length ? headlines : articles.slice(0, 8))].map((a: any, i: number) => (
                  <Link 
                    key={slugOf(a) + i} 
                    to={`/article/${slugOf(a)}`} 
                    className="inline-flex items-center text-sm text-white/90 hover:text-white transition-colors mx-8 font-medium"
                  >
                    {titleOf(a)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Premium Content Focus */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Main Featured Story */}
            <div className="lg:col-span-8 space-y-6">
              {main ? (
                <article className="group">
                  <Link to={`/article/${slugOf(main)}`} className="block">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-insightBlack">
                      <div className="aspect-[16/9] bg-gradient-to-br from-gray-900 to-insightBlack flex items-center justify-center">
                        <img 
                          src={imgOf(main)} 
                          alt={titleOf(main)} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-insightBlack/90 via-insightBlack/40 to-transparent" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <Badge className="bg-insightRed text-white mb-4 font-bold uppercase tracking-wider">
                          {categoryOf(main)}
                        </Badge>
                        <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white mb-4 group-hover:text-insightRed/90 transition-colors">
                          {titleOf(main)}
                        </h1>
                        <p className="text-white/90 text-lg mb-4 line-clamp-2 max-w-3xl">
                          {excerptOf(main)}
                        </p>
                        <div className="flex items-center gap-4 text-white/70 text-sm">
                          <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {dateOf(main)}
                          </span>
                          <span>•</span>
                          <span>{main?.author || "Editorial Team"}</span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {secondary.map((a: any, i: number) => (
                      <Link 
                        key={slugOf(a) + i} 
                        to={`/article/${slugOf(a)}`} 
                        className="group block bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden">
                          <img 
                            src={imgOf(a)} 
                            alt={titleOf(a)} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        <div className="p-5">
                          <Badge variant="outline" className="mb-2 text-xs">
                            {categoryOf(a)}
                          </Badge>
                          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-insightRed transition-colors mb-2">
                            {titleOf(a)}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {excerptOf(a)}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {dateOf(a)}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </article>
              ) : (
                <div className="text-center py-12 text-gray-500">No featured articles available</div>
              )}
            </div>

            {/* Right Sidebar - Magazine & Trending */}
            <aside className="lg:col-span-4 space-y-6">
              {latestMagazine && (
                <div className="bg-gradient-to-br from-insightBlack to-gray-900 rounded-2xl p-6 text-white shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-insightRed" />
                    <h3 className="font-bold text-lg uppercase tracking-wider">Latest Issue</h3>
                  </div>
                  <Link to="/magazine" className="block group">
                    <div className="relative rounded-xl overflow-hidden mb-4 shadow-2xl">
                      <img 
                        src={latestMagazine.cover_image_url || "/placeholder.svg"} 
                        alt={latestMagazine.title || "Latest Magazine"} 
                        className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="font-bold text-xl mb-2 group-hover:text-insightRed transition-colors">
                      {latestMagazine.title}
                    </h4>
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">
                      {latestMagazine.description}
                    </p>
                    <Button className="w-full bg-insightRed hover:bg-insightRed/90 text-white font-semibold">
                      Read Magazine <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-bold uppercase tracking-wider text-sm text-insightBlack">
                    Most Read Today
                  </h3>
                </div>
                <ul className="divide-y divide-gray-100">
                  {mostRead.slice(0, 5).map((a: any, i: number) => (
                    <li key={slugOf(a) + i} className="hover:bg-gray-50 transition-colors">
                      <Link to={`/article/${slugOf(a)}`} className="flex gap-4 p-4 group">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-insightRed/10 text-insightRed font-bold flex items-center justify-center text-sm">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <Badge variant="outline" className="mb-1.5 text-xs">
                            {categoryOf(a)}
                          </Badge>
                          <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-insightRed transition-colors mb-1">
                            {titleOf(a)}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {dateOf(a)}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Editor's Picks */}
      <section className="py-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-insightBlack">Editor's Picks</h2>
            <Link to="/articles" className="text-sm font-semibold text-insightRed hover:text-insightBlack">View all</Link>
          </div>

          <div className="flex gap-4 overflow-x-auto py-2 -mx-4 px-4">
            {(featured && featured.length ? featured : latestGrid).map((a:any,i:number)=>(
              <Link key={slugOf(a)+i} to={`/article/${slugOf(a)}`} className="min-w-[260px] max-w-[320px] bg-white rounded-lg shadow group overflow-hidden">
                <div className="aspect-[16/10] bg-black flex items-center justify-center">
                  <img src={imgOf(a)} alt={titleOf(a)} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <div className="text-xs text-gray-500 mb-1">{categoryOf(a)}</div>
                  <h3 className="font-semibold line-clamp-2 group-hover:text-insightRed">{titleOf(a)}</h3>
                  <div className="text-xs text-gray-400 mt-2 flex items-center gap-2"><Calendar className="h-3 w-3"/>{dateOf(a)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Stories */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-insightBlack">Top Stories</h2>
            <Link to="/articles" className="text-sm font-semibold text-insightRed hover:text-insightBlack">See all</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(() => {
              const sorted = [...articles].filter(Boolean).sort((a:any,b:any)=>new Date(b?.date||0).getTime()-new Date(a?.date||0).getTime());
              const top = sorted.slice(0,6);
              return top.map((a:any,i:number)=> (
                <Link key={slugOf(a)+i} to={`/article/${slugOf(a)}`}>
                  <Card className="overflow-hidden group hover:shadow-lg transition">
                    <div className="aspect-[16/10] bg-black flex items-center justify-center">
                      <img src={imgOf(a)} alt={titleOf(a)} className="w-full h-full object-contain"/>
                    </div>
                    <CardContent className="pt-4">
                      <div className="text-xs text-gray-500 mb-1">{categoryOf(a)}</div>
                      <h3 className="font-semibold line-clamp-2 group-hover:text-insightRed">{titleOf(a)}</h3>
                      <div className="text-xs text-gray-400 mt-2 flex items-center gap-2"><Calendar className="h-3 w-3"/>{dateOf(a)}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            })()}
          </div>
        </div>
      </section>

      {/* Category sections */}
      <section className="py-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(() => {
              const sorted = [...articles].filter(Boolean).sort((a:any,b:any)=>new Date(b?.date||0).getTime()-new Date(a?.date||0).getTime());
              const cats = Array.from(new Set(sorted.map(s=>s.category).filter(Boolean))).slice(0,3);
              return cats.map((cat:string)=> {
                const items = sorted.filter(s=>s.category===cat).slice(0,4);
                return (
                  <div key={cat} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg">{cat}</h4>
                      <Link to={`/category/${encodeURIComponent(cat)}`} className="text-sm text-insightRed">View all</Link>
                    </div>
                    <div className="space-y-3">
                      {items.map((it:any,i:number)=> (
                        <Link key={slugOf(it)+i} to={`/article/${slugOf(it)}`} className="flex items-center gap-3 group">
                          <img src={imgOf(it)} alt={titleOf(it)} className="w-20 h-14 object-contain bg-black rounded"/>
                          <div>
                            <h5 className="font-medium line-clamp-2 group-hover:text-insightRed">{titleOf(it)}</h5>
                            <div className="text-xs text-gray-400">{dateOf(it)}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })
            })()}
          </div>
        </div>
      </section>

      {/* Leadership Spotlight */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-insightBlack">Leadership Spotlight</h2>
            <Link to="/leadership" className="text-sm font-semibold text-insightRed hover:text-insightBlack">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(leadership || []).slice(0,3).map((l:any)=> (
              <Card key={l.id} className="overflow-hidden hover:shadow-lg">
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <img src={l.image_url || '/placeholder.svg'} alt={l.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="p-4 text-center">
                  <div className="text-insightRed font-semibold text-sm">{l.title}</div>
                  <h3 className="font-semibold text-lg">{l.name}</h3>
                  {l.company && <div className="text-sm text-gray-500">{l.company}</div>}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-insightBlack">Press Releases</h2>
            <Link to="/press-releases" className="text-sm font-semibold text-insightRed hover:text-insightBlack">View all</Link>
          </div>
          <div className="space-y-4">
            {(press || []).slice(0,4).map((p:any)=> (
              <Link key={p.id} to={`/press-releases/${p.slug}`} className="flex items-start gap-4 group rounded-lg p-4 border border-gray-100 hover:shadow-md bg-white">
                <img src={p.image_url||'/placeholder.svg'} alt={p.title} className="w-28 h-20 object-cover bg-black rounded"/>
                <div>
                  <div className="text-xs font-bold text-insightRed uppercase tracking-wide mb-1">{p.category||'Update'}</div>
                  <h3 className="font-semibold line-clamp-2 group-hover:text-insightRed">{p.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.excerpt}</p>
                  <div className="text-xs text-gray-400 mt-2">{dateOf(p)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-insightRed text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-3">Subscribe to {settings.companyName}</h3>
            <p className="text-white/90 mb-5">Monthly strategies and interviews for leaders. No noise, just signal.</p>
            <Link to="/magazine">
              <Button size="lg" className="bg-white text-insightRed hover:bg-gray-100">
                <BookOpen className="mr-2 h-5 w-5"/> Explore Issues
              </Button>
            </Link>
          </div>
          <div className="hidden lg:block justify-self-end">
            <img src={latestMagazine?.cover_image_url || "/placeholder.svg"} alt="Latest" className="w-64 rounded-lg shadow-2xl -rotate-6"/>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
