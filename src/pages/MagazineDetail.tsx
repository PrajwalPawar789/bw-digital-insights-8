import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMagazineBySlug } from '@/hooks/useMagazines';
import { useMagazineArticles } from '@/hooks/useMagazineArticles';
import { ChevronLeft, Loader2, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import MagazineFlipbookEmbed from '@/components/MagazineFlipbookEmbed';
import MagazineFlipbookLightbox from '@/components/MagazineFlipbookLightbox';
import Seo from "@/components/seo/Seo";
import { useSettings } from "@/hooks/useSettings";
import {
  buildBreadcrumbSchema,
  buildPublicationIssueSchema,
  getSiteOrigin,
  toAbsoluteUrl,
  truncateText,
} from "@/lib/seo";
import { motion } from 'framer-motion';
import { buildCurrentPublicStorageUrl } from "@/lib/storageUrl";

const MagazineDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: magazine, isLoading, error } = useMagazineBySlug(slug || '');
  const { data: magazineArticles = [], isLoading: articlesLoading } = useMagazineArticles(magazine?.id || '');
  const [initialPage, setInitialPage] = useState<number | undefined>(undefined);
  const [activePage, setActivePage] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { settings } = useSettings();
  const fallbackPdfUrl = buildCurrentPublicStorageUrl(
    "magazine-pdfs",
    "magazine-pdfs/1769290939583-y42jndu8ij.pdf"
  );
  const previewPdfUrl = magazine?.pdf_url || fallbackPdfUrl;

  useEffect(() => {
    if (typeof initialPage === 'number' && !Number.isNaN(initialPage)) {
      setActivePage(Math.max(1, initialPage));
    }
  }, [initialPage]);

  if (isLoading) {
    return (
      <>
        <Seo title="Magazine issue" noindex />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin text-insightRed" />
            <span className="text-lg">Loading magazine...</span>
          </div>
        </div>
      </>
    );
  }

  if (error || !magazine) {
    console.log("Magazine not found, redirecting...");
    return (
      <>
        <Seo title="Magazine not found" noindex />
        <div className="min-h-screen py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-insightBlack mb-4">Magazine Not Found</h1>
            <p className="mb-6 text-gray-600">The magazine you're looking for doesn't exist or the URL is invalid.</p>
            <div className="mb-6">
              <p className="text-sm text-gray-500">Requested slug: <code className="bg-gray-100 px-2 py-1 rounded">{slug}</code></p>
            </div>
            <Link
              to="/magazine"
              className="inline-flex items-center bg-insightRed hover:bg-insightBlack text-white px-6 py-3 rounded-md text-sm font-medium transition-colors"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Magazines
            </Link>
          </div>
        </div>
      </>
    );
  }

  const siteOrigin = getSiteOrigin();
  const canonicalUrl = siteOrigin && slug ? `${siteOrigin}/magazine/${slug}` : undefined;
  const publisherName = settings.siteTitle || settings.companyName || "The CIO Vision";
  const publisherLogo = toAbsoluteUrl(settings.siteLogo || "/ciovision-logo.svg", siteOrigin);
  const seoImage = toAbsoluteUrl(
    magazine.cover_image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    siteOrigin
  );
  const baseDescription = magazine.description || "Explore the latest magazine issue featuring executive interviews and industry analysis.";
  const seoDescription = truncateText(baseDescription);

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
    datePublished: magazine.publish_date ? new Date(magazine.publish_date).toISOString() : undefined,
    issueNumber: magazine.issue_number,
    publisherName,
    publisherLogo,
  });

  return (
    <>
      <Seo
        title={magazine.title}
        description={baseDescription}
        image={seoImage}
        type="article"
        publishedTime={magazine.publish_date ? new Date(magazine.publish_date).toISOString() : undefined}
        schema={[...(breadcrumbSchema ? [breadcrumbSchema] : []), issueSchema]}
      />
      <div className="min-h-screen transition-all duration-300 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Magazine Header */}
          <>
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
                    <Button
                      onClick={() => {
                        setInitialPage(undefined);
                        document.getElementById('pdf-viewer')?.scrollIntoView({ behavior: 'smooth' });
                      }}
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
                          <div className="flex items-center gap-3">
                            <Button size="sm" onClick={() => {
                              const page = magazineArticle.page_number || 1;
                              setInitialPage(page);
                              document.getElementById('pdf-viewer')?.scrollIntoView({ behavior: 'smooth' });
                            }} className="bg-insightBlack text-white hover:bg-black/90">Preview</Button>

                            <Link
                              to={`/article/${magazineArticle.articles.slug}`}
                              className="text-insightRed hover:text-insightBlack font-medium text-sm flex items-center"
                            >
                              Read Article <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        </div>

        <section id="pdf-viewer" className="relative w-full py-12 sm:py-16 lg:py-20">
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.1),transparent_65%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff,rgba(245,245,245,0.95))]"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto flex max-w-[1200px] flex-col gap-6 px-4 sm:px-6 lg:px-8"
          >
            <div className="flex flex-col gap-4 text-center sm:text-left">
              <div className="inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.4em] text-gray-500 sm:justify-start">
                <span className="h-px w-10 bg-insightRed/70" />
                Magazine Preview
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  {/* <h2 className="text-3xl font-semibold text-insightBlack sm:text-4xl">
                    Executive-Grade Preview Experience
                  </h2>
                  <p className="max-w-2xl text-base text-gray-700 sm:text-lg">
                    Cinematic page turns, a distraction-free layout, and a premium reading flow
                    designed for decision-makers.
                  </p> */}
                </div>
                {/* <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="h-2 w-2 rounded-full bg-insightRed/80" />
                  Optimized for fast executive reading
                </div> */}
              </div>
            </div>

            {/* <div className="flex flex-col gap-2 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-insightRed/70" />
                Use Left and Right arrow keys or swipe to turn pages.
              </span>
              <span className="text-gray-500">Your preview focus stays locked on the active page.</span>
            </div> */}

            <MagazineFlipbookEmbed
              pdfUrl={previewPdfUrl}
              title={magazine.title}
              initialPage={initialPage}
              onOpenFullscreen={() => setLightboxOpen(true)}
              onReadFullIssue={() => window.open(previewPdfUrl, '_blank', 'noopener,noreferrer')}
              onPageChange={(page) => setActivePage(page)}
            />
          </motion.div>
        </section>

        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          {/* Magazine Information */}
          {/* <div>
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
                  <h3 className="text-lg font-semibold mb-4">Read Options</h3>
                  <div className="space-y-3">
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
          </div> */}
        </div>

        <MagazineFlipbookLightbox
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          pdfUrl={previewPdfUrl}
          bgImageUrl={magazine.cover_image_url}
          title={magazine.title}
          initialPage={activePage}
        />
      </div>
    </>
  );
};

export default MagazineDetail;
