import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    DFLIP?: any;
    jQuery?: any;
  }
}

interface MagazineFlipbookLightboxProps {
  open: boolean;
  onClose: () => void;
  pdfUrl: string;
  bgImageUrl?: string;
  title?: string;
  initialPage?: number;
}

const formatPage = (value?: number | null) => {
  if (!value || Number.isNaN(value)) {
    return "--";
  }
  return value.toString().padStart(2, "0");
};

const MagazineFlipbookLightbox = ({
  open,
  onClose,
  pdfUrl,
  bgImageUrl,
  title,
  initialPage,
}: MagazineFlipbookLightboxProps) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage || 1);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [initNonce, setInitNonce] = useState(0);

  const updatePageState = useCallback((book: any) => {
    const activePage = book?.target?._activePage ?? book?._activePage;
    if (typeof activePage === "number" && !Number.isNaN(activePage)) {
      setCurrentPage(activePage);
    }

    const totalPages = book?.target?.pageCount ?? book?.pageCount;
    if (typeof totalPages === "number" && !Number.isNaN(totalPages)) {
      setPageCount(totalPages);
    }
  }, []);

  const handleReady = useCallback(
    (book: any) => {
      updatePageState(book);
      setIsReady(true);
      if (!pageCount && instanceRef.current) {
        window.setTimeout(() => {
          const totalPages =
            instanceRef.current?.target?.pageCount ?? instanceRef.current?.pageCount;
          if (typeof totalPages === "number" && !Number.isNaN(totalPages)) {
            setPageCount(totalPages);
          }
        }, 250);
      }
    },
    [pageCount, updatePageState]
  );

  const handleFlip = useCallback(
    (book: any) => {
      updatePageState(book);
    },
    [updatePageState]
  );

  const handlePrev = useCallback(() => {
    const instance = instanceRef.current;
    if (!instance) {
      return;
    }
    instance.prev?.();
    window.requestAnimationFrame(() => updatePageState(instance));
  }, [updatePageState]);

  const handleNext = useCallback(() => {
    const instance = instanceRef.current;
    if (!instance) {
      return;
    }
    instance.next?.();
    window.requestAnimationFrame(() => updatePageState(instance));
  }, [updatePageState]);

  const handleZoomIn = useCallback(() => {
    instanceRef.current?.zoom?.(1);
  }, []);

  const handleZoomOut = useCallback(() => {
    instanceRef.current?.zoom?.(-1);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = window.setTimeout(() => {
      const target = viewerRef.current;
      if (!target) {
        return;
      }

      if (instanceRef.current) {
        return;
      }

      if (!window.DFLIP && !window.jQuery?.fn?.flipBook) {
        setError("Flipbook engine failed to load. Please try again.");
        return;
      }

      setIsReady(false);
      setError(null);

      const height = target.clientHeight || 600;
      const isMobile = window.matchMedia("(max-width: 640px)").matches;
      const openPage =
        typeof initialPage === "number" && !Number.isNaN(initialPage)
          ? Math.max(1, initialPage)
          : 1;
      setCurrentPage(openPage);
      // Run the same flipbook engine in fullscreen with simplified UI for focus.
      const options: Record<string, any> = {
        target,
        pdf: pdfUrl,
        source: pdfUrl,
        height,
        webgl: !isMobile,
        webglShadow: !isMobile,
        controlsPosition: "hide",
        showThumbnails: false,
        showFullscreen: false,
        showShare: false,
        showPageNumber: false,
        autoPlay: false,
        soundEnable: false,
        backgroundColor: "transparent",
        backgroundImage: bgImageUrl,
        enableDownload: false,
        enablePrint: false,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        // Use default render quality to avoid forced PDF optimization.
        pageMode: isMobile ? 1 : 2,
        singlePageMode: 1,
        forceFit: true,
        scrollWheel: false,
        dragToFlip: true,
        duration: 850,
        transparent: true,
        openPage,
        onReady: handleReady,
        onFlip: handleFlip,
        pdfjsSrc: "/js/libs/pdf.min.js",
        pdfjsWorkerSrc: "/js/libs/pdf.worker.min.js",
        pdfjsCompatibilitySrc: "/js/libs/compatibility.js",
        threejsSrc: "/js/libs/three.min.js",
        mockupjsSrc: "/js/libs/mockup.min.js",
        cMapUrl: "https://unpkg.com/pdfjs-dist@2.12.313/cmaps/",
      };

      if (window.jQuery?.fn?.flipBook) {
        instanceRef.current = window.jQuery(target).flipBook(pdfUrl, options);
        return;
      }

      if (window.DFLIP && typeof window.DFLIP === "function") {
        instanceRef.current = new window.DFLIP(options);
        return;
      }

      console.error("DearFlip not loaded. Ensure dflip.js is included.");
    }, 0);

    return () => window.clearTimeout(timer);
  }, [bgImageUrl, handleFlip, handleReady, initialPage, open, pdfUrl, initNonce]);

  useEffect(() => {
    if (open) {
      return;
    }

    const instance = instanceRef.current;
    if (instance?.dispose) {
      instance.dispose();
    } else if (instance?.destroy) {
      instance.destroy();
    }

    instanceRef.current = null;

    if (viewerRef.current) {
      viewerRef.current.innerHTML = "";
    }

    setIsReady(false);
    setError(null);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowRight") {
        handleNext();
      }
      if (event.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleNext, handlePrev, onClose, open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    if (typeof initialPage === "number" && !Number.isNaN(initialPage)) {
      const nextPage = Math.max(1, initialPage);
      setCurrentPage(nextPage);
      if (instanceRef.current?.gotoPage) {
        instanceRef.current.gotoPage(nextPage);
      }
    }
  }, [initialPage, open]);

  const handleRetry = useCallback(() => {
    setError(null);
    setInitNonce((value) => value + 1);
  }, []);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[3000]" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-0 z-10 flex flex-col">
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3 text-sm text-white/80">
            <span className="hidden sm:inline-block font-semibold text-white">
              {title || "Magazine Preview"}
            </span>
            <span
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.35em]"
              aria-live="polite"
            >
              {formatPage(currentPage)} <span className="text-white/50">/</span>{" "}
              {formatPage(pageCount)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleZoomOut}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Zoom out"
              disabled={!isReady}
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Zoom in"
              disabled={!isReady}
            >
              <Plus className="h-4 w-4" />
            </button>
          <Button
            onClick={onClose}
            variant="outline"
            size="icon"
            className="h-11 w-11 border-white/30 bg-white/10 text-white hover:bg-white/20"
            aria-label="Close fullscreen preview"
          >
            <X className="h-4 w-4" />
          </Button>
          </div>
        </div>

        <div className="relative flex-1 px-4 pb-6 sm:px-8 sm:pb-8">
          <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30">
            <div ref={viewerRef} className="h-full w-full" />

            {!isReady && !error && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
                <div className="space-y-4 text-center text-white">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  <p className="text-sm text-white/80">
                    Loading the immersive preview
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 text-center text-white">
                <div className="space-y-4 px-6">
                  <p className="text-sm font-semibold">{error}</p>
                  <Button
                    variant="outline"
                    className="h-10 border-white/40 bg-white/10 text-white hover:bg-white/20"
                    onClick={handleRetry}
                  >
                    Retry Preview
                  </Button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 sm:flex"
            aria-label="Previous page"
            disabled={!isReady}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 sm:flex"
            aria-label="Next page"
            disabled={!isReady}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MagazineFlipbookLightbox;
