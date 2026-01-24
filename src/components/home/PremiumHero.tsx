import { Link } from 'react-router-dom';
import { Star, Crown, TrendingUp, Users, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PremiumHeroProps {
  latestMagazine?: any;
  magazineData?: any[];
  companyName?: string;
}

const PremiumHero = ({ latestMagazine, magazineData = [], companyName = "The CIO Vision" }: PremiumHeroProps) => {
  const stats = [
    { icon: Users, value: '50K+', label: 'C-Suite Readers' },
    { icon: BookOpen, value: '120+', label: 'Exclusive Interviews' },
    { icon: TrendingUp, value: '95%', label: 'Success Rate' },
    { icon: Star, value: '4.9', label: 'Reader Rating' },
  ];

  return (
    <section className="relative overflow-hidden min-h-[88vh] flex items-stretch">
      {/* Background layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-insightBlack via-gray-900 to-insightBlack" />
      <div className="absolute inset-0 bg-pattern opacity-10" />
      <div className="absolute -top-24 -left-24 w-[32rem] h-[32rem] bg-insightRed/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-[36rem] h-[36rem] bg-insightGold/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Headline column */}
          <div className="lg:col-span-7 flex flex-col justify-center text-white">
            <div className="inline-flex items-center px-5 py-2 rounded-full bg-insightRed text-white text-sm font-semibold w-max shadow-magazine">
              <Crown className="w-4 h-4 mr-2" /> Business Minds Edition
            </div>

            <h1 className="mt-6 font-premium text-5xl md:text-6xl leading-[1.1] tracking-tight">
              {companyName}:
              <span className="block text-transparent bg-gradient-to-r from-insightRed to-insightGold bg-clip-text animate-gradient">C‑Suite Intelligence</span>
              For Bold Decisions
            </h1>

            <p className="mt-5 text-xl text-gray-300 max-w-2xl">
              Interviews, strategy, and market signals distilled for founders, CEOs, and operators. Read what leaders are reading.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link to="/magazine">
                <Button size="lg" className="btn-premium w-full sm:w-auto text-lg px-8 py-4">
                  <BookOpen className="mr-2 h-5 w-5" /> Read Latest Issue
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                  About Us
                </Button>
              </Link>
            </div>

            {/* Stats strip */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-insightRed" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-sm text-gray-400">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature column */}
          <div className="lg:col-span-5">
            <div className="h-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur relative shadow-elevated">
              {/* Feature image */}
              <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5]">
                <img
                  src={latestMagazine?.cover_image_url || magazineData?.[0]?.cover_image_url || '/placeholder.svg'}
                  alt={latestMagazine?.title || magazineData?.[0]?.title || 'Latest Issue'}
                  className="w-full h-full object-fit-middle"
                  style={{ objectFit: 'contain', objectPosition: 'center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <Badge className="absolute top-4 left-4 bg-insightRed text-white">Latest Issue</Badge>
              </div>

              {/* Feature content */}
              <div className="p-6 text-white">
                <h3 className="text-2xl font-bold mb-2 line-clamp-2">
                  {latestMagazine?.title || magazineData?.[0]?.title || 'Exclusive Leadership Issue'}
                </h3>
                <p className="text-gray-300 line-clamp-3 mb-4">
                  {latestMagazine?.description || magazineData?.[0]?.description || 'Executive playbooks, industry shifts, and founder stories — curated for decision‑makers.'}
                </p>
                <Link to={latestMagazine?.slug ? `/magazine/${latestMagazine.slug}` : '/magazine'} className="inline-flex items-center font-semibold text-insightRed hover:text-white transition-colors">
                  Read now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumHero;
