
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useLeadershipProfiles = () => {
  return useQuery({
    queryKey: ["leadership"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leadership_profiles")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });
};

export const useFeaturedLeadership = () => {
  return useQuery({
    queryKey: ["leadership", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leadership_profiles")
        .select("*")
        .eq("featured", true)
        .order("name")
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });
};

export const useLeadershipBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["leadership", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leadership_profiles")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};

export const useCreateLeadership = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profile: any) => {
      const { data, error } = await supabase
        .from("leadership_profiles")
        .insert([profile])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadership"] });
      toast.success("Leadership profile created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create leadership profile");
      console.error(error);
    },
  });
};

export const useUpdateLeadership = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from("leadership_profiles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadership"] });
      toast.success("Leadership profile updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update leadership profile");
      console.error(error);
    },
  });
};

export const useDeleteLeadership = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("leadership_profiles")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadership"] });
      toast.success("Leadership profile deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete leadership profile");
      console.error(error);
    },
  });
};
