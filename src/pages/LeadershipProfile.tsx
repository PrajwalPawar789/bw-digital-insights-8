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
import ArticleBody, {
  getArticleWordCount,
} from "@/components/articles/ArticleBody";
import Seo from "@/components/seo/Seo";
import {
  useLeadershipBySlug,
  useLeadershipProfiles,
} from "@/hooks/useLeadership";
import {
  buildBreadcrumbSchema,
  buildProfileSchema,
  getSiteOrigin,
  toAbsoluteUrl,
  truncateText,
} from "@/lib/seo";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1200";

const getStoryTitle = (name: string, articleTitle?: string | null) => {
  if (articleTitle?.trim()) return articleTitle.trim();
  const possessiveName = name.endsWith("s") ? `${name}’` : `${name}’s`;
  return `Inside ${possessiveName} Approach to Business and Leadership`;
};

type StoryArtworkProps = {
  name: string;
  title: string;
  company?: string | null;
  portrait?: string | null;
  featuredImage?: string | null;
  compact?: boolean;
};

const StoryArtwork = ({
  name,
  title,
  company,
  portrait,
  featuredImage,
  compact = false,
}: StoryArtworkProps) => {
  if (featuredImage) {
    return (
      <img
        src={featuredImage}
        alt={`${name} — The CIO Vision`}
        className="h-full w-full object-cover object-top"
        loading={compact ? "lazy" : undefined}
        fetchPriority={compact ? undefined : "high"}
        decoding="async"
      />
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f8f8f6]">
      <div className="absolute -left-[8%] -top-[32%] h-[82%] w-[54%] rounded-full bg-[#d72620]" />
      <div className="absolute left-[7%] top-[9%] h-[76%] w-[53%] rounded-br-[48%] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.13)]" />
      <div className="absolute -right-[7%] -top-[8%] h-[78%] w-[47%] rounded-full border-[clamp(12px,4vw,68px)] border-[#e62429]/20" />
      <div className="absolute bottom-0 right-[5%] h-[71%] w-[42%] rounded-t-full bg-[#df2d25]" />
      <div className="absolute bottom-[5%] right-[7%] aspect-square w-[38%] overflow-hidden rounded-full border-[clamp(3px,0.7vw,10px)] border-white bg-neutral-200 shadow-xl">
        <img
          src={portrait || FALLBACK_IMAGE}
          alt={name}
          className="h-full w-full object-cover object-top"
          loading={compact ? "lazy" : undefined}
          fetchPriority={compact ? undefined : "high"}
          decoding="async"
        />
      </div>
      <div
        className={`absolute left-[8%] z-10 flex items-center border-l-[clamp(3px,0.7vw,10px)] border-[#e62429] pl-[2%] ${
          compact ? "top-[12%]" : "top-[11%]"
        }`}
        aria-label="The CIO Vision"
      >
        <div className="leading-none">
          <p
            className={`font-sans font-black uppercase tracking-[-0.055em] text-black ${
              compact
                ? "text-[clamp(7px,0.62vw,11px)]"
                : "text-[clamp(22px,2.7vw,46px)]"
            }`}
          >
            The CIO Vision
          </p>
          {!compact && (
            <p className="mt-1 font-sans text-[clamp(8px,0.72vw,12px)] font-bold uppercase tracking-[0.28em] text-[#d72620]">
              Business Magazine
            </p>
          )}
        </div>
      </div>
      {!compact && (
        <div className="absolute bottom-[13%] left-[12%] z-10 w-[43%] text-center">
          <p className="font-serif text-[clamp(28px,4.2vw,66px)] font-bold uppercase leading-[0.96] tracking-[-0.035em] text-[#bd2d25]">
            {name}
          </p>
          <span className="mx-auto mt-4 block h-[3px] w-16 bg-[#bd2d25]" />
          <p className="mt-3 font-sans text-[clamp(12px,1.35vw,21px)] font-bold uppercase leading-tight tracking-[0.04em] text-neutral-800">
            {title}
          </p>
          {company && (
            <p className="mt-1 font-sans text-[clamp(10px,1vw,16px)] font-semibold uppercase tracking-[0.08em] text-neutral-500">
              {company}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const LeadershipProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: leader, isLoading, error } = useLeadershipBySlug(slug || "");
  const { data: allProfiles = [], isLoading: profilesLoading } =
    useLeadershipProfiles();

  const relatedProfiles = useMemo(() => {
    if (!leader) return [];
    const others = allProfiles.filter((profile) => profile.id !== leader.id);
    const leadershipTalks = others.filter((profile) =>
      profile.home_sections?.includes("leadership_talk")
    );
    const remaining = others.filter(
      (profile) => !profile.home_sections?.includes("leadership_talk")
    );
    return [...leadershipTalks, ...remaining].slice(0, 6);
  }, [allProfiles, leader]);

  if (isLoading || (!leader && profilesLoading)) {
    return (
      <>
        <Seo title="Leadership profile" noindex />
        <div className="flex min-h-screen items-center justify-center bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#e62429]" />
          <span className="ml-2 text-base">Loading profile...</span>
        </div>
      </>
    );
  }

  if (error || !leader) {
    return (
      <>
        <Seo title="Profile not found" noindex />
        <div className="min-h-screen bg-white px-5 py-24 text-center text-black">
          <h1 className="font-serif text-4xl font-bold">Profile Not Found</h1>
          <p className="mt-4 text-neutral-600">
            The leadership profile you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            to="/leadership"
            className="mt-7 inline-flex items-center bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e62429]"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Leadership
          </Link>
        </div>
      </>
    );
  }

  if (leader.home_sections?.includes("magazine_profile")) {
    return <Navigate replace to={`/magazine-profile/${leader.slug}`} />;
  }

  const storyTitle = getStoryTitle(leader.name, leader.article_title);
  const featuredImage = leader.featured_image_url || leader.image_url || FALLBACK_IMAGE;
  const readingMinutes = Math.max(
    1,
    Math.ceil(getArticleWordCount(leader.bio || "") / 220)
  );
  const profileIndex = allProfiles.findIndex((profile) => profile.id === leader.id);
  const previousProfile =
    profileIndex >= 0 && profileIndex < allProfiles.length - 1
      ? allProfiles[profileIndex + 1]
      : null;
  const nextProfile = profileIndex > 0 ? allProfiles[profileIndex - 1] : null;
  const siteOrigin = getSiteOrigin();
  const canonicalUrl =
    siteOrigin && slug ? `${siteOrigin}/leadership/${slug}` : undefined;
  const seoImage = toAbsoluteUrl(featuredImage, siteOrigin);
  const baseDescription =
    leader.areas_of_expertise || leader.bio || `${leader.name} leadership profile.`;
  const seoDescription = truncateText(baseDescription);
  const sameAs = [leader.linkedin_url, leader.twitter_url].filter(
    Boolean
  ) as string[];
  const modifiedTime = leader.updated_at
    ? new Date(leader.updated_at).toISOString()
    : undefined;
  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : canonicalUrl || `/leadership/${leader.slug}`;
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(storyTitle);

  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: "Leadership", url: `${siteOrigin}/leadership` },
        {
          name: leader.name,
          url: canonicalUrl || `${siteOrigin}/leadership/${leader.slug}`,
        },
      ])
    : undefined;

  const profileSchema = buildProfileSchema({
    name: leader.name,
    description: seoDescription,
    image: seoImage,
    jobTitle: leader.title,
    worksFor: leader.company,
    url: canonicalUrl,
    sameAs,
  });

  const shareButtons = [
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
        seoImage || featuredImage
      )}&description=${encodedTitle}`,
      className: "bg-[#bd081c]",
      Icon: FaPinterestP,
    },
  ];

  return (
    <>
      <Seo
        title={storyTitle}
        description={baseDescription}
        image={seoImage}
        type="profile"
        modifiedTime={modifiedTime}
        schema={[...(breadcrumbSchema ? [breadcrumbSchema] : []), profileSchema]}
      />

      <div className="min-h-screen bg-white text-black">
        <div className="w-full px-4 py-5 sm:px-[1.5vw] sm:py-[1.8vw]">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,1fr)] lg:gap-[1.1vw]">
            <main className="min-w-0">
              <div className="relative flex min-h-[42px] items-start justify-end border-t border-black lg:min-h-[4.4vw]">
                <Link
                  to="/leadership"
                  className="absolute left-0 top-0 inline-flex min-h-[41px] items-center bg-black px-2.5 font-serif text-[20px] font-bold text-white transition hover:bg-[#e62429] lg:min-h-[4.4vw] lg:px-[0.75vw] lg:text-[1.45vw]"
                >
                  Leadership Talks
                </Link>
                <p className="pt-1.5 font-serif text-[17px] leading-7 lg:pt-[0.45vw] lg:text-[1.25vw] lg:leading-[1.6]">
                  Reading Time: {" "}
                  <strong>
                    {readingMinutes} {readingMinutes === 1 ? "minute" : "minutes"}
                  </strong>
                </p>
              </div>

              <h1 className="mb-2.5 font-sans text-[27px] font-extrabold leading-[1.18] tracking-[-0.025em] text-black sm:text-[29px] lg:text-[2.05vw]">
                {storyTitle}
              </h1>

              <figure className="mb-8 w-full overflow-hidden bg-neutral-100">
                <div className="aspect-[3/2] w-full">
                  <StoryArtwork
                    name={leader.name}
                    title={leader.title}
                    company={leader.company}
                    portrait={leader.image_url}
                    featuredImage={leader.featured_image_url}
                  />
                </div>
              </figure>

              <div className="leadership-story-copy">
                <ArticleBody content={leader.bio} />
              </div>

              <section className="mt-9 border-t border-black pt-3" aria-label="Share this story">
                <h2 className="mb-3 font-serif text-[21px] font-bold leading-tight lg:text-[1.5vw]">
                  Did You like the post? Share it now:
                </h2>
                <div className="flex flex-wrap gap-2">
                  {shareButtons.map(({ label, href, className, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Share on ${label}`}
                      title={`Share on ${label}`}
                      className={`flex h-10 w-10 items-center justify-center text-white transition hover:-translate-y-0.5 hover:brightness-110 lg:h-[2.95vw] lg:w-[2.95vw] ${className}`}
                    >
                      <Icon className="h-[18px] w-[18px] lg:h-[1.3vw] lg:w-[1.3vw]" />
                    </a>
                  ))}
                </div>
              </section>

              {(previousProfile || nextProfile) && (
                <nav
                  className="mt-8 grid border-y border-black sm:grid-cols-2"
                  aria-label="Leadership story navigation"
                >
                  <div className="min-w-0 border-b border-black py-4 pr-4 sm:border-b-0 sm:border-r">
                    {previousProfile && (
                      <Link
                        to={`/leadership/${previousProfile.slug}`}
                        className="group flex items-center gap-2 font-sans text-sm font-bold leading-snug hover:text-[#e62429]"
                      >
                        <ChevronLeft className="h-4 w-4 shrink-0" />
                        <span className="line-clamp-2">
                          {getStoryTitle(
                            previousProfile.name,
                            previousProfile.article_title
                          )}
                        </span>
                      </Link>
                    )}
                  </div>
                  <div className="min-w-0 py-4 pl-4">
                    {nextProfile && (
                      <Link
                        to={`/leadership/${nextProfile.slug}`}
                        className="group flex items-center justify-end gap-2 text-right font-sans text-sm font-bold leading-snug hover:text-[#e62429]"
                      >
                        <span className="line-clamp-2">
                          {getStoryTitle(nextProfile.name, nextProfile.article_title)}
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0" />
                      </Link>
                    )}
                  </div>
                </nav>
              )}
            </main>

            <aside className="min-w-0 lg:sticky lg:top-24">
              <h2 className="border-b-2 border-black pb-2 font-sans text-[23px] font-extrabold leading-[1.05] tracking-[-0.02em] lg:text-[1.7vw]">
                Read More From The CIO Vision
              </h2>
              <div>
                {relatedProfiles.map((profile) => {
                  const relatedTitle = getStoryTitle(
                    profile.name,
                    profile.article_title
                  );
                  return (
                    <Link
                      key={profile.id}
                      to={`/leadership/${profile.slug}`}
                      className="group grid grid-cols-[40%_minmax(0,1fr)] gap-[4%] border-b border-black py-[0.8vw]"
                    >
                      <div className="aspect-[104/68] w-full overflow-hidden bg-neutral-100">
                        <StoryArtwork
                          name={profile.name}
                          title={profile.title}
                          company={profile.company}
                          portrait={profile.image_url}
                          featuredImage={profile.featured_image_url}
                          compact
                        />
                      </div>
                      <h3 className="line-clamp-4 font-sans text-[14px] font-extrabold leading-[1.2] group-hover:text-[#e62429] lg:text-[1.03vw]">
                        {relatedTitle}
                      </h3>
                    </Link>
                  );
                })}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadershipProfile;
