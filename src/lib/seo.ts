export const DEFAULT_DESCRIPTION =
  "The CIO Vision (theciovision.com) delivers executive insights, leadership interviews, and market intelligence for modern business leaders.";

export const BRAND_ALIASES = ["TheCIOVision", "theciovision", "theciovision.com"];
export const BRAND_SOCIALS = [
  "https://www.linkedin.com/company/theciovision",
  "https://www.instagram.com/theciovision/",
];

export type BreadcrumbItem = {
  name: string;
  url: string;
};

type PageSchemaOptions = {
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage";
  name: string;
  description?: string;
  image?: string;
  url?: string;
  datePublished?: string;
  dateModified?: string;
};

type ArticleSchemaOptions = {
  type?: "Article" | "NewsArticle" | "PressRelease";
  headline: string;
  description?: string;
  image?: string;
  url?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  publisherName?: string;
  publisherLogo?: string;
  section?: string;
  keywords?: string[];
};

type ProfileSchemaOptions = {
  name: string;
  description?: string;
  image?: string;
  jobTitle?: string;
  worksFor?: string;
  url?: string;
  sameAs?: string[];
};

type PublicationIssueSchemaOptions = {
  name: string;
  description?: string;
  image?: string;
  url?: string;
  datePublished?: string;
  dateModified?: string;
  issueNumber?: string | number;
  publisherName?: string;
  publisherLogo?: string;
};

type OrganizationSchemaOptions = {
  alternateName?: string[];
  sameAs?: string[];
};

type WebSiteSchemaOptions = {
  alternateName?: string[];
  searchUrl?: string;
};

type ItemListEntry = {
  name: string;
  url: string;
  image?: string;
  description?: string;
  datePublished?: string;
  position?: number;
  itemType?: string;
};

type FAQEntry = {
  question: string;
  answer: string;
};

const assignIf = (target: Record<string, unknown>, key: string, value: unknown) => {
  if (value === undefined || value === null || value === "") {
    return;
  }
  target[key] = value;
};

export const getSiteOrigin = () => {
  const envOrigin = import.meta.env?.VITE_SITE_URL;
  if (envOrigin) {
    return envOrigin.replace(/\/$/, "");
  }
  if (typeof window === "undefined") {
    return "";
  }
  return window.location.origin;
};

export const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

export const truncateText = (value: string, maxLength = 160) => {
  const normalized = normalizeText(value);
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
};

export const toIsoDateString = (value?: string | null) => {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed.toISOString();
};

export const getLatestDate = (...values: Array<string | null | undefined>) =>
  values.reduce<string | undefined>((latest, current) => {
    const currentIso = toIsoDateString(current);
    if (!currentIso) {
      return latest;
    }
    if (!latest) {
      return currentIso;
    }
    return new Date(currentIso).getTime() > new Date(latest).getTime() ? currentIso : latest;
  }, undefined);

export const toAbsoluteUrl = (url: string | null | undefined, origin?: string) => {
  if (!url) {
    return "";
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const base = origin || getSiteOrigin();
  if (!base) {
    return url;
  }
  if (url.startsWith("/")) {
    return `${base}${url}`;
  }
  return `${base}/${url}`;
};

export const buildBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const buildPageSchema = (options: PageSchemaOptions) => {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": options.type || "WebPage",
    name: options.name,
  };

  assignIf(schema, "description", options.description);
  assignIf(schema, "url", options.url);
  assignIf(schema, "datePublished", options.datePublished);
  assignIf(schema, "dateModified", options.dateModified);

  if (options.image) {
    schema.image = [options.image];
  }

  return schema;
};

export const buildOrganizationSchema = (
  name: string,
  url: string,
  logo?: string,
  options?: OrganizationSchemaOptions
) => {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
  };
  assignIf(schema, "logo", logo);
  if (options?.alternateName && options.alternateName.length > 0) {
    schema.alternateName = options.alternateName;
  }
  if (options?.sameAs && options.sameAs.length > 0) {
    schema.sameAs = options.sameAs;
  }
  return schema;
};

