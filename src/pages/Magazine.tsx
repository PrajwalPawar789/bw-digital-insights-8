
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { magazineData, Magazine } from '../data/magazineData';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { BookOpen, Star } from 'lucide-react';

const MagazinePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;
  
  const categories = ['all', ...Array.from(new Set(magazineData.map(mag => mag.category)))];
  
  const filteredMagazines = selectedCategory === 'all'
    ? magazineData
    : magazineData.filter(magazine => magazine.category === selectedCategory);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMagazines = filteredMagazines.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMagazines.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Enhanced Design */}
      <div className="relative bg-insightBlack text-white py-16 mb-12">
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1557425955-df376b5903c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Executive Insights Magazine
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-200 leading-relaxed">
            Join the elite circle of C-suite leaders shaping tomorrow's business landscape. Discover exclusive interviews, strategic insights, and transformative ideas.
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Global Readers", value: "500K+" },
            { label: "C-Suite Features", value: "1000+" },
            { label: "Industry Leaders", value: "250+" },
            { label: "Countries Reached", value: "120+" },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl md:text-3xl font-bold text-insightRed mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Enhanced Category Filter */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-10">
          <h2 className="text-xl font-semibold mb-4 text-insightBlack">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-insightRed text-white shadow-md'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Magazine Grid with Enhanced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentMagazines.length > 0 ? (
            currentMagazines.map((magazine: Magazine) => (
              <Link
                key={magazine.id}
                to={`/magazine/${magazine.id}`}
                className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative">
                  <div className="aspect-w-3 aspect-h-4">
                    <img
                      src={magazine.coverImage}
                      alt={magazine.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-0 right-0 bg-insightRed text-white text-xs font-bold px-3 py-2 m-3 rounded-full">
                    {magazine.category}
                  </div>
                  {/* Premium Badge */}
                  <div className="absolute top-0 left-0 m-3">
                    <div className="flex items-center bg-black bg-opacity-75 text-white text-xs px-3 py-1 rounded-full">
                      <Star className="w-3 h-3 mr-1" />
                      Premium
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-insightBlack group-hover:text-insightRed transition-colors line-clamp-2">
                    {magazine.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{magazine.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span>{magazine.articles.length} Articles</span>
                    </div>
                    <span className="inline-flex items-center text-insightRed font-medium">
                      Read More
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <div className="max-w-md mx-auto">
                <p className="text-gray-600 text-lg mb-4">No magazines found in this category.</p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-insightRed hover:text-insightBlack transition-colors"
                >
                  View all magazines
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 mb-16">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="cursor-pointer hover:bg-gray-100"
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
                        className={`cursor-pointer ${
                          currentPage === page
                            ? 'bg-insightRed text-white hover:bg-insightRed/90'
                            : 'hover:bg-gray-100'
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
                      className="cursor-pointer hover:bg-gray-100"
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
