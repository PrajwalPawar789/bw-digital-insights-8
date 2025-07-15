import { Link } from 'react-router-dom';
import { Star, Crown, TrendingUp, Users, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PremiumHeroProps {
  latestMagazine?: any;
  magazineData?: any[];
  companyName?: string;
}

const PremiumHero = ({ latestMagazine, magazineData = [], companyName = "Insight Business" }: PremiumHeroProps) => {
  const stats = [
    { icon: Users, value: '50K+', label: 'C-Suite Readers' },
    { icon: BookOpen, value: '120+', label: 'Exclusive Interviews' },
    { icon: TrendingUp, value: '95%', label: 'Success Rate' },
    { icon: Star, value: '4.9', label: 'Reader Rating' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-insightBlack via-insightBlack-light to-insightBlack min-h-[90vh] flex items-center">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-insightRed/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-insightGold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-white">
            {/* Premium Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-insightRed to-insightRed-dark rounded-full text-sm font-semibold shadow-magazine animate-fade-in">
              <Crown className="w-5 h-5 mr-2" />
              <span>Premium Business Intelligence</span>
            </div>
            
            {/* Main Headlines */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block">Where</span>
                <span className="block text-transparent bg-gradient-to-r from-insightRed to-insightGold bg-clip-text animate-gradient">
                  C-Suite Leaders
                </span>
                <span className="block">Get Insights</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-xl">
                Exclusive interviews, strategic analysis, and actionable insights from the world's most successful business leaders.
              </p>
            </div>
            
            {/* Value Proposition */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-insightRed rounded-full flex items-center justify-center mt-1">
                  <Star className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Exclusive CEO Interviews</h3>
                  <p className="text-gray-400">Direct access to Fortune 500 leadership insights</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-insightGold rounded-full flex items-center justify-center mt-1">
                  <TrendingUp className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Strategic Market Analysis</h3>
                  <p className="text-gray-400">Data-driven insights for competitive advantage</p>
                </div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/magazine">
                <Button 
                  size="lg" 
                  className="btn-premium w-full sm:w-auto text-lg px-8 py-4 animate-premium-pulse"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Read Latest Issue
                </Button>
              </Link>
              <Link to="/about">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                >
                  Learn More
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="w-6 h-6 text-insightRed" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Content - Magazine Stack */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main Magazine Cover */}
              {latestMagazine && (
                <div className="magazine-cover relative z-20 transform rotate-6 hover:rotate-3 transition-all duration-700">
                  <img
                    src={latestMagazine.cover_image_url || '/placeholder.svg'}
                    alt={latestMagazine.title}
                    className="w-80 h-auto rounded-xl shadow-elevated"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-xl"></div>
                  <Badge className="absolute top-4 left-4 bg-insightRed text-white">
                    Latest Issue
                  </Badge>
                </div>
              )}
              
              {/* Second Magazine */}
              {magazineData[1] && (
                <div className="magazine-cover absolute -left-16 top-8 z-10 transform -rotate-6 hover:-rotate-3 transition-all duration-700">
                  <img
                    src={magazineData[1].cover_image_url || '/placeholder.svg'}
                    alt={magazineData[1].title}
                    className="w-72 h-auto rounded-xl shadow-magazine opacity-90"
                  />
                </div>
              )}
              
              {/* Third Magazine */}
              {magazineData[2] && (
                <div className="magazine-cover absolute -right-12 top-16 z-0 transform rotate-12 hover:rotate-6 transition-all duration-700">
                  <img
                    src={magazineData[2].cover_image_url || '/placeholder.svg'}
                    alt={magazineData[2].title}
                    className="w-64 h-auto rounded-xl shadow-gold opacity-80"
                  />
                </div>
              )}
              
              {/* Floating Badge */}
              <div className="absolute -top-6 -right-6 z-30 bg-insightGold text-insightBlack rounded-full p-4 shadow-gold animate-premium-pulse">
                <Crown className="h-8 w-8" />
              </div>
              
              {/* Premium Label */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-30">
                <Badge className="bg-gradient-to-r from-insightRed to-insightGold text-white px-6 py-2 text-lg font-semibold">
                  Premium Access
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumHero;