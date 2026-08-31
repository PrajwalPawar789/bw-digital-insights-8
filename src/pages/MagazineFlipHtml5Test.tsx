import { FormEvent, useMemo, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { useMagazineBySlug } from "@/hooks/useMagazines";
import { getSiteOrigin, toAbsoluteUrl, truncateText } from "@/lib/seo";

const ISSUE_SLUG = "the-most-influential-career-coach-inspiring-women-leaders-in-2025";
const FLIPHTML5_SOURCE_PDF_URL =
  "https://www.theciovision.com/supabase-proxy.php/storage/v1/object/public/magazine-pdfs/magazine-pdfs/1768770437739-fqdxtgwxts6.pdf";

const isFlipHtml5Url = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith("fliphtml5.com");
  } catch {
    return false;
  }
};

const isPdfUrl = (value: string) => {
  try {
    return new URL(value).pathname.toLowerCase().endsWith(".pdf");
  } catch {
    return false;
  }
};

const MagazineFlipHtml5Test = () => {
  const { data: magazine, isLoading, error } = useMagazineBySlug(ISSUE_SLUG);
  const [searchParams, setSearchParams] = useSearchParams();
  const embedUrl = searchParams.get("embed") || "";
  const [draftUrl, setDraftUrl] = useState(embedUrl);
  const [frameLoaded, setFrameLoaded] = useState(false);

  const isValidEmbedUrl = useMemo(() => isFlipHtml5Url(embedUrl), [embedUrl]);
  const isSourcePdfInEmbedField = useMemo(() => isPdfUrl(embedUrl), [embedUrl]);

  const submitEmbedUrl = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextUrl = draftUrl.trim();
    setFrameLoaded(false);
    setSearchParams(nextUrl ? { embed: nextUrl } : {});
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-black text-white">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error || !magazine) {
    return <div className="min-h-[65vh] bg-black px-5 py-24 text-center text-white">Magazine not found.</div>;
  }

  const description = truncateText(
    magazine.description || "FlipHTML5 reader test for this magazine issue."
  );
  const siteOrigin = getSiteOrigin();
  const canonical = siteOrigin
    ? `${siteOrigin}/magazine/${ISSUE_SLUG}-New-fliphtml5`
    : undefined;

  return (
    <>
      <Seo
        title={`${magazine.title} — FlipHTML5 Test`}
        description={description}
        image={toAbsoluteUrl(magazine.cover_image_url || "/placeholder.svg", siteOrigin)}
        canonical={canonical}
        noindex
      />

      <main className="min-h-screen bg-black pb-10 text-white">
        <section className="mx-auto w-full max-w-[1065px] px-4 pb-7 pt-4 sm:px-0">
          <header className="border-b border-white/25 pb-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/65">
              FlipHTML5 Test Preview
            </p>
            <h1 className="mt-2 font-sans text-xl font-extrabold leading-tight sm:text-2xl">
              {magazine.title}
            </h1>
            <p className="mt-2 text-sm text-white/65">
              This parallel test page does not change the live magazine page.
            </p>
          </header>

          <div className="mt-5 rounded-lg border border-white/20 bg-white/[0.04] p-4 sm:p-5">
            <p className="text-sm font-semibold">Optional: replace this PDF preview with FlipHTML5</p>
            <p className="mt-1 text-xs leading-5 text-white/65">
              First open the source PDF below and upload it in FlipHTML5 with its File URL option. Then choose
              Embed and paste the generated FlipHTML5 URL here — not the PDF URL.
            </p>
            <form onSubmit={submitEmbedUrl} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <label htmlFor="fliphtml5-embed-url" className="sr-only">
                FlipHTML5 embed URL
              </label>
              <input
                id="fliphtml5-embed-url"
                type="url"
                value={draftUrl}
                onChange={(event) => setDraftUrl(event.target.value)}
                placeholder="Paste the generated https://online.fliphtml5.com/... URL"
                className="min-h-11 flex-1 rounded border border-white/30 bg-black px-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white"
              />
              <button
                type="submit"
                className="min-h-11 rounded bg-white px-5 text-sm font-bold text-black transition hover:bg-white/85"
              >
                Load preview
              </button>
            </form>
          </div>

          {embedUrl && !isValidEmbedUrl && (
            <p className="mt-4 rounded border border-red-400/50 bg-red-400/10 px-4 py-3 text-sm text-red-100">
              {isSourcePdfInEmbedField
                ? "This is the source PDF URL, not a FlipHTML5 embed URL. Upload it to FlipHTML5 first, then paste the generated https://online.fliphtml5.com/... URL."
                : "Please enter a valid HTTPS URL on a FlipHTML5 domain."}
            </p>
          )}

          {isValidEmbedUrl ? (
            <div className="relative mt-5 overflow-hidden rounded-lg border border-white/20 bg-black" style={{ minHeight: "min(75vh, 820px)" }}>
              {!frameLoaded && (
                <div className="absolute inset-0 z-30 flex items-center justify-center gap-2 bg-black text-sm text-white/80">
                  <Loader2 className="h-5 w-5 animate-spin" /> Loading FlipHTML5 preview
                </div>
              )}
              <iframe
                key={embedUrl}
                src={embedUrl}
                title={`${magazine.title} FlipHTML5 preview`}
                className="relative z-20 h-full min-h-[min(75vh,820px)] w-full border-0"
                allow="fullscreen"
                allowFullScreen
                onLoad={() => setFrameLoaded(true)}
              />
            </div>
          ) : (
            <div className="mt-5 overflow-hidden rounded-lg border border-white/20 bg-black">
              <div className="flex items-center justify-between gap-3 border-b border-white/15 px-4 py-3">
                <p className="text-sm font-semibold">PDF preview</p>
                <a
                  href={FLIPHTML5_SOURCE_PDF_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 transition hover:text-white"
                >
                  Open PDF <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <iframe
                src={`${FLIPHTML5_SOURCE_PDF_URL}#view=FitH`}
                title={`${magazine.title} PDF preview`}
                className="h-[75vh] min-h-[620px] w-full border-0 bg-white"
              />
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default MagazineFlipHtml5Test;
