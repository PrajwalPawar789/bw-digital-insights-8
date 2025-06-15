import React from 'react';
import { useLeadershipProfiles } from '@/hooks/useLeadership';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, ArrowRight, Users, Award, Building2 } from 'lucide-react';

const Leadership = () => {
  const { data: leaders, isLoading } = useLeadershipProfiles();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-insightRed"></div>
      </div>
    );
  }

  // Filter and organize leaders
  const featuredLeaders = leaders?.filter(leader => leader.featured) || [];
  const regularLeaders = leaders?.filter(leader => !leader.featured) || [];

  return (
    <div className="min-h-screen bg-white py-16">
      {/* HERO SECTION with BG IMAGE */}
      <div className="relative mb-16">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=1200&q=80')"
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-insightRed/10 rounded-full">
              <Users className="h-8 w-8 text-insightRed" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow">
            Leadership Profiles
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto drop-shadow">
            Meet the visionary leaders shaping the future of business and technology. 
            Our featured profiles showcase industry pioneers, innovative CEOs, and transformational executives.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Leaders Section */}
        {featuredLeaders.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Award className="h-6 w-6 text-insightRed mr-3" />
              <h2 className="text-2xl font-bold text-insightBlack">Featured Leaders</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* First featured leader - larger card */}
              {featuredLeaders[0] && (
                <div className="lg:col-span-2 lg:row-span-2">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={featuredLeaders[0].image_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800'}
                        alt={featuredLeaders[0].name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-8">
                      <div className="flex items-center mb-4">
                        <span className="bg-insightRed text-white px-3 py-1 rounded-full text-sm font-medium">
                          Featured Leader
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-insightBlack mb-2">
                        {featuredLeaders[0].name}
                      </h3>
                      <p className="text-insightRed font-semibold mb-2">
                        {featuredLeaders[0].title}
                      </p>
                      {featuredLeaders[0].company && (
                        <div className="flex items-center text-gray-600 mb-4">
                          <Building2 className="h-4 w-4 mr-2" />
                          <span>{featuredLeaders[0].company}</span>
                        </div>
                      )}
                      <p className="text-gray-600 mb-6 line-clamp-4">
                        {featuredLeaders[0].bio}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-3">
                          {featuredLeaders[0].linkedin_url && (
                            <a
                              href={featuredLeaders[0].linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Linkedin className="h-5 w-5" />
                            </a>
                          )}
                          {featuredLeaders[0].twitter_url && (
                            <a
                              href={featuredLeaders[0].twitter_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-blue-400 transition-colors"
                            >
                              <Twitter className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                        <Link
                          to={`/leadership/${featuredLeaders[0].slug}`}
                          className="inline-flex items-center text-insightRed hover:text-insightBlack font-medium transition-colors"
                        >
                          Read Profile <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other featured leaders - smaller cards */}
              <div className="lg:col-span-1 space-y-8">
                {featuredLeaders.slice(1, 3).map((leader) => (
                  <div key={leader.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={leader.image_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'}
                        alt={leader.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <span className="bg-insightRed text-white px-2 py-1 rounded-full text-xs font-medium mb-3 inline-block">
                        Featured
                      </span>
                      <h3 className="text-xl font-bold text-insightBlack mb-2">
                        {leader.name}
                      </h3>
                      <p className="text-insightRed font-semibold mb-2">
                        {leader.title}
                      </p>
                      {leader.company && (
                        <div className="flex items-center text-gray-600 mb-3">
                          <Building2 className="h-4 w-4 mr-2" />
                          <span className="text-sm">{leader.company}</span>
                        </div>
                      )}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {leader.bio}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {leader.linkedin_url && (
                            <a
                              href={leader.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Linkedin className="h-4 w-4" />
                            </a>
                          )}
                          {leader.twitter_url && (
                            <a
                              href={leader.twitter_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-blue-400 transition-colors"
                            >
                              <Twitter className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <Link
                          to={`/leadership/${leader.slug}`}
                          className="text-insightRed hover:text-insightBlack font-medium text-sm transition-colors"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* All Leaders Section */}
        {regularLeaders.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-insightBlack mb-8">All Leadership Profiles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularLeaders.map((leader) => (
                <div key={leader.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={leader.image_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'}
                      alt={leader.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-insightBlack mb-2">
                      {leader.name}
                    </h3>
                    <p className="text-insightRed font-semibold mb-2">
                      {leader.title}
                    </p>
                    {leader.company && (
                      <div className="flex items-center text-gray-600 mb-3">
                        <Building2 className="h-4 w-4 mr-2" />
                        <span className="text-sm">{leader.company}</span>
                      </div>
                    )}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {leader.bio}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {leader.linkedin_url && (
                          <a
                            href={leader.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        )}
                        {leader.twitter_url && (
                          <a
                            href={leader.twitter_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-400 transition-colors"
                          >
                            <Twitter className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <Link
                        to={`/leadership/${leader.slug}`}
                        className="text-insightRed hover:text-insightBlack font-medium text-sm transition-colors"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {(!leaders || leaders.length === 0) && (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Leadership Profiles Available</h3>
            <p className="text-gray-500">Check back soon for inspiring leadership stories and profiles.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leadership;
