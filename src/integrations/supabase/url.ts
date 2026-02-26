const SUPABASE_URL_ENV = (import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_PROXY_PATH = "/supabase";
const FORCE_DIRECT_SUPABASE =
  String(import.meta.env.VITE_SUPABASE_USE_DIRECT || "").toLowerCase() === "true";

export const getSupabaseBaseUrl = (): string => {
  if (typeof window === "undefined") {
    return SUPABASE_URL_ENV;
  }

  // Emergency escape hatch: allow direct Supabase URL when explicitly requested.
  if (FORCE_DIRECT_SUPABASE) {
    return SUPABASE_URL_ENV;
  }

  // Default to same-origin proxy in browser to avoid client-side DNS/network issues.
  return `${window.location.origin}${SUPABASE_PROXY_PATH}`;
};

export const getSupabasePublicStoragePrefix = (): string => {
  const baseUrl = getSupabaseBaseUrl();
  return baseUrl ? `${baseUrl}/storage/v1/object/public/` : "";
};
