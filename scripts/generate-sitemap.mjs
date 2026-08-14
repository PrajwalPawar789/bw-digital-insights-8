import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const envFilePath = path.join(process.cwd(), ".env");

const stripWrappingQuotes = (value) => {
  if (!value) return value;
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
};

const loadDotEnv = async () => {
  try {
    const raw = await fs.readFile(envFilePath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = stripWrappingQuotes(trimmed.slice(separatorIndex + 1).trim());
      if (!key || process.env[key] !== undefined) continue;
      process.env[key] = value;
    }
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return;
    }

    throw error;
  }
};

await loadDotEnv();

const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || "https://theciovision.com").replace(/\/$/, "");
const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "";

const publicSitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
const sitemapSnapshotPath = path.join(process.cwd(), "sitemap-current.xml");
const fallbackSitemapPaths = [publicSitemapPath, sitemapSnapshotPath];

const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const toIsoDate = (value) => {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
};

const pickLatestLastMod = (...values) =>
  values.reduce((latest, current) => {
    const currentIso = toIsoDate(current);
    if (!currentIso) return latest;
    if (!latest) return currentIso;
    return new Date(currentIso).getTime() > new Date(latest).getTime() ? currentIso : latest;
  }, undefined);

const normalizeStorageUrl = (value) => {
  if (!value) return "";
  const trimmed = String(value).trim();
  const prefix = supabaseUrl ? `${supabaseUrl}/storage/v1/object/public/` : "";

  const directMatch = trimmed.match(
    /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/(.+)$/i
  );
  if (directMatch && prefix) {
    return `${prefix}${directMatch[1]}`;
  }

  const proxiedMatch = trimmed.match(
    /(?:\/supabase-proxy\.php|\/supabase)\/storage\/v1\/object\/public\/(.+)$/i
  );
  if (proxiedMatch && prefix) {
    return `${prefix}${proxiedMatch[1]}`;
  }

  return trimmed;
};

const isIndustryNewsCategory = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  return ["news", "top trending news", "top stories"].includes(normalized);
};

