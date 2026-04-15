import { getCanonicalSiteUrl, isIndexableHost } from "./_lib/site-config";

const buildRobotsBody = (allowIndexing: boolean, siteUrl: string) => {
  if (!allowIndexing) {
    return ["User-agent: *", "Disallow: /"].join("\n");
  }

  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /admin/",
    "Disallow: /search",
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ].join("\n");
};

export default {
  async fetch(request: Request) {
    const requestUrl = new URL(request.url);
    const siteUrl = getCanonicalSiteUrl();
    const body = buildRobotsBody(isIndexableHost(requestUrl.hostname), siteUrl);

    return new Response(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  },
};
