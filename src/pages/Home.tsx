import { useMemo } from "react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useArticles, useFeaturedArticles } from "@/hooks/useArticles";
import { useMagazines } from "@/hooks/useMagazines";
import { useLeadershipProfiles } from "@/hooks/useLeadership";
import { usePressReleases } from "@/hooks/usePressReleases";
import { useSettings } from "@/hooks/useSettings";
import { Calendar, ChevronRight, Newspaper, BookOpen, ArrowRight, Users, Briefcase, Layers, Shield, TrendingUp, LineChart, Target, Handshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  const { main, secondary, headlines, latestMagazine } = useMemo(() => {
    const byDate = [...articles].filter(Boolean).sort((a, b) => new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime());
    const featuredFirst = [...byDate].sort((a, b) => (b?.featured ? 1 : 0) - (a?.featured ? 1 : 0));
    const main = featuredFirst[0];
    const secondary = featuredFirst.slice(1, 3);
    const headlines = featuredFirst.slice(3, 11);
    const latestMagazine = magazines[0] || null;
    return { main, secondary, headlines, latestMagazine };
  }, [articles, magazines]);

  const { supportingStories, insightStories, leadershipSpotlight, pressHighlights } = useMemo(() => {
    const sorted = [...articles]
      .filter(Boolean)
      .sort((a: any, b: any) => new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime());

    const supportingStories = sorted.slice(1, 4);
    const insightStories = (featured && featured.length ? featured : sorted.slice(4, 10)).slice(0, 6);
    const leadershipSpotlight = (leadership || []).slice(0, 3);
    const pressHighlights = (press || []).slice(0, 3);

    return { supportingStories, insightStories, leadershipSpotlight, pressHighlights };
  }, [articles, featured, leadership, press]);

  const tieredTracks = useMemo(() => {
    const ordered = [...articles]
      .filter(Boolean)
      .sort((a: any, b: any) => new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime());

    const tiers = [
      {
        title: "C-Suite Visionaries",
        description: "What enterprise leaders are prioritizing next quarter.",
        icon: Shield,
      },
      {
        title: "VP Playmakers",
        description: "Operational wins from the teams turning strategy into motion.",
        icon: LineChart,
      },
      {
        title: "Director's Toolkit",
        description: "Execution frameworks and scorecards directors rely on.",
        icon: Target,
      },
      {
        title: "Founder Files",
        description: "Stories from entrepreneurs scaling bold ideas responsibly.",
        icon: Handshake,
      },
    ];

    return tiers
      .map((tier, index) => ({
        ...tier,
        stories: ordered.slice(index * 3, index * 3 + 3),
      }))
      .filter((tier) => tier.stories.length > 0);
  }, [articles]);

  const articleCount = articles.length;
  const leadershipCount = leadership.length;
  const magazineCount = magazines.length;
  const pressCount = press.length;

  const impactHighlights = useMemo(
    () => [
      {
        title: "Executive Features",
        stat: `${Math.max(articleCount, 12)}+`,
        description: "Profiles on the changemakers re-architecting their industries.",
      },
      {
        title: "Boardroom Voices",
        stat: `${Math.max(leadershipCount, 6)}+`,
        description: "Interviews with C-level leaders, investors, and disruptors.",
      },
      {
        title: "Strategy Playbooks",
        stat: `${Math.max(pressCount, 10)}+`,
        description: "Frameworks directors and VPs deploy to earn measurable growth.",
      },
      {
        title: "Magazine Issues",
        stat: `${Math.max(magazineCount, 4)}+`,
        description: "Premium editions documenting transformation in motion.",
      },
    ],
    [articleCount, leadershipCount, magazineCount, pressCount]
  );

  const growthPillars = [
    {
      title: "People",
      description: "Build cultures where experts feel seen, heard, and empowered to challenge the status quo.",
      icon: Users,
    },
    {
      title: "Culture",
      description: "Translate purpose into everyday rituals that keep innovation grounded in shared values.",
      icon: Briefcase,
    },
    {
      title: "Process",
      description: "Engineer repeatable momentum with systems that scale from pilot programs to global rollouts.",
      icon: Layers,
    },
    {
      title: "Accountability",
      description: "Measure what matters, celebrate responsible risk-taking, and close every learning loop.",
      icon: Shield,
    },
  ];

  const flywheelSignals = [
    {
      icon: TrendingUp,
      title: "Where growth comes from",
      description: "Growth is earned when the stories of current customers become the playbook for the next wave of relationships.",
    },
    {
      icon: Handshake,
      title: "New customers follow actions",
      description: "Your next loyal reader, subscriber, or partner arrives because a past customer shared a proof point that felt personal and actionable.",
    },
    {
      icon: Target,
      title: "Design the follow-through",
      description: "Map the journeys, automate the nudges, and deliver experiences that transform curiosity into unwavering trust.",
    },
  ];

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
    <div className="min-h-screen bg-white text-insightBlack">
      {/* Executive Wire */}
      <div className="bg-insightBlack text-white overflow-hidden border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-4 py-3">
            <Badge className="bg-insightRed text-white hover:bg-insightRed/90 font-semibold uppercase tracking-[0.35em]">
              <Newspaper className="w-3.5 h-3.5 mr-1.5" /> Executive Wire
            </Badge>
            <div className="relative flex-1 overflow-hidden">
              <div className="whitespace-nowrap animate-marquee">
                {[...(headlines.length ? headlines : articles.slice(0, 8))].map((a: any, i: number) => (
                  <Link
                    key={slugOf(a) + i}
                    to={`/article/${slugOf(a)}`}
                    className="inline-flex items-center text-sm text-white/80 hover:text-white transition-colors mx-8 font-medium"
                  >
                    {titleOf(a)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.08),transparent_55%)]" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="lg:col-span-7">
              {main ? (
                <article className="h-full flex flex-col">
                  <Link to={`/article/${slugOf(main)}`} className="group relative block overflow-hidden rounded-3xl shadow-2xl">
                    <div className="relative">
                      <div className="aspect-[16/9] bg-insightBlack flex items-center justify-center overflow-hidden">
                        <img
                          src={imgOf(main)}
                          alt={titleOf(main)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-insightBlack/95 via-insightBlack/40 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 space-y-5">
                        <Badge className="bg-insightRed text-white font-bold uppercase tracking-[0.3em]">
                          {categoryOf(main)}
                        </Badge>
                        <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white group-hover:text-insightRed/90 transition-colors">
                          {titleOf(main)}
                        </h1>
                        <p className="text-white/90 text-lg max-w-3xl line-clamp-3">
                          {excerptOf(main)}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                          <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {dateOf(main)}
                          </span>
                          <span className="hidden sm:inline-block">•</span>
                          <span>{main?.author || "Editorial Team"}</span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {secondary.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {secondary.slice(0, 2).map((a: any, i: number) => (
                        <Link
                          key={slugOf(a) + i}
                          to={`/article/${slugOf(a)}`}
                          className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                        >
                          <div className="aspect-[16/10] bg-gray-100 flex items-center justify-center overflow-hidden">
                            <img
                              src={imgOf(a)}
                              alt={titleOf(a)}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="p-6 space-y-3">
                            <Badge variant="outline" className="text-xs">
                              {categoryOf(a)}
                            </Badge>
                            <h3 className="font-bold text-lg line-clamp-2 group-hover:text-insightRed transition-colors">
                              {titleOf(a)}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-3">
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
                  )}
                </article>
              ) : (
                <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">
                  Featured stories will appear here once published.
                </div>
              )}
            </div>

            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="bg-white/80 backdrop-blur rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-insightRed">Inside the magazine</p>
                    <h3 className="text-2xl font-bold mt-2">Momentum in the boardroom</h3>
                  </div>
                  <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-insightRed/10 text-insightRed">
                    <BookOpen className="h-6 w-6" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {impactHighlights.map((highlight) => (
                    <div key={highlight.title} className="rounded-2xl border border-gray-200 p-4">
                      <div className="text-3xl font-bold text-insightRed">{highlight.stat}</div>
                      <h4 className="mt-2 text-sm font-semibold uppercase tracking-wide text-gray-500">{highlight.title}</h4>
                      <p className="mt-2 text-sm text-gray-600">{highlight.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {supportingStories.length > 0 && (
                <div className="bg-insightBlack text-white rounded-3xl overflow-hidden shadow-2xl">
                  <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-insightRed">Boardroom Briefings</p>
                      <h4 className="text-lg font-semibold mt-1">Success stories on the move</h4>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/50" />
                  </div>
                  <ul className="divide-y divide-white/10">
                    {supportingStories.slice(0, 3).map((story: any, i: number) => (
                      <li key={slugOf(story) + i}>
                        <Link
                          to={`/article/${slugOf(story)}`}
                          className="group flex items-start gap-4 px-6 py-5 transition hover:bg-white/5"
                        >
                          <div className="mt-1 h-10 w-10 flex-shrink-0 rounded-full bg-white/10 text-white flex items-center justify-center font-semibold">
                            {i + 1}
                          </div>
                          <div className="flex-1 space-y-2">
                            <h5 className="font-semibold leading-snug group-hover:text-insightRed">
                              {titleOf(story)}
                            </h5>
                            <p className="text-sm text-white/70 line-clamp-2">{excerptOf(story)}</p>
                            <div className="flex items-center gap-2 text-xs text-white/60">
                              <Calendar className="h-3 w-3" />
                              {dateOf(story)}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Boardroom Spotlight */}
      <section className="py-16 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-2xl space-y-3">
              <Badge variant="outline" className="w-fit uppercase tracking-[0.3em]">Boardroom Spotlight</Badge>
              <h2 className="text-3xl font-bold">Meet the architects of enterprise reinvention</h2>
              <p className="text-gray-600 text-lg">
                C-level, VP, and director-level leaders share how they build momentum, align teams, and deliver at scale.
              </p>
            </div>
            <Link to="/leadership" className="inline-flex items-center text-insightRed font-semibold">
              View the full roster <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadershipSpotlight.length > 0 ? leadershipSpotlight.map((leader: any) => (
              <Card key={leader.id} className="group overflow-hidden rounded-3xl border border-gray-200 shadow-lg">
                <div className="h-60 bg-gradient-to-br from-gray-900 to-insightBlack flex items-center justify-center overflow-hidden">
                  <img
                    src={leader.image_url || "/placeholder.svg"}
                    alt={leader.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6 space-y-3">
                  <div className="text-xs uppercase tracking-[0.3em] text-insightRed font-semibold">Leadership</div>
                  <h3 className="text-xl font-semibold group-hover:text-insightRed transition">{leader.name}</h3>
                  {leader.title && <p className="text-sm text-gray-600">{leader.title}</p>}
                  {leader.company && <p className="text-xs text-gray-500 uppercase tracking-wide">{leader.company}</p>}
                </CardContent>
              </Card>
            )) : (
              <div className="md:col-span-3 rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
                Leadership spotlights appear once profiles are published.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Executive Briefings */}
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div className="max-w-2xl space-y-3">
              <Badge className="w-fit bg-insightRed text-white uppercase tracking-[0.3em]">Executive Briefings</Badge>
              <h2 className="text-3xl font-bold">The playbooks your peers are using</h2>
              <p className="text-gray-600 text-lg">
                Curated briefings tailored for C-suite, VP, director, and founder audiences navigating growth-critical decisions.
              </p>
            </div>
            <Link to="/articles" className="inline-flex items-center text-insightRed font-semibold">
              Explore all insights <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {tieredTracks.length > 0 ? tieredTracks.map((track) => (
              <div key={track.title} className="h-full bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-insightRed/80">{track.title}</p>
                    <h3 className="mt-2 text-xl font-semibold text-insightBlack">{track.description}</h3>
                  </div>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-insightRed/10 text-insightRed">
                    <track.icon className="h-6 w-6" />
                  </span>
                </div>
                <ul className="space-y-5">
                  {track.stories.map((story: any, index: number) => (
                    <li key={slugOf(story) + index} className="group">
                      <Link to={`/article/${slugOf(story)}`} className="flex items-start gap-4 rounded-2xl border border-transparent px-4 py-3 transition hover:border-insightRed/20 hover:bg-insightRed/5">
                        <div className="mt-1 text-sm font-semibold text-insightRed">{(index + 1).toString().padStart(2, "0")}</div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 text-xs text-gray-500 uppercase tracking-wide">
                            <span>{categoryOf(story)}</span>
                            <span className="hidden sm:inline-block">•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {dateOf(story)}
                            </span>
                          </div>
                          <h4 className="font-semibold text-lg leading-snug group-hover:text-insightRed transition">
                            {titleOf(story)}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{excerptOf(story)}</p>
                        </div>
                        <ChevronRight className="mt-1 h-5 w-5 text-gray-400 group-hover:text-insightRed transition" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )) : (
              <div className="rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
                Articles will appear here as soon as they are published.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Strategy Desk */}
      <section className="py-16 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="space-y-3 max-w-2xl">
              <Badge variant="outline" className="w-fit uppercase tracking-[0.3em]">Strategy Desk</Badge>
              <h2 className="text-3xl font-bold">Field-tested insights from executives in motion</h2>
              <p className="text-gray-600 text-lg">
                Stories that deconstruct the wins, pivots, and frameworks fueling high-velocity leadership teams.
              </p>
            </div>
            <Link to="/articles" className="inline-flex items-center text-insightRed font-semibold">
              View latest coverage <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {insightStories.slice(0, 6).map((story: any, index: number) => (
              <Link
                key={slugOf(story) + index}
                to={`/article/${slugOf(story)}`}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-insightRed">
                  <span>{categoryOf(story)}</span>
                  <span className="hidden sm:inline-block">•</span>
                  <span className="flex items-center gap-1 tracking-normal normal-case text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {dateOf(story)}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-insightBlack group-hover:text-insightRed transition">
                  {titleOf(story)}
                </h3>
                <p className="mt-3 text-sm text-gray-600 line-clamp-3">{excerptOf(story)}</p>
                <div className="mt-6 flex items-center justify-between text-sm font-medium text-insightRed">
                  <span>Read success blueprint</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Momentum Framework */}
      <section className="py-16 bg-insightBlack text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="space-y-6">
              <Badge className="bg-white/10 text-white uppercase tracking-[0.3em] w-fit">Momentum Framework</Badge>
              <h2 className="text-3xl font-bold">Architect the next era of growth</h2>
              <p className="text-white/80 text-lg">
                Use these pillars and signals to align executive priorities, operational cadence, and customer proof points.
              </p>
            </div>
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {growthPillars.map((pillar) => (
                  <div key={pillar.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-insightRed/20 text-insightRed mb-4">
                      <pillar.icon className="h-6 w-6" />
                    </span>
                    <h3 className="text-xl font-semibold">{pillar.title}</h3>
                    <p className="text-white/70 mt-3 text-sm">{pillar.description}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {flywheelSignals.map((signal) => (
                  <div key={signal.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white mb-3">
                      <signal.icon className="h-5 w-5" />
                    </span>
                    <h4 className="text-lg font-semibold">{signal.title}</h4>
                    <p className="text-white/70 mt-3 text-sm">{signal.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Press Room */}
      <section className="py-16 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="space-y-3 max-w-2xl">
              <Badge variant="outline" className="w-fit uppercase tracking-[0.3em]">Press Room</Badge>
              <h2 className="text-3xl font-bold">Partnerships and recognition from the field</h2>
              <p className="text-gray-600 text-lg">
                Milestones, announcements, and collaborations that show how leaders are shaping the market together.
              </p>
            </div>
            <Link to="/press-releases" className="inline-flex items-center text-insightRed font-semibold">
              View press archive <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pressHighlights.length > 0 ? pressHighlights.map((item: any, index: number) => (
              <Link
                key={slugOf(item) + index}
                to={`/press-releases/${slugOf(item)}`}
                className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-insightRed">
                  <span>Announcement</span>
                  <span className="hidden sm:inline-block">•</span>
                  <span className="flex items-center gap-1 tracking-normal normal-case text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {dateOf(item)}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold group-hover:text-insightRed transition">
                  {titleOf(item)}
                </h3>
                <p className="mt-3 text-sm text-gray-600 line-clamp-3">{excerptOf(item)}</p>
                <div className="mt-6 inline-flex items-center text-sm font-semibold text-insightRed">
                  Read the press note <ChevronRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            )) : (
              <div className="md:col-span-3 rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
                Press highlights will populate as announcements go live.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Subscription CTA */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-insightRed via-insightRed/90 to-insightBlack" aria-hidden="true" />
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="rounded-3xl bg-white/5 backdrop-blur p-10 sm:p-14 text-white shadow-2xl border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
              <div className="md:col-span-2 space-y-5">
                <Badge className="bg-white/15 text-white uppercase tracking-[0.3em] w-fit">Subscribe</Badge>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  Stay accountable to the future you are building
                </h2>
                <p className="text-white/80 text-lg">
                  Receive weekly strategies, interviews, and operating cadences from leaders who ship measurable outcomes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/magazine">
                    <Button size="lg" className="bg-white text-insightRed hover:bg-gray-100">
                      Explore premium issues
                    </Button>
                  </Link>
                  <Link to="/contact" className="inline-flex items-center font-semibold text-white">
                    Partner with our newsroom <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="space-y-4 text-sm text-white/80">
                <div className="rounded-3xl border border-white/15 bg-white/5 p-5">
                  <p className="font-semibold text-white">What you get</p>
                  <ul className="mt-3 space-y-2 text-white/70">
                    <li>• Executive debriefs across C-suite, VP, and director levels.</li>
                    <li>• Playbooks for orchestrating cross-functional growth.</li>
                    <li>• Benchmarks, frameworks, and accountability rituals.</li>
                  </ul>
                </div>
                <div className="rounded-3xl border border-white/15 bg-white/5 p-5">
                  <p className="font-semibold text-white">Next print drop</p>
                  <p className="mt-2 text-white/70">
                    {latestMagazine?.title || "The CIO Vision"} — shipping soon to premium subscribers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
