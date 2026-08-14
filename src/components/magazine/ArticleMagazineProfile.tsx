import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Loader2,
} from "lucide-react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaPinterestP,
  FaRedditAlien,
  FaXTwitter,
} from "react-icons/fa6";
import Seo from "@/components/seo/Seo";
import type { Database } from "@/integrations/supabase/types";
import {
  useMagazineProfileRecords,
  type MagazineProfileIssue,
} from "@/hooks/useMagazineProfiles";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  getSiteOrigin,
  toAbsoluteUrl,
  truncateText,
} from "@/lib/seo";

type Article = Database["public"]["Tables"]["articles"]["Row"];

type ArticleMagazineProfileProps = {
  article: Article;
  issue: MagazineProfileIssue;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200";

const cleanText = (value: string) =>
  value
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

const isHeadingLine = (value: string) => {
  const words = value.split(/\s+/).filter(Boolean);
  return (
    value.length <= 105 &&
    words.length <= 14 &&
    !/[.!?…,:;!”"']$/.test(value) &&
    !value.includes("“")
  );
};

const getProfileDetails = (article: Article, issue: MagazineProfileIssue) => {
  const person = article.title.split(":")[0].trim();
  const description = issue.magazines.description || "";
  const escapedName = person.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const roleAndCompany = description.match(
    new RegExp(`${escapedName},\\s*([^,.]+?)\\s+at\\s+([^,.]+)`, "i")
  );

  return {
    person,
    role: roleAndCompany?.[1]?.trim(),
    company: roleAndCompany?.[2]?.trim(),
  };
};

const ArticleMagazineProfile = ({
  article,
  issue,
}: ArticleMagazineProfileProps) => {
  const { data: profileRecords = [], isLoading: profilesLoading } =
    useMagazineProfileRecords();
  const content = cleanText(article.content || "");
  const wordCount = `${article.excerpt || ""} ${content}`
    .split(/\s+/)
    .filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));
  const details = getProfileDetails(article, issue);
  const currentIndex = profileRecords.findIndex(
    (record) => record.article_id === article.id
  );
  const previousProfile =
    currentIndex > 0 ? profileRecords[currentIndex - 1] : null;
  const nextProfile =
    currentIndex >= 0 && currentIndex < profileRecords.length - 1
      ? profileRecords[currentIndex + 1]
      : null;

  const siteOrigin = getSiteOrigin();
  const canonicalUrl = siteOrigin
    ? `${siteOrigin}/magazine-profile/${article.slug}`
    : undefined;
  const image = toAbsoluteUrl(article.image_url || FALLBACK_IMAGE, siteOrigin);
  const description = truncateText(
    article.excerpt || article.content || `${details.person} magazine profile.`
  );
  const publishedTime = article.date
    ? new Date(article.date).toISOString()
    : undefined;
  const modifiedTime = article.updated_at
    ? new Date(article.updated_at).toISOString()
    : undefined;
  const issueDate = new Date(issue.magazines.publish_date).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );
  const currentUrl =
    canonicalUrl || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(article.title);

  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: "Magazine Profiles", url: `${siteOrigin}/magazine` },
        {
          name: article.title,
          url: canonicalUrl || `${siteOrigin}/magazine-profile/${article.slug}`,
        },
      ])
    : undefined;
  const articleSchema = buildArticleSchema({
    type: "Article",
    headline: article.title,
    description,
    image,
    url: canonicalUrl,
    author: article.author,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    publisherName: "The CIO Vision",
    section: "Magazine Profiles",
    keywords: ["Magazine Profiles", issue.magazines.title, details.person],
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
        image || ""
      )}&description=${encodedTitle}`,
      className: "bg-[#bd081c]",
      Icon: FaPinterestP,
    },
  ];

  const renderContentBlock = (block: string, blockIndex: number) => {
    const lines = block.split("\n").map(cleanText).filter(Boolean);
    if (!lines.length) return null;

    const elements = [];
    if (lines.length > 1 && isHeadingLine(lines[0])) {
      elements.push(<h2 key={`${blockIndex}-heading`}>{lines[0]}</h2>);
      lines.shift();
    }

    if (lines.length > 1 && lines.every((line) => /^[-•]/.test(line))) {
      elements.push(
        <ul key={`${blockIndex}-list`}>
          {lines.map((line) => (
            <li key={line}>{line.replace(/^[-•]\s*/, "")}</li>
          ))}
        </ul>
      );
    } else if (lines.length) {
      const remaining = lines.join("\n");
      if (elements.length === 0 && isHeadingLine(remaining)) {
        elements.push(<h2 key={`${blockIndex}-heading-only`}>{remaining}</h2>);
      } else {
        elements.push(<p key={`${blockIndex}-copy`}>{remaining}</p>);
      }
    }

    return elements;
  };

  return (
    <>
      <Seo
        title={article.title}
        description={description}
        image={image}
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
        <div className="mx-auto max-w-[1320px] px-5 pb-12 pt-3">
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_325px]">
            <article className="min-w-0">
              <div className="flex min-h-11 items-start justify-between border-t-2 border-black">
                <Link
                  to="/magazine"
                  className="inline-flex min-h-10 items-center bg-black px-3 font-serif text-xl font-bold text-white transition hover:bg-[#e62429]"
                >
                  Magazine Profiles
                </Link>
                <p className="pt-1.5 font-serif text-[17px] leading-7">
                  Reading Time: <strong>{readingMinutes} minutes</strong>
                </p>
              </div>

              <h1 className="mb-3 mt-1 font-sans text-[29px] font-extrabold leading-[1.12] tracking-[-0.02em] md:text-[31px]">
                {article.title}
              </h1>

              <figure className="mb-7 overflow-hidden bg-neutral-100">
                <img
                  src={article.image_url || FALLBACK_IMAGE}
                  alt={article.title}
                  className="block h-auto w-full"
                  fetchPriority="high"
                />
              </figure>

              <div className="magazine-profile-copy">
                {article.excerpt && (
                  <p className="magazine-profile-lead">{article.excerpt}</p>
                )}
                {content
                  .split(/\n\s*\n+/)
                  .map(cleanText)
                  .filter(Boolean)
                  .map(renderContentBlock)}
              </div>

              <section className="mt-9 border-t border-black pt-4">
                <h2 className="font-serif text-lg font-bold">
                  Did You like the post? Share it now:
                </h2>
                <div
                  className="mt-3 flex flex-wrap gap-2"
                  aria-label="Share this magazine profile"
                >
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

              {!profilesLoading && (previousProfile || nextProfile) && (
                <nav
                  className="mt-8 grid border-y border-neutral-300 md:grid-cols-2"
                  aria-label="Magazine profile navigation"
                >
                  <div className="min-h-24 border-b border-neutral-300 p-4 md:border-b-0 md:border-r">
                    {previousProfile && (
                      <Link
                        to={`/magazine-profile/${previousProfile.articles.slug}`}
                        className="group flex items-center gap-3 font-serif text-sm font-bold leading-snug hover:text-[#e62429]"
                      >
                        <ArrowLeft className="h-4 w-4 shrink-0 transition group-hover:-translate-x-1" />
                        {previousProfile.articles.title}
                      </Link>
                    )}
                  </div>
                  <div className="min-h-24 p-4 text-right">
                    {nextProfile && (
                      <Link
                        to={`/magazine-profile/${nextProfile.articles.slug}`}
                        className="group flex items-center justify-end gap-3 font-serif text-sm font-bold leading-snug hover:text-[#e62429]"
                      >
                        {nextProfile.articles.title}
                        <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-1" />
                      </Link>
                    )}
                  </div>
                </nav>
              )}
            </article>

            <aside
              className="border border-black bg-white lg:sticky lg:top-[70px]"
              aria-label="Magazine profile details"
            >
              <div className="px-10 pt-3 text-center">
                <Link
                  to={`/magazine/${issue.magazines.slug}`}
                  className="group block"
                >
                  <img
                    src={issue.magazines.cover_image_url || FALLBACK_IMAGE}
                    alt={issue.magazines.title}
                    className="mx-auto block h-auto w-full border border-neutral-300"
                    loading="lazy"
                  />
                  <h2 className="mt-2 font-serif text-[19px] font-bold leading-[1.15] group-hover:text-[#e62429]">
                    {issue.magazines.title}
                  </h2>
                </Link>
              </div>

              <div className="space-y-1.5 px-3 py-4 font-serif text-[16px] leading-[1.28]">
                <p>
                  <strong>Featured Person:</strong> {details.person}
                  {details.role ? ` (${details.role})` : ""}
                </p>
                {details.company && (
                  <p>
                    <strong>Company Name:</strong> {details.company}
                  </p>
                )}
                <p>
                  <strong>Magazine Issue:</strong> {issue.magazines.title}
                </p>
                <p>
                  <strong>Issue Published:</strong> {issueDate}
                </p>
                <p>
                  <strong>Profile By:</strong> {article.author}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-neutral-300 p-3">
                <Link
                  to={`/magazine/${issue.magazines.slug}`}
                  className="inline-flex min-h-10 items-center justify-center gap-2 bg-black px-3 text-xs font-bold text-white transition hover:bg-[#e62429]"
                >
                  <BookOpen className="h-4 w-4" /> View Issue
                </Link>
                <Link
                  to={`/magazine/${issue.magazines.slug}`}
                  className="inline-flex min-h-10 items-center justify-center gap-2 bg-[#e62429] px-3 text-xs font-bold text-white transition hover:bg-black"
                >
                  <CalendarDays className="h-4 w-4" /> Read Magazine
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
};

export const MagazineProfileLoading = () => (
  <div className="flex min-h-screen items-center justify-center bg-white">
    <div className="flex items-center gap-2 font-serif text-base text-black">
      <Loader2 className="h-5 w-5 animate-spin text-[#e62429]" />
      Loading magazine profile
    </div>
  </div>
);

export default ArticleMagazineProfile;
