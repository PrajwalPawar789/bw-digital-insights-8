import { Link } from 'react-router-dom';
import { BookOpen, Download, Eye, Star, Calendar, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface PremiumMagazineShowcaseProps {
  magazines?: any[];
  companyName?: string;
}

const PremiumMagazineShowcase = ({ magazines = [], companyName = "The CIO Vision" }: PremiumMagazineShowcaseProps) => {
  const featuredMagazines = magazines.slice(0, 6);

  return (
    <section className="py-24 bg-gradient-to-br from-insightBlack via-insightBlack-light to-insightBlack relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-pattern opacity-20"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-insightRed/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-insightGold/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-insightGold to-insightGold-light text-insightBlack border-none text-sm px-6 py-3 shadow-gold">
            <BookOpen className="w-4 h-4 mr-2" />
            Premium Collection
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="block">Exclusive</span>
            <span className="block gold-text">{companyName}</span>
            <span className="block">Magazine Archive</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover our complete collection of quarterly publications featuring exclusive CEO interviews, 
            strategic market analysis, and the insights that drive business transformation.
          </p>
        </div>
        
        {/* Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featuredMagazines.map((magazine, index) => (
            <Card key={magazine.id || index} className="magazine-grid-item premium-card bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-500">
              <div className="relative">
                {/* Magazine Cover */}
                <div className="magazine-cover aspect-[3/4] overflow-hidden">
                  <img
                    src={magazine.cover_image_url || '/placeholder.svg'}
                    alt={magazine.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    <Badge className="bg-insightRed/90 text-white font-semibold">
                      {magazine.issue_number ? `Issue ${magazine.issue_number}` : 'Latest'}
                    </Badge>
                    {magazine.featured && (
                      <Badge className="bg-insightGold/90 text-insightBlack font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex gap-2">
                      <Link to={`/magazine/${magazine.slug}`} className="flex-1">
                        <Button 
                          size="sm" 
                          className="w-full bg-white/90 text-insightBlack hover:bg-white font-medium"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Read Now
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-white/90 border-white text-insightBlack hover:bg-white"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6 text-white">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-insightRed transition-colors line-clamp-2">
                      {magazine.title}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
                      {magazine.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {new Date(magazine.publish_date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>Premium</span>
                    </div>
                  </div>
                  
                  <Link to={`/magazine/${magazine.slug}`}>
                    <Button 
                      variant="outline" 
                      className="w-full border-white/20 text-white hover:bg-white/10 group-hover:bg-insightRed group-hover:border-insightRed group-hover:text-white transition-all"
                    >
                      Read Full Issue
                      <BookOpen className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <div className="premium-card bg-gradient-to-r from-white/5 to-white/10 border-white/20 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready for Premium Access?
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of business leaders who rely on our exclusive insights and analysis
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/magazine">
                <Button 
                  size="lg" 
                  className="btn-premium"
                >
                  Browse All Issues
                  <BookOpen className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Get Premium Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumMagazineShowcase;
