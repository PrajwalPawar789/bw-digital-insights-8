import React from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '@/hooks/useArticles';
import { useFeaturedMagazines } from '@/hooks/useMagazines';
import { useLeadership } from '@/hooks/useLeadership';
import { useSettings } from '@/hooks/useSettings';

const Home = () => {
  const { data: articles, isLoading: articlesLoading } = useArticles();
  const { data: featuredMagazines, isLoading: magazinesLoading } = useFeaturedMagazines();
  const { data: leadership, isLoading: leadershipLoading } = useLeadership();
  const { settings } = useSettings();

  const featuredArticles = articles?.filter(article => article.featured) || [];
  const breakingNewsArticles = articles?.slice(0, 4) || [];

  if (articlesLoading || magazinesLoading || leadershipLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-insightRed"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-insightBlack to-gray-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to {settings.companyName}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Your premier source for business insights, industry analysis, and leadership perspectives
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/articles"
                className="bg-insightRed text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
              >
                Read Exclusive Insights
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
              >
                Watch Success Stories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Breaking News Section */}
      {settings.breakingNewsEnabled && breakingNewsArticles.length > 0 && (
        <section className="py-12 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-insightBlack mb-2">{settings.breakingNewsTitle}</h2>
              <p className="text-gray-600">{settings.breakingNewsSubtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {breakingNewsArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={article.image_url || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400'}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-insightRed font-medium">
                      {new Date(article.date).toLocaleDateString()}
                    </span>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      <Link to={`/article/${article.slug}`} className="hover:text-insightRed">
                        {article.title}
                      </Link>
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Articles Section */}
      {featuredArticles.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-insightBlack mb-2">Featured Articles</h2>
              <p className="text-gray-600">Explore our top picks for in-depth analysis and expert opinions.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={article.image_url || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400'}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-insightRed font-medium">
                      {new Date(article.date).toLocaleDateString()}
                    </span>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      <Link to={`/article/${article.slug}`} className="hover:text-insightRed">
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{article.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Magazine Section */}
      {featuredMagazines && featuredMagazines.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-insightBlack mb-2">Latest Magazine</h2>
              <p className="text-gray-600">Stay ahead with the latest insights and trends in our featured magazine.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredMagazines.map((magazine) => (
                <div key={magazine.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img
                      src={magazine.cover_image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
                      alt={magazine.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      <Link to={`/magazine/${magazine.slug}`} className="hover:text-insightRed">
                        {magazine.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{magazine.description}</p>
                    <Link
                      to={`/magazine/${magazine.slug}`}
                      className="inline-block mt-4 text-insightRed hover:text-insightBlack font-medium"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Leadership Section */}
      {leadership && leadership.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-insightBlack mb-2">Leadership Insights</h2>
              <p className="text-gray-600">Get inspired by the visionaries shaping the future of business.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {leadership.map((leader) => (
                <div key={leader.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={leader.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
                      alt={leader.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{leader.name}</h3>
                    <p className="text-gray-600 text-sm">{leader.title}, {leader.company}</p>
                    <Link
                      to={`/leadership/${leader.slug}`}
                      className="inline-block mt-4 text-insightRed hover:text-insightBlack font-medium"
                    >
                      Read Bio
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA Section */}
      <section className="bg-insightBlack text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Unlock Your Business Potential
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Subscribe to our newsletter and get the latest insights, trends, and strategies delivered straight to your inbox.
            </p>
            <div className="flex justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full md:w-auto px-6 py-3 rounded-md text-black focus:outline-none"
              />
              <button className="bg-insightRed text-white px-8 py-3 rounded-md text-lg font-medium transition-colors hover:bg-insightBlack">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
