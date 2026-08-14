import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import MagazineFlipbookEmbed from "@/components/MagazineFlipbookEmbed";
import MagazineFlipbookLightbox from "@/components/MagazineFlipbookLightbox";
import Seo from "@/components/seo/Seo";
import { useMagazineArticles } from "@/hooks/useMagazineArticles";
import { useMagazineBySlug } from "@/hooks/useMagazines";
import { useSettings } from "@/hooks/useSettings";
import {
  buildBreadcrumbSchema,
  buildPublicationIssueSchema,
  getSiteOrigin,
  toAbsoluteUrl,
  truncateText,
} from "@/lib/seo";
import { buildCurrentPublicStorageUrl } from "@/lib/storageUrl";

const FALLBACK_STORY_IMAGE =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900";

const MagazineDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: magazine, isLoading, error } = useMagazineBySlug(slug || "");
  const { data: magazineArticles = [], isLoading: articlesLoading } = useMagazineArticles(
    magazine?.id || ""
  );
  const { settings } = useSettings();
  const [activePage, setActivePage] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [carouselOffset, setCarouselOffset] = useState(0);

  const fallbackPdfUrl = buildCurrentPublicStorageUrl(
    "magazine-pdfs",
    "magazine-pdfs/1769290939583-y42jndu8ij.pdf"
  );
  const previewPdfUrl = magazine?.pdf_url || fallbackPdfUrl;

  const stories = useMemo(
    () => magazineArticles.filter((item) => Boolean(item.articles)),
    [magazineArticles]
  );
  const leadStory = stories[0];
  const carouselStories = stories.slice(1);
  const visibleCarouselStories = useMemo(() => {
    if (carouselStories.length <= 3) {
      return carouselStories;
    }
    return Array.from(
      { length: 3 },
      (_, index) => carouselStories[(carouselOffset + index) % carouselStories.length]
    );
  }, [carouselOffset, carouselStories]);

  useEffect(() => {
    if (carouselStories.length <= 3) {
      return;
    }
    const timer = window.setInterval(() => {
      setCarouselOffset((offset) => (offset + 1) % carouselStories.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [carouselStories.length]);

  if (isLoading) {
    return (
      <>
        <Seo title="Magazine issue" noindex />
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
          <div className="flex items-center gap-2 text-sm">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading magazine
          </div>
        </div>
      </>
    );
  }

  if (error || !magazine) {
    return (
      <>
        <Seo title="Magazine not found" noindex />
        <div className="min-h-screen bg-black px-5 py-24 text-center text-white">
          <h1 className="font-serif text-4xl font-bold">Magazine Not Found</h1>
          <p className="mt-4 text-white/70">
            The magazine you&apos;re looking for does not exist or the URL is invalid.
          </p>
          <Link
            to="/magazine"
            className="mt-7 inline-flex items-center border border-white bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-black hover:text-white"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Magazines
          </Link>
        </div>
      </>
    );
  }

  const siteOrigin = getSiteOrigin();
  const canonicalUrl = siteOrigin && slug ? `${siteOrigin}/magazine/${slug}` : undefined;
  const publisherName = settings.siteTitle || settings.companyName || "The CIO Vision";
  const publisherLogo = toAbsoluteUrl(settings.siteLogo || "/ciovision-logo.svg", siteOrigin);
  const seoImage = toAbsoluteUrl(magazine.cover_image_url || FALLBACK_STORY_IMAGE, siteOrigin);
  const baseDescription =
    magazine.description ||
    "Explore the latest magazine issue featuring executive interviews and industry analysis.";
  const seoDescription = truncateText(baseDescription);
  const publishedTime = magazine.publish_date
    ? new Date(magazine.publish_date).toISOString()
    : undefined;
  const modifiedTime = magazine.updated_at
    ? new Date(magazine.updated_at).toISOString()
    : undefined;
  const issueDate = magazine.publish_date
    ? new Date(magazine.publish_date).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : magazine.issue_number || "Magazine";

  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: "Magazine", url: `${siteOrigin}/magazine` },
        { name: magazine.title, url: canonicalUrl || `${siteOrigin}${window.location.pathname}` },
      ])
    : undefined;

  const issueSchema = buildPublicationIssueSchema({
    name: magazine.title,
    description: seoDescription,
    image: seoImage,
    url: canonicalUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    issueNumber: magazine.issue_number,
    publisherName,
    publisherLogo,
  });

  const renderStoryCard = (magazineArticle: (typeof stories)[number]) => {
    const article = magazineArticle.articles;
    const articleHref =
      magazineArticle.featured && magazineArticle.page_number === 1
        ? `/magazine-profile/${article.slug}`
        : `/article/${article.slug}`;
    return (
      <article key={magazineArticle.id} className="flex min-w-0 flex-col bg-[#333333] text-white">
        <Link to={articleHref} className="block aspect-[3/2] overflow-hidden bg-[#171717]">
          <img
            src={article.image_url || FALLBACK_STORY_IMAGE}
            alt={article.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </Link>
        <div className="flex min-h-[170px] flex-1 flex-col px-2 pb-2 pt-1.5">
          <h3 className="line-clamp-3 font-sans text-[14px] font-bold leading-[1.15]">
            <Link to={articleHref} className="hover:underline">
              {article.title}
            </Link>
          </h3>
          {article.excerpt && (
            <p className="mt-1 line-clamp-3 font-serif text-[13px] leading-[1.13] text-white">
              {article.excerpt}
            </p>
          )}
          <Link
            to={articleHref}
            className="mt-auto w-fit bg-white px-5 py-2 font-sans text-[11px] font-bold text-black transition hover:bg-[#e62429] hover:text-white"
          >
            Read More
          </Link>
        </div>
      </article>
    );
  };

  return (
    <>
      <Seo
        title={magazine.title}
        description={baseDescription}
        image={seoImage}
        type="article"
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
        schema={[...(breadcrumbSchema ? [breadcrumbSchema] : []), issueSchema]}
      />

      <main className="min-h-screen bg-black text-white">
        <section id="pdf-viewer" className="mx-auto w-full max-w-[1065px] px-4 pb-7 pt-1 sm:px-0">
          <header className="pb-2 text-center">
            <p className="font-serif text-lg font-bold leading-7 sm:text-xl">{issueDate}</p>
            <h1 className="mx-auto max-w-[1280px] font-sans text-xl font-extrabold leading-tight sm:text-2xl">
              {magazine.title}
            </h1>
          </header>

          <MagazineFlipbookEmbed
            pdfUrl={previewPdfUrl}
            title={magazine.title}
            onOpenFullscreen={() => setLightboxOpen(true)}
            onPageChange={setActivePage}
          />
        </section>

        {!articlesLoading && leadStory && (
          <section className="mx-auto w-full max-w-[1065px] px-4 pb-6 sm:px-0">
            <div className="relative border-t border-[#8a8a8a] pt-10">
              <h2 className="absolute left-0 top-0 -translate-y-px bg-white px-2 py-1 font-serif text-xl font-bold leading-7 text-black">
                Featured Stories
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                {renderStoryCard(leadStory)}
                <div className="grid grid-cols-1 gap-3 md:col-span-3 md:grid-cols-3">
                  {visibleCarouselStories.map(renderStoryCard)}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <MagazineFlipbookLightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        pdfUrl={previewPdfUrl}
        title={magazine.title}
        initialPage={activePage}
      />
    </>
  );
};

export default MagazineDetail;
