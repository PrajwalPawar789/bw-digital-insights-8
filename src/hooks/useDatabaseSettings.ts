
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDatabaseSettings = () => {
  return useQuery({
    queryKey: ["database-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*");
      
      if (error) throw error;
      
      // Convert array to object for easier access
      const settingsObj = data.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>);
      
      return settingsObj;
    },
  });
};

export const useUpdateSetting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { data, error } = await supabase
        .from("settings")
        .upsert({ key, value }, { onConflict: 'key' })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["database-settings"] });
      toast.success("Settings updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update settings");
      console.error(error);
    },
  });
};
