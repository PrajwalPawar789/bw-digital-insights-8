import React from 'react';
import { MinimalButton, ScrollMode, SpecialZoomLevel, Viewer, ViewMode, Worker } from '@react-pdf-viewer/core';
import { NextIcon, pageNavigationPlugin, PreviousIcon } from '@react-pdf-viewer/page-navigation';
import { ThumbnailDirection, thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { Download, Maximize, RefreshCw, Loader2, FileWarning } from 'lucide-react';
import { Button } from "@/components/ui/button";

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';

interface MagazinePDFViewerProps {
  fileUrl: string;
  title: string;
  onDownload: () => void;
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
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold text-gray-900">
          {fullScreen ? 'Reading Mode' : 'Magazine Preview'}
        </h2>
        <div className="flex space-x-2">
          {onFullScreen && (
            <Button onClick={onFullScreen} variant="outline" size="sm">
              <Maximize className="h-4 w-4" />
            </Button>
          )}
          {pdfError && (
            <Button onClick={retryLoad} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" /> Retry
            </Button>
          )}
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-90">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}

        {pdfError ? (
          <div className="text-center py-16 bg-red-50 rounded-lg border border-red-100 m-4">
            <FileWarning className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 font-medium mb-2 text-lg">Failed to load PDF</p>
            <p className="text-red-600 text-sm mb-4">Error: {pdfError}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={onDownload} variant="outline">
                <Download className="mr-2 h-4 w-4" /> Try Download
              </Button>
              <Button onClick={retryLoad} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" /> Retry
              </Button>
            </div>
          </div>
        ) : (
          <Worker workerUrl="/pdf.worker.min.js">
            <div
              style={{
                border: '1px solid rgba(0, 0, 0, .1)',
                display: 'flex',
                flexDirection: 'column',
                height: fullScreen ? 'calc(100vh - 120px)' : '600px',
              }}
            >
              {/* Toolbar */}
              <div
                style={{
                  borderBottom: '1px solid rgba(0, 0, 0, .1)',
                  padding: '8px',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <div className="flex items-center justify-center space-x-4">
                  <ZoomOutButton />
                  <ZoomPopover />
                  <ZoomInButton />
                  <div className="border-l border-gray-300 h-6 mx-2"></div>
                  <MinimalButton onClick={jumpToPreviousPage}>
                    <PreviousIcon />
                  </MinimalButton>
                  <MinimalButton onClick={jumpToNextPage}>
                    <NextIcon />
                  </MinimalButton>
                </div>
              </div>

              {/* Main viewer */}
              <div
                style={{
                  flex: 1,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Viewer
                  fileUrl={fileUrl}
                  defaultScale={SpecialZoomLevel.PageFit}
                  scrollMode={ScrollMode.Page}
                  viewMode={ViewMode.SinglePage}
                  plugins={[pageNavigationPluginInstance, thumbnailPluginInstance, zoomPluginInstance]}
                  onDocumentLoad={handleDocumentLoad}
                  renderLoader={(percentages: number) => (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                        <p className="text-gray-600">Loading... {Math.round(percentages)}%</p>
                      </div>
                    </div>
                  )}
                />
              </div>

              {/* Thumbnails */}
              <div
                style={{
                  height: '120px',
                  overflow: 'auto',
                  borderTop: '1px solid rgba(0, 0, 0, .1)',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <Thumbnails thumbnailDirection={ThumbnailDirection.Horizontal} />
              </div>
            </div>
          </Worker>
        )}
      </div>
    </div>
  );
};

export default MagazinePDFViewer;