const toAbsoluteUrl = (url) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${siteUrl}${url.startsWith("/") ? url : `/${url}`}`;
};

const buildSitemapXml = (entries) => {
  const body = entries
    .map((entry) => {
      const lines = [`  <url>`, `    <loc>${escapeXml(toAbsoluteUrl(entry.path))}</loc>`];
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
    "",
  ].join("\n");
};

const copyFallbackSitemap = async (reason) => {
  for (const fallbackPath of fallbackSitemapPaths) {
    try {
      const fallbackXml = await fs.readFile(fallbackPath, "utf8");
      await fs.writeFile(publicSitemapPath, fallbackXml, "utf8");
      console.warn(
        `Using fallback sitemap snapshot from ${path.basename(fallbackPath)} because ${reason}.`
      );
      return true;
    } catch {
      // Try the next fallback source.
    }
  }

  return false;
};

const ensurePublicDir = async () => {
  await fs.mkdir(path.dirname(publicSitemapPath), { recursive: true });
};

const generate = async () => {
  await ensurePublicDir();

  if (!supabaseUrl || !supabaseAnonKey) {
    const usedFallback = await copyFallbackSitemap("Supabase environment variables are missing");
    if (usedFallback) return;
    throw new Error("Missing Supabase environment variables for sitemap generation.");
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const [
    articlesResult,
    magazinesResult,
    leadershipResult,
    pressReleasesResult,
    magazineProfilesResult,
  ] = await Promise.allSettled([
      supabase
        .from("articles")
        .select("id, slug, category, date, updated_at, created_at, image_url")
        .order("date", { ascending: false }),
      supabase
        .from("magazines")
        .select("slug, publish_date, updated_at, created_at, cover_image_url")
        .order("publish_date", { ascending: false }),
      supabase
        .from("leadership_profiles")
        .select("slug, updated_at, created_at, image_url, home_sections")
        .order("name", { ascending: true }),
      supabase
        .from("press_releases")
        .select("slug, date, updated_at, created_at, image_url")
        .order("date", { ascending: false }),
      supabase
        .from("magazine_articles")
        .select(
          "article_id, featured, page_number, articles(slug, date, updated_at, created_at, image_url), magazines(featured_article_id)"
        )
        .eq("featured", true)
        .eq("page_number", 1),
    ]);

  const getRows = async (result, label) => {
    if (result.status === "rejected") {
      throw new Error(`Failed to fetch ${label}: ${result.reason}`);
    }

    if (result.value.error) {
      throw new Error(`Failed to fetch ${label}: ${result.value.error.message}`);
    }

    return result.value.data || [];
  };

  try {
    const articles = await getRows(articlesResult, "articles");
    const magazines = await getRows(magazinesResult, "magazines");
    const leadershipProfiles = await getRows(leadershipResult, "leadership profiles");
    const pressReleases = await getRows(pressReleasesResult, "press releases");
    const magazineProfileRelations = await getRows(
      magazineProfilesResult,
      "magazine profiles"
    );

    const magazineProfileArticleIds = new Set(
      magazineProfileRelations.map((relation) => relation.article_id)
    );

    const articleEntries = articles
      .filter(
        (article) =>
          article.slug && !magazineProfileArticleIds.has(article.id)
      )
      .map((article) => ({
        path: `/article/${article.slug}`,
        lastModified: pickLatestLastMod(article.updated_at, article.date, article.created_at),
        imageUrls: normalizeStorageUrl(article.image_url)
          ? [normalizeStorageUrl(article.image_url)]
          : undefined,
      }));

    const magazineEntries = magazines
      .filter((magazine) => magazine.slug)
      .map((magazine) => ({
        path: `/magazine/${magazine.slug}`,
        lastModified: pickLatestLastMod(
          magazine.updated_at,
          magazine.publish_date,
          magazine.created_at
        ),
        imageUrls: normalizeStorageUrl(magazine.cover_image_url)
          ? [normalizeStorageUrl(magazine.cover_image_url)]
          : undefined,
      }));

    const leadershipEntries = leadershipProfiles
      .filter(
        (profile) =>
          profile.slug && !profile.home_sections?.includes("magazine_profile")
      )
      .map((profile) => ({
        path: `/leadership/${profile.slug}`,
        lastModified: pickLatestLastMod(profile.updated_at, profile.created_at),
        imageUrls: normalizeStorageUrl(profile.image_url)
          ? [normalizeStorageUrl(profile.image_url)]
          : undefined,
      }));

    const articleMagazineProfileEntries = Array.from(
      new Map(
        magazineProfileRelations
          .filter((relation) => relation.articles?.slug)
          .map((relation) => [relation.article_id, relation])
      ).values()
    ).map((relation) => ({
      path: `/magazine-profile/${relation.articles.slug}`,
      lastModified: pickLatestLastMod(
        relation.articles.updated_at,
        relation.articles.date,
        relation.articles.created_at
      ),
      imageUrls: normalizeStorageUrl(relation.articles.image_url)
        ? [normalizeStorageUrl(relation.articles.image_url)]
        : undefined,
    }));

    const leadershipMagazineProfileEntries = leadershipProfiles
      .filter(
        (profile) =>
          profile.slug && profile.home_sections?.includes("magazine_profile")
      )
      .map((profile) => ({
        path: `/magazine-profile/${profile.slug}`,
        lastModified: pickLatestLastMod(profile.updated_at, profile.created_at),
        imageUrls: normalizeStorageUrl(profile.image_url)
          ? [normalizeStorageUrl(profile.image_url)]
          : undefined,
      }));

    const pressReleaseEntries = pressReleases
      .filter((release) => release.slug)
      .map((release) => ({
        path: `/press-releases/${release.slug}`,
        lastModified: pickLatestLastMod(release.updated_at, release.date, release.created_at),
        imageUrls: normalizeStorageUrl(release.image_url)
          ? [normalizeStorageUrl(release.image_url)]
          : undefined,
      }));

    const categoryEntriesMap = new Map();
    for (const article of articles) {
      if (!article.category) continue;
      const categorySlug = slugify(article.category);
      if (!categorySlug) continue;
      const candidateLastMod = pickLatestLastMod(article.updated_at, article.date, article.created_at);
      categoryEntriesMap.set(
        categorySlug,
        pickLatestLastMod(categoryEntriesMap.get(categorySlug), candidateLastMod)
      );
    }

    const categoryEntries = Array.from(categoryEntriesMap.entries()).map(
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
      ...articles
        .filter((article) => isIndustryNewsCategory(article.category))
        .map((article) => pickLatestLastMod(article.updated_at, article.date, article.created_at))
    );

    const staticEntries = [
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

    const entries = Array.from(
      new Map(
        [
          ...staticEntries,
          ...categoryEntries,
          ...articleEntries,
          ...magazineEntries,
          ...leadershipEntries,
          ...articleMagazineProfileEntries,
          ...leadershipMagazineProfileEntries,
          ...pressReleaseEntries,
        ].map((entry) => [entry.path, entry])
      ).values()
    );

    const xml = buildSitemapXml(entries);
    await fs.writeFile(publicSitemapPath, xml, "utf8");
    await fs.writeFile(sitemapSnapshotPath, xml, "utf8");
    console.log(`Generated public/sitemap.xml with ${entries.length} URLs.`);
  } catch (error) {
    const usedFallback = await copyFallbackSitemap(error.message || "dynamic sitemap generation failed");
    if (usedFallback) return;
    throw error;
  }
};

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});
