import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toCurrentStorageUrl } from "@/lib/storageUrl";
import { isIndustryNewsCategory } from "@/lib/articleCategories";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  industry: string;
  date: string;
  source: string;
  image_url?: string | null;
  slug: string;
}

const mapArticleToNewsItem = (article: any): NewsItem => ({
  id: article.id,
  title: article.title,
  excerpt: article.excerpt || "",
  industry: article.category,
  date: article.date,
  source: article.author,
  image_url: toCurrentStorageUrl(article.image_url),
  slug: article.slug,
});

const fetchIndustryNews = async () => {
  const { data, error } = await supabase
    .from("articles")
    .select("id, title, excerpt, category, date, author, image_url, slug")
    .order("date", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || [])
    .filter((article) => isIndustryNewsCategory(article.category))
    .map(mapArticleToNewsItem);
};

export const useIndustryNews = () => {
  return useQuery({
    queryKey: ["industry-news"],
    queryFn: fetchIndustryNews,
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedNews = () => {
  return useQuery({
    queryKey: ["featured-news"],
    queryFn: async () => {
      const newsItems = await fetchIndustryNews();
      return newsItems.slice(0, 3);
    },
    staleTime: 5 * 60 * 1000,
  });
};
