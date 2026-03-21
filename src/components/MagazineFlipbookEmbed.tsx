import { useCallback, useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Maximize2,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    jQuery?: any;
  }
}

interface MagazineFlipbookEmbedProps {
  pdfUrl: string;
  title?: string;
  initialPage?: number;
  onOpenFullscreen?: () => void;
  onReadFullIssue?: () => void;
  onPageChange?: (page: number) => void;
}

const formatPage = (value?: number | null) => {
  if (!value || Number.isNaN(value)) {
    return "--";
  }
  return value.toString().padStart(2, "0");
};

const FLIPBOOK_RETRY_DELAY_MS = 60;
const MAX_FLIPBOOK_SYNC_ATTEMPTS = 30;

const MagazineFlipbookEmbed = ({
  pdfUrl,
  title,
  initialPage,
  onOpenFullscreen,
  onReadFullIssue,
  onPageChange,
}: MagazineFlipbookEmbedProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<any>(null);
  const pdfRef = useRef<string>("");
  const pendingPageRef = useRef<number | undefined>(initialPage);
  const readyRef = useRef(false);
  const retryTimerRef = useRef<number | null>(null);
  const readyTimerRef = useRef<number | null>(null);
  const titleRef = useRef<string | undefined>(title);
  const onPageChangeRef = useRef<typeof onPageChange>(onPageChange);
  const pageCountRef = useRef<number | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage || 1);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [initNonce, setInitNonce] = useState(0);
  const [hasFocus, setHasFocus] = useState(false);

  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  useEffect(() => {
    onPageChangeRef.current = onPageChange;
  }, [onPageChange]);

  const clearPendingPageRetry = useCallback(() => {
    if (retryTimerRef.current !== null) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  const clearReadyRetry = useCallback(() => {
    if (readyTimerRef.current !== null) {
      window.clearTimeout(readyTimerRef.current);
      readyTimerRef.current = null;
    }
  }, []);

  const getControllableInstance = useCallback(() => {
    const instance = instanceRef.current;
    if (typeof instance?.gotoPage !== "function") {
      return null;
    }
    if (typeof instance?.target?.gotoPage !== "function") {
      return null;
    }
    return instance;
  }, []);

  const normalizePage = useCallback((page: number) => {
    const nextPage = Math.max(1, page);
    const maxPage = pageCountRef.current;
    if (typeof maxPage === "number" && maxPage > 0) {
      return Math.min(maxPage, nextPage);
    }
    return nextPage;
  }, []);

  const flushPendingPage = useCallback(
    (attempt = 0) => {
      clearPendingPageRetry();

      const requestedPage = pendingPageRef.current;
      if (typeof requestedPage !== "number" || Number.isNaN(requestedPage)) {
        return;
      }

      const instance = getControllableInstance();
      if (!readyRef.current || !instance) {
        if (attempt < MAX_FLIPBOOK_SYNC_ATTEMPTS) {
          retryTimerRef.current = window.setTimeout(
            () => flushPendingPage(attempt + 1),
            FLIPBOOK_RETRY_DELAY_MS
          );
        }
        return;
      }

      const nextPage = normalizePage(requestedPage);
      try {
        instance.gotoPage(nextPage);
        pendingPageRef.current = undefined;
        setCurrentPage(nextPage);
        onPageChangeRef.current?.(nextPage);
      } catch (error) {
        if (attempt < MAX_FLIPBOOK_SYNC_ATTEMPTS) {
          retryTimerRef.current = window.setTimeout(
            () => flushPendingPage(attempt + 1),
            FLIPBOOK_RETRY_DELAY_MS
          );
          return;
        }
        console.error("Unable to sync flipbook page", error);
      }
    },
    [clearPendingPageRetry, getControllableInstance, normalizePage]
  );

  useEffect(() => {
    pendingPageRef.current = initialPage;
    if (typeof initialPage === "number" && !Number.isNaN(initialPage)) {
      const nextPage = normalizePage(initialPage);
      setCurrentPage(nextPage);
      onPageChangeRef.current?.(nextPage);
      flushPendingPage();
    }
  }, [flushPendingPage, initialPage, normalizePage]);

  useEffect(() => {
    const node = shellRef.current;
    if (!node || isInView) {
      return;
    }

    // Lazy-init the flipbook only when the preview is near the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isInView]);

  const updatePageState = useCallback((book: any) => {
    const activePage = book?.target?._activePage ?? book?._activePage;
    if (typeof activePage === "number" && !Number.isNaN(activePage)) {
      setCurrentPage(activePage);
      onPageChangeRef.current?.(activePage);
    }

    const totalPages = book?.target?.pageCount ?? book?.pageCount;
    if (typeof totalPages === "number" && !Number.isNaN(totalPages)) {
      pageCountRef.current = totalPages;
      setPageCount(totalPages);
    }
  }, []);

  const handleReady = useCallback(
    (book: any) => {
      const syncReadyState = (attempt = 0) => {
        clearReadyRetry();

        const instance = getControllableInstance();
        if (!instance) {
          updatePageState(book);
          if (attempt < MAX_FLIPBOOK_SYNC_ATTEMPTS) {
            readyTimerRef.current = window.setTimeout(
              () => syncReadyState(attempt + 1),
              FLIPBOOK_RETRY_DELAY_MS
            );
          }
          return;
        }

        readyRef.current = true;
        updatePageState(book ?? instance);
        setIsReady(true);
        flushPendingPage();

        if (!pageCountRef.current) {
          window.setTimeout(() => {
            const totalPages = instance.target?.pageCount ?? instance.pageCount;
            if (typeof totalPages === "number" && !Number.isNaN(totalPages)) {
              pageCountRef.current = totalPages;
              setPageCount(totalPages);
            }
          }, 250);
        }
      };

      window.requestAnimationFrame(() => {
        syncReadyState();
      });
    },
    [clearReadyRetry, flushPendingPage, getControllableInstance, updatePageState]
  );

  const handleFlip = useCallback(
    (book: any) => {
      updatePageState(book);
    },
    [updatePageState]
  );

  useEffect(() => {
    if (!isInView) {
      return;
    }

    const target = containerRef.current;
    if (!target) {
      return;
    }

    if (!window.jQuery?.fn?.flipBook) {
      setError("Flipbook engine failed to load. Please try again.");
      return;
    }

    if (instanceRef.current && pdfRef.current === pdfUrl) {
      return;
    }

    setError(null);
    setIsReady(false);
    readyRef.current = false;
    clearReadyRetry();
    clearPendingPageRetry();

    if (instanceRef.current?.dispose) {
      instanceRef.current.dispose();
    }
    instanceRef.current = null;
    target.innerHTML = "";

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const isTablet = window.matchMedia("(max-width: 1024px)").matches;
    const openPage =
      typeof pendingPageRef.current === "number" && !Number.isNaN(pendingPageRef.current)
        ? Math.max(1, pendingPageRef.current)
        : 1;

    // Keep DFlip UI hidden; we supply a custom, premium control surface.
    const options: Record<string, any> = {
      height: "100%",
      width: "100%",
      webgl: !isMobile,
      webglShadow: !isMobile,
      controlsPosition: "hide",
      backgroundColor: "transparent",
      backgroundImage: "",
      showThumbnails: false,
      showShare: false,
      showPageNumber: false,
      autoPlay: false,
      soundEnable: false,
      enableDownload: false,
      enablePrint: false,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      bookTitle: titleRef.current || "Magazine",
      source: pdfUrl,
      // Use default render quality to avoid forced PDF optimization.
      pageMode: isMobile ? 1 : 2,
      singlePageMode: 1,
      forceFit: true,
      scrollWheel: false,
      search: false,
      showThumbnail: false,
      showOutline: false,
      dragToFlip: true,
      hard: "none",
      duration: 850,
      transparent: true,
      spotLightIntensity: isMobile ? 0.15 : isTablet ? 0.22 : 0.32,
      ambientLightIntensity: isMobile ? 0.65 : 0.82,
      shadowOpacity: isMobile ? 0.1 : 0.2,
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

    pdfRef.current = pdfUrl;
    setCurrentPage(openPage);

    instanceRef.current = window.jQuery(target).flipBook(pdfUrl, options);

    return () => {
      // Ensure the underlying flipbook canvas is fully disposed on re-init/unmount.
      readyRef.current = false;
      clearReadyRetry();
      clearPendingPageRetry();
      if (instanceRef.current?.dispose) {
        instanceRef.current.dispose();
      }
      instanceRef.current = null;
      if (target) {
        target.innerHTML = "";
      }
    };
  }, [clearPendingPageRetry, clearReadyRetry, handleFlip, handleReady, initNonce, isInView, pdfUrl]);

  useEffect(() => {
    if (!hasFocus) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      const instance = getControllableInstance();
      if (!readyRef.current || !instance) {
        return;
      }
      if (event.key === "ArrowRight") {
        instance.next?.();
      }
      if (event.key === "ArrowLeft") {
        instance.prev?.();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [getControllableInstance, hasFocus]);

  const handlePrev = useCallback(() => {
    const instance = getControllableInstance();
    if (!readyRef.current || !instance) {
      return;
    }
    instance.prev?.();
    window.requestAnimationFrame(() => updatePageState(instance));
  }, [getControllableInstance, updatePageState]);

  const handleNext = useCallback(() => {
    const instance = getControllableInstance();
    if (!readyRef.current || !instance) {
      return;
    }
    instance.next?.();
    window.requestAnimationFrame(() => updatePageState(instance));
  }, [getControllableInstance, updatePageState]);

  const handleZoomIn = useCallback(() => {
    const instance = getControllableInstance();
    if (!readyRef.current || !instance) {
      return;
    }
    instance.zoom?.(1);
  }, [getControllableInstance]);

  const handleZoomOut = useCallback(() => {
    const instance = getControllableInstance();
    if (!readyRef.current || !instance) {
      return;
    }
    instance.zoom?.(-1);
  }, [getControllableInstance]);

  const handleOpenFullscreen = useCallback(() => {
    if (onOpenFullscreen) {
      onOpenFullscreen();
      return;
    }

    const instance = instanceRef.current;
    if (instance?.ui?.switchFullscreen) {
      instance.ui.switchFullscreen();
      return;
    }
    if (instance?.switchFullscreen) {
      instance.switchFullscreen();
      return;
    }

    const container = containerRef.current?.querySelector(".df-container") as
      | HTMLElement
      | null;
    container?.requestFullscreen?.();
  }, [onOpenFullscreen]);

  const handleReadFullIssue = useCallback(() => {
    if (onReadFullIssue) {
      onReadFullIssue();
      return;
    }
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  }, [onReadFullIssue, pdfUrl]);

  const handleRetry = useCallback(() => {
    setError(null);
    setInitNonce((value) => value + 1);
  }, []);

  return (
    <section
      ref={shellRef}
      className="magazine-embed-shell"
      aria-label={`${title || "Magazine"} preview`}
    >
      <div
        className="magazine-embed-frame group focus-visible:ring-2 focus-visible:ring-insightRed/40"
        role="region"
        aria-busy={!isReady}
        tabIndex={0}
        onClick={(event) => {
          event.currentTarget.focus();
        }}
        onFocusCapture={() => setHasFocus(true)}
        onBlurCapture={(event) => {
          if (event.currentTarget.contains(event.relatedTarget as Node)) {
            return;
          }
          setHasFocus(false);
        }}
      >
        <div className="relative flex justify-center">
          <div className="relative w-full max-w-[1100px] aspect-[16/9] min-h-[280px] sm:min-h-[360px] lg:min-h-[520px]">
            <div
              className="pointer-events-none absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.65),rgba(0,0,0,0.0)_65%)] opacity-90 blur-2xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_center,rgba(10,10,10,0.18),rgba(0,0,0,0)_60%)]"
              aria-hidden="true"
            />
            <div
              className={`relative h-full w-full rounded-[28px] border border-white/40 bg-white/80 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-transform duration-700 ${
                isReady ? "scale-100" : "scale-[0.985]"
              } group-hover:scale-[1.01]`}
            >
              <div
                ref={containerRef}
                className="magazine-embed-target absolute inset-0 touch-pan-y"
              />

              {!isReady && !error && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[28px] bg-white/75 backdrop-blur-sm">
                  <div className="w-[70%] max-w-[420px] space-y-4 text-center">
                    <div className="premium-loading h-3 w-24 rounded-full mx-auto" />
                    <div className="premium-loading h-3 w-full rounded-full" />
                    <div className="premium-loading h-3 w-5/6 rounded-full mx-auto" />
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                      <Loader2 className="h-4 w-4 animate-spin text-insightRed" />
                      Preparing the executive preview
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div
                  className="absolute inset-0 z-10 flex items-center justify-center rounded-[28px] bg-white/80 text-center"
                  role="alert"
                >
                  <div className="space-y-4 px-6">
                    <p className="text-sm font-semibold text-insightBlack">{error}</p>
                    <Button
                      variant="outline"
                      className="h-10 px-4"
                      onClick={handleRetry}
                    >
                      Retry Preview
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="magazine-control-bar mt-6 flex flex-col gap-4 rounded-2xl border border-white/40 bg-white/70 px-4 py-4 text-insightBlack shadow-[0_20px_40px_-30px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-6"
          role="toolbar"
          aria-label="Preview controls"
        >
          <div className="flex items-center justify-between gap-4 sm:justify-start">
            <button
              type="button"
              onClick={handlePrev}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/80 text-insightBlack transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-insightRed/40 disabled:opacity-50"
              aria-label="Previous page"
              disabled={!isReady}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div
              className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-gray-700"
              aria-live="polite"
            >
              {formatPage(currentPage)} <span className="text-gray-400">/</span>{" "}
              {formatPage(pageCount)}
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/80 text-insightBlack transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-insightRed/40 disabled:opacity-50"
              aria-label="Next page"
              disabled={!isReady}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center justify-between gap-2 rounded-full border border-white/50 bg-white/70 px-3 py-2">
              <button
                type="button"
                onClick={handleZoomOut}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-insightBlack transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-insightRed/40 disabled:opacity-50"
                aria-label="Zoom out"
                disabled={!isReady}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-600">
                Zoom
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-insightBlack transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-insightRed/40 disabled:opacity-50"
                aria-label="Zoom in"
                disabled={!isReady}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              variant="outline"
              className="h-12 rounded-full border-white/50 bg-white/70 px-5 text-sm text-insightBlack hover:bg-white"
              onClick={handleOpenFullscreen}
              aria-label="Open fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
              Open Fullscreen
            </Button>
            <Button
              className="btn-premium h-12 rounded-full px-6 text-sm font-semibold"
              onClick={handleReadFullIssue}
              aria-label="Read full issue"
            >
              <BookOpen className="h-4 w-4" />
              Read Full Issue
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MagazineFlipbookEmbed;
