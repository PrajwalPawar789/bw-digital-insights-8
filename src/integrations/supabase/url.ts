const SUPABASE_URL_ENV = (import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_DEV_PROXY_PATH = "/supabase";
const SUPABASE_PROD_PROXY_PATH = "/supabase-proxy.php";
const FORCE_DIRECT_SUPABASE =
  String(import.meta.env.VITE_SUPABASE_USE_DIRECT || "").toLowerCase() === "true";

const isLocalHostname = (hostname: string) => {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "[::1]";
};

export const getSupabaseBaseUrl = (): string => {
  if (typeof window === "undefined") {
    return SUPABASE_URL_ENV;
  }

  // Emergency escape hatch: allow direct Supabase URL when explicitly requested.
  if (FORCE_DIRECT_SUPABASE) {
    return SUPABASE_URL_ENV;
  }

  if (import.meta.env.DEV || isLocalHostname(window.location.hostname)) {
    return `${window.location.origin}${SUPABASE_DEV_PROXY_PATH}`;
  }

  // Production uses the PHP proxy path directly to avoid depending on rewrite rules.
  return `${window.location.origin}${SUPABASE_PROD_PROXY_PATH}`;
};

export const getSupabasePublicStoragePrefix = (): string => {
  const baseUrl = getSupabaseBaseUrl();
  return baseUrl ? `${baseUrl}/storage/v1/object/public/` : "";
};
