import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { toCurrentStorageUrl } from "@/lib/storageUrl";

type Magazine = Database["public"]["Tables"]["magazines"]["Row"];
type Article = Database["public"]["Tables"]["articles"]["Row"];

export type MagazineProfileIssue = {
  id: string;
  article_id: string;
  magazine_id: string;
  featured: boolean | null;
  page_number: number | null;
  magazines: Magazine;
};

export type MagazineProfileRecord = MagazineProfileIssue & {
  articles: Article;
};

export const useMagazineProfileIssue = (articleId?: string) =>
  useQuery({
    queryKey: ["magazine-profile-issue", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("magazine_articles")
        .select("id, article_id, magazine_id, featured, page_number, magazines(*)")
        .eq("article_id", articleId as string)
        .eq("featured", true)
        .eq("page_number", 1);

      if (error) throw error;

      const relationships = (data || []) as unknown as MagazineProfileIssue[];
      const relationship =
        relationships.find(
          (item) => item.magazines?.featured_article_id === articleId
        ) || relationships[0];

      if (!relationship?.magazines) return null;

      return {
        ...relationship,
        magazines: {
          ...relationship.magazines,
          cover_image_url: toCurrentStorageUrl(
            relationship.magazines.cover_image_url
          ),
          pdf_url: toCurrentStorageUrl(relationship.magazines.pdf_url),
        },
      };
    },
    enabled: Boolean(articleId),
  });

export const useMagazineProfileRecords = () =>
  useQuery({
    queryKey: ["magazine-profile-records"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("magazine_articles")
        .select(
          "id, article_id, magazine_id, featured, page_number, articles(*), magazines(*)"
        )
        .eq("featured", true)
        .eq("page_number", 1)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const rows = (data || []) as unknown as MagazineProfileRecord[];
      const byArticle = new Map<string, MagazineProfileRecord>();

      rows.forEach((row) => {
        if (!row.articles || !row.magazines) return;
        const current = byArticle.get(row.article_id);
        const isCover = row.magazines.featured_article_id === row.article_id;
        const currentIsCover =
          current?.magazines.featured_article_id === current?.article_id;

        if (!current || (isCover && !currentIsCover)) {
          byArticle.set(row.article_id, {
            ...row,
            articles: {
              ...row.articles,
              image_url: toCurrentStorageUrl(row.articles.image_url),
            },
            magazines: {
              ...row.magazines,
              cover_image_url: toCurrentStorageUrl(row.magazines.cover_image_url),
              pdf_url: toCurrentStorageUrl(row.magazines.pdf_url),
            },
          });
        }
      });

      return Array.from(byArticle.values()).sort(
        (left, right) =>
          new Date(right.articles.date).getTime() -
          new Date(left.articles.date).getTime()
      );
    },
  });
