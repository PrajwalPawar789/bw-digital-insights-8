
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLeadershipProfiles, useFeaturedLeadership } from '@/hooks/useLeadership';
import { Search, Linkedin, Twitter, Loader2 } from 'lucide-react';

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
      {/* Hero Section */}
      <div className="relative bg-insightBlack text-white py-16 mb-12">
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Leadership Excellence
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-200 leading-relaxed">
            Meet the visionary leaders who are shaping the future of technology and business. Their insights drive innovation and transformation across industries.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Leaders Section */}
        {featuredLeaders.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-insightBlack mb-8 text-center">Featured Leaders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredLeaders.map((leader) => (
                <Link
                  key={leader.id}
                  to={`/leadership/${leader.slug}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative">
                    <img
                      src={leader.image_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400'}
                      alt={leader.name}
                      className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-insightBlack group-hover:text-insightRed transition-colors mb-2">
                      {leader.name}
                    </h3>
                    <p className="text-insightRed font-medium mb-1">{leader.title}</p>
                    {leader.company && (
                      <p className="text-gray-600 text-sm mb-3">{leader.company}</p>
                    )}
                    <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                      {leader.bio.substring(0, 150)}...
                    </p>
                    <div className="flex items-center space-x-3">
                      {leader.linkedin_url && (
                        <a
                          href={leader.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {leader.twitter_url && (
                        <a
                          href={leader.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-10">
          <h2 className="text-xl font-semibold mb-4 text-insightBlack">Find Leadership Profiles</h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, title, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-insightRed focus:border-transparent"
            />
          </div>
        </div>

        {/* All Leaders Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-insightBlack mb-8 text-center">
            {searchTerm ? 'Search Results' : 'All Leaders'}
          </h2>
          
          {filteredLeaders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLeaders.map((leader) => (
                <Link
                  key={leader.id}
                  to={`/leadership/${leader.slug}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative">
                    <img
                      src={leader.image_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400'}
                      alt={leader.name}
                      className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-insightBlack group-hover:text-insightRed transition-colors mb-2">
                      {leader.name}
                    </h3>
                    <p className="text-insightRed font-medium mb-1">{leader.title}</p>
                    {leader.company && (
                      <p className="text-gray-600 text-sm mb-3">{leader.company}</p>
                    )}
                    <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                      {leader.bio.substring(0, 150)}...
                    </p>
                    <div className="flex items-center space-x-3">
                      {leader.linkedin_url && (
                        <a
                          href={leader.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {leader.twitter_url && (
                        <a
                          href={leader.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <p className="text-gray-600 text-lg mb-4">
                  {searchTerm ? 'No leaders found matching your search.' : 'No leadership profiles available.'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-insightRed hover:text-insightBlack transition-colors"
                  >
                    Clear search
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
