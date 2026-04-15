import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/integrations/supabase/types";
import {
  isIndustryNewsCategory,
  normalizeCategorySlug,
} from "../src/lib/articleCategories";
import {
  getCanonicalSiteUrl,
  getSupabaseAnonKey,
  getSupabaseUrl,
} from "./_lib/site-config";

type ArticleRow = Pick<
  Database["public"]["Tables"]["articles"]["Row"],
  "slug" | "category" | "date" | "updated_at" | "created_at" | "image_url"
>;

type MagazineRow = Pick<
  Database["public"]["Tables"]["magazines"]["Row"],
  "slug" | "publish_date" | "updated_at" | "created_at" | "cover_image_url"
>;

type LeadershipRow = Pick<
  Database["public"]["Tables"]["leadership_profiles"]["Row"],
  "slug" | "updated_at" | "created_at" | "image_url"
>;

type PressReleaseRow = Pick<
  Database["public"]["Tables"]["press_releases"]["Row"],
  "slug" | "date" | "updated_at" | "created_at" | "image_url"
>;

type SitemapEntry = {
  path: string;
  lastModified?: string;
  imageUrls?: string[];
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toIsoDate = (value?: string | null) => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
};

const pickLatestLastMod = (...values: Array<string | undefined>) => {
  return values.reduce<string | undefined>((latest, current) => {
    if (!current) {
      return latest;
    }
    if (!latest) {
      return current;
    }
    return new Date(current).getTime() > new Date(latest).getTime() ? current : latest;
  }, undefined);
};

