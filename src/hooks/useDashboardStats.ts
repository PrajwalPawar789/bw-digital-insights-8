import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      // Get articles count
      const { count: articlesCount } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true });

      // Get magazines count
      const { count: magazinesCount } = await supabase
        .from("magazines")
        .select("*", { count: "exact", head: true });

      // Get leadership profiles count
      const { count: leadershipCount } = await supabase
        .from("leadership_profiles")
        .select("*", { count: "exact", head: true });

      // Get press releases count
      const { count: pressReleasesCount } = await supabase
        .from("press_releases")
        .select("*", { count: "exact", head: true });

      return {
        articles: articlesCount || 0,
        magazines: magazinesCount || 0,
        leadership: leadershipCount || 0,
        pressReleases: pressReleasesCount || 0,
      };
    },
  });
};