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
  const { data: rawArticles = [] } = useArticles();
  const { data: rawMagazines = [] } = useMagazines();
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
    const mostRead = byDate.slice(0, 6);
    const latestGrid = byDate.slice(11, 15);
    const latestMagazine = magazines[0] || null;
    return { main, secondary, headlines, mostRead, latestGrid, latestMagazine };
  }, [articles, magazines]);

  return (
    <div className="min-h-screen bg-white">
      {/* Headline ticker */}
      <div className="bg-insightBlack text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-insightRed text-white text-xs font-bold uppercase tracking-wide">
              <Newspaper className="w-3 h-3 mr-1" /> Latest
            </span>
            <div className="relative flex-1 overflow-hidden">
              <div className="whitespace-nowrap animate-marquee">
                {[...(headlines.length ? headlines : articles.slice(0, 8))].map((a: any, i: number) => (
                  <Link key={slugOf(a) + i} to={`/article/${slugOf(a)}`} className="inline-flex items-center text-sm text-white/90 hover:text-white mx-6">
                    {titleOf(a)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HERO split */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left rail: Most Read */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-200 font-semibold uppercase tracking-wide text-sm text-insightBlack">Most Read</div>
              <ul className="divide-y divide-gray-200 max-h-[560px] overflow-auto">
                {mostRead.map((a: any, i: number) => (
                  <li key={slugOf(a) + i} className="p-4 hover:bg-white transition">
                    <Link to={`/article/${slugOf(a)}`} className="flex gap-3 group items-start">
                      <img src={imgOf(a)} alt={titleOf(a)} className="w-18 h-18 min-w-[72px] min-h-[72px] rounded object-cover flex-shrink-0" />
                      <div className="leading-snug">
                        <div className="text-xs text-gray-500 mb-1">{categoryOf(a)}</div>
                        <h4 className="font-semibold group-hover:text-insightRed line-clamp-2">{titleOf(a)}</h4>
                        <div className="text-xs text-gray-500 mt-1">{dateOf(a)}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Center: Main Feature */}
          <div className="lg:col-span-6 space-y-6">
            {main && (
              <article className="space-y-4">
                <Link to={`/article/${slugOf(main)}`} className="block group rounded-2xl overflow-hidden shadow-lg bg-black">
                  <div className="w-full aspect-[16/9] bg-black flex items-center justify-center">
                    <img src={imgOf(main)} alt={titleOf(main)} className="w-full h-full object-cover" />
                  </div>
                </Link>

                <div className="p-4 bg-white rounded-md">
                  <div className="inline-flex px-3 py-1 rounded bg-insightRed text-white text-xs font-bold mb-3">{categoryOf(main)}</div>
                  <h1 className="text-3xl md:text-4xl font-bold leading-tight text-insightBlack">{titleOf(main)}</h1>
                  <p className="text-gray-700 mt-2 line-clamp-2 md:line-clamp-3">{excerptOf(main)}</p>
                  <Link to={`/article/${slugOf(main)}`} className="inline-flex items-center text-insightRed hover:text-insightBlack font-medium mt-3">Read full story <ChevronRight className="ml-1 h-4 w-4"/></Link>
                </div>
              </article>
            )}

            {/* Headlines list under hero */}
            <div className="bg-gray-50 rounded-xl border border-gray-200">
              <div className="px-5 py-3 border-b border-gray-200 font-semibold uppercase tracking-wide text-sm text-insightBlack">Latest Headlines</div>
              <ul className="divide-y divide-gray-200">
                {headlines.map((a: any, i: number) => (
                  <li key={slugOf(a) + i} className="p-4 hover:bg-white transition">
                    <Link to={`/article/${slugOf(a)}`} className="flex items-start gap-4 group">
                      <span className="mt-1 inline-block w-6 h-6 rounded-full bg-insightRed/10 text-insightRed text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold group-hover:text-insightRed line-clamp-2">{titleOf(a)}</h4>
                        <div className="text-xs text-gray-500 mt-1">{dateOf(a)}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-insightRed"/>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Secondary cards + Magazine promo */}
          <aside className="lg:col-span-3 space-y-6">
            {secondary.map((a: any, i: number) => (
              <Link key={slugOf(a) + i} to={`/article/${slugOf(a)}`} className="block group rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition">
                <div className="aspect-video bg-black">
                  <img src={imgOf(a)} alt={titleOf(a)} className="w-full h-full object-cover" />
                </div>
              </Link>
            ))}

            <Card className="overflow-hidden">
              <div className="aspect-[3/4] bg-black">
                <img src={latestMagazine?.cover_image_url || "/placeholder.svg"} alt={latestMagazine?.title || "Latest Magazine"} className="w-full h-full object-cover"/>
              </div>
            </Card>
          </aside>
        </div>
      </section>

      {/* Redesigned Editor's Picks - horizontal scroller */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-insightBlack">Editor's Picks</h2>
            <Link to="/articles" className="text-sm font-semibold text-insightRed hover:text-insightBlack">View all</Link>
          </div>

          <div className="flex gap-4 overflow-x-auto py-2 -mx-4 px-4 snap-x snap-mandatory no-scrollbar">
            {(featured && featured.length ? featured : latestGrid).map((a:any,i:number)=>(
              <Link key={slugOf(a)+i} to={`/article/${slugOf(a)}`} className="min-w-[300px] max-w-[300px] bg-white rounded-lg shadow group overflow-hidden">
                <div className="aspect-[16/9] bg-gray-100 overflow-hidden flex items-center justify-center rounded-t-lg">
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

      {/* Top Stories grid & Trending */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-insightBlack">Top Stories</h2>
            <Link to="/articles" className="text-sm font-semibold text-insightRed hover:text-insightBlack">See all</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(() => {
              const sorted = [...articles].filter(Boolean).sort((a:any,b:any)=>new Date(b?.date||0).getTime()-new Date(a?.date||0).getTime());
              const top = sorted.slice(0,6);
              return top.map((a:any,i:number)=> (
                <Card key={slugOf(a)+i} className="overflow-hidden group hover:shadow-lg transition">
                  <div className="aspect-[16/9] bg-gray-100 overflow-hidden flex items-center justify-center rounded-t-lg">
                    <img src={imgOf(a)} alt={titleOf(a)} className="w-full h-full object-contain"/>
                  </div>
                  <CardContent>
                    <div className="text-xs text-gray-500 mb-1">{categoryOf(a)}</div>
                    <h3 className="font-semibold line-clamp-2 group-hover:text-insightRed">{titleOf(a)}</h3>
                    <div className="text-xs text-gray-400 mt-2 flex items-center gap-2"><Calendar className="h-3 w-3"/>{dateOf(a)}</div>
                  </CardContent>
                </Card>
              ))
            })()}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3 text-insightBlack">Trending</h3>
            <div className="flex gap-4 overflow-x-auto py-2 -mx-4 px-4 snap-x snap-mandatory no-scrollbar">
              {articles.slice(0,10).map((a:any,i:number)=> (
                <Link key={slugOf(a)+i} to={`/article/${slugOf(a)}`} className="min-w-[220px] bg-white rounded-md shadow-sm overflow-hidden group">
                  <div className="flex items-center gap-3 p-3">
                    <img src={imgOf(a)} alt={titleOf(a)} className="w-20 h-14 object-cover bg-black rounded"/>
                    <div>
                      <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-insightRed">{titleOf(a)}</h4>
                      <div className="text-xs text-gray-400 mt-1">{dateOf(a)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category sections (3) */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(() => {
              const sorted = [...articles].filter(Boolean).sort((a:any,b:any)=>new Date(b?.date||0).getTime()-new Date(a?.date||0).getTime());
              const cats = Array.from(new Set(sorted.map(s=>s.category).filter(Boolean))).slice(0,3);
              return cats.map((cat:string, idx:number)=> {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-insightBlack">Leadership Spotlight</h2>
            <Link to="/leadership" className="text-sm font-semibold text-insightRed hover:text-insightBlack">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(leadership || []).slice(0,3).map((l:any)=> (
              <Card key={l.id} className="overflow-hidden hover:shadow-lg">
                <div className="flex items-stretch gap-0 md:gap-0">
                  <div className="w-1/3 hidden md:block bg-black">
                    <img src={l.image_url || '/placeholder.svg'} alt={l.name} className="w-full h-full object-cover"/>
                  </div>
                  <div className="p-4 flex-1">
                    <div className="text-insightRed font-semibold text-sm">{l.title}</div>
                    <h3 className="font-semibold text-lg group-hover:text-insightRed">{l.name}</h3>
                    {l.company && <div className="text-sm text-gray-500">{l.company}</div>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-insightBlack">Press Releases</h2>
            <Link to="/press-releases" className="text-sm font-semibold text-insightRed hover:text-insightBlack">View all</Link>
          </div>
          <div className="space-y-4">
            {(press || []).slice(0,4).map((p:any)=> (
              <Link key={p.id} to={`/press-releases/${p.slug}`} className="flex items-start gap-4 group rounded-lg p-4 border border-gray-100 hover:shadow-md bg-white">
                <img src={p.image_url||'/placeholder.svg'} alt={p.title} className="w-28 h-20 object-cover rounded"/>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
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
