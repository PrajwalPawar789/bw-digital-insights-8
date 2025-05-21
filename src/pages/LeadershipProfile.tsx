
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { leaderProfiles, leadershipArticles } from '../data/leadershipData';
import { ChevronLeft, Calendar, Award, ArrowRight } from 'lucide-react';

const LeadershipProfile = () => {
  const { id } = useParams();
  const [leader, setLeader] = useState(null);
  const [leaderArticles, setLeaderArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Find the leader by ID
    const foundLeader = leaderProfiles.find(profile => profile.id === parseInt(id));
    
    if (foundLeader) {
      setLeader(foundLeader);
      // Find articles by this leader
      const articles = leadershipArticles.filter(
        article => article.author === foundLeader.name
      );
      setLeaderArticles(articles);
    }
    
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-insightRed">Loading...</div>
      </div>
    );
  }

  if (!leader) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-insightBlack mb-4">Leadership Profile Not Found</h1>
        <p className="text-gray-600 mb-8">The profile you're looking for doesn't seem to exist.</p>
        <Link 
          to="/leadership" 
          className="inline-flex items-center px-6 py-3 bg-insightRed hover:bg-red-700 text-white rounded-md transition-colors"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Back to Leadership
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Leader Info */}
      <section className="bg-gradient-to-r from-insightBlack to-gray-900 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/leadership" 
            className="inline-flex items-center text-white/80 hover:text-white mb-8 group"
          >
            <ChevronLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Back to Leadership
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1">
              <div className="relative">
                <div className="rounded-full h-64 w-64 overflow-hidden border-4 border-insightRed mx-auto lg:mx-0">
                  <img 
                    src={leader.image} 
                    alt={leader.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-insightRed text-white rounded-full p-3">
                  <Award className="h-6 w-6" />
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="inline-flex items-center px-3 py-1 bg-insightRed rounded-full text-sm font-medium mb-4">
                Technology Leader
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{leader.name}</h1>
              <p className="text-xl text-gray-300 mb-2">{leader.title}</p>
              <p className="text-lg text-insightRed font-medium mb-6">{leader.company}</p>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <p className="text-gray-200 leading-relaxed">{leader.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles by the Leader */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-insightBlack mb-8">Articles & Insights</h2>
          
          {leaderArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {leaderArticles.map(article => (
                <div 
                  key={article.id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex flex-col h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-0 right-0 m-4">
                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-insightRed text-white rounded-full">
                          {article.type.charAt(0).toUpperCase() + article.type.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="h-4 w-4 mr-2" />
                        {article.date}
                      </div>
                      <h3 className="text-xl font-bold text-insightBlack mb-3 group-hover:text-insightRed transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 flex-grow">{article.excerpt}</p>
                      <Link 
                        to={`/article/${article.id}`}
                        className="inline-flex items-center text-insightRed hover:text-insightBlack transition-colors self-start mt-auto"
                      >
                        Read Full Article <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">No articles found by this leader.</p>
              <Link 
                to="/leadership"
                className="inline-flex items-center text-insightRed hover:text-insightBlack transition-colors mt-4"
              >
                Browse All Leadership Content <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Related Leaders */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-insightBlack mb-8">More Technology Leaders</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {leaderProfiles
              .filter(profile => profile.id !== leader.id)
              .slice(0, 4)
              .map(profile => (
                <Link 
                  key={profile.id}
                  to={`/leadership/${profile.id}`}
                  className="group"
                >
                  <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 text-center">
                    <div className="rounded-full h-24 w-24 overflow-hidden mx-auto mb-4">
                      <img 
                        src={profile.image} 
                        alt={profile.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-bold text-insightBlack group-hover:text-insightRed transition-colors">
                      {profile.name}
                    </h3>
                    <p className="text-sm text-gray-500">{profile.company}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeadershipProfile;
