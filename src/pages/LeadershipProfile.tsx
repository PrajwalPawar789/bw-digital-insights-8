
import { useParams, Link } from 'react-router-dom';
import { useLeadershipBySlug } from '@/hooks/useLeadership';
import { ChevronLeft, Linkedin, Twitter, Mail, Loader2 } from 'lucide-react';

const LeadershipProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: leader, isLoading, error } = useLeadershipBySlug(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-insightRed" />
          <span className="text-lg">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error || !leader) {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            to="/leadership"
            className="inline-flex items-center text-insightRed hover:text-insightBlack transition-colors text-sm font-medium"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Leadership Team
          </Link>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <img
                src={leader.image_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400'}
                alt={leader.name}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-2/3 p-8">
              <h1 className="text-3xl font-bold text-insightBlack mb-2">{leader.name}</h1>
              <h2 className="text-xl text-insightRed font-semibold mb-2">{leader.title}</h2>
              {leader.company && (
                <p className="text-gray-600 mb-4">{leader.company}</p>
              )}
              
              {/* Social Links */}
              <div className="flex items-center space-x-4 mb-6">
                {leader.linkedin_url && (
                  <a
                    href={leader.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 mr-2" />
                    LinkedIn
                  </a>
                )}
                {leader.twitter_url && (
                  <a
                    href={leader.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <Twitter className="w-5 h-5 mr-2" />
                    Twitter
                  </a>
                )}
              </div>

              {/* Quick Bio */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-insightBlack mb-2">Quick Overview</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {leader.bio.split('\n')[0]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Biography */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h3 className="text-2xl font-bold text-insightBlack mb-6">Biography</h3>
          <div className="prose prose-lg max-w-none">
            {leader.bio.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Professional Highlights */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-insightBlack mb-6">Professional Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-insightRed mb-2">Current Role</h4>
              <p className="text-gray-700">{leader.title}</p>
              {leader.company && (
                <p className="text-gray-600 text-sm">{leader.company}</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-insightRed mb-2">Areas of Expertise</h4>
              <p className="text-gray-700 text-sm">
                Leadership, Digital Transformation, Strategic Planning, Technology Innovation
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-insightBlack mb-4">Connect with {leader.name.split(' ')[0]}</h4>
            <div className="flex flex-wrap gap-4">
              {leader.linkedin_url && (
                <a
                  href={leader.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  Connect on LinkedIn
                </a>
              )}
              {leader.twitter_url && (
                <a
                  href={leader.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Follow on Twitter
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadershipProfile;
