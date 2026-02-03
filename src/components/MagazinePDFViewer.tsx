import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollMode,
  SpecialZoomLevel,
  ViewMode,
  Viewer,
  Worker,
  type DocumentLoadEvent,
  type LoadError,
} from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  FileWarning,
  Loader2,
  Maximize2,
  RefreshCw,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from 'lucide-react';

const PDF_WORKER_URL = '/pdf.worker.min.js';

interface MagazinePDFViewerProps {
  fileUrl: string;
  title: string;
  onDownload?: () => void;
  onFullScreen?: () => void;
  fullScreen?: boolean;
  initialPage?: number;
}

const MagazinePDFViewer: React.FC<MagazinePDFViewerProps> = ({
  fileUrl,
  title,
  onDownload,
  onFullScreen,
  fullScreen = false,
  initialPage,
}) => {
  const isMobile = useIsMobile();
  const [numPages, setNumPages] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  const pageNavigationPluginInstance = pageNavigationPlugin();
  const zoomPluginInstance = zoomPlugin({ enableShortcuts: true });
  const { CurrentPageLabel, GoToNextPage, GoToPreviousPage } =
    pageNavigationPluginInstance;
  const {
    ZoomIn: ZoomInControl,
    ZoomOut: ZoomOutControl,
    CurrentScale,
  } = zoomPluginInstance;

  const viewMode = isMobile ? ViewMode.SinglePage : ViewMode.DualPageWithCover;
  const initialPageIndex =
    typeof initialPage === 'number' && !Number.isNaN(initialPage)
      ? Math.max(0, initialPage - 1)
      : 0;

  useEffect(() => {
    setNumPages(0);
  }, [fileUrl]);

  useEffect(() => {
    if (typeof initialPage === 'number' && numPages > 0) {
      const target = Math.max(1, Math.min(numPages, initialPage));
      pageNavigationPluginInstance.jumpToPage(target - 1);
    }
  }, [initialPage, numPages, pageNavigationPluginInstance]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight') {
        pageNavigationPluginInstance.jumpToNextPage();
      } else if (e.key === 'ArrowLeft') {
        pageNavigationPluginInstance.jumpToPreviousPage();
      } else if ((e.key === 'f' || e.key === 'F') && onFullScreen) {
        onFullScreen();
      } else if (e.key === 'Escape' && fullScreen && onFullScreen) {
        onFullScreen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pageNavigationPluginInstance, onFullScreen, fullScreen]);

  const handleDocumentLoad = useCallback(
    ({ doc }: DocumentLoadEvent) => {
      setNumPages(doc.numPages);
    },
    []
  );

  const handleRetry = useCallback(() => {
    setNumPages(0);
    setReloadKey((prev) => prev + 1);
  }, []);

  const handleDownload = useCallback(() => {
    if (onDownload) {
      onDownload();
      return;
    }
    if (fileUrl) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  }, [fileUrl, onDownload]);

  const renderLoader = useCallback((percentages: number) => {
    const progress = Math.min(100, Math.round(percentages));
    return (
      <div className="flipbook-loading">
        <Loader2 className="h-10 w-10 animate-spin text-insightRed mb-4" />
        <p className="text-lg font-medium text-gray-700">
          Loading magazine content...
        </p>
        <div className="w-56 h-2 bg-gray-200 rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-insightRed transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{progress}% Complete</p>
      </div>
    );
  }, []);

  const renderError = useCallback(
    (error: LoadError) => (
      <div className="flex items-center justify-center py-16">
        <div className="text-center py-10 mx-4 max-w-md premium-card">
          <FileWarning className="h-14 w-14 text-insightRed mx-auto mb-4" />
          <h3 className="text-insightBlack font-bold text-xl mb-2">
            Could Not Load Magazine
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            {error?.message || 'An unexpected error occurred.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleRetry}
              className="bg-insightRed hover:bg-insightBlack text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="border-insightRed text-insightRed hover:bg-insightRed hover:text-white"
            >
              Open PDF
            </Button>
          </div>
        </div>
      </div>
    ),
    [handleRetry, handleDownload]
  );

  if (!fileUrl || fileUrl.trim() === '') {
    return (
      <div className="text-center py-16 bg-yellow-50 rounded-lg border border-yellow-200">
        <FileWarning className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <p className="text-yellow-700 font-medium mb-2 text-lg">
          No PDF Available
        </p>
        <p className="text-yellow-600 text-sm">
          This magazine does not have a PDF file uploaded yet.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'pdf-viewer-container',
        fullScreen && 'pdf-viewer-container--fullscreen'
      )}
    >
      <div className="pdf-viewer-toolbar">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-insightRed rounded-full flex items-center justify-center">
              <FileWarning className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {fullScreen
                  ? 'Premium Reading Mode'
                  : 'Interactive Magazine Preview'}
              </h2>
              <p className="text-sm text-gray-300">{title}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <ZoomOutControl>
                {({ onClick }) => (
                  <Button
                    onClick={onClick}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  >
                    <ZoomOutIcon className="h-4 w-4 mr-2" />
                    Zoom out
                  </Button>
                )}
              </ZoomOutControl>
              <CurrentScale>
                {({ scale }) => (
                  <span className="min-w-[56px] text-center text-xs font-semibold text-white/80">
                    {Math.round(scale * 100)}%
                  </span>
                )}
              </CurrentScale>
              <ZoomInControl>
                {({ onClick }) => (
                  <Button
                    onClick={onClick}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  >
                    <ZoomInIcon className="h-4 w-4 mr-2" />
                    Zoom in
                  </Button>
                )}
              </ZoomInControl>
            </div>
            {onFullScreen && (
              <Button
                onClick={onFullScreen}
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                {fullScreen ? 'Exit Reading' : 'Full screen'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flipbook-stage">
        <div className="flipbook-shell">
          <div
            className={cn(
              'flipbook-book magazine-viewer-frame',
              fullScreen && 'magazine-viewer-frame--fullscreen'
            )}
          >
            <Worker workerUrl={PDF_WORKER_URL}>
              <Viewer
                key={`${fileUrl}-${reloadKey}`}
                fileUrl={fileUrl}
                viewMode={viewMode}
                scrollMode={ScrollMode.Page}
                defaultScale={SpecialZoomLevel.PageFit}
                plugins={[pageNavigationPluginInstance, zoomPluginInstance]}
                initialPage={initialPageIndex}
                onDocumentLoad={handleDocumentLoad}
                renderLoader={renderLoader}
                renderError={renderError}
              />
            </Worker>
          </div>
        </div>

        {numPages > 0 && (
          <div className="flipbook-nav">
            <GoToPreviousPage>
              {({ onClick, isDisabled }) => (
                <Button
                  onClick={onClick}
                  variant="outline"
                  disabled={isDisabled}
                  className="border-gray-300"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>
              )}
            </GoToPreviousPage>
            <CurrentPageLabel>
              {({ currentPage, numberOfPages }) => (
                <div className="text-sm text-gray-600">
                  Page{' '}
                  <span className="font-semibold">
                    {numberOfPages ? currentPage + 1 : '-'}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold">
                    {numberOfPages || '-'}
                  </span>
                </div>
              )}
            </CurrentPageLabel>
            <GoToNextPage>
              {({ onClick, isDisabled }) => (
                <Button
                  onClick={onClick}
                  variant="outline"
                  disabled={isDisabled}
                  className="border-gray-300"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </GoToNextPage>
          </div>
        )}
      </div>
    </div>
  );
};

export default MagazinePDFViewer;