export const buildWebSiteSchema = (
  name: string,
  url: string,
  options?: WebSiteSchemaOptions
) => {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
  };

  if (options?.alternateName && options.alternateName.length > 0) {
    schema.alternateName = options.alternateName;
  }

  if (options?.searchUrl) {
    const target = options.searchUrl.includes("{search_term_string}")
      ? options.searchUrl
      : `${options.searchUrl}{search_term_string}`;
    schema.potentialAction = {
      "@type": "SearchAction",
      target,
      "query-input": "required name=search_term_string",
    };
  }

  return schema;
};

export const buildArticleSchema = (options: ArticleSchemaOptions) => {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": options.type || "Article",
    headline: options.headline,
  };

  assignIf(schema, "description", options.description);
  if (options.image) {
    schema.image = [options.image];
  }
  if (options.url) {
    schema.mainEntityOfPage = {
      "@type": "WebPage",
      "@id": options.url,
    };
  }
  if (options.author) {
    schema.author = {
      "@type": "Person",
      name: options.author,
    };
  }
  assignIf(schema, "datePublished", options.datePublished);
  assignIf(schema, "dateModified", options.dateModified);
  assignIf(schema, "articleSection", options.section);
  if (options.keywords && options.keywords.length > 0) {
    schema.keywords = options.keywords.join(", ");
  }

  if (options.publisherName) {
    const publisher: Record<string, unknown> = {
      "@type": "Organization",
      name: options.publisherName,
    };
    if (options.publisherLogo) {
      publisher.logo = {
        "@type": "ImageObject",
        url: options.publisherLogo,
      };
    }
    schema.publisher = publisher;
  }

  return schema;
};

export const buildItemListSchema = (
  name: string,
  items: ItemListEntry[],
  url?: string
) => {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => {
      const listItem: Record<string, unknown> = {
        "@type": "ListItem",
        position: item.position || index + 1,
      };

      const thing: Record<string, unknown> = {
        "@type": item.itemType || "Thing",
        name: item.name,
        url: item.url,
      };

      assignIf(thing, "image", item.image);
      assignIf(thing, "description", item.description);
      assignIf(thing, "datePublished", item.datePublished);
      listItem.item = thing;

      return listItem;
    }),
  };

  assignIf(schema, "url", url);
  return schema;
};

export const buildFAQSchema = (entries: FAQEntry[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: entries.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: entry.answer,
    },
  })),
});

export const buildProfileSchema = (options: ProfileSchemaOptions) => {
  const person: Record<string, unknown> = {
    "@type": "Person",
    name: options.name,
  };

  assignIf(person, "description", options.description);
  assignIf(person, "image", options.image);
  assignIf(person, "jobTitle", options.jobTitle);
  assignIf(person, "url", options.url);

  if (options.worksFor) {
    person.worksFor = {
      "@type": "Organization",
      name: options.worksFor,
    };
  }

  if (options.sameAs && options.sameAs.length > 0) {
    person.sameAs = options.sameAs;
  }

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: person,
  };
};

export const buildPublicationIssueSchema = (options: PublicationIssueSchemaOptions) => {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "PublicationIssue",
    name: options.name,
  };

  assignIf(schema, "description", options.description);
  if (options.image) {
    schema.image = [options.image];
  }
  assignIf(schema, "url", options.url);
  assignIf(schema, "datePublished", options.datePublished);
  assignIf(schema, "dateModified", options.dateModified);
  assignIf(schema, "issueNumber", options.issueNumber);

  if (options.publisherName) {
    schema.isPartOf = {
      "@type": "Periodical",
      name: options.publisherName,
    };
    const publisher: Record<string, unknown> = {
      "@type": "Organization",
      name: options.publisherName,
    };
    if (options.publisherLogo) {
      publisher.logo = {
        "@type": "ImageObject",
        url: options.publisherLogo,
      };
    }
    schema.publisher = publisher;
  }

  return schema;
};
