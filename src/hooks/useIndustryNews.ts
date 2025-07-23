
import { useQuery } from '@tanstack/react-query';

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

// Mock data for industry news
const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'AI Transformation Drives 40% Revenue Growth in Fortune 500 Companies',
    excerpt: 'New research reveals how artificial intelligence implementations are reshaping business operations and driving unprecedented revenue growth across major corporations.',
    industry: 'Technology',
    date: '2025-01-15',
    source: 'Tech Business Weekly',
    image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
    slug: 'ai-transformation-revenue-growth-fortune-500'
  },
  {
    id: '2',
    title: 'Sustainable Finance Reaches $35 Trillion Globally as ESG Investing Accelerates',
    excerpt: 'Environmental, Social, and Governance (ESG) investing continues its explosive growth, with institutional investors leading the charge toward sustainable financial practices.',
    industry: 'Finance',
    date: '2025-01-14',
    source: 'Financial Leadership Today',
    image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    slug: 'sustainable-finance-esg-investing-growth'
  },
  {
    id: '3',
    title: 'Healthcare Innovation: Telehealth Market Projected to Hit $659 Billion by 2030',
    excerpt: 'Digital health solutions and remote care technologies are revolutionizing patient care delivery, creating massive market opportunities for healthcare innovators.',
    industry: 'Healthcare',
    date: '2025-01-13',
    source: 'Healthcare Business Review',
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
    slug: 'telehealth-market-growth-digital-health'
  },
  {
    id: '4',
    title: 'Supply Chain Resilience: Companies Invest $2.4 Trillion in Diversification Strategies',
    excerpt: 'Global supply chain disruptions drive unprecedented investment in resilience strategies, with companies restructuring operations for greater flexibility and security.',
    industry: 'Manufacturing',
    date: '2025-01-12',
    source: 'Supply Chain Executive',
    image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
    slug: 'supply-chain-resilience-diversification-investment'
  }
];

export const useIndustryNews = () => {
  return useQuery({
    queryKey: ['industry-news'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockNewsData;
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
      return mockNewsData.slice(0, 3);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
