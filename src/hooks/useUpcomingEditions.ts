
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUpcomingEditions = () => {
  return useQuery({
    queryKey: ["upcoming_editions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("upcoming_editions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    initialData: [],
  });
};
