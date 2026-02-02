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
        // Log a readable error and rethrow a standard Error so callers get a useful message
        try {
          console.error('Error fetching settings:', JSON.stringify(error));
        } catch (e) {
          console.error('Error fetching settings:', error);
        }
        throw new Error(error?.message || JSON.stringify(error) || 'Unknown error fetching settings');
      }

      // Convert array to object for easier access
      const settingsObject: Record<string, string | null> = {};
      data?.forEach((setting: DatabaseSetting) => {
        if (setting && typeof setting.key === 'string') {
          settingsObject[setting.key] = setting.value ?? null;
        }
      });

      return settingsObject;
    },
  });
};

export const useCompanyName = () => {
  const { data: settings } = useDatabaseSettings();
  return settings?.company_name || 'The CIO Vision';
};
