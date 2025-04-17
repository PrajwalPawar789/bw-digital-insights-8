
import { Link } from 'react-router-dom';
import { leaderProfiles, leadershipArticles } from '../data/leadershipData';
import { ExternalLink } from 'lucide-react';

const Leadership = () => {
  // Separate articles by type
  const philosophyArticles = leadershipArticles.filter(article => article.type === 'philosophy');
  const interviewsAndFeatures = leadershipArticles.filter(article => article.type === 'interview' || article.type === 'feature');

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4">Leadership Insights</h1>
          <p className="max-w-3xl mx-auto text-gray-600">
            Explore thought leadership and strategic perspectives from influential CIOs and technology leaders
            who are driving digital transformation across industries.
          </p>
        </div>

        {/* CIO Profiles Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-insightBlack mb-6">Featured CIO Profiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaderProfiles.map(profile => (
              <div key={profile.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={profile.image} 
                    alt={profile.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-insightBlack mb-1">{profile.name}</h3>
                  <p className="text-insightRed font-medium mb-1">{profile.title}</p>
                  <p className="text-gray-600 text-sm mb-4">{profile.company}</p>
                  <p className="text-gray-600 text-sm line-clamp-3">{profile.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Leadership Philosophy Articles */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-insightBlack mb-6">Leadership Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {philosophyArticles.map(article => (
              <div key={article.id} className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <h3 className="text-lg font-bold text-insightBlack mb-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.excerpt}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-sm text-gray-500">By {article.author}</span>
                    <span className="text-sm text-gray-500">{article.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interviews and Media Features */}
        <section>
          <h2 className="text-2xl font-bold text-insightBlack mb-6">Interviews & Media Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {interviewsAndFeatures.map(article => (
              <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-insightBlack mb-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{article.date}</span>
                    {article.url ? (
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-insightRed hover:text-insightBlack text-sm font-medium transition-colors"
                      >
                        External Link <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    ) : (
                      <span className="text-insightRed text-sm font-medium">
                        {article.type === 'interview' ? 'Interview' : 'Feature'}
                      </span>
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
