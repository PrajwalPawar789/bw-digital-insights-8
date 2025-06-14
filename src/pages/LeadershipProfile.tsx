
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { leadershipData } from '../data/leadershipData';
import { ChevronLeft, Linkedin, Twitter, Globe, Mail, ArrowUpRight, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";

const LeadershipProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const [leader, setLeader] = useState(leadershipData.find(leader => leader.slug === slug));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-insightRed"></div>
      </div>
    );
  }

  if (!leader) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-insightBlack mb-4">Profile Not Found</h1>
          <p className="mb-6">The leadership profile you're looking for doesn't exist.</p>
          <Link
            to="/leadership"
            className="inline-flex items-center bg-insightRed hover:bg-insightBlack text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Leadership Team
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/leadership"
            className="inline-flex items-center text-insightRed hover:text-insightBlack transition-colors text-sm font-medium"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Leadership Team
          </Link>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gradient-to-br from-gray-900 to-insightBlack text-white p-8">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 w-48 h-48 overflow-hidden rounded-full border-4 border-white shadow-lg">
                  <img 
                    src={leader.image} 
                    alt={leader.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-3xl font-bold mb-2">{leader.name}</h1>
                <p className="text-xl font-light text-gray-300 mb-4">{leader.title}</p>
                <p className="text-gray-300 mb-6">{leader.company}</p>
                
                <div className="flex space-x-4 mb-6">
                  {leader.linkedin && (
                    <a href={leader.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {leader.twitter && (
                    <a href={leader.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {leader.website && (
                    <a href={leader.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                  {leader.email && (
                    <a href={`mailto:${leader.email}`} className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
                      <Mail className="h-5 w-5" />
                    </a>
                  )}
                </div>
                
                <div className="mt-4 w-full">
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <h3 className="font-medium mb-3 text-white">Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {leader.expertise.map((item, index) => (
                        <span key={index} className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-insightBlack mb-4">Biography</h2>
                {leader.bio.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 mb-4">{paragraph}</p>
                ))}
              </div>
              
              {leader.education && leader.education.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-insightBlack mb-4">Education</h2>
                  <div className="space-y-4">
                    {leader.education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-insightRed pl-4 py-1">
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <p className="text-gray-600">{edu.institution}{edu.year ? `, ${edu.year}` : ''}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {leader.awards && leader.awards.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-insightBlack mb-4">Awards & Recognition</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {leader.awards.map((award, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-insightBlack">{award.title}</h3>
                        <p className="text-gray-600 text-sm">{award.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {leader.quotes && leader.quotes.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-insightBlack mb-4">Notable Quotes</h2>
                  <div className="space-y-6">
                    {leader.quotes.map((quote, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-lg relative">
                        <div className="absolute -top-3 -left-3 text-4xl text-insightRed">"</div>
                        <div className="absolute -bottom-3 -right-3 text-4xl text-insightRed">"</div>
                        <blockquote className="italic text-gray-800 mb-2">{quote.text}</blockquote>
                        {quote.source && (
                          <p className="text-sm text-gray-600">— {quote.source}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {leader.articles && leader.articles.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-insightBlack mb-4">Featured Articles</h2>
                  <div className="space-y-4">
                    {leader.articles.map((article, index) => (
                      <Link
                        key={index}
                        to={`/article/${article.slug}`}
                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                      >
                        <BookOpen className="h-5 w-5 text-insightRed mr-3" />
                        <div className="flex-1">
                          <h3 className="font-medium group-hover:text-insightRed transition-colors">{article.title}</h3>
                          <p className="text-sm text-gray-600">{article.date}</p>
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-insightRed transition-colors" />
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <Button 
                      className="bg-insightRed hover:bg-insightBlack text-white transition-colors"
                      asChild
                    >
                      <Link to="/contact">
                        Contact for Speaking Opportunities
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadershipProfile;
