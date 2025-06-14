
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pressReleaseData } from '../data/pressReleaseData';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Calendar, FileText, ChevronRight } from 'lucide-react';

const PressReleases = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const categories = ['all', ...Array.from(new Set(pressReleaseData.map(pr => pr.category)))];
  
  const filteredReleases = selectedCategory === 'all'
    ? pressReleaseData
    : pressReleaseData.filter(pr => pr.category === selectedCategory);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReleases = filteredReleases.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReleases.length / itemsPerPage);
  
  useEffect(() => {
    // Reset to page 1 when category changes
    setCurrentPage(1);
  }, [selectedCategory]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-insightBlack mb-4">InsightsBW Press Releases</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay informed about our latest company announcements, partnerships, research publications, and leadership updates.
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4 text-insightBlack">Filter by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-insightRed text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6 mb-10">
          {currentReleases.length > 0 ? (
            currentReleases.map((pressRelease) => (
              <Link
                key={pressRelease.id}
                to={`/press-releases/${pressRelease.slug}`}
                className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="h-48 md:h-full overflow-hidden">
                      <img
                        src={pressRelease.image}
                        alt={pressRelease.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="p-6 md:w-2/3">
                    <div className="flex flex-wrap gap-3 mb-3">
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                        {pressRelease.category}
                      </span>
                      <div className="flex items-center text-gray-500 text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(pressRelease.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-insightBlack group-hover:text-insightRed transition-colors mb-2">
                      {pressRelease.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{pressRelease.excerpt}</p>
                    <div className="flex items-center text-insightRed font-medium">
                      <FileText className="h-4 w-4 mr-1" />
                      Read Press Release
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600">No press releases found in this category.</p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="mt-4 text-insightRed hover:text-insightBlack transition-colors font-medium"
              >
                View all press releases
              </button>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} className="cursor-pointer" />
                  </PaginationItem>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      isActive={currentPage === page}
                      onClick={() => handlePageChange(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} className="cursor-pointer" />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default PressReleases;
