
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type PressReleasePayload = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  date: string;
  image_url: string | null;
  author: string;
  featured: boolean;
};

export const usePressReleases = () => {
  return useQuery({
    queryKey: ['press_releases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('press_releases')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw new Error(error.message);
      return data || [];
    },
  });
};

export const useCreatePressRelease = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPressRelease: Omit<PressReleasePayload, 'id'>) => {
      const { data, error } = await supabase
        .from('press_releases')
        .insert([newPressRelease])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['press_releases'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
      toast.success('Press release created successfully.');
    },
    onError: (error) => {
      toast.error(`Error creating press release: ${error.message}`);
    },
  });
};

export const useUpdatePressRelease = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pressReleaseToUpdate: PressReleasePayload) => {
      const { id, ...updateData } = pressReleaseToUpdate;
      if (!id) throw new Error("ID is required for updating");
      
      const { data, error } = await supabase
        .from('press_releases')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['press_releases'] });
      toast.success('Press release updated successfully.');
    },
    onError: (error) => {
      toast.error(`Error updating press release: ${error.message}`);
    },
  });
};

export const useDeletePressRelease = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('press_releases')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['press_releases'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
      toast.success('Press release deleted successfully.');
    },
    onError: (error) => {
      toast.error(`Error deleting press release: ${error.message}`);
    },
  });
};

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
