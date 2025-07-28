
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLeadershipProfiles, useFeaturedLeadership } from '@/hooks/useLeadership';
import { Search, Linkedin, Twitter, Loader2, Award, Star, Globe, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const Leadership = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: allLeaders = [], isLoading } = useLeadershipProfiles();
  const { data: featuredLeaders = [] } = useFeaturedLeadership();

  const filteredLeaders = allLeaders.filter(leader =>
    leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leader.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (leader.company && leader.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-insightRed" />
          <span className="text-lg">Loading leadership profiles...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Premium Hero Section */}
      <section className="relative bg-gradient-to-br from-insightBlack via-gray-900 to-insightBlack text-white py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-insightRed/30 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-8 bg-insightRed/20 text-insightRed border-insightRed/30 text-lg px-6 py-3 font-semibold">
            Elite Business Leadership Network
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Visionary Leaders
            <span className="block text-insightRed">Shaping Tomorrow</span>
          </h1>
          <p className="max-w-4xl mx-auto text-xl md:text-2xl text-gray-200 leading-relaxed mb-12">
            Meet the extraordinary executives, innovators, and thought leaders who are redefining industries, 
            driving global transformation, and creating the future of business. Their strategic insights 
            and proven leadership excellence inspire the next generation of industry titans.
          </p>
          
          {/* Impressive Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Users className="h-10 w-10 mx-auto mb-4 text-insightRed" />
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-sm text-gray-300">Global Executives</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Globe className="h-10 w-10 mx-auto mb-4 text-insightRed" />
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-sm text-gray-300">Countries Represented</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Award className="h-10 w-10 mx-auto mb-4 text-insightRed" />
              <div className="text-3xl font-bold mb-2">$2T+</div>
              <div className="text-sm text-gray-300">Combined Revenue Led</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Star className="h-10 w-10 mx-auto mb-4 text-insightRed" />
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-sm text-gray-300">Fortune 500 Reach</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Elite Featured Leaders Section */}
        {featuredLeaders.length > 0 && (
          <div className="py-20">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-insightRed/10 text-insightRed border-insightRed/20">
                EXECUTIVE SPOTLIGHT
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-insightBlack mb-6">
                Industry Titans & Visionaries
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the strategic minds behind the world's most successful enterprises. 
                These leaders don't just run companies—they transform entire industries.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredLeaders.map((leader, index) => (
                <Link
                  key={leader.id}
                  to={`/leadership/${leader.slug}`}
                  className={`group block ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                >
                  <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border-0 bg-gradient-to-br from-white to-gray-50">
                    <div className="relative">
                      <div className={`overflow-hidden ${index === 0 ? 'h-80' : 'h-64'}`}>
                        <img
                          src={leader.image_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600'}
                          alt={leader.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      <Badge className="absolute top-6 left-6 bg-insightRed hover:bg-red-700 text-white shadow-lg">
                        FEATURED EXECUTIVE
                      </Badge>
                    </div>
                    <CardContent className={`p-8 ${index === 0 ? 'space-y-4' : 'space-y-3'}`}>
                      <div>
                        <h3 className={`font-bold text-insightBlack group-hover:text-insightRed transition-colors mb-2 ${index === 0 ? 'text-2xl' : 'text-xl'}`}>
                          {leader.name}
                        </h3>
                        <p className={`text-insightRed font-semibold ${index === 0 ? 'text-lg' : 'text-base'}`}>
                          {leader.title}
                        </p>
                        {leader.company && (
                          <p className={`text-gray-600 ${index === 0 ? 'text-base' : 'text-sm'} mb-3`}>
                            {leader.company}
                          </p>
                        )}
                      </div>
                      
                      <p className={`text-gray-700 leading-relaxed ${index === 0 ? 'text-base line-clamp-4' : 'text-sm line-clamp-3'}`}>
                        {leader.bio.substring(0, index === 0 ? 200 : 120)}...
                      </p>
                      
                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center space-x-3">
                          {leader.linkedin_url && (
                            <div className="p-2 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                              <Linkedin className="w-4 h-4 text-blue-600" />
                            </div>
                          )}
                          {leader.twitter_url && (
                            <div className="p-2 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                              <Twitter className="w-4 h-4 text-blue-400" />
                            </div>
                          )}
                        </div>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                          View Profile
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Premium Search Section */}
        <div className="py-16 bg-gradient-to-r from-gray-50 to-white rounded-2xl mb-16">
          <div className="max-w-3xl mx-auto text-center px-8">
            <h2 className="text-2xl font-bold mb-4 text-insightBlack">Discover Leadership Excellence</h2>
            <p className="text-gray-600 mb-8">Search our exclusive network of C-suite executives, entrepreneurs, and industry pioneers</p>
            <div className="relative">
              <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, title, company, or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-insightRed focus:border-transparent shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* All Leaders Section */}
        <div className="pb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4">
              {searchTerm ? 'Search Results' : 'Leadership Directory'}
            </h2>
            <p className="text-lg text-gray-600">
              {searchTerm ? `Found ${filteredLeaders.length} leaders matching your search` : 'Comprehensive profiles of business leaders driving global innovation'}
            </p>
          </div>
          
          {filteredLeaders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredLeaders.map((leader) => (
                <Link
                  key={leader.id}
                  to={`/leadership/${leader.slug}`}
                  className="group block"
                >
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white">
                    <div className="relative">
                      <div className="h-56 overflow-hidden">
                        <img
                          src={leader.image_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400'}
                          alt={leader.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-insightBlack group-hover:text-insightRed transition-colors mb-2">
                        {leader.name}
                      </h3>
                      <p className="text-insightRed font-medium mb-1">{leader.title}</p>
                      {leader.company && (
                        <p className="text-gray-600 text-sm mb-3">{leader.company}</p>
                      )}
                      <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                        {leader.bio.substring(0, 120)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {leader.linkedin_url && (
                            <div className="p-1.5 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                              <Linkedin className="w-4 h-4 text-blue-600" />
                            </div>
                          )}
                          {leader.twitter_url && (
                            <div className="p-1.5 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                              <Twitter className="w-4 h-4 text-blue-400" />
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="group-hover:bg-insightRed group-hover:text-white group-hover:border-insightRed transition-all">
                          View Profile
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'No leaders found' : 'No leadership profiles available'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? 'Try adjusting your search terms or browse all profiles.' : 'Leadership profiles will appear here once they are added.'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-insightRed hover:text-insightBlack transition-colors font-medium"
                  >
                    Clear search and view all leaders
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leadership;
