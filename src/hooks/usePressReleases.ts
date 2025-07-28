
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useFeaturedPressReleases = () => {
  return useQuery({
    queryKey: ['press-releases', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('press_releases')
        .select('*')
        .eq('featured', true)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};
