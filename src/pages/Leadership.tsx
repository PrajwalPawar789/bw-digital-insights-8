import { Link } from 'react-router-dom';
import { leaderProfiles, leadershipArticles } from '../data/leadershipData';
import { ExternalLink, Award, TrendingUp, Users, BookOpen, ArrowRight } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const Leadership = () => {
  const philosophyArticles = leadershipArticles.filter(article => article.type === 'philosophy');
  const interviewsAndFeatures = leadershipArticles.filter(article => article.type === 'interview' || article.type === 'feature');

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section with Parallax Effect */}
      <div className="relative h-[60vh] bg-gradient-to-r from-insightBlack to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80')] opacity-20 bg-cover bg-center"></div>
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Leadership Insights
            </h1>
            <p className="max-w-3xl mx-auto text-gray-300 text-lg md:text-xl leading-relaxed mb-8">
              Discover the minds shaping tomorrow's business landscape through exclusive interviews
              and strategic insights from global technology leaders.
            </p>
            
            {/* Leadership Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {[
                { icon: Users, label: "Featured Leaders", value: "500+" },
                { icon: Award, label: "Industry Awards", value: "250+" },
                { icon: TrendingUp, label: "Success Stories", value: "1000+" },
                { icon: BookOpen, label: "Expert Articles", value: "2000+" },
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
                >
                  <stat.icon className="w-8 h-8 mb-2 mx-auto text-insightRed" />
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* CIO Profiles Section with Enhanced Cards */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-insightBlack mb-8 text-center">
            Featured Technology Leaders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaderProfiles.map(profile => (
              <HoverCard key={profile.id}>
                <HoverCardTrigger asChild>
                  <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                    <div className="relative h-72 overflow-hidden">
                      <img 
                        src={profile.image} 
                        alt={profile.name}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-insightBlack mb-1 group-hover:text-insightRed transition-colors">
                        {profile.name}
                      </h3>
                      <p className="text-insightRed font-medium mb-2">{profile.title}</p>
                      <p className="text-gray-600 text-sm mb-4">{profile.company}</p>
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-6">
                  <h4 className="text-lg font-semibold mb-2">{profile.name}</h4>
                  <p className="text-sm text-gray-600">{profile.bio}</p>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </section>

        {/* Leadership Philosophy Articles with Parallax Sections */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-insightBlack mb-8 text-center">
            Leadership Philosophy & Insights
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {philosophyArticles.map(article => (
              <div 
                key={article.id} 
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row h-full">
                  <div className="md:w-2/5 relative overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="md:w-3/5 p-6 flex flex-col">
                    <h3 className="text-xl font-bold text-insightBlack mb-3 group-hover:text-insightRed transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">
                      {article.excerpt}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-gray-500">By {article.author}</span>
                      <Link 
                        to={`/article/${article.id}`}
                        className="inline-flex items-center text-insightRed hover:text-insightBlack transition-colors"
                      >
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interviews and Media Features with Grid Layout */}
        <section>
          <h2 className="text-3xl font-bold text-insightBlack mb-8 text-center">
            Interviews & Media Coverage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviewsAndFeatures.map(article => (
              <div 
                key={article.id} 
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-0 right-0 m-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-insightRed text-white rounded-full">
                      {article.type === 'interview' ? 'Interview' : 'Feature'}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-insightBlack mb-3 group-hover:text-insightRed transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">{article.excerpt}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-sm text-gray-500">{article.date}</span>
                    {article.url ? (
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-insightRed hover:text-insightBlack transition-colors"
                      >
                        Read More <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    ) : (
                      <Link 
                        to={`/article/${article.id}`}
                        className="inline-flex items-center text-insightRed hover:text-insightBlack transition-colors"
                      >
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Leadership;
