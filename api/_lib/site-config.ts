const DEFAULT_SITE_URL = "https://theciovision.com";

const normalizeOrigin = (value?: string | null) => {
  if (!value) {
    return "";
  }

  try {
    const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    return new URL(normalized).origin.replace(/\/$/, "");
  } catch {
    return "";
  }
};

const normalizeHost = (value?: string | null) =>
  (value || "").trim().toLowerCase().replace(/^www\./, "");

export const getCanonicalSiteUrl = () =>
  normalizeOrigin(process.env.SITE_URL || process.env.VITE_SITE_URL) || DEFAULT_SITE_URL;

export const isIndexableHost = (hostname: string) => {
  const canonicalHost = normalizeHost(new URL(getCanonicalSiteUrl()).hostname);
  return normalizeHost(hostname) === canonicalHost;
};

export const getSupabaseUrl = () =>
  normalizeOrigin(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);

export const getSupabaseAnonKey = () =>
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "";
