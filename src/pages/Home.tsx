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
  const { data: rawArticles = [], isLoading: articlesLoading, error: articlesError } = useArticles();
  const { data: rawMagazines = [], isLoading: magazinesLoading } = useMagazines();
  const { data: featured = [] } = useFeaturedArticles();
  const { settings } = useSettings();
  const { data: leadership = [] } = useLeadershipProfiles();
  const { data: press = [] } = usePressReleases();

  // Debug logging
  console.log('Home component rendering', { 
    articlesCount: rawArticles?.length, 
    magazinesCount: rawMagazines?.length,
    articlesLoading,
    articlesError 
  });

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
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left rail: Most Read */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-200 font-semibold uppercase tracking-wide text-sm text-insightBlack">Most Read</div>
              <ul className="divide-y divide-gray-200">
                {mostRead.map((a: any, i: number) => (
                  <li key={slugOf(a) + i} className="p-4 hover:bg-white transition">
                    <Link to={`/article/${slugOf(a)}`} className="flex gap-3 group items-start">
                      <span className="mt-1 inline-block w-6 h-6 rounded-full bg-insightRed/10 text-insightRed text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      <img src={imgOf(a)} alt={titleOf(a)} className="w-20 h-14 rounded object-contain bg-gray-100 flex-shrink-0" />
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
                <Link to={`/article/${slugOf(main)}`} className="block group rounded-2xl overflow-hidden shadow-lg bg-white">
                  <div className="w-full aspect-[16/9] bg-gray-100 flex items-center justify-center">
                    <img src={imgOf(main)} alt={titleOf(main)} className="block mx-auto max-h-full max-w-full object-contain" />
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

          </div>

          {/* Right: Secondary cards + Magazine promo */}
          <aside className="lg:col-span-3 space-y-6">
            {secondary.map((a: any, i: number) => (
              <Link key={slugOf(a) + i} to={`/article/${slugOf(a)}`} className="block group rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition">
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <img src={imgOf(a)} alt={titleOf(a)} className="max-h-full max-w-full object-contain" />
                </div>
              </Link>
            ))}

            <Card className="overflow-hidden">
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <img src={latestMagazine?.cover_image_url || "/placeholder.svg"} alt={latestMagazine?.title || "Latest Magazine"} className="max-h-full max-w-full object-contain"/>
              </div>
            </Card>
          </aside>
        </div>
      </section>

      {/* Disciplines behind enduring growth */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-bold text-insightBlack">The disciplines behind enduring growth</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Every issue dissects how modern enterprises link people, culture, process, and accountability to deliver meaningful progress. These pillars frame every story we publish.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            {growthPillars.map(({ title, description, icon: Icon }) => (
              <div key={title} className="h-full rounded-2xl border border-gray-200 bg-gray-50 p-6 text-left shadow-sm">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-insightRed/10 text-insightRed">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-xl font-semibold text-insightBlack">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth flywheel + supporting stories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl font-bold text-insightBlack">Where does growth come from?</h2>
            <p className="text-gray-600 text-lg">
              Sustainable growth arrives when past customer actions fuel the playbook for new audiences. We translate those actions into repeatable rituals so teams can move with confidence.
            </p>
            <div className="space-y-4">
              {flywheelSignals.map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-xl bg-white p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-4">
                    <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-insightRed/10 text-insightRed">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-insightBlack">{title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 space-y-5">
            {supportingStories.map((story: any) => (
              <Link
                key={slugOf(story)}
                to={`/article/${slugOf(story)}`}
                className="flex flex-col sm:flex-row gap-5 rounded-2xl bg-white p-5 border border-gray-200 hover:border-insightRed/60 hover:shadow-lg transition"
              >
                <div className="sm:w-48 flex-shrink-0">
                  <div className="aspect-[4/3] rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img src={imgOf(story)} alt={titleOf(story)} className="h-full w-full object-cover" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-insightRed font-semibold">
                    <span>{categoryOf(story)}</span>
                    <span className="text-gray-400">{dateOf(story)}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-insightBlack group-hover:text-insightRed transition">
                    {titleOf(story)}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">{excerptOf(story)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Insights grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-insightBlack">Insights engineered for action</h2>
              <p className="text-gray-600 mt-2 max-w-2xl">
                These articles break down the systems, metrics, and cultural shifts that keep operators moving. Explore frameworks that convert ambition into measurable progress.
              </p>
            </div>
            <Link to="/articles" className="inline-flex items-center text-insightRed font-semibold">
              View all insights
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {insightStories.map((story: any) => (
              <Card key={slugOf(story)} className="h-full flex flex-col">
                <div className="aspect-[16/10] bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img src={imgOf(story)} alt={titleOf(story)} className="h-full w-full object-cover" />
                </div>
                <CardContent className="p-5 flex flex-col gap-3 flex-1">
                  <div className="text-xs uppercase tracking-wide text-insightRed font-semibold">
                    {categoryOf(story)}
                  </div>
                  <h3 className="text-lg font-semibold text-insightBlack line-clamp-2">{titleOf(story)}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3 flex-1">{excerptOf(story)}</p>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {dateOf(story)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Voices of leadership */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-insightBlack">Voices of leadership</h2>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Leaders share how they architect culture, invest in people, and operationalize accountability. Their lessons inform every issue of the magazine.
              </p>
            </div>
            <Link to="/leadership" className="inline-flex items-center text-insightRed font-semibold">
              Meet the leaders
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadershipSpotlight.map((leader: any) => (
              <Card key={leader.id} className="group overflow-hidden border border-gray-200">
                <div className="h-56 bg-gray-100 flex items-center justify-center">
                  <img
                    src={leader.image_url || "/placeholder.svg"}
                    alt={leader.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <CardContent className="p-6 space-y-3">
                  <div className="text-xs uppercase tracking-wide text-insightRed font-semibold">Leadership</div>
                  <h3 className="text-xl font-semibold text-insightBlack group-hover:text-insightRed transition">
                    {leader.name}
                  </h3>
                  <p className="text-sm text-gray-600">{leader.title}</p>
                  {leader.company && <p className="text-xs text-gray-500">{leader.company}</p>}
                </CardContent>
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
  );
};

export default Home;
