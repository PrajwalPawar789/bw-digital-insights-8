import React, { useMemo, useState } from 'react';
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
} from '@/components/ui/pagination';
import { BookOpen, Star, Loader2, Search, Calendar, Download, Eye, ArrowRight, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Seo from "@/components/seo/Seo";
import { buildBreadcrumbSchema, getSiteOrigin } from "@/lib/seo";

const Magazine = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  const { data: allMagazines = [], isLoading } = useMagazines();
  const { data: featuredMagazines = [] } = useFeaturedMagazines();

  // Horizontal scroller for featured magazines — mouse-driven smooth scroll
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const targetScroll = React.useRef(0);

  React.useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onScrollerMouseMove = (e: React.MouseEvent) => {
    const el = scrollerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const maxScroll = el.scrollWidth - el.clientWidth;
    targetScroll.current = pct * maxScroll;

    if (!rafRef.current) {
      const step = () => {
        const elNow = scrollerRef.current;
        if (!elNow) {
          if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
          return;
        }
        const current = elNow.scrollLeft;
        const t = targetScroll.current;
        const next = current + (t - current) * 0.15;
        elNow.scrollLeft = next;
        if (Math.abs(next - t) > 0.5) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          rafRef.current = null;
        }
      };
      rafRef.current = requestAnimationFrame(step);
    }
  };

  const onScrollerLeave = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  };

  const updateScales = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const maxDist = rect.width / 2;

    children.forEach((child, idx) => {
      const childRect = child.getBoundingClientRect();
      const childCenter = childRect.left + childRect.width / 2;
      const offset = (childCenter - centerX) / maxDist; // -1..1
      const t = Math.max(0, 1 - Math.abs(offset)); // 0..1
    const maxScale = 1.3; // center scale when t===1
    const minScale = 1.0; // side scale when t===0
    const scale = minScale + t * (maxScale - minScale); // 1 .. 1.3
    const translateY = -12 * t; // gentler lift for center
    const rotateY = offset * -12; // tilt sides
    const z = Math.round(t * 100);

    const imgWrapper = child.querySelector('div');
    if (imgWrapper) {
      (imgWrapper as HTMLElement).style.transform = `translateY(${translateY}px) scale(${scale})`;
      (imgWrapper as HTMLElement).style.transition = 'transform 0.26s cubic-bezier(.2,.9,.2,1)';
      (imgWrapper as HTMLElement).style.willChange = 'transform';
    }

    (child as HTMLElement).style.zIndex = String(300 + z);
    (child as HTMLElement).style.transform = `perspective(1000px) rotateY(${rotateY}deg)`;
    (child as HTMLElement).style.transition = 'transform 0.26s cubic-bezier(.2,.9,.2,1), filter 0.26s ease';
    (child as HTMLElement).style.filter = t > 0.2 ? 'none' : 'grayscale(50%) brightness(0.78)';
    });
  };

  // ensure initial scales are set
  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    // small delay to allow layout
    setTimeout(() => {
      updateScales();
      // center the middle item initially
      const children = Array.from(el.children) as HTMLElement[];
      if (children.length) {
        const mid = Math.floor(children.length / 2);
        const child = children[mid];
        const left = Math.max(0, child.offsetLeft + child.offsetWidth / 2 - el.clientWidth / 2);
        el.scrollLeft = left;
        updateScales();
      }
    }, 80);
    const handleResize = () => updateScales();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [featuredMagazines, allMagazines]);

  // derive categories (simple heuristics + titles)
  const categories = useMemo(() => {
    const found = new Set<string>();
    allMagazines.forEach((m: any) => {
      const title = (m.title || '').toLowerCase();
      if (title.includes('ai') || title.includes('artificial intelligence') || title.includes('tech')) found.add('technology');
      else if (title.includes('cyber') || title.includes('security')) found.add('security');
      else if (title.includes('innovation') || title.includes('startup')) found.add('innovation');
      else if (title.includes('finance') || title.includes('banking')) found.add('finance');
      else if (title.includes('health') || title.includes('medical')) found.add('healthcare');
      else if (title.includes('sustain') || title.includes('green') || title.includes('environment')) found.add('sustainability');
      else if (title.includes('leader') || title.includes('management')) found.add('leadership');
      else found.add('business');
    });
    return ['all', ...Array.from(found)];
  }, [allMagazines]);

  const filteredMagazines = useMemo(() => {
    const filtered = allMagazines.filter((mag: any) => {
      const matchesCategory = selectedCategory === 'all' || (() => {
        const title = (mag.title || '').toLowerCase();
        if (selectedCategory === 'technology') return title.includes('ai') || title.includes('artificial intelligence') || title.includes('tech');
        if (selectedCategory === 'security') return title.includes('cyber') || title.includes('security');
        if (selectedCategory === 'innovation') return title.includes('innovation') || title.includes('startup');
        if (selectedCategory === 'finance') return title.includes('finance') || title.includes('banking');
        if (selectedCategory === 'healthcare') return title.includes('health') || title.includes('medical');
        if (selectedCategory === 'sustainability') return title.includes('sustain') || title.includes('green') || title.includes('environment');
        if (selectedCategory === 'leadership') return title.includes('leader') || title.includes('management');
        return selectedCategory === 'business';
      })();

      const matchesSearch = !searchTerm || (mag.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || (mag.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    switch (sortBy) {
      case 'newest':
        return filtered.sort((a: any, b: any) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());
      case 'oldest':
        return filtered.sort((a: any, b: any) => new Date(a.publish_date).getTime() - new Date(b.publish_date).getTime());
      case 'title':
        return filtered.sort((a: any, b: any) => (a.title || '').localeCompare(b.title || ''));
      case 'featured':
        return filtered.sort((a: any, b: any) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      default:
        return filtered;
    }
  }, [allMagazines, selectedCategory, searchTerm, sortBy]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMagazines = filteredMagazines.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(filteredMagazines.length / itemsPerPage));

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pageNumbers: Array<number | string> = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
      return pageNumbers;
    }
    pageNumbers.push(1);
    if (currentPage > 4) pageNumbers.push('ellipsis1');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pageNumbers.push(i);
    if (currentPage < totalPages - 3) pageNumbers.push('ellipsis2');
    if (totalPages > 1) pageNumbers.push(totalPages);
    return pageNumbers;
  };

  const magazineStats = {
    total: allMagazines.length,
    featured: featuredMagazines.length,
    categories: Math.max(0, categories.length - 1),
    avgReadTime: '15 min',
  };

  const companyName = useCompanyName();
  const siteOrigin = getSiteOrigin();
  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: "Magazine", url: `${siteOrigin}/magazine` },
      ])
    : undefined;

  if (isLoading) {
    return (
      <>
        <Seo title="Magazine" noindex />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-insightRed" />
            <p className="text-lg font-medium">Loading magazines...</p>
            <p className="text-sm text-gray-600">Preparing the latest business insights for you</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo
        title="Magazine"
        description={`Explore ${companyName} magazine issues featuring executive interviews, industry analysis, and leadership insights.`}
        schema={breadcrumbSchema ? [breadcrumbSchema] : undefined}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero / Featured carousel */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-insightBlack">{companyName} Magazine</h1>
              <p className="text-gray-600 mb-6 max-w-2xl">Explore our curated issues — deep-dive interviews, long-form features, and analysis from industry leaders. Subscribe for full access to archives and exclusive content.</p>
              <div className="flex items-center gap-3">
                <Link to="/magazine" className="inline-flex items-center px-4 py-2 rounded-md bg-insightRed text-white font-medium hover:bg-insightRed/90">Subscribe</Link>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-insightBlack">Request a Corporate License</Link>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="relative overflow-visible rounded-xl">
                <div ref={scrollerRef} onMouseMove={onScrollerMouseMove} onMouseLeave={onScrollerLeave} onScroll={() => updateScales()} className="scroller-strip flex gap-6 overflow-x-auto py-6 px-6 no-scrollbar">
                  {(featuredMagazines.length ? featuredMagazines : allMagazines.slice(0,6)).map((m: any, idx:number) => (
                    <Link key={m.id} to={`/magazine/${m.slug}`} className="mag-scroller-item relative min-w-[220px] w-[220px] shrink-0 group rounded-lg overflow-visible bg-transparent">
                      <div className="aspect-[3/4] cover-wrapper bg-transparent flex items-center justify-center transform transition-transform duration-500 will-change-transform overflow-visible">
                        <img src={m.cover_image_url || '/placeholder.svg'} alt={m.title} className="w-full h-full object-contain p-2 rounded-lg bg-transparent drop-shadow-lg" />
                        <div className="absolute inset-0 pointer-events-none" />
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-6 bg-black/60 text-white text-xs rounded-md px-3 py-1 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="font-semibold line-clamp-1">{m.title}</div>
                        <div className="text-[11px] text-gray-200">{m.publish_date ? new Date(m.publish_date).toLocaleDateString() : ''}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <div>
            {/* Controls */}
            <Card className="p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search magazines by title, description, or keywords..." value={searchTerm} onChange={(e:any)=>handleSearchChange(e.target.value)} className="pl-10 h-12" />
                </div>

                <div className="md:w-48">
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:w-48">
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

              <div className="mt-3 flex items-center gap-3 text-sm text-gray-600">
                <span>Showing {filteredMagazines.length} of {allMagazines.length}</span>
                {searchTerm && <Badge variant="secondary">Search: "{searchTerm}"</Badge>}
                {selectedCategory !== 'all' && <Badge variant="secondary">Category: {selectedCategory}</Badge>}
              </div>
            </Card>

            {/* Grid */}
            {/* Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {currentMagazines.length > 0 ? currentMagazines.map((magazine:any)=> (
    <Link
      key={magazine.id}
      to={`/magazine/${magazine.slug}`}
      className="block group"
    >
      <Card className="relative overflow-hidden rounded-xl hover:shadow-xl transition">
        <div className="aspect-[3/4] bg-white overflow-hidden flex items-center justify-center">
          <img
            src={magazine.cover_image_url || '/placeholder.svg'}
            alt={magazine.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold line-clamp-2 text-insightBlack group-hover:text-insightRed transition-colors">
                {magazine.title}
              </h3>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">
                {magazine.publish_date ? new Date(magazine.publish_date).toLocaleDateString() : ''}
              </div>
              <Badge className="mt-2 bg-insightRed text-white">
                {magazine.issue_number ? `Issue ${magazine.issue_number}` : 'Latest'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )) : (
                <Card className="p-12 text-center">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No magazines found</h3>
                  <p className="text-gray-600 mb-6">{searchTerm || selectedCategory !== 'all' ? "Try adjusting your search criteria." : "New magazine issues will appear here."}</p>
                </Card>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} className="cursor-pointer hover:bg-gray-100" />
                      </PaginationItem>
                    )}

                    {getPageNumbers().map((page:any, index:number) => (
                      <PaginationItem key={index}>
                        {page === 'ellipsis1' || page === 'ellipsis2' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink isActive={currentPage === page} onClick={() => handlePageChange(page as number)} className={`${currentPage === page ? 'bg-insightRed text-white' : 'hover:bg-gray-100'}`}>
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext onClick={() => handlePageChange(currentPage + 1)} className="cursor-pointer hover:bg-gray-100" />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
    </>
  );
};

export default Magazine;