const toAbsoluteUrl = (path: string, siteUrl: string) =>
  /^https?:\/\//i.test(path)
    ? path
    : `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

const getStoragePrefix = (supabaseUrl: string) =>
  supabaseUrl ? `${supabaseUrl}/storage/v1/object/public/` : "";

const normalizeStorageUrl = (value: string | null | undefined, storagePrefix: string) => {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  const match = trimmed.match(
    /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/(.+)$/i
  );

  if (match && storagePrefix) {
    return `${storagePrefix}${match[1]}`;
  }

  return trimmed;
};

const buildSitemapXml = (siteUrl: string, entries: SitemapEntry[]) => {
  const body = entries
    .map((entry) => {
      const lines = [`  <url>`, `    <loc>${escapeXml(toAbsoluteUrl(entry.path, siteUrl))}</loc>`];

      if (entry.lastModified) {
        lines.push(`    <lastmod>${escapeXml(entry.lastModified)}</lastmod>`);
      }

      for (const imageUrl of entry.imageUrls || []) {
        lines.push("    <image:image>");
        lines.push(`      <image:loc>${escapeXml(imageUrl)}</image:loc>`);
        lines.push("    </image:image>");
      }

      lines.push("  </url>");
      return lines.join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    body,
    "</urlset>",
  ].join("\n");
};

const getFulfilledValue = <T,>(result: PromiseSettledResult<T>, label: string, fallback: T): T => {
  if (result.status === "fulfilled") {
    return result.value;
  }

  console.error(`Failed to fetch ${label} for sitemap`, result.reason);
  return fallback;
};

const createSupabaseClient = () => {
  const supabaseUrl = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!supabaseUrl || !anonKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export default {
  async fetch() {
    const siteUrl = getCanonicalSiteUrl();
    const supabaseUrl = getSupabaseUrl();
    const storagePrefix = getStoragePrefix(supabaseUrl);
    const supabase = createSupabaseClient();

    let articles: ArticleRow[] = [];
    let magazines: MagazineRow[] = [];
    let leadershipProfiles: LeadershipRow[] = [];
    let pressReleases: PressReleaseRow[] = [];

    if (supabase) {
      const results = await Promise.allSettled([
        supabase
          .from("articles")
          .select("slug, category, date, updated_at, created_at, image_url")
          .order("date", { ascending: false })
          .then(({ data, error }) => {
            if (error) throw error;
            return (data || []) as ArticleRow[];
          }),
        supabase
          .from("magazines")
          .select("slug, publish_date, updated_at, created_at, cover_image_url")
          .order("publish_date", { ascending: false })
          .then(({ data, error }) => {
            if (error) throw error;
            return (data || []) as MagazineRow[];
          }),
        supabase
          .from("leadership_profiles")
          .select("slug, updated_at, created_at, image_url")
          .order("name", { ascending: true })
          .then(({ data, error }) => {
            if (error) throw error;
            return (data || []) as LeadershipRow[];
          }),
        supabase
          .from("press_releases")
          .select("slug, date, updated_at, created_at, image_url")
          .order("date", { ascending: false })
          .then(({ data, error }) => {
            if (error) throw error;
            return (data || []) as PressReleaseRow[];
          }),
      ]);

      articles = getFulfilledValue(results[0], "articles", []);
      magazines = getFulfilledValue(results[1], "magazines", []);
      leadershipProfiles = getFulfilledValue(results[2], "leadership profiles", []);
      pressReleases = getFulfilledValue(results[3], "press releases", []);
    }

    const articleEntries: SitemapEntry[] = articles
      .filter((article) => Boolean(article.slug))
      .map((article) => ({
        path: `/article/${article.slug}`,
        lastModified: pickLatestLastMod(
          toIsoDate(article.updated_at),
          toIsoDate(article.date),
          toIsoDate(article.created_at)
        ),
        imageUrls: normalizeStorageUrl(article.image_url, storagePrefix)
          ? [normalizeStorageUrl(article.image_url, storagePrefix)]
          : undefined,
      }));

    const magazineEntries: SitemapEntry[] = magazines
      .filter((magazine) => Boolean(magazine.slug))
      .map((magazine) => ({
        path: `/magazine/${magazine.slug}`,
        lastModified: pickLatestLastMod(
          toIsoDate(magazine.updated_at),
          toIsoDate(magazine.publish_date),
          toIsoDate(magazine.created_at)
        ),
        imageUrls: normalizeStorageUrl(magazine.cover_image_url, storagePrefix)
          ? [normalizeStorageUrl(magazine.cover_image_url, storagePrefix)]
          : undefined,
      }));

    const leadershipEntries: SitemapEntry[] = leadershipProfiles
      .filter((profile) => Boolean(profile.slug))
      .map((profile) => ({
        path: `/leadership/${profile.slug}`,
        lastModified: pickLatestLastMod(
          toIsoDate(profile.updated_at),
          toIsoDate(profile.created_at)
        ),
        imageUrls: normalizeStorageUrl(profile.image_url, storagePrefix)
          ? [normalizeStorageUrl(profile.image_url, storagePrefix)]
          : undefined,
      }));

    const pressReleaseEntries: SitemapEntry[] = pressReleases
      .filter((release) => Boolean(release.slug))
      .map((release) => ({
        path: `/press-releases/${release.slug}`,
        lastModified: pickLatestLastMod(
          toIsoDate(release.updated_at),
          toIsoDate(release.date),
          toIsoDate(release.created_at)
        ),
        imageUrls: normalizeStorageUrl(release.image_url, storagePrefix)
          ? [normalizeStorageUrl(release.image_url, storagePrefix)]
          : undefined,
      }));

    const industryNewsArticles = articles.filter((article) =>
      isIndustryNewsCategory(article.category)
    );

    const categoryEntriesMap = new Map<string, string | undefined>();
    for (const article of articles) {
      if (!article.category) {
        continue;
      }

      const categorySlug = normalizeCategorySlug(article.category);
      if (!categorySlug) {
        continue;
      }

      const candidateLastMod = pickLatestLastMod(
        toIsoDate(article.updated_at),
        toIsoDate(article.date),
        toIsoDate(article.created_at)
      );

      categoryEntriesMap.set(
        categorySlug,
        pickLatestLastMod(categoryEntriesMap.get(categorySlug), candidateLastMod)
      );
    }

    const categoryEntries: SitemapEntry[] = Array.from(categoryEntriesMap.entries()).map(
      ([categorySlug, lastModified]) => ({
        path: `/category/${categorySlug}`,
        lastModified,
      })
    );

    const newestArticleLastMod = pickLatestLastMod(
      ...articleEntries.map((entry) => entry.lastModified)
    );
    const newestMagazineLastMod = pickLatestLastMod(
      ...magazineEntries.map((entry) => entry.lastModified)
    );
    const newestLeadershipLastMod = pickLatestLastMod(
      ...leadershipEntries.map((entry) => entry.lastModified)
    );
    const newestPressReleaseLastMod = pickLatestLastMod(
      ...pressReleaseEntries.map((entry) => entry.lastModified)
    );
    const newestIndustryNewsLastMod = pickLatestLastMod(
      ...industryNewsArticles.map((article) =>
        pickLatestLastMod(
          toIsoDate(article.updated_at),
          toIsoDate(article.date),
          toIsoDate(article.created_at)
        )
      )
    );

    const staticEntries: SitemapEntry[] = [
      {
        path: "/",
        lastModified: pickLatestLastMod(
          newestArticleLastMod,
          newestMagazineLastMod,
          newestLeadershipLastMod,
          newestPressReleaseLastMod
        ),
      },
      { path: "/articles", lastModified: newestArticleLastMod },
      { path: "/industry-news", lastModified: newestIndustryNewsLastMod },
      { path: "/magazine", lastModified: newestMagazineLastMod },
      { path: "/leadership", lastModified: newestLeadershipLastMod },
      { path: "/press-releases", lastModified: newestPressReleaseLastMod },
      { path: "/about" },
      { path: "/contact" },
      { path: "/partner-with-us" },
      { path: "/advertise" },
    ];

    const dedupedEntries = Array.from(
      new Map(
        [...staticEntries, ...categoryEntries, ...articleEntries, ...magazineEntries, ...leadershipEntries, ...pressReleaseEntries].map(
          (entry) => [entry.path, entry]
        )
      ).values()
    );

    const xml = buildSitemapXml(siteUrl, dedupedEntries);

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400",
      },
    });
  },
};
