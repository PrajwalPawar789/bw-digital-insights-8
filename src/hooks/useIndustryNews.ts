
import { useQuery } from '@tanstack/react-query';
import { newsData } from '@/data/newsData';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  industry: string;
  date: string;
  source: string;
  image_url?: string;
  slug: string;
}

export const useIndustryNews = () => {
  return useQuery({
    queryKey: ['industry-news'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter articles that are industry news (ids 22-25) and map to expected format
      const industryNewsArticles = newsData
        .filter(article => article.id >= 22 && article.id <= 25)
        .map(article => ({
          id: article.id.toString(),
          title: article.title,
          excerpt: article.excerpt,
          industry: article.category,
          date: article.date,
          source: article.author,
          image_url: article.image,
          slug: article.slug
        }));
      
      return industryNewsArticles;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFeaturedNews = () => {
  return useQuery({
    queryKey: ['featured-news'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter articles that are industry news (ids 22-25) and map to expected format
      const industryNewsArticles = newsData
        .filter(article => article.id >= 22 && article.id <= 25)
        .map(article => ({
          id: article.id.toString(),
          title: article.title,
          excerpt: article.excerpt,
          industry: article.category,
          date: article.date,
          source: article.author,
          image_url: article.image,
          slug: article.slug
        }));
      
      return industryNewsArticles.slice(0, 3);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
