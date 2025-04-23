
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-black py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyYTQgNCAwIDEwMCA4IDQgNCAwIDAwMC04eiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">InsightsBW Magazine</h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover groundbreaking insights, expert analysis, and transformative ideas shaping the future of business
            </p>
          </div>
        </div>
      </section>
      
      {/* Category Filter */}
      <div className="bg-white shadow-sm sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-insightRed text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
        
      {/* Magazine Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentMagazines.length > 0 ? (
            currentMagazines.map((magazine: Magazine) => (
              <Link
                key={magazine.id}
                to={`/magazine/${magazine.id}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                  <div className="relative">
                    <div className="aspect-[3/4]">
                      <img
                        src={magazine.coverImage}
                        alt={magazine.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4">
                      <span className="inline-block px-3 py-1.5 text-sm font-semibold bg-white text-insightBlack rounded-md shadow-md">
                        {magazine.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-insightRed transition-colors">
                      {magazine.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{magazine.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">{magazine.publicationDate}</span>
                      <span className="text-insightRed font-medium group-hover:translate-x-2 transition-transform duration-300">
                        Read Magazine →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-16">
              <p className="text-xl text-gray-600">No magazines found in this category.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="cursor-pointer hover:bg-gray-100 transition-colors"
                    />
                  </PaginationItem>
                )}
                
                {getPageNumbers().map((page, index) => {
                  if (page === 'ellipsis1' || page === 'ellipsis2') {
                    return <PaginationItem key={`ellipsis-${index}`}><PaginationEllipsis /></PaginationItem>;
                  }
                  
                  return (
                    <PaginationItem key={`page-${page}`}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => handlePageChange(page as number)}
                        className={`cursor-pointer transition-colors ${
                          currentPage === page 
                            ? 'bg-insightRed text-white hover:bg-red-600' 
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
                      className="cursor-pointer hover:bg-gray-100 transition-colors"
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
