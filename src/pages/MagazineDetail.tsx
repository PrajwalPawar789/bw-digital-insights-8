
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { magazineData, Magazine, MagazineArticle } from '../data/magazineData';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Download, FileWarning, Maximize, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Set up PDF.js worker with a consistent version that works with our react-pdf version
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const MagazineDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [pdfError, setPdfError] = useState<boolean>(false);
  const [loadRetry, setLoadRetry] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);
  const [fullScreen, setFullScreen] = useState<boolean>(false);

  useEffect(() => {
    // Find the magazine by ID
    const foundMagazine = magazineData.find(mag => mag.id === Number(id));
    if (foundMagazine) {
      setMagazine(foundMagazine);
      // Reset state when magazine changes
      setNumPages(null);
      setPageNumber(1);
      setPdfError(false);
      setLoadRetry(0);
      setScale(1.0);
    }
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);

  // Retry loading PDF if there was an error
  useEffect(() => {
    if (pdfError && loadRetry < 3) {
      const retryTimer = setTimeout(() => {
        console.log("Retrying PDF load...");
        setPdfError(false);
        setLoadRetry(prev => prev + 1);
      }, 2000);
      
      return () => clearTimeout(retryTimer);
    }
  }, [pdfError, loadRetry]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfError(false);
    setLoadRetry(0);
    toast({
      title: "PDF loaded successfully",
      description: `This magazine has ${numPages} pages to explore.`,
      duration: 3000,
    });
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("PDF loading error:", error);
    setPdfError(true);
    
    toast({
      title: "PDF loading error",
      description: "There was an issue loading the PDF. Please try downloading instead.",
      variant: "destructive",
      duration: 5000,
    });
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

  // Manual retry function
  const retryPdfLoad = () => {
    setPdfError(false);
    setLoadRetry(0);
    
    toast({
      title: "Retrying PDF load",
      description: "Attempting to load the PDF again...",
      duration: 2000,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-insightRed"></div>
      </div>
    );
  }

  if (!magazine) {
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

  // Using a reliable PDF source - this is a sample PDF that's commonly used for testing
  const pdfUrl = "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf";

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Magazine Info */}
        <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
          <div className="md:w-1/3">
            <img
              src={magazine.coverImage}
              alt={magazine.title}
              className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow"
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
            <h1 className="text-3xl font-bold text-insightBlack mb-3">{magazine.title}</h1>
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-md mb-4">
              {magazine.category}
            </span>
            <p className="text-gray-600 mb-6">{magazine.description}</p>
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-500">Published: {magazine.publicationDate}</span>
              <a
                href={pdfUrl}
                download
                className="inline-flex items-center bg-insightBlack hover:bg-insightRed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </a>
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className={cn(
          "bg-white p-6 rounded-lg shadow-md mb-12 transition-all duration-300",
          fullScreen ? "fixed inset-0 z-50 bg-white p-8 rounded-none overflow-auto" : ""
        )}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-insightBlack">Magazine Preview</h2>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={zoomOut} 
                disabled={pdfError}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetZoom} 
                disabled={pdfError}
              >
                <span className="text-xs font-mono">{Math.round(scale * 100)}%</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={zoomIn} 
                disabled={pdfError}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleFullScreen} 
                disabled={pdfError}
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
          
          <div className="flex justify-center">
            <div className="max-w-3xl transition-all duration-200">
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-insightRed mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading PDF...</p>
                  </div>
                }
                error={
                  <div className="text-center py-12 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex flex-col items-center">
                      <FileWarning className="h-12 w-12 text-red-500 mb-3" />
                      <p className="text-red-500 font-medium mb-4">Failed to load PDF. Please try downloading instead.</p>
                      <div className="flex gap-3">
                        <a
                          href={pdfUrl}
                          download
                          className="inline-flex items-center bg-insightRed hover:bg-insightBlack text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          <Download className="mr-2 h-4 w-4" /> Download PDF
                        </a>
                        <Button
                          onClick={retryPdfLoad}
                          variant="outline"
                          size="default"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" /> Retry
                        </Button>
                      </div>
                    </div>
                  </div>
                }
              >
                <Page 
                  pageNumber={pageNumber}
                  scale={scale}
                  width={fullScreen ? Math.min(800, window.innerWidth - 100) : Math.min(600, window.innerWidth - 40)}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="mx-auto shadow-md"
                />
              </Document>
            </div>
          </div>
          
          {/* PDF Navigation */}
          {numPages && !pdfError && (
            <div className="flex justify-between items-center mt-6 bg-gray-50 p-3 rounded-md">
              <Button
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
                variant={pageNumber <= 1 ? "ghost" : "outline"}
                size="sm"
                className="flex items-center"
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </Button>
              <p className="text-sm text-gray-600">
                Page <span className="font-semibold">{pageNumber}</span> of <span className="font-semibold">{numPages}</span>
              </p>
              <Button
                onClick={goToNextPage}
                disabled={pageNumber >= (numPages || 1)}
                variant={pageNumber >= (numPages || 1) ? "ghost" : "outline"}
                size="sm"
                className="flex items-center"
              >
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Articles Section */}
        <div>
          <h2 className="text-2xl font-bold text-insightBlack mb-6">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {magazine.articles.map((article: MagazineArticle) => (
              <div key={article.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <img
                  src={article.thumbnailImage}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 hover:text-insightRed transition-colors">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{article.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">By {article.author}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Page {article.pageNumber}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagazineDetail;
