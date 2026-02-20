
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { toCurrentStorageUrl } from "@/lib/storageUrl";

const normalizeMagazineArticleImageUrl = (item: any) => ({
  ...item,
  articles: item?.articles
    ? {
        ...item.articles,
        image_url: toCurrentStorageUrl(item.articles.image_url),
      }
    : item?.articles,
});

export const useMagazineArticles = (magazineId: string) => {
  return useQuery({
    queryKey: ["magazine-articles", magazineId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("magazine_articles")
        .select(`
          *,
          articles:article_id (
            id,
            title,
            excerpt,
            author,
            image_url,
            slug,
            category
          )
        `)
        .eq("magazine_id", magazineId)
        .order("page_number", { ascending: true });
      
      if (error) throw error;
      return (data || []).map(normalizeMagazineArticleImageUrl);
    },
    enabled: !!magazineId,
  });
};

export const useCreateMagazineArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (magazineArticle: any) => {
      const { data, error } = await supabase
        .from("magazine_articles")
        .insert([magazineArticle])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["magazine-articles"] });
      toast.success("Article added to magazine successfully");
    },
    onError: (error) => {
      toast.error("Failed to add article to magazine");
      console.error(error);
    },
  });
};

export const useDeleteMagazineArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("magazine_articles")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["magazine-articles"] });
      toast.success("Article removed from magazine");
    },
    onError: (error) => {
      toast.error("Failed to remove article from magazine");
      console.error(error);
    },
  });
};
