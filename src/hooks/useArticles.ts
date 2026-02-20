
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { toCurrentStorageUrl } from "@/lib/storageUrl";

const normalizeArticleImageUrl = (article: any) => ({
  ...article,
  image_url: toCurrentStorageUrl(article?.image_url),
});

export const useArticles = () => {
  return useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("date", { ascending: false });
      
      if (error) throw error;
      return (data || []).map(normalizeArticleImageUrl);
    },
  });
};

export const useFeaturedArticles = () => {
  return useQuery({
    queryKey: ["articles", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("featured", true)
        .order("date", { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return (data || []).map(normalizeArticleImageUrl);
    },
  });
};

export const useArticleBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["articles", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      return normalizeArticleImageUrl(data);
    },
    enabled: !!slug,
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (article: any) => {
      const { data, error } = await supabase
        .from("articles")
        .insert([article])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Article created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create article");
      console.error(error);
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from("articles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Article updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update article");
      console.error(error);
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Article deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete article");
      console.error(error);
    },
  });
};
