import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toCurrentStorageUrl } from "@/lib/storageUrl";

export interface LinkedinPost {
  id: string;
  body: string;
  image_url: string | null;
  likes: number;
  href: string | null;
  embed_url: string | null;
  display_order: number;
}

// Coerce any LinkedIn input into a working /embed/feed/update/urn:li:activity:<id> URL.
// Accepts:
//   - a full embed URL                 -> returned as-is (full iframe HTML is also extracted)
//   - a post URL with activity-<id>    -> wrapped in the urn:li:activity template
//   - a urn:li:share / urn:li:ugcPost  -> respected, since LinkedIn's "Embed this post"
//                                         sometimes gives one of those types
//   - a bare activity id (digits only) -> wrapped in the urn:li:activity template
// Returns null if nothing matches.
export const toLinkedinEmbedUrl = (input: string | null | undefined): string | null => {
  if (!input) return null;
  const v = input.trim();
  if (!v) return null;

  // If they pasted the full <iframe> snippet, extract the src.
  const srcMatch = v.match(/src=["']([^"']+)["']/);
  if (srcMatch) return srcMatch[1];

  if (v.startsWith("https://www.linkedin.com/embed/")) return v;

  // Respect an explicit URN if present (share / ugcPost / activity)
  const urn = v.match(/urn:li:(share|ugcPost|activity):(\d{10,})/i);
  if (urn) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:${urn[1]}:${urn[2]}`;
  }

  const activity = v.match(/activity[-:](\d{10,})/i)?.[1];
  if (activity) return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activity}`;
  if (/^\d{10,}$/.test(v)) return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${v}`;
  return null;
};

export const useLinkedinPosts = () => {
  return useQuery<LinkedinPost[]>({
    queryKey: ["linkedin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("linkedin_posts")
        .select("id, body, image_url, likes, href, embed_url, display_order")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data || []).map((p) => ({
        id: p.id,
        body: p.body,
        image_url: toCurrentStorageUrl(p.image_url),
        likes: typeof p.likes === "number" ? p.likes : 0,
        href: p.href,
        embed_url: toLinkedinEmbedUrl(p.embed_url),
        display_order: p.display_order,
      }));
    },
    placeholderData: [],
    staleTime: 5 * 60 * 1000,
  });
};
