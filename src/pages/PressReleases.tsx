
import { Link } from 'react-router-dom';
import { pressReleaseData } from '../data/pressReleaseData';

const PressReleases = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4">Press Releases</h1>
          <p className="max-w-3xl mx-auto text-gray-600">
            Stay up-to-date with the latest announcements, partnerships, and innovations from InsightsBW.
          </p>
        </div>

        {/* Press Release List */}
        <div className="space-y-8">
          {pressReleaseData.map((pressRelease) => (
            <div key={pressRelease.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                  <img
                    src={pressRelease.image}
                    alt={pressRelease.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex flex-col h-full">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-md">
                          {pressRelease.category}
                        </span>
                        <span className="text-sm text-gray-500">{pressRelease.date}</span>
                      </div>
                      <h2 className="text-xl font-bold text-insightBlack mb-3">{pressRelease.title}</h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">{pressRelease.excerpt}</p>
                    </div>
                    <div className="mt-auto">
                      <Link
                        to={`/press-releases/${pressRelease.id}`}
                        className="text-insightRed hover:text-insightBlack text-sm font-medium transition-colors"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PressReleases;
