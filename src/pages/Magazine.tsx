
import { useState, useEffect } from 'react';
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
import { ChevronRight, Search, Filter, BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

const MagazinePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const itemsPerPage = 6;
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Get all unique categories
  const categories = ['all', ...Array.from(new Set(magazineData.map(mag => mag.category)))];
  
  // Filter magazines by category and search query
  const filteredMagazines = magazineData.filter(magazine => {
    const matchesCategory = selectedCategory === 'all' || magazine.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      magazine.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      magazine.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMagazines = filteredMagazines.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMagazines.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages with smooth animation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = (e.target as HTMLFormElement).search.value;
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
    
    // Show toast when search is performed
    if (query) {
      toast({
        title: "Search results",
        description: `Showing results for "${query}"`,
        duration: 3000,
      });
    }
  };

  // Clear search and filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setCurrentPage(1);
    
    if (document.getElementById('search-input')) {
      (document.getElementById('search-input') as HTMLInputElement).value = '';
    }
    
    toast({
      title: "Filters cleared",
      description: "Showing all magazines",
      duration: 3000,
    });
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

  // Magazine Skeleton Loading Component
  const MagazineSkeleton = () => (
    <div className="h-full overflow-hidden rounded-lg bg-white shadow-md">
      <div className="aspect-[3/4] relative">
        <Skeleton className="h-full w-full" />
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <Skeleton className="h-6 w-24 mb-3" />
          <Skeleton className="h-8 w-full mb-3" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  );

  // Empty state component when no magazines match filters
  const EmptyState = () => (
    <div className="col-span-3 py-16 px-4 text-center bg-gray-50 rounded-lg border border-gray-100">
      <div className="mx-auto max-w-md">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No magazines found</h3>
        <p className="text-gray-600 mb-6">
          We couldn't find any magazines matching your current filters. Try adjusting your search or browse all our collections.
        </p>
        <button
          onClick={handleClearFilters}
          className="inline-flex items-center justify-center rounded-md bg-insightRed px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-insightRed/90 hover:shadow-md"
        >
          View all magazines
        </button>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen py-16 bg-gradient-to-b from-gray-50 to-white" aria-labelledby="magazine-collection-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs for improved navigation context */}
        <nav className="flex mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-500 hover:text-insightRed transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
              <span className="font-medium text-insightBlack">Magazine Collection</span>
            </li>
          </ol>
        </nav>
        
        {/* Hero Section with semantic markup */}
        <header className="text-center mb-12">
          <h1 
            id="magazine-collection-heading" 
            className="text-4xl md:text-5xl font-bold text-insightBlack mb-6 leading-tight"
          >
            InsightsBW Magazine Collection
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Explore our curated collection of business insights, industry analysis, 
            and expert perspectives shaping the future of business.
          </p>
        </header>
        
        {/* Search and Filter Section */}
        <div className="mb-12 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <form onSubmit={handleSearch} className="relative flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <input
                  type="text"
                  id="search-input"
                  name="search"
                  placeholder="Search magazines..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-insightRed focus:border-transparent transition-all"
                  aria-label="Search magazines"
                />
              </div>
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-insightRed text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-insightRed/90 transition-colors"
                aria-label="Submit search"
              >
                Search
              </button>
            </form>
            
            <div className="flex items-center">
              <span className="mr-2 text-sm font-medium text-gray-700 flex items-center whitespace-nowrap">
                <Filter className="mr-2 h-4 w-4" aria-hidden="true" /> Filter by:
              </span>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-insightRed text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                    aria-pressed={selectedCategory === category}
                    aria-label={`Filter by ${category === 'all' ? 'all categories' : category}`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
                
                {/* Only show clear button when filters are active */}
                {(selectedCategory !== 'all' || searchQuery) && (
                  <button
                    onClick={handleClearFilters}
                    className="px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                    aria-label="Clear all filters"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Magazine Grid with proper ARIA roles */}
        <div role="feed" aria-busy={isLoading} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {isLoading ? (
            // Skeleton loading state
            Array(6).fill(0).map((_, index) => (
              <div key={`skeleton-${index}`} className="transform transition-all duration-300">
                <MagazineSkeleton />
              </div>
            ))
          ) : currentMagazines.length > 0 ? (
            // Magazines content
            currentMagazines.map((magazine: Magazine) => (
              <Link
                key={magazine.id}
                to={`/magazine/${magazine.id}`}
                className="transform transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-insightRed focus:ring-offset-2 rounded-lg"
              >
                <Card className="h-full overflow-hidden group hover:shadow-xl">
                  <div className="relative">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={magazine.coverImage}
                        alt={`Cover: ${magazine.title}`}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        width="400"
                        height="533"
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
                        Read Magazine <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            // Empty state when no magazines match filters
            <EmptyState />
          )}
        </div>

        {/* Enhanced Pagination with ARIA roles */}
        {!isLoading && totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-12">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-1"
                      aria-label="Go to previous page"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Previous
                    </PaginationPrevious>
                  </PaginationItem>
                )}
                
                {getPageNumbers().map((page, index) => {
                  if (page === 'ellipsis1' || page === 'ellipsis2') {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis aria-hidden="true" />
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
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
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
                      className="cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-1"
                      aria-label="Go to next page"
                    >
                      Next <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </PaginationNext>
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </nav>
        )}
      </div>
    </section>
  );
};

export default MagazinePage;
