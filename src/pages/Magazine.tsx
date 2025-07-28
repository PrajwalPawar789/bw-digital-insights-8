import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMagazines, useFeaturedMagazines } from '@/hooks/useMagazines';
import { useCompanyName } from '@/hooks/useDatabaseSettings';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { BookOpen, Star, Loader2, Search, Filter, Calendar, Download, Eye, ArrowRight, Crown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Magazine = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;
  
  const { data: allMagazines = [], isLoading } = useMagazines();
  const { data: featuredMagazines = [] } = useFeaturedMagazines();
  
  // Enhanced category extraction with more specific categorization
  const categories = ['all', ...Array.from(new Set(allMagazines.map(mag => {
    const title = mag.title.toLowerCase();
    if (title.includes('ai') || title.includes('artificial intelligence') || title.includes('tech')) return 'technology';
    if (title.includes('cyber') || title.includes('security')) return 'security';
    if (title.includes('innovation') || title.includes('startup')) return 'innovation';
    if (title.includes('finance') || title.includes('banking')) return 'finance';
    if (title.includes('health') || title.includes('medical')) return 'healthcare';
    if (title.includes('sustain') || title.includes('green') || title.includes('environment')) return 'sustainability';
    if (title.includes('leader') || title.includes('management')) return 'leadership';
    return 'business';
  })))];
  
  // Advanced filtering and search
  const filteredMagazines = allMagazines
    .filter(magazine => {
      const matchesCategory = selectedCategory === 'all' || (() => {
        const title = magazine.title.toLowerCase();
        if (selectedCategory === 'technology') return title.includes('ai') || title.includes('artificial intelligence') || title.includes('tech');
        if (selectedCategory === 'security') return title.includes('cyber') || title.includes('security');
        if (selectedCategory === 'innovation') return title.includes('innovation') || title.includes('startup');
        if (selectedCategory === 'finance') return title.includes('finance') || title.includes('banking');
        if (selectedCategory === 'healthcare') return title.includes('health') || title.includes('medical');
        if (selectedCategory === 'sustainability') return title.includes('sustain') || title.includes('green') || title.includes('environment');
        if (selectedCategory === 'leadership') return title.includes('leader') || title.includes('management');
        return selectedCategory === 'business';
      })();
      
      const matchesSearch = searchTerm === '' || 
        magazine.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        magazine.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime();
        case 'oldest':
          return new Date(a.publish_date).getTime() - new Date(b.publish_date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:
          return 0;
      }
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMagazines = filteredMagazines.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMagazines.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1); // Reset to first page when sorting
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      if (currentPage > 4) pageNumbers.push('ellipsis1');
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      if (currentPage < totalPages - 3) pageNumbers.push('ellipsis2');
      
      // Always show last page if more than 1 page
      if (totalPages > 1) pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const magazineStats = {
    total: allMagazines.length,
    featured: featuredMagazines.length,
    categories: categories.length - 1, // Exclude 'all'
    avgReadTime: '15 min'
  };

  const companyName = useCompanyName();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-insightRed" />
          <p className="text-lg font-medium">Loading magazines...</p>
          <p className="text-sm text-gray-600">Preparing the latest business insights for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-insightBlack via-gray-900 to-insightBlack text-white py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1557425955-df376b5903c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Badge className="mb-6 bg-gradient-to-r from-insightRed to-red-600 text-white border-none text-sm px-6 py-3 shadow-xl">
              <Crown className="w-4 h-4 mr-2" />
              Premium Business Intelligence
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {companyName} Archive
          </h1>
          
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-200 leading-relaxed mb-8">
            Access our complete collection of quarterly publications featuring exclusive CEO interviews, 
            market analysis, and strategic insights that drive business transformation.
          </p>
        </div>
      </section>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Advanced Search and Filter Controls */}
        <Card className="p-6 mb-8 shadow-sm">
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search magazines by title, description, or keywords..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              
              {/* Category Filter */}
              <div className="lg:w-48">
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Sort */}
              <div className="lg:w-48">
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="featured">Featured First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Filter Summary */}
            <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
              <span>Showing {filteredMagazines.length} of {allMagazines.length} magazines</span>
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{searchTerm}"
                  <button onClick={() => handleSearchChange('')} className="ml-1 hover:text-red-600">×</button>
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {selectedCategory}
                  <button onClick={() => handleCategoryChange('all')} className="ml-1 hover:text-red-600">×</button>
                </Badge>
              )}
            </div>
          </div>
        </Card>
        
        {/* Enhanced Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentMagazines.length > 0 ? (
            currentMagazines.map((magazine) => (
              <Card key={magazine.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200">
                <div className="relative">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={magazine.cover_image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'}
                      alt={magazine.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Enhanced Overlay with Multiple Badges */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    <Badge className="bg-insightRed/90 hover:bg-insightRed text-white font-semibold">
                      {magazine.issue_number ? `Issue ${magazine.issue_number}` : 'Latest'}
                    </Badge>
                    {magazine.featured && (
                      <Badge className="bg-yellow-500/90 text-black font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  {/* Bottom Action Buttons */}
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex gap-2">
                      <Link to={`/magazine/${magazine.slug}`} className="flex-1">
                        <Button size="sm" className="w-full bg-white/90 text-black hover:bg-white text-xs font-medium">
                          <Eye className="w-3 h-3 mr-1" />
                          Read Now
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" className="bg-white/90 border-white text-black hover:bg-white">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold mb-3 text-insightBlack group-hover:text-insightRed transition-colors line-clamp-2 leading-tight">
                      {magazine.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {magazine.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(magazine.publish_date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span>15 min</span>
                    </div>
                  </div>
                  
                  <Link to={`/magazine/${magazine.slug}`} className="block mt-4">
                    <Button variant="outline" className="w-full group-hover:bg-insightRed group-hover:text-white group-hover:border-insightRed transition-all">
                      Read Full Issue
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="p-12 text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No magazines found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedCategory !== 'all' 
                    ? "Try adjusting your search criteria or browse all magazines." 
                    : "New magazine issues will appear here as they're published."
                  }
                </p>
                <div className="flex gap-3 justify-center">
                  {(searchTerm || selectedCategory !== 'all') && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleSearchChange('');
                        handleCategoryChange('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                  <Link to="/contact">
                    <Button className="bg-insightRed hover:bg-red-700">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center space-y-4">
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
            
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} • {filteredMagazines.length} total results
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Magazine;
