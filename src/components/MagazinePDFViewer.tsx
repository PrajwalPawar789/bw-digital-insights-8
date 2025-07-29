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
  fullScreen = false,
}) => {
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { GoToFirstPage, GoToLastPage, GoToNextPage, GoToPreviousPage } = pageNavigationPluginInstance;

  const zoomPluginInstance = zoomPlugin();
  const { Zoom, ZoomIn, ZoomOut } = zoomPluginInstance;

  const thumbnailPluginInstance = thumbnailPlugin();
  const { Thumbnails } = thumbnailPluginInstance;

  const renderToolbar = (Toolbar: (props: any) => React.ReactElement) => (
    <Toolbar>
      {(props: {
        canGoToFirstPage: boolean;
        canGoToLastPage: boolean;
        canGoToNextPage: boolean;
        canGoToPreviousPage: boolean;
        canZoomIn: boolean;
        canZoomOut: boolean;
        currentPage: number;
        numberOfPages: number;
        onFirstPage: () => void;
        onLastPage: () => void;
        onNextPage: () => void;
        onPreviousPage: () => void;
        onZoomIn: () => void;
        onZoomOut: () => void;
      }) => (
        <div className="w-full bg-white border-b border-gray-200 flex items-center justify-between p-3">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900 truncate mr-4">{title}</h3>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={props.onFirstPage}
                disabled={!props.canGoToFirstPage}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="First page"
              >
                <span className="text-sm">⏮</span>
              </button>
              <button
                onClick={props.onPreviousPage}
                disabled={!props.canGoToPreviousPage}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous page"
              >
                <PreviousIcon />
              </button>
              <span className="text-sm text-gray-600 px-3">
                {props.currentPage + 1} / {props.numberOfPages}
              </span>
              <button
                onClick={props.onNextPage}
                disabled={!props.canGoToNextPage}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next page"
              >
                <NextIcon />
              </button>
              <button
                onClick={props.onLastPage}
                disabled={!props.canGoToLastPage}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Last page"
              >
                <span className="text-sm">⏭</span>
              </button>
            </div>

            <div className="flex items-center space-x-1 border-l border-gray-300 pl-3">
              <button
                onClick={props.onZoomOut}
                disabled={!props.canZoomOut}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom out"
              >
                <ZoomOut />
              </button>
              <Zoom>
                {(props) => (
                  <span className="text-sm text-gray-600 px-2 min-w-[60px] text-center">
                    {Math.round(props.scale * 100)}%
                  </span>
                )}
              </Zoom>
              <button
                onClick={props.onZoomIn}
                disabled={!props.canZoomIn}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom in"
              >
                <ZoomIn />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onFullScreen && (
              <Button
                onClick={onFullScreen}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
                title={fullScreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                <Maximize className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {fullScreen ? "Exit Fullscreen" : "Fullscreen"}
                </span>
              </Button>
            )}
            {onDownload && (
              <Button
                onClick={onDownload}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
                title="Download PDF"
              >
                <span className="hidden sm:inline">Download</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </Toolbar>
  );

  const renderError = (error: any) => (
    <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg">
      <FileWarning className="h-16 w-16 text-red-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load PDF</h3>
      <p className="text-sm text-gray-600 text-center max-w-md">
        The PDF file could not be loaded. This might be due to a network issue or the file being unavailable.
      </p>
      <Button
        onClick={() => window.location.reload()}
        variant="outline"
        className="mt-4 flex items-center space-x-2"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Retry</span>
      </Button>
    </div>
  );

  const renderLoader = () => (
    <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
      <p className="text-sm text-gray-600">Loading PDF...</p>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow-sm border overflow-hidden ${fullScreen ? 'h-full' : 'h-[800px]'}`}>
      <Worker workerUrl="/pdf.worker.min.js">
        <div className="flex h-full">
          {/* Thumbnail sidebar - only show when not in fullscreen */}
          {!fullScreen && (
            <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
              <div className="p-3 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">Pages</h4>
              </div>
              <div className="p-2">
                <Thumbnails />
              </div>
            </div>
          )}
          
          {/* Main viewer */}
          <div className="flex-1 flex flex-col">
            <Viewer
              fileUrl={fileUrl}
              plugins={[pageNavigationPluginInstance, zoomPluginInstance, thumbnailPluginInstance]}
              renderError={renderError}
              renderLoader={renderLoader}
              scrollMode={ScrollMode.Page}
              viewMode={ViewMode.SinglePage}
              defaultScale={SpecialZoomLevel.PageFit}
            />
          </div>
        </div>
      </Worker>
    </div>
  );
};

export default MagazinePDFViewer;
