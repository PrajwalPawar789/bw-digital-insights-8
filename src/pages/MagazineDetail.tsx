
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMagazineBySlug } from '@/hooks/useMagazines';
import { useMagazineArticles } from '@/hooks/useMagazineArticles';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Download, FileWarning, Maximize, ZoomIn, ZoomOut, RefreshCw, Loader2, BookOpen, ArrowRight } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const MagazineDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: magazine, isLoading, error } = useMagazineBySlug(slug || '');
  const { data: magazineArticles = [], isLoading: articlesLoading } = useMagazineArticles(magazine?.id || '');
  
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1.0);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [pdfLoading, setPdfLoading] = useState<boolean>(true);

  // Reset PDF state when magazine changes
  useEffect(() => {
    if (magazine) {
      setNumPages(null);
      setPageNumber(1);
      setPdfError(null);
      setPdfLoading(true);
      console.log("Magazine PDF URL:", magazine.pdf_url);
    }
  }, [magazine?.id]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log("PDF loaded successfully with", numPages, "pages");
    setNumPages(numPages);
    setPdfError(null);
    setPdfLoading(false);
    
    toast({
      title: "PDF loaded successfully",
      description: `This magazine has ${numPages} pages to explore.`,
      duration: 3000,
    });
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("PDF loading error:", error);
    setPdfError(error.message);
    setPdfLoading(false);
    
    toast({
      title: "PDF loading error",
      description: "There was an issue loading the PDF. Please try downloading instead.",
      variant: "destructive",
      duration: 5000,
    });
  };

  const onDocumentLoadStart = () => {
    console.log("PDF document started loading");
    setPdfLoading(true);
    setPdfError(null);
  };

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (numPages && pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.6));
  const resetZoom = () => setScale(1.0);
  
  const toggleFullScreen = () => setFullScreen(!fullScreen);

  const retryPdfLoad = () => {
    setPdfError(null);
    setPdfLoading(true);
    setNumPages(null);
    setPageNumber(1);
    
    toast({
      title: "Retrying PDF load",
      description: "Attempting to load the PDF again...",
      duration: 2000,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-insightRed" />
          <span className="text-lg">Loading magazine...</span>
        </div>
      </div>
    );
  }

  if (error || !magazine) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-insightBlack mb-4">Magazine Not Found</h1>
          <p className="mb-6">The magazine you're looking for doesn't exist.</p>
          <Link
            to="/magazine"
            className="inline-flex items-center bg-insightRed hover:bg-insightBlack text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Magazines
          </Link>
        </div>
      </div>
    );
  }

  // Check if we have a valid PDF URL
  const hasPdfUrl = magazine.pdf_url && magazine.pdf_url.trim() !== '';
  const pdfUrl = hasPdfUrl ? magazine.pdf_url : "/sample-magazine.pdf";
  
  console.log("Using PDF URL:", pdfUrl);
  console.log("Has valid PDF URL:", hasPdfUrl);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Magazine Header */}
        <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
          <div className="md:w-1/3">
            <img
              src={magazine.cover_image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'}
              alt={magazine.title}
              className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            />
          </div>
          <div className="md:w-2/3">
            <div className="mb-4">
              <Link
                to="/magazine"
                className="inline-flex items-center text-insightRed hover:text-insightBlack transition-colors text-sm font-medium"
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Back to Magazines
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-insightBlack mb-4">{magazine.title}</h1>
            {magazine.issue_number && (
              <div className="flex items-center gap-4 mb-4">
                <span className="inline-block px-3 py-1 text-sm font-semibold bg-insightRed text-white rounded-md">
                  Issue {magazine.issue_number}
                </span>
                {magazine.featured && (
                  <span className="inline-block px-3 py-1 text-sm font-semibold bg-green-100 text-green-800 rounded-md">
                    Featured
                  </span>
                )}
              </div>
            )}
            <p className="text-gray-700 text-lg leading-relaxed mb-6">{magazine.description}</p>
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-500">
                Published: {new Date(magazine.publish_date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <div className="flex gap-3">
                {hasPdfUrl && (
                  <a
                    href={pdfUrl}
                    download
                    className="inline-flex items-center bg-insightBlack hover:bg-insightRed text-white px-6 py-3 rounded-md text-sm font-medium transition-colors"
                  >
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                  </a>
                )}
                <Button
                  onClick={() => document.getElementById('pdf-viewer')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center bg-insightRed hover:bg-insightBlack text-white px-6 py-3 rounded-md text-sm font-medium transition-colors"
                >
                  <BookOpen className="mr-2 h-4 w-4" /> Read Online
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Magazine Articles Section */}
        {!articlesLoading && magazineArticles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-insightBlack mb-6">Featured Articles in This Issue</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {magazineArticles.map((magazineArticle) => (
                <div key={magazineArticle.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={magazineArticle.articles.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
                      alt={magazineArticle.articles.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-insightRed">
                        Page {magazineArticle.page_number}
                      </span>
                      {magazineArticle.featured && (
                        <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{magazineArticle.articles.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{magazineArticle.articles.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">By {magazineArticle.articles.author}</span>
                      <Link
                        to={`/article/${magazineArticle.articles.slug}`}
                        className="text-insightRed hover:text-insightBlack font-medium text-sm flex items-center"
                      >
                        Read Article <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PDF Viewer */}
        <div id="pdf-viewer" className={cn(
          "bg-white rounded-lg shadow-lg mb-12 transition-all duration-300",
          fullScreen ? "fixed inset-0 z-50 bg-white p-8 rounded-none overflow-auto" : "p-6"
        )}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-insightBlack">
              {fullScreen ? 'Reading Mode' : 'Magazine Preview'}
            </h2>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={zoomOut} 
                disabled={!!pdfError || pdfLoading}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetZoom} 
                disabled={!!pdfError || pdfLoading}
              >
                <span className="text-xs font-mono">{Math.round(scale * 100)}%</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={zoomIn} 
                disabled={!!pdfError || pdfLoading}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleFullScreen} 
                disabled={!!pdfError || pdfLoading}
              >
                <Maximize className="h-4 w-4" />
              </Button>
              {pdfError && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={retryPdfLoad}
                >
                  <RefreshCw className="h-4 w-4 mr-1" /> Retry
                </Button>
              )}
            </div>
          </div>
          
          {!hasPdfUrl ? (
            <div className="text-center py-16 bg-yellow-50 rounded-lg border border-yellow-200">
              <FileWarning className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <p className="text-yellow-700 font-medium mb-2 text-lg">No PDF Available</p>
              <p className="text-yellow-600 text-sm mb-6">This magazine doesn't have a PDF file uploaded yet.</p>
              <div className="text-sm text-gray-600">
                <p>Using sample PDF for demonstration...</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="max-w-4xl transition-all duration-200">
                {pdfLoading && (
                  <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-insightRed mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading magazine pages...</p>
                    <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
                    <p className="text-xs text-gray-400 mt-4">PDF URL: {pdfUrl.substring(0, 50)}...</p>
                  </div>
                )}
                
                {pdfError && (
                  <div className="text-center py-16 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex flex-col items-center">
                      <FileWarning className="h-16 w-16 text-red-500 mb-4" />
                      <p className="text-red-500 font-medium mb-2 text-lg">Failed to load PDF</p>
                      <p className="text-red-400 text-sm mb-2">Error: {pdfError}</p>
                      <p className="text-red-400 text-sm mb-6">The PDF file might be corrupted or unavailable</p>
                      <div className="flex gap-4">
                        <a
                          href={pdfUrl}
                          download
                          className="inline-flex items-center bg-insightRed hover:bg-insightBlack text-white px-6 py-3 rounded-md text-sm font-medium transition-colors"
                        >
                          <Download className="mr-2 h-4 w-4" /> Download PDF
                        </a>
                        <Button
                          onClick={retryPdfLoad}
                          variant="outline"
                          size="default"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" /> Retry Loading
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <Document
                  file={pdfUrl}
                  onLoadStart={onDocumentLoadStart}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={null} // We handle loading state ourselves
                  error={null}   // We handle error state ourselves
                  options={{
                    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
                    cMapPacked: true,
                    standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
                  }}
                >
                  {!pdfError && !pdfLoading && numPages && (
                    <Page 
                      key={`page_${pageNumber}_${scale}`}
                      pageNumber={pageNumber}
                      scale={scale}
                      width={fullScreen ? Math.min(900, window.innerWidth - 100) : Math.min(700, window.innerWidth - 80)}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="mx-auto shadow-lg rounded border"
                      loading={
                        <div className="flex items-center justify-center p-8 bg-gray-100 rounded">
                          <Loader2 className="h-8 w-8 animate-spin text-insightRed mr-2" />
                          <span>Loading page {pageNumber}...</span>
                        </div>
                      }
                    />
                  )}
                </Document>
              </div>
            </div>
          )}

          {/* PDF Navigation */}
          {numPages && !pdfError && !pdfLoading && (
            <div className="mt-8 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <Button
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1}
                  variant={pageNumber <= 1 ? "ghost" : "outline"}
                  size="default"
                  className="flex items-center"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous Page
                </Button>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Page <span className="font-semibold text-lg">{pageNumber}</span> of <span className="font-semibold text-lg">{numPages}</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max={numPages}
                      value={pageNumber}
                      onChange={(e) => {
                        const page = parseInt(e.target.value);
                        if (page >= 1 && page <= numPages) {
                          setPageNumber(page);
                        }
                      }}
                      className="w-16 px-2 py-1 text-center border rounded text-sm"
                    />
                    <Button
                      onClick={() => setPageNumber(Math.ceil(numPages / 2))}
                      variant="outline"
                      size="sm"
                    >
                      Go to Middle
                    </Button>
                  </div>
                </div>
                
                <Button
                  onClick={goToNextPage}
                  disabled={pageNumber >= (numPages || 1)}
                  variant={pageNumber >= (numPages || 1) ? "ghost" : "outline"}
                  size="default"
                  className="flex items-center"
                >
                  Next Page <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-4 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-insightRed h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(pageNumber / numPages) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Magazine Information */}
        <div>
          <h2 className="text-2xl font-bold text-insightBlack mb-6">About This Issue</h2>
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  {magazine.description || "This magazine issue contains cutting-edge insights and analysis from industry leaders and technology experts."}
                </p>
                <div className="space-y-2">
                  <p className="text-sm"><strong className="text-insightBlack">Issue:</strong> {magazine.issue_number || 'Latest'}</p>
                  <p className="text-sm"><strong className="text-insightBlack">Published:</strong> {new Date(magazine.publish_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  <p className="text-sm"><strong className="text-insightBlack">Articles:</strong> {magazineArticles.length} featured articles</p>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-semibold mb-4">Download Options</h3>
                <div className="space-y-3">
                  <a
                    href={pdfUrl}
                    download
                    className="inline-flex items-center justify-center bg-insightRed hover:bg-insightBlack text-white px-6 py-3 rounded-md font-medium transition-colors w-full"
                  >
                    <Download className="mr-2 h-5 w-5" /> Download Full PDF
                  </a>
                  <Button
                    onClick={() => window.print()}
                    variant="outline"
                    className="w-full"
                  >
                    Print Current Page
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagazineDetail;
