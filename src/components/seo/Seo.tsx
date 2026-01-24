import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useSettings } from "@/hooks/useSettings";
import {
  DEFAULT_DESCRIPTION,
  BRAND_ALIASES,
  BRAND_SOCIALS,
  buildOrganizationSchema,
  buildWebSiteSchema,
  getSiteOrigin,
  truncateText,
  toAbsoluteUrl,
} from "@/lib/seo";

type SeoSchema = Record<string, unknown> | Array<Record<string, unknown>>;

type SeoProps = {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  canonical?: string;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  schema?: SeoSchema;
  includeSiteSchema?: boolean;
};

const Seo = ({
  title,
  description,
  image,
  type = "website",
  canonical,
  noindex = false,
  publishedTime,
  modifiedTime,
  author,
  keywords,
  schema,
  includeSiteSchema = true,
}: SeoProps) => {
  const { settings } = useSettings();
  const location = useLocation();
  const siteName = settings.siteTitle || settings.companyName || "The CIO Vision";
  const origin = getSiteOrigin();
  const canonicalUrl = canonical || (origin ? `${origin}${location.pathname}` : undefined);
  const metaDescription = description ? truncateText(description) : DEFAULT_DESCRIPTION;
  const normalizedTitle = title ? title.trim() : "";
  const metaTitle =
    normalizedTitle && normalizedTitle.toLowerCase() !== siteName.toLowerCase()
      ? `${normalizedTitle} | ${siteName}`
      : siteName;
  const imageUrl = toAbsoluteUrl(image || settings.siteLogo || "/ciovision-logo.svg", origin);
  const robotsContent = noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  const schemaItems: Array<Record<string, unknown>> = [];
  if (includeSiteSchema && origin) {
    const logoUrl = toAbsoluteUrl(settings.siteLogo || "/ciovision-logo.svg", origin);
    const brandAliases = Array.from(
      new Set(
        BRAND_ALIASES
          .map((alias) => alias.trim())
          .filter((alias) => alias && alias.toLowerCase() !== siteName.toLowerCase())
      )
    );
    const searchTarget = `${origin}/search?q=`;
    schemaItems.push(
      buildOrganizationSchema(siteName, origin, logoUrl, {
        alternateName: brandAliases,
        sameAs: BRAND_SOCIALS,
      })
    );
    schemaItems.push(
      buildWebSiteSchema(siteName, origin, {
        alternateName: brandAliases,
        searchUrl: searchTarget,
      })
    );
  }
  if (schema) {
    if (Array.isArray(schema)) {
      schemaItems.push(...schema);
    } else {
      schemaItems.push(schema);
    }
  }

  const schemaJson =
    schemaItems.length === 0
      ? ""
      : JSON.stringify(schemaItems.length === 1 ? schemaItems[0] : schemaItems, null, 2);

  return (
    <Helmet>
      <title>{metaTitle}</title>
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      <meta name="description" content={metaDescription} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <meta name="author" content={author || siteName} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}

      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}

      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {schemaJson && (
        <script type="application/ld+json">{schemaJson}</script>
      )}
    </Helmet>
  );
};

export default Seo;
