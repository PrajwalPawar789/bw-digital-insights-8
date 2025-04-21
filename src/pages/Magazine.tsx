
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { magazineData, Magazine } from '../data/magazineData';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { ChevronRight } from 'lucide-react';

const MagazinePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;
  
  const categories = ['all', ...Array.from(new Set(magazineData.map(mag => mag.category)))];
  
  const filteredMagazines = selectedCategory === 'all'
    ? magazineData
    : magazineData.filter(magazine => magazine.category === selectedCategory);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMagazines = filteredMagazines.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMagazines.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Create array of page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // If there are many pages, add ellipsis after page 1
    if (currentPage > 3) pageNumbers.push('ellipsis1');
    
    // Add previous page if not first or second
    if (currentPage > 2) pageNumbers.push(currentPage - 1);
    
    // Add current page if not first
    if (currentPage !== 1) pageNumbers.push(currentPage);
    
    // Add next page if not last
    if (currentPage < totalPages - 1) pageNumbers.push(currentPage + 1);
    
    // If there are many pages, add ellipsis before last page
    if (currentPage < totalPages - 2) pageNumbers.push('ellipsis2');
    
    // Always show last page if more than 1 page
    if (totalPages > 1) pageNumbers.push(totalPages);
    
    return pageNumbers;
  };

  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-insightBlack mb-6 leading-tight">
            InsightsBW Magazine Collection
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Explore our curated collection of business insights, industry analysis, 
            and expert perspectives shaping the future of business.
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-insightRed text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentMagazines.length > 0 ? (
            currentMagazines.map((magazine: Magazine) => (
              <Link
                key={magazine.id}
                to={`/magazine/${magazine.id}`}
                className="transform hover:-translate-y-1 transition-all duration-300"
              >
                <Card className="h-full overflow-hidden group hover:shadow-xl">
                  <div className="relative">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={magazine.coverImage}
                        alt={magazine.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90"></div>
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center bg-white/90 backdrop-blur-sm text-insightBlack px-3 py-1.5 text-sm font-semibold rounded-md">
                        {magazine.category}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                      <p className="text-sm font-medium mb-2">{magazine.publicationDate}</p>
                      <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:underline">
                        {magazine.title}
                      </h3>
                      <p className="text-sm text-gray-200 line-clamp-2 mb-4">
                        {magazine.description}
                      </p>
                      <span className="inline-flex items-center bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group-hover:scale-105">
                        Read Magazine <ChevronRight className="ml-2 h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-3 py-16 text-center">
              <p className="text-lg text-gray-600">No magazines found in this category.</p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="mt-4 text-insightRed hover:text-insightBlack transition-colors"
              >
                View all magazines
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                    />
                  </PaginationItem>
                )}
                
                {getPageNumbers().map((page, index) => {
                  if (page === 'ellipsis1' || page === 'ellipsis2') {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  
                  return (
                    <PaginationItem key={`page-${page}`}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => handlePageChange(page as number)}
                        className={`cursor-pointer transition-all duration-300 ${
                          currentPage === page
                            ? 'bg-insightRed text-white hover:bg-insightRed/90'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                    />
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

export default MagazinePage;
