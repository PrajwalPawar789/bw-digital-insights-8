
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUpdateDatabaseSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string | null }) => {
      const { data, error } = await supabase
        .from('settings')
        .upsert(
          { key, value },
          { onConflict: 'key' }
        )
        .select()
        .single();
      
      if (error) {
        console.error('Error updating setting:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['database-settings'] });
      toast.success("Settings updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update settings");
      console.error('Update settings error:', error);
    },
  });
};
