
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { toCurrentStorageUrl } from "@/lib/storageUrl";

const normalizeMagazineUrls = (magazine: any) => ({
  ...magazine,
  cover_image_url: toCurrentStorageUrl(magazine?.cover_image_url),
  pdf_url: toCurrentStorageUrl(magazine?.pdf_url),
});

export const useMagazines = () => {
  return useQuery({
    queryKey: ["magazines"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("magazines")
        .select("*")
        .order("publish_date", { ascending: false });
      
      if (error) throw error;
      return (data || []).map(normalizeMagazineUrls);
    },
  });
};

export const useFeaturedMagazines = () => {
  return useQuery({
    queryKey: ["magazines", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("magazines")
        .select("*")
        .eq("featured", true)
        .order("publish_date", { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return (data || []).map(normalizeMagazineUrls);
    },
  });
};

export const useMagazineBySlug = (slug: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["magazines", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("magazines")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      return normalizeMagazineUrls(data);
    },
    enabled: !!slug && (options?.enabled !== false),
  });
};

export const useMagazineById = (id: string) => {
  return useQuery({
    queryKey: ["magazines", "by-id", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("magazines")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return normalizeMagazineUrls(data);
    },
    enabled: !!id,
  });
};

export const useCreateMagazine = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (magazine: any) => {
      const { data, error } = await supabase
        .from("magazines")
        .insert([magazine])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["magazines"] });
      toast.success("Magazine created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create magazine");
      console.error(error);
    },
  });
};

export const useUpdateMagazine = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from("magazines")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["magazines"] });
      if (data?.slug) {
        queryClient.invalidateQueries({ queryKey: ["magazines", data.slug] });
      }
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ["magazines", "by-id", data.id] });
      }
      toast.success("Magazine updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update magazine");
      console.error(error);
    },
  });
};

export const useDeleteMagazine = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("magazines")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["magazines"] });
      toast.success("Magazine deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete magazine");
      console.error(error);
    },
  });
};
