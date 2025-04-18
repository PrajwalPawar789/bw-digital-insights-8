
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
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4">InsightsBW Magazine</h1>
          <p className="max-w-3xl mx-auto text-gray-600">
            Our digital magazine delivers in-depth analysis, expert interviews, and actionable insights
            to help business leaders navigate complexity and drive innovation.
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1); // Reset to page 1 when changing category
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-insightRed text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentMagazines.length > 0 ? (
            currentMagazines.map((magazine: Magazine) => (
              <Link
                key={magazine.id}
                to={`/magazine/${magazine.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="relative">
                  <img
                    src={magazine.coverImage}
                    alt={magazine.title}
                    className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-0 right-0 bg-insightRed text-white text-xs font-bold px-2 py-1 m-2 rounded">
                    {magazine.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-insightBlack group-hover:text-insightRed transition-colors">
                    {magazine.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{magazine.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{magazine.publicationDate}</span>
                    <span className="text-insightRed font-medium">View</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-600">No magazines found in this category.</p>
            </div>
          )}
        </div>

        {/* Improved Pagination */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                {/* Previous Page Button */}
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}
                
                {/* Page Numbers */}
                {getPageNumbers().map((page, index) => {
                  if (page === 'ellipsis1' || page === 'ellipsis2') {
                    return <PaginationItem key={`ellipsis-${index}`}><PaginationEllipsis /></PaginationItem>;
                  }
                  
                  return (
                    <PaginationItem key={`page-${page}`}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => handlePageChange(page as number)}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {/* Next Page Button */}
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="cursor-pointer"
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
