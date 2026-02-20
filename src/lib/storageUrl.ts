const CURRENT_SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const CURRENT_PUBLIC_STORAGE_PREFIX = CURRENT_SUPABASE_URL
  ? `${CURRENT_SUPABASE_URL}/storage/v1/object/public/`
  : "";

/**
 * Rewrites any Supabase public storage URL to the currently configured project URL.
 * Useful when migrated records still contain URLs from an old project ref.
 */
export const toCurrentStorageUrl = (url?: string | null): string | null => {
  if (!url) return null;
  if (!CURRENT_PUBLIC_STORAGE_PREFIX) return url;

  const value = url.trim();
  const match = value.match(
    /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/(.+)$/i
  );

  if (!match) return value;
  return `${CURRENT_PUBLIC_STORAGE_PREFIX}${match[1]}`;
};

export const buildCurrentPublicStorageUrl = (bucket: string, objectPath: string): string => {
  if (!CURRENT_PUBLIC_STORAGE_PREFIX) return "";
  const normalizedPath = objectPath.replace(/^\/+/, "");
  return `${CURRENT_PUBLIC_STORAGE_PREFIX}${bucket}/${normalizedPath}`;
};
