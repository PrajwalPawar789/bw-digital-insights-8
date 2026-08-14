import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaPinterestP,
  FaRedditAlien,
  FaXTwitter,
} from "react-icons/fa6";
import Seo from "@/components/seo/Seo";
import ArticleBody, {
  extractArticleHeadings,
  getArticleWordCount,
} from "@/components/articles/ArticleBody";
import { useArticleBySlug, useArticles } from "@/hooks/useArticles";
import { useMagazineProfileIssue } from "@/hooks/useMagazineProfiles";
import { useSettings } from "@/hooks/useSettings";
import { normalizeCategorySlug } from "@/lib/articleCategories";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  getSiteOrigin,
  toAbsoluteUrl,
  truncateText,
} from "@/lib/seo";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200";

const fallbackImageSource = (imageUrl?: string | null) => {
  if (!imageUrl) return "The CIO Vision";
  try {
    const hostname = new URL(imageUrl).hostname.replace(/^www\./, "");
    return hostname.includes("supabase.co") ? "The CIO Vision" : hostname;
  } catch {
    return "The CIO Vision";
  }
};

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: slugArticle, isLoading: slugLoading } = useArticleBySlug(slug || "");
  const { data: allArticles = [], isLoading: articlesLoading } = useArticles();
  const article = slugArticle || allArticles.find((item) => item.slug === slug);
  const { data: magazineProfileIssue, isLoading: magazineProfileLoading } =
    useMagazineProfileIssue(article?.id);
  const { settings } = useSettings();

  const headings = useMemo(
    () => extractArticleHeadings(article?.content || ""),
    [article?.content]
  );
  const tableOfContents = headings.length
    ? headings
    : [{ id: "article-overview", level: 2 as const, text: "Article overview" }];
  const readingMinutes = useMemo(() => {
    if (!article) return 1;
    const words =
      getArticleWordCount(article.content || "") +
      getArticleWordCount(article.excerpt || "");
    return Math.max(1, Math.ceil(words / 220));
  }, [article]);

  const relatedArticles = useMemo(() => {
    if (!article) return [];
    const otherArticles = allArticles.filter((item) => item.id !== article.id);
    const sameCategory = otherArticles.filter(
      (item) => item.category === article.category
    );
    const remaining = otherArticles.filter(
      (item) => item.category !== article.category
    );
    return [...sameCategory, ...remaining].slice(0, 6);
  }, [allArticles, article]);

  const articleIndex = article
    ? allArticles.findIndex((item) => item.id === article.id)
    : -1;
  const previousArticle =
    articleIndex >= 0 && articleIndex < allArticles.length - 1
      ? allArticles[articleIndex + 1]
      : null;
  const nextArticle = articleIndex > 0 ? allArticles[articleIndex - 1] : null;

  if (!article && (slugLoading || articlesLoading)) {
    return (
      <>
        <Seo title="Loading article" noindex />
        <div className="flex min-h-screen items-center justify-center bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#e62429]" />
        </div>
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Seo title="Article not found" noindex />
        <div className="min-h-screen bg-white px-5 py-24 text-center text-black">
          <h1 className="font-serif text-4xl font-bold">Article Not Found</h1>
          <p className="mt-4 text-neutral-600">
            The article you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            to="/"
            className="mt-7 inline-flex items-center bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e62429]"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </div>
      </>
    );
  }

  if (magazineProfileLoading) {
    return (
      <>
        <Seo title="Loading article" noindex />
        <div className="flex min-h-screen items-center justify-center bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#e62429]" />
        </div>
      </>
    );
  }

  if (magazineProfileIssue) {
    return <Navigate replace to={`/magazine-profile/${article.slug}`} />;
  }

  const siteOrigin = getSiteOrigin();
  const canonicalUrl = siteOrigin ? `${siteOrigin}/article/${article.slug}` : undefined;
  const publisherName =
    settings.siteTitle || settings.companyName || "The CIO Vision";
  const publisherLogo = toAbsoluteUrl(
    settings.siteLogo || "/ciovisionnavbarlogo2.png",
    siteOrigin
  );
  const seoImage = toAbsoluteUrl(article.image_url || FALLBACK_IMAGE, siteOrigin);
  const baseDescription = article.excerpt || article.content || "";
  const seoDescription = truncateText(baseDescription);
  const publishedTime = article.date
    ? new Date(article.date).toISOString()
    : undefined;
  const modifiedTime = article.updated_at
    ? new Date(article.updated_at).toISOString()
    : undefined;
  const categoryPath = normalizeCategorySlug(article.category);
  const imageSourceLabel =
    article.image_source || fallbackImageSource(article.image_url);
  const imageSourceHref =
    article.image_source_url ||
    (article.image_url && !article.image_url.includes("supabase.co")
      ? article.image_url
      : null);
  const currentUrl =
    canonicalUrl || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(article.title);

  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: article.category, url: `${siteOrigin}/category/${categoryPath}` },
        {
          name: article.title,
          url: canonicalUrl || `${siteOrigin}/article/${article.slug}`,
        },
      ])
    : undefined;
  const articleSchema = buildArticleSchema({
    type: "Article",
    headline: article.title,
    description: seoDescription,
    image: seoImage,
    url: canonicalUrl,
    author: article.author,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    publisherName,
    publisherLogo,
    section: article.category,
    keywords: article.category ? [article.category] : undefined,
  });

  const shareItems = [
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      className: "bg-[#0a66c2]",
      Icon: FaLinkedinIn,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      className: "bg-black",
      Icon: FaXTwitter,
    },
    {
      label: "Reddit",
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      className: "bg-[#ff4500]",
      Icon: FaRedditAlien,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      className: "bg-[#1877f2]",
      Icon: FaFacebookF,
    },
    {
      label: "Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(
        seoImage || ""
      )}&description=${encodedTitle}`,
      className: "bg-[#bd081c]",
      Icon: FaPinterestP,
    },
  ];

  return (
    <>
      <Seo
        title={article.title}
        description={baseDescription}
        image={seoImage}
        type="article"
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
        author={article.author}
        schema={[
          ...(breadcrumbSchema ? [breadcrumbSchema] : []),
          articleSchema,
        ]}
      />

      <main className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-[1360px] px-5 pb-12 pt-3">
          <div className="grid items-start gap-[15px] lg:grid-cols-[minmax(0,1fr)_261px]">
            <article className="min-w-0">
              <div className="flex min-h-11 items-start justify-between border-t-2 border-black">
                <Link
                  to={`/category/${categoryPath}`}
                  className="inline-flex min-h-11 items-center bg-black px-2.5 font-serif text-[20px] font-bold text-white transition hover:bg-[#e62429]"
                >
                  {article.category}
                </Link>
                <p className="pt-1.5 font-serif text-[17px] leading-7">
                  Reading Time:{" "}
                  <strong>
                    {readingMinutes} {readingMinutes === 1 ? "minute" : "minutes"}
                  </strong>
                </p>
              </div>

              <h1 className="mb-3 mt-2 max-w-[1000px] font-sans text-[29px] font-extrabold leading-[1.1] tracking-[-0.025em] md:text-[31px]">
                {article.title}
              </h1>

              <figure className="mb-3 bg-neutral-100">
                <img
                  src={article.image_url || FALLBACK_IMAGE}
                  alt={article.title}
                  className="block h-auto w-full"
                  fetchPriority="high"
                />
                <figcaption className="mt-1.5 font-serif text-[13px] text-neutral-600">
                  Source:{" "}
                    {imageSourceHref ? (
                      <a
                        href={imageSourceHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-neutral-400 underline-offset-2 hover:text-[#e62429]"
                      >
                        {imageSourceLabel}
                      </a>
                    ) : (
                      imageSourceLabel
                    )}
                </figcaption>
              </figure>

              <div className="grid items-start gap-7 pt-5 lg:grid-cols-[230px_minmax(0,1fr)]">
                <aside className="hidden lg:block lg:sticky lg:top-[76px]">
                  <h2 className="bg-black px-3 py-2 font-serif text-[17px] font-bold text-white">
                    In This Article
                  </h2>
                  <nav className="border border-t-0 border-neutral-300" aria-label="Table of contents">
                    {tableOfContents.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`group flex border-b border-neutral-200 px-3 py-2.5 font-sans text-[13px] font-semibold leading-[1.25] last:border-0 hover:bg-neutral-100 hover:text-[#e62429] ${
                          heading.level === 3 ? "pl-6" : ""
                        }`}
                      >
                        <ChevronRight className="mr-1.5 mt-0.5 h-3 w-3 shrink-0 transition group-hover:translate-x-0.5" />
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </aside>

                <div className="min-w-0">
                  {article.excerpt && (
                    <p className="mb-6 border-l-4 border-[#e62429] pl-4 font-serif text-[18px] font-medium leading-[1.6] text-neutral-800">
                      {article.excerpt}
                    </p>
                  )}
                  <ArticleBody content={article.content} />

                  <section className="mt-9 border-t border-black pt-4">
                    <h2 className="font-serif text-lg font-bold">
                      Did You like the post? Share it now:
                    </h2>
                    <div className="mt-3 flex flex-wrap gap-2" aria-label="Share this article">
                      {shareItems.map(({ label, href, className, Icon }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Share on ${label}`}
                          className={`flex h-9 w-9 items-center justify-center text-white transition hover:-translate-y-0.5 ${className}`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  </section>

                  {(previousArticle || nextArticle) && (
                    <nav
                      className="mt-8 grid border-y border-neutral-300 md:grid-cols-2"
                      aria-label="Post navigation"
                    >
                      <div className="min-h-24 border-b border-neutral-300 p-4 md:border-b-0 md:border-r">
                        {previousArticle && (
                          <Link
                            to={`/article/${previousArticle.slug}`}
                            className="group flex items-center gap-3 font-serif text-sm font-bold leading-snug hover:text-[#e62429]"
                          >
                            <ChevronLeft className="h-4 w-4 shrink-0 transition group-hover:-translate-x-1" />
                            {previousArticle.title}
                          </Link>
                        )}
                      </div>
                      <div className="min-h-24 p-4 text-right">
                        {nextArticle && (
                          <Link
                            to={`/article/${nextArticle.slug}`}
                            className="group flex items-center justify-end gap-3 font-serif text-sm font-bold leading-snug hover:text-[#e62429]"
                          >
                            {nextArticle.title}
                            <ChevronRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-1" />
                          </Link>
                        )}
                      </div>
                    </nav>
                  )}
                </div>
              </div>
            </article>

            <aside className="lg:sticky lg:top-[76px]" aria-label="Read more articles">
              <h2 className="border-b-2 border-black pb-2 font-sans text-[22px] font-extrabold leading-[1.08]">
                Read More From The CIO Vision
              </h2>
              <div>
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    to={`/article/${related.slug}`}
                    className="group grid grid-cols-[104px_minmax(0,1fr)] gap-2.5 border-b border-black py-3"
                  >
                    <div className="aspect-[3/2] overflow-hidden bg-neutral-100">
                      <img
                        src={related.image_url || FALLBACK_IMAGE}
                        alt={related.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-sans text-[14px] font-extrabold leading-[1.25] group-hover:text-[#e62429]">
                      {related.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
};

export default ArticleDetail;
