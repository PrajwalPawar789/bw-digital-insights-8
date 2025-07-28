
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DatabaseSetting {
  id: string;
  key: string;
  value: string | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useDatabaseSettings = () => {
  return useQuery({
    queryKey: ['database-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*');
      
      if (error) {
        console.error('Error fetching settings:', error);
        throw error;
      }
      
      // Convert array to object for easier access
      const settingsObject: Record<string, string> = {};
      data?.forEach((setting: DatabaseSetting) => {
        if (setting.value) {
          settingsObject[setting.key] = setting.value;
        }
      });
      
      return settingsObject;
    },
  });
};

export const useCompanyName = () => {
  const { data: settings } = useDatabaseSettings();
  return settings?.company_name || 'Insights Business Magazine';
};
