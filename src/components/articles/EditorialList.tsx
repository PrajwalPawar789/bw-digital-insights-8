import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Clock3, Layers3, Sparkles, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface Props { articles: any[]; basePath?: string; layout?: 'editorial' | 'grid' }

const ARTICLES_PER_PAGE = 6;
const CATEGORY_LIMIT = 6;

function imgOf(a:any){return a?.image_url||'/placeholder.svg'}
function titleOf(a:any){return a?.title||'Untitled'}
function slugOf(a:any){return a?.slug||''}
function dateOf(a:any){const d=a?.date?new Date(a.date):null;return d?d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):''}
function categoryOf(a:any){return a?.category||'Business'}
function excerptOf(a:any){return a?.excerpt||''}
function readTimeOf(a:any){
  const text = `${titleOf(a)} ${excerptOf(a)}`.trim();
  const words = text ? text.split(/\s+/).length : 0;
  return `${Math.max(2, Math.ceil(words / 45))} min read`;
}

const getPageNumbers = (currentPage: number, totalPages: number) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
};

const EditorialList = ({articles = [], basePath = '/article', layout = 'editorial'}: Props) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const sorted = useMemo(
    () => (Array.isArray(articles) ? [...articles].sort((a, b) => new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime()) : []),
    [articles]
  );
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(sorted.map((article) => categoryOf(article))))],
    [sorted]
  );
  const visibleCategories = categories.slice(0, CATEGORY_LIMIT);
  const filtered = useMemo(
    () => activeCategory === 'All' ? sorted : sorted.filter((article) => categoryOf(article) === activeCategory),
    [activeCategory, sorted]
  );
  const lead = filtered[0];
  const list = filtered.slice(1);
  const totalPages = Math.max(1, Math.ceil(list.length / ARTICLES_PER_PAGE));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const pageStart = (currentPageSafe - 1) * ARTICLES_PER_PAGE;
  const pageItems = list.slice(pageStart, pageStart + ARTICLES_PER_PAGE);
  const pageNumbers = getPageNumbers(currentPageSafe, totalPages);
  const trending = [...sorted].slice(0, 5);
  const spotlight = [...sorted].slice(5, 8);
  const latestTitles = [...sorted].slice(0, 4);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, articles.length]);

  if (layout === 'grid') {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((a,i)=> (
            <Link key={slugOf(a)+i} to={`${basePath}/${slugOf(a)}`} className="group rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img src={imgOf(a)} alt={titleOf(a)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
              </div>
              <div className="p-4">
                <div className="text-xs text-insightRed font-bold uppercase tracking-wide mb-1">{categoryOf(a)}</div>
                <h3 className="text-lg font-semibold text-insightBlack group-hover:text-insightRed mb-1 line-clamp-2">{titleOf(a)}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">{excerptOf(a)}</p>
                <div className="text-xs text-gray-500 flex items-center gap-2"><Calendar className="h-3 w-3"/>{dateOf(a)}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-insightRed">Browse smarter</p>
            <h2 className="mt-2 text-2xl font-bold text-insightBlack">Less scrolling, faster discovery</h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              Jump through pages, narrow the feed by topic, and keep the newest stories visible above the fold.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <Layers3 className="h-4 w-4 text-insightRed" />
                Total stories
              </div>
              <div className="mt-2 text-2xl font-bold text-insightBlack">{filtered.length}</div>
            </div>
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <TrendingUp className="h-4 w-4 text-insightRed" />
                Topics
              </div>
              <div className="mt-2 text-2xl font-bold text-insightBlack">{categories.length - 1}</div>
            </div>
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <Clock3 className="h-4 w-4 text-insightRed" />
                This page
              </div>
              <div className="mt-2 text-2xl font-bold text-insightBlack">{pageItems.length + (lead ? 1 : 0)}</div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {visibleCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                activeCategory === category
                  ? 'border-insightRed bg-insightRed text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-insightRed hover:text-insightRed'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main column */}
      <div className="lg:col-span-2 space-y-8">
        {lead && (
          <Link to={`${basePath}/${slugOf(lead)}`} className="block group overflow-hidden rounded-2xl shadow-lg">
            <div className="relative aspect-[16/9]">
              <img src={imgOf(lead)} alt={titleOf(lead)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"/>
              <div className="absolute bottom-0 p-6 text-white">
                <div className="inline-flex px-3 py-1 rounded bg-insightRed text-white text-xs font-bold mb-3">{categoryOf(lead)}</div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">{titleOf(lead)}</h2>
                <p className="text-white/80 line-clamp-2">{excerptOf(lead)}</p>
                <div className="mt-3 flex items-center gap-3 text-sm text-white/80">
                  <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />{dateOf(lead)}</span>
                  <span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" />{readTimeOf(lead)}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        <div className="divide-y divide-gray-200 bg-white rounded-xl border border-gray-200 overflow-hidden">
          {pageItems.map((a,i)=> (
            <Link key={slugOf(a)+i} to={`${basePath}/${slugOf(a)}`} className="flex flex-col md:flex-row gap-5 p-5 hover:bg-gray-50 transition">
              <div className="md:w-60 flex-shrink-0">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img src={imgOf(a)} alt={titleOf(a)} className="w-full h-full object-cover"/>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-insightRed font-bold uppercase tracking-wide mb-1">{categoryOf(a)}</div>
                <h3 className="text-xl font-semibold text-insightBlack group-hover:text-insightRed mb-2">{titleOf(a)}</h3>
                <p className="text-gray-600 line-clamp-2 mb-2">{excerptOf(a)}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-2"><Calendar className="h-3 w-3"/>{dateOf(a)}</span>
                  <span className="inline-flex items-center gap-2"><Clock3 className="h-3 w-3"/>{readTimeOf(a)}</span>
                </div>
              </div>
              <ChevronRight className="hidden md:block h-5 w-5 text-gray-300 self-center group-hover:text-insightRed"/>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div id="editorial-pagination" className="rounded-2xl border border-gray-200 bg-white px-4 py-5">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600">
                Showing page {currentPageSafe} of {totalPages}
              </p>
              <p className="text-sm text-gray-500">
                Stories {lead ? pageStart + 2 : pageStart + 1} to {Math.min(pageStart + pageItems.length + (lead ? 1 : 0), filtered.length)} of {filtered.length}
              </p>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#editorial-pagination"
                    onClick={(event) => {
                      event.preventDefault();
                      setCurrentPage((page) => Math.max(1, page - 1));
                    }}
                    className={currentPageSafe === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {pageNumbers.map((page, index) => {
                  const showEllipsisBefore = index > 0 && page - pageNumbers[index - 1] > 1;
                  return (
                    <Fragment key={page}>
                      {showEllipsisBefore && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          href="#editorial-pagination"
                          isActive={page === currentPageSafe}
                          onClick={(event) => {
                            event.preventDefault();
                            setCurrentPage(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    </Fragment>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#editorial-pagination"
                    onClick={(event) => {
                      event.preventDefault();
                      setCurrentPage((page) => Math.min(totalPages, page + 1));
                    }}
                    className={currentPageSafe === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="space-y-8">
        <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200 font-semibold uppercase tracking-wide text-sm text-insightBlack">Trending</div>
          <ul className="divide-y divide-gray-200">
            {trending.map((a,i)=> (
              <li key={slugOf(a)+i} className="p-4 hover:bg-white transition">
                <Link to={`${basePath}/${slugOf(a)}`} className="flex gap-3 group">
                  <img src={imgOf(a)} alt={titleOf(a)} className="w-16 h-16 rounded object-cover flex-shrink-0"/>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{categoryOf(a)}</div>
                    <h4 className="font-semibold group-hover:text-insightRed line-clamp-2">{titleOf(a)}</h4>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span>{dateOf(a)}</span>
                      <span>|</span>
                      <span>{readTimeOf(a)}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {spotlight.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-insightRed" />
              <h3 className="text-lg font-bold text-insightBlack">Editor&apos;s Spotlight</h3>
            </div>
            <div className="space-y-4">
              {spotlight.map((article, index) => (
                <Link key={`${slugOf(article)}-spotlight-${index}`} to={`${basePath}/${slugOf(article)}`} className="block rounded-2xl bg-gray-50 p-4 transition hover:bg-gray-100">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="secondary" className="bg-insightRed/10 text-insightRed hover:bg-insightRed/10">
                      {categoryOf(article)}
                    </Badge>
                    <span className="text-xs text-gray-500">{readTimeOf(article)}</span>
                  </div>
                  <h4 className="font-semibold text-insightBlack line-clamp-2">{titleOf(article)}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}

        {latestTitles.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-insightBlack p-6 text-white shadow-sm">
            <h3 className="text-lg font-bold">Latest Radar</h3>
            <p className="mt-2 text-sm text-white/70">A quick skim list for readers who want the newest coverage first.</p>
            <ol className="mt-4 space-y-3">
              {latestTitles.map((article, index) => (
                <li key={`${slugOf(article)}-radar-${index}`} className="flex gap-3">
                  <span className="text-sm font-bold text-insightRed">{String(index + 1).padStart(2, '0')}</span>
                  <Link to={`${basePath}/${slugOf(article)}`} className="text-sm leading-6 text-white/90 transition hover:text-white">
                    {titleOf(article)}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="rounded-xl border border-gray-200 p-6 bg-white text-center shadow-sm">
          <h3 className="text-xl font-bold mb-2">Weekly Brief</h3>
          <p className="text-gray-600 mb-4">Get the top stories in your inbox.</p>
          <Link to="/contact" className="inline-flex items-center px-4 py-2 rounded-md bg-insightRed text-white font-medium hover:bg-insightRed/90">Subscribe</Link>
        </div>
      </aside>
      </div>
    </div>
  )
}

export default EditorialList;
