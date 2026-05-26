import { getSupabasePublicStoragePrefix } from "@/integrations/supabase/url";

const CURRENT_PUBLIC_STORAGE_PREFIX = getSupabasePublicStoragePrefix();

/**
 * Rewrites any Supabase public storage URL to the currently configured project URL.
 * Handles records migrated from an old project ref as well as ones saved against a
 * developer's localhost proxy (which happens when the admin upload fell back to the
 * proxied client — see useImageUpload.ts).
 */
export const toCurrentStorageUrl = (url?: string | null): string | null => {
  if (!url) return null;
  if (!CURRENT_PUBLIC_STORAGE_PREFIX) return url;

  const value = url.trim();

  const supabaseMatch = value.match(
    /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/(.+)$/i
  );
  if (supabaseMatch) return `${CURRENT_PUBLIC_STORAGE_PREFIX}${supabaseMatch[1]}`;

  const localhostMatch = value.match(
    /^https?:\/\/(?:localhost|127\.0\.0\.1|\[?::1\]?)(?::\d+)?\/(?:supabase|supabase-proxy\.php)\/storage\/v1\/object\/public\/(.+)$/i
  );
  if (localhostMatch) return `${CURRENT_PUBLIC_STORAGE_PREFIX}${localhostMatch[1]}`;

  return value;
};

export const buildCurrentPublicStorageUrl = (bucket: string, objectPath: string): string => {
  if (!CURRENT_PUBLIC_STORAGE_PREFIX) return "";
  const normalizedPath = objectPath.replace(/^\/+/, "");
  return `${CURRENT_PUBLIC_STORAGE_PREFIX}${bucket}/${normalizedPath}`;
};
