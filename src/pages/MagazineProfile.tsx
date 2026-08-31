import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Globe2,
  Linkedin,
  Sparkles,
} from "lucide-react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaPinterestP,
  FaRedditAlien,
  FaXTwitter,
} from "react-icons/fa6";
import Seo from "@/components/seo/Seo";
import ArticleBody from "@/components/articles/ArticleBody";
import ArticleMagazineProfile, {
  MagazineProfileLoading,
} from "@/components/magazine/ArticleMagazineProfile";
import { useArticleBySlug } from "@/hooks/useArticles";
import { useLeadershipBySlug, useLeadershipProfiles } from "@/hooks/useLeadership";
import { useMagazines } from "@/hooks/useMagazines";
import { useMagazineProfileIssue } from "@/hooks/useMagazineProfiles";
import {
  buildBreadcrumbSchema,
  buildProfileSchema,
  getSiteOrigin,
  toAbsoluteUrl,
  truncateText,
} from "@/lib/seo";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200";

const cleanText = (value: string) =>
  value
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

const isHeadingBlock = (value: string) => {
  const words = value.split(/\s+/).filter(Boolean);
  return (
    value.length <= 110 &&
    words.length <= 14 &&
    !/[.!?…,!”"']$/.test(value) &&
    !value.includes("“") &&
    !value.includes("\n")
  );
};

const profileHeadline = (profile: {
  name: string;
  title?: string | null;
  company?: string | null;
  areas_of_expertise?: string | null;
}) => {
  const name = profile.name.trim();
  if (profile.areas_of_expertise?.trim()) {
    return `${name}: ${profile.areas_of_expertise.trim()}`;
  }
  if (profile.title && profile.company) {
    return `${name}: ${profile.title} at ${profile.company}`;
  }
  return `${name}: ${profile.title || "Leadership, Vision and Professional Excellence"}`;
};

const MagazineProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading: articleLoading } = useArticleBySlug(slug || "");
  const { data: articleIssue, isLoading: articleIssueLoading } =
    useMagazineProfileIssue(article?.id);
  const { data: profile, isLoading, error } = useLeadershipBySlug(slug || "");
  const { data: allProfiles = [] } = useLeadershipProfiles();
  const { data: magazines = [] } = useMagazines();

  const magazineProfiles = useMemo(
    () =>
      allProfiles
        .filter((item) => item.home_sections?.includes("magazine_profile"))
        .sort((left, right) => (left.home_order ?? 0) - (right.home_order ?? 0)),
    [allProfiles]
  );

  const profileIndex = magazineProfiles.findIndex((item) => item.slug === slug);
  const previousProfile = profileIndex > 0 ? magazineProfiles[profileIndex - 1] : null;
  const nextProfile =
    profileIndex >= 0 && profileIndex < magazineProfiles.length - 1
      ? magazineProfiles[profileIndex + 1]
      : null;
  const sidebarMagazine = useMemo(() => {
    if (!profile || !magazines.length) return null;

    if (profile.article_title) {
      const match = magazines.find(
        (m) =>
          m.title.toLowerCase().includes(profile.article_title!.toLowerCase()) ||
          profile.article_title!.toLowerCase().includes(m.title.toLowerCase())
      );
      if (match) return match;
    }

    if (profile.slug === "richard-jacik" || profile.slug === "silvia-borzini") {
      const match = magazines.find(
        (m) => m.slug === "the-most-visionary-leaders-transforming-the-future-in-2026"
      );
      if (match) return match;
    }

    const fallback = magazines.find((m) =>
      m.title.toLowerCase().includes("visionary") || m.title.toLowerCase().includes("innovative")
    );

    return fallback || magazines[0] || null;
  }, [profile, magazines]);

  if (
    articleLoading ||
    (article && articleIssueLoading) ||
    (!article && isLoading)
  ) {
    return (
      <>
        <Seo title="Magazine profile" noindex />
        <MagazineProfileLoading />
      </>
    );
  }

  if (article && articleIssue) {
    return <ArticleMagazineProfile article={article} issue={articleIssue} />;
  }

  if (article && !articleIssueLoading) {
    return <Navigate replace to={`/article/${article.slug}`} />;
  }

  if (error || !profile) {
    return (
      <>
        <Seo title="Magazine profile not found" noindex />
        <div className="min-h-screen bg-white px-5 py-24 text-center text-black">
          <h1 className="font-serif text-4xl font-bold">Profile Not Found</h1>
          <p className="mt-4 text-neutral-600">
            The magazine profile you&apos;re looking for does not exist.
          </p>
          <Link
            to="/leadership"
            className="mt-7 inline-flex items-center bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e62429]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profiles
          </Link>
        </div>
      </>
    );
  }

  if (!profile.home_sections?.includes("magazine_profile")) {
    return <Navigate replace to={`/leadership/${profile.slug}`} />;
  }

  const headline = profileHeadline(profile);
  const content = cleanText(profile.bio || "");
  const blocks = content.split(/\n\s*\n+/).map(cleanText).filter(Boolean);
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));
  const siteOrigin = getSiteOrigin();
  const canonicalUrl = siteOrigin && slug ? `${siteOrigin}/magazine-profile/${slug}` : undefined;
  const image = toAbsoluteUrl(profile.image_url || FALLBACK_IMAGE, siteOrigin);
  const description = truncateText(profile.bio || `${profile.name} magazine profile.`);
  const sameAs = [profile.linkedin_url, profile.twitter_url].filter(Boolean) as string[];
  const modifiedTime = profile.updated_at ? new Date(profile.updated_at).toISOString() : undefined;
  const publishedLabel = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;
  const currentUrl = canonicalUrl || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(headline);

  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: "Magazine Profiles", url: `${siteOrigin}/leadership` },
        { name: profile.name.trim(), url: canonicalUrl || `${siteOrigin}${window.location.pathname}` },
      ])
    : undefined;
  const profileSchema = buildProfileSchema({
    name: profile.name.trim(),
    description,
    image,
    jobTitle: profile.title,
    worksFor: profile.company,
    url: canonicalUrl,
    sameAs,
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

  return (
    <>
      <Seo
        title={headline}
        description={description}
        image={image}
        type="profile"
        modifiedTime={modifiedTime}
        schema={[...(breadcrumbSchema ? [breadcrumbSchema] : []), profileSchema]}
      />

      <main className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-[1320px] px-5 pb-12 pt-3">
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_325px]">
            <article className="min-w-0">
              <div className="relative flex min-h-11 items-start justify-between border-t-2 border-black">
                <Link
                  to="/leadership"
                  className="inline-flex min-h-10 items-center bg-black px-3 font-serif text-xl font-bold text-white transition hover:bg-[#e62429]"
                >
                  Magazine Profiles
                </Link>
                <p className="pt-1.5 font-serif text-[17px] leading-7">
                  Reading Time: <strong>{readingMinutes} minutes</strong>
                </p>
              </div>

              <h1 className="mb-3 mt-1 font-sans text-[29px] font-extrabold leading-[1.12] tracking-[-0.02em] md:text-[31px]">
                {headline}
              </h1>

              <figure className="mb-7 overflow-hidden bg-neutral-100">
                <img
                  src={profile.image_url || FALLBACK_IMAGE}
                  alt={headline}
                  className="aspect-[3/2] w-full object-cover"
                  fetchPriority="high"
                />
              </figure>

              <div className="magazine-profile-copy">
                <ArticleBody content={profile.bio || ""} />
              </div>

              <section className="mt-9 border-t border-black pt-4">
                <h2 className="font-serif text-lg font-bold">Did You like the post? Share it now:</h2>
                <div className="mt-3 flex flex-wrap gap-2" aria-label="Share this magazine profile">
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

              {(previousProfile || nextProfile) && (
                <nav className="mt-8 grid border-y border-neutral-300 md:grid-cols-2" aria-label="Profile navigation">
                  <div className="min-h-24 border-b border-neutral-300 p-4 md:border-b-0 md:border-r">
                    {previousProfile && (
                      <Link
                        to={`/magazine-profile/${previousProfile.slug}`}
                        className="group flex items-center gap-3 font-serif text-sm font-bold leading-snug hover:text-[#e62429]"
                      >
                        <ArrowLeft className="h-4 w-4 shrink-0 transition group-hover:-translate-x-1" />
                        {profileHeadline(previousProfile)}
                      </Link>
                    )}
                  </div>
                  <div className="min-h-24 p-4 text-right">
                    {nextProfile && (
                      <Link
                        to={`/magazine-profile/${nextProfile.slug}`}
                        className="group flex items-center justify-end gap-3 font-serif text-sm font-bold leading-snug hover:text-[#e62429]"
                      >
                        {profileHeadline(nextProfile)}
                        <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-1" />
                      </Link>
                    )}
                  </div>
                </nav>
              )}
            </article>

            <aside className="border border-black bg-white lg:sticky lg:top-[70px]" aria-label="Profile details">
              {sidebarMagazine && (
                <div className="px-10 pt-3 text-center">
                  <Link to={`/magazine/${sidebarMagazine.slug}`} className="group block">
                    <img
                      src={sidebarMagazine.cover_image_url || FALLBACK_IMAGE}
                      alt={sidebarMagazine.title}
                      className="mx-auto aspect-[576/756] w-full border border-neutral-300 object-cover"
                      loading="lazy"
                    />
                    <h2 className="mt-2 font-serif text-[19px] font-bold leading-[1.15] group-hover:text-[#e62429]">
                      {sidebarMagazine.title}
                    </h2>
                  </Link>
                </div>
              )}

              <div className="space-y-1.5 px-3 py-4 font-serif text-[16px] leading-[1.28]">
                <p>
                  <strong>Featured Person:</strong> {profile.name.trim()} ({profile.title})
                </p>
                {profile.company && (
                  <p>
                    <strong>Company Name:</strong> {profile.company}
                  </p>
                )}
                <p>
                  <strong>Position:</strong> {profile.title}
                </p>
                {profile.areas_of_expertise && (
                  <p>
                    <strong>Expertise:</strong> {profile.areas_of_expertise}
                  </p>
                )}
                {publishedLabel && (
                  <p>
                    <strong>Profile Published:</strong> {publishedLabel}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-neutral-300 p-3">
                {sidebarMagazine && (
                  <Link
                    to={`/magazine/${sidebarMagazine.slug}`}
                    className="inline-flex min-h-10 items-center justify-center gap-2 bg-black px-3 text-xs font-bold text-white transition hover:bg-[#e62429]"
                  >
                    <Globe2 className="h-4 w-4" /> Magazine
                  </Link>
                )}
                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center justify-center gap-2 bg-[#0a66c2] px-3 text-xs font-bold text-white transition hover:bg-black"
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                )}
              </div>

              <div className="grid gap-2 border-t border-neutral-300 px-3 py-3 text-xs text-neutral-600">
                {profile.company && (
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-black" /> {profile.company}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <BriefcaseBusiness className="h-4 w-4 text-black" /> {profile.title}
                </span>
                {publishedLabel && (
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-black" /> {publishedLabel}
                  </span>
                )}
                {profile.featured && (
                  <span className="flex items-center gap-2 font-semibold text-[#e62429]">
                    <Sparkles className="h-4 w-4" /> Featured Magazine Profile
                  </span>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
};

export default MagazineProfile;
