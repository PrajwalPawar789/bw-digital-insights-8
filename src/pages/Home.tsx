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
import Seo from "@/components/seo/Seo";
import { buildBreadcrumbSchema, getSiteOrigin } from "@/lib/seo";

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

  const { main, leftSide, rightSide, headlines, mostRead, latestGrid, latestMagazine } = useMemo(() => {
    const byDate = [...articles].filter(Boolean).sort((a, b) => new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime());
    const featuredFirst = [...byDate].sort((a, b) => (b?.featured ? 1 : 0) - (a?.featured ? 1 : 0));
    
    const main = featuredFirst[0];
    const leftSide = featuredFirst.slice(1, 3);
    const rightSide = featuredFirst.slice(3, 5);
    const headlines = featuredFirst.slice(5, 13);
    const mostRead = byDate.slice(0, 4);
    const latestGrid = byDate.slice(11, 15);
    const latestMagazine = magazines[0] || null;
    
    return { main, leftSide, rightSide, headlines, mostRead, latestGrid, latestMagazine };
  }, [articles, magazines]);

  const siteOrigin = getSiteOrigin();
  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([{ name: "Home", url: siteOrigin }])
    : undefined;
  const seoImage = latestMagazine?.cover_image_url || main?.image_url || "/ciovision-logo.svg";
  const seoDescription = `${settings.companyName} delivers executive interviews, market intelligence, and leadership insights for business leaders.`;

  return (
    <>
      <Seo
        description={seoDescription}
        image={seoImage}
        schema={breadcrumbSchema ? [breadcrumbSchema] : undefined}
      />
      <div className="min-h-screen bg-white">
      {/* Headline ticker */}
      {/* <div className="bg-insightBlack text-white overflow-hidden">
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
      </div> */}

      {/* HERO split */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left rail: 2 Cards */}
          <aside className="lg:col-span-3 space-y-6">
            {leftSide.map((a: any, i: number) => (
              <Link key={slugOf(a) + i} to={`/article/${slugOf(a)}`} className="block group rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition bg-white">
                <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img src={imgOf(a)} alt={titleOf(a)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <div className="text-xs text-insightRed font-bold mb-2 uppercase tracking-wider">{categoryOf(a)}</div>
                  <h3 className="font-bold text-lg leading-tight group-hover:text-insightRed transition-colors line-clamp-2">{titleOf(a)}</h3>
                </div>
              </Link>
            ))}
          </aside>

          {/* Center: Main Feature */}
          <div className="lg:col-span-6 space-y-6">
            {main && (
              <article className="space-y-4">
                <Link to={`/article/${slugOf(main)}`} className="block group rounded-2xl overflow-hidden shadow-lg bg-white">
                  <div className="w-full aspect-[16/9] bg-gray-100 flex items-center justify-center">
                    <img src={imgOf(main)} alt={titleOf(main)} className="max-h-full max-w-full object-contain" />
                  </div>
                </Link>

                <div className="p-4 bg-white rounded-md">
                  {/* category tag removed as requested */}
                  <h1 style={{ fontSize: '27px' }} className="font-bold leading-tight text-insightBlack">{titleOf(main)}</h1>
                  <p className="text-gray-700 mt-2 line-clamp-2 md:line-clamp-3">{excerptOf(main)}</p>
                  <Link to={`/article/${slugOf(main)}`} className="inline-flex items-center text-insightRed hover:text-insightBlack font-medium mt-3">Read full story <ChevronRight className="ml-1 h-4 w-4"/></Link>
                </div>
              </article>
            )}

          </div>

          {/* Right: 2 Cards */}
          <aside className="lg:col-span-3 space-y-6">
            {rightSide.map((a: any, i: number) => (
              <Link key={slugOf(a) + i} to={`/article/${slugOf(a)}`} className="block group rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition bg-white">
                <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img src={imgOf(a)} alt={titleOf(a)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <div className="text-xs text-insightRed font-bold mb-2 uppercase tracking-wider">{categoryOf(a)}</div>
                  <h3 className="font-bold text-lg leading-tight group-hover:text-insightRed transition-colors line-clamp-2">{titleOf(a)}</h3>
                </div>
              </Link>
            ))}
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
                  <div className="aspect-[16/10] bg-black flex items-center justify-center">
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

          {/* Trending section removed per design request */}
        </div>
      </section>

      {/* Category sections removed (Technology / Leadership / Analytics) per request */}

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
    </>
  );
};

export default Home;
