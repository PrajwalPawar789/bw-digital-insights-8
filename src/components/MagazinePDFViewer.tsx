
import React from 'react';
import { MinimalButton, ScrollMode, SpecialZoomLevel, Viewer, ViewMode, Worker } from '@react-pdf-viewer/core';
import { NextIcon, pageNavigationPlugin, PreviousIcon } from '@react-pdf-viewer/page-navigation';
import { ThumbnailDirection, thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { Maximize, RefreshCw, Loader2, FileWarning } from 'lucide-react';
import { Button } from "@/components/ui/button";

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';

interface MagazinePDFViewerProps {
  fileUrl: string;
  title: string;
  onDownload?: () => void;
  onFullScreen?: () => void;
  fullScreen?: boolean;
}

const MagazinePDFViewer: React.FC<MagazinePDFViewerProps> = ({ 
  fileUrl, 
  title, 
  onDownload, 
  onFullScreen,
  fullScreen = false 
}) => {
  const [pdfError, setPdfError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { jumpToNextPage, jumpToPreviousPage } = pageNavigationPluginInstance;

  const thumbnailPluginInstance = thumbnailPlugin();
  const { Thumbnails } = thumbnailPluginInstance;

  const zoomPluginInstance = zoomPlugin();
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

  const handleDocumentLoad = () => {
    console.log("PDF loaded successfully");
    setLoading(false);
    setPdfError(null);
  };

  const retryLoad = () => {
    setLoading(true);
    setPdfError(null);
  };

  // Check if file URL is valid
  React.useEffect(() => {
    if (!fileUrl || fileUrl.trim() === '') {
      setPdfError("No PDF file available");
      setLoading(false);
      return;
    }

    // Reset states when fileUrl changes
    setLoading(true);
    setPdfError(null);
  }, [fileUrl]);

  if (!fileUrl || fileUrl.trim() === '') {
    return (
      <div className="text-center py-16 bg-yellow-50 rounded-lg border border-yellow-200">
        <FileWarning className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <p className="text-yellow-700 font-medium mb-2 text-lg">No PDF Available</p>
        <p className="text-yellow-600 text-sm">This magazine doesn't have a PDF file uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="pdf-viewer-container">
      {/* Premium Header */}
      <div className="pdf-viewer-toolbar">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-insightRed rounded-full flex items-center justify-center">
              <FileWarning className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {fullScreen ? 'Premium Reading Mode' : 'Interactive Magazine Preview'}
              </h2>
              <p className="text-sm text-gray-300">{title}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {onFullScreen && (
              <Button 
                onClick={onFullScreen} 
                variant="outline" 
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            )}
            {pdfError && (
              <Button 
                onClick={retryLoad} 
                variant="outline" 
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40"
              >
                <RefreshCw className="h-4 w-4 mr-1" /> Retry
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced PDF Viewer */}
      <div className="relative bg-gray-50">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/95 backdrop-blur-sm">
            <div className="text-center premium-card p-8">
              <Loader2 className="h-12 w-12 animate-spin text-insightRed mx-auto mb-4" />
              <p className="text-insightBlack font-medium text-lg mb-2">Loading Premium Content</p>
              <p className="text-gray-600">Preparing your magazine experience...</p>
            </div>
          </div>
        )}

        {pdfError ? (
          <div className="text-center py-16 mx-4">
            <div className="premium-card p-8 max-w-md mx-auto">
              <FileWarning className="h-16 w-16 text-insightRed mx-auto mb-4" />
              <h3 className="text-insightBlack font-bold text-xl mb-2">Content Loading Issue</h3>
              <p className="text-gray-600 mb-4">We're having trouble loading this premium content.</p>
              <p className="text-sm text-gray-500 mb-6">Error: {pdfError}</p>
              <Button 
                onClick={retryLoad} 
                className="btn-premium"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </div>
          </div>
        ) : (
          <Worker workerUrl="/pdf.worker.min.js">
            <div
              className="flex flex-col bg-white"
              style={{
                height: fullScreen ? 'calc(100vh - 140px)' : '700px',
                maxHeight: fullScreen ? 'calc(100vh - 140px)' : '700px',
              }}
            >
              {/* Enhanced Toolbar */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-4">
                <div className="flex items-center justify-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <ZoomOutButton />
                    <ZoomPopover />
                    <ZoomInButton />
                  </div>
                  <div className="border-l border-gray-300 h-8"></div>
                  <div className="flex items-center space-x-2">
                    <MinimalButton onClick={jumpToPreviousPage}>
                      <PreviousIcon />
                    </MinimalButton>
                    <MinimalButton onClick={jumpToNextPage}>
                      <NextIcon />
                    </MinimalButton>
                  </div>
                </div>
              </div>

              {/* Main Viewer with Enhanced Styling */}
              <div className="flex-1 relative overflow-hidden bg-gray-100 p-4">
                <div className="h-full flex items-center justify-center">
                  <div className="pdf-page w-full h-full max-w-4xl mx-auto">
                    <Viewer
                      fileUrl={fileUrl}
                      defaultScale={SpecialZoomLevel.PageFit}
                      scrollMode={ScrollMode.Page}
                      viewMode={ViewMode.SinglePage}
                      plugins={[pageNavigationPluginInstance, thumbnailPluginInstance, zoomPluginInstance]}
                      onDocumentLoad={handleDocumentLoad}
                      renderLoader={(percentages: number) => (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center premium-card p-6">
                            <Loader2 className="h-8 w-8 animate-spin text-insightRed mx-auto mb-3" />
                            <p className="text-insightBlack font-medium">Loading...</p>
                            <p className="text-sm text-gray-500">{Math.round(percentages)}% Complete</p>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Enhanced Thumbnails */}
              <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-2">
                <div className="h-24 overflow-auto">
                  <Thumbnails thumbnailDirection={ThumbnailDirection.Horizontal} />
                </div>
              </div>
            </div>
          </Worker>
        )}
      </div>
    </div>
  );
};

export default MagazinePDFViewer;
