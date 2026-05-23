import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toCurrentStorageUrl } from "@/lib/storageUrl";

export interface CaseStudy {
  id: string;
  title: string;
  image_url: string | null;
  display_order: number;
}

export const useCaseStudies = () => {
  return useQuery<CaseStudy[]>({
    queryKey: ["case-studies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_studies")
        .select("id, title, image_url, display_order")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data || []).map((c) => ({
        id: c.id,
        title: c.title,
        image_url: toCurrentStorageUrl(c.image_url),
        display_order: c.display_order,
      }));
    },
    // Defensive: never undefined
    initialData: [],
    staleTime: 5 * 60 * 1000,
  });
};
