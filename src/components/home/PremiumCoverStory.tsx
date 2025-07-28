import { Link } from 'react-router-dom';
import { ChevronRight, Clock, User, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PremiumCoverStoryProps {
  coverStory?: any;
}

const PremiumCoverStory = ({ coverStory }: PremiumCoverStoryProps) => {
  if (!coverStory) {
    return null;
  }

  const highlights = [
    {
      number: "01",
      title: "Leadership Innovation",
      description: "Revolutionary approaches to C-suite decision making that transformed entire industries."
    },
    {
      number: "02", 
      title: "Strategic Insights",
      description: "Exclusive behind-the-scenes look at the strategic thinking that drives billion-dollar companies."
    },
    {
      number: "03",
      title: "Market Impact",
      description: "How these leadership decisions created ripple effects across global markets."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute inset-0 bg-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-insightRed to-insightRed-dark text-white border-none text-sm px-6 py-3">
            <Star className="w-4 h-4 mr-2" />
            Featured Story
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-insightBlack mb-4">
            This Month's <span className="premium-text">Cover Story</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dive deep into exclusive content that shapes business strategy worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Cover Story Image */}
          <div className="lg:col-span-2 relative">
            <div className="premium-card group cursor-pointer overflow-hidden">
              <div className="relative h-[500px] overflow-hidden">
                <img
                  src={coverStory.image_url || '/placeholder.svg'}
                  alt={coverStory.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge className="bg-insightRed text-white font-semibold">
                      Cover Story
                    </Badge>
                    <div className="flex items-center text-sm text-gray-300">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>15 min read</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <User className="w-4 h-4 mr-1" />
                      <span>{coverStory.author}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 max-w-2xl leading-tight">
                    {coverStory.title}
                  </h3>
                  
                  <p className="text-lg text-gray-300 mb-6 max-w-xl">
                    {coverStory.excerpt || "An exclusive deep-dive into the strategic thinking that drives today's most successful business leaders."}
                  </p>
                  
                  <Link to={`/article/${coverStory.slug}`}>
                    <Button 
                      size="lg" 
                      className="btn-premium"
                    >
                      Read Full Story
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Story Highlights */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-insightBlack mb-4">Key Highlights</h3>
              <p className="text-gray-600 mb-8">
                What makes this story essential reading for business leaders
              </p>
            </div>
            
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="w-14 h-14 bg-gradient-to-br from-insightRed to-insightRed-dark rounded-full flex items-center justify-center text-white font-bold text-lg shadow-magazine group-hover:shadow-elevated transition-all duration-300">
                  {highlight.number}
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="text-xl font-bold text-insightBlack mb-2 group-hover:text-insightRed transition-colors">
                    {highlight.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Premium Access CTA */}
            <div className="premium-card p-6 bg-gradient-to-br from-insightRed/5 to-insightGold/5 border-l-4 border-insightRed">
              <div className="flex items-center mb-3">
                <Star className="w-5 h-5 text-insightRed mr-2" />
                <span className="font-semibold text-insightBlack">Premium Access</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Get unlimited access to all exclusive content and CEO interviews
              </p>
              <Button 
                size="sm" 
                className="btn-premium w-full"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumCoverStory;