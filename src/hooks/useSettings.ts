
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useDatabaseSettings } from './useDatabaseSettings';

interface HomepageSettings {
  featuredArticles: boolean;
  latestMagazine: boolean;
  leadershipProfiles: boolean;
  pressReleases: boolean;
  industryNews: boolean;
}

interface SiteSettings {
  siteTitle: string;
  companyName: string;
  siteLogo: string | null;
  primaryColor: string;
  analyticsCode: string;
  homepageSections: HomepageSettings;
  heroMainArticleId: string | null;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: "The CIO Vision",
  companyName: "The CIO Vision",
  siteLogo: null,
  primaryColor: "#0f172a",
  analyticsCode: "",
  homepageSections: {
    featuredArticles: true,
    latestMagazine: true,
    leadershipProfiles: true,
    pressReleases: true,
    industryNews: true,
  },
  heroMainArticleId: null,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const { data: dbSettings } = useDatabaseSettings();

  useEffect(() => {
    loadSettings();
  }, [dbSettings]);

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('siteSettings');
      let localSettings = DEFAULT_SETTINGS;
      
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        localSettings = { ...DEFAULT_SETTINGS, ...parsed };
      }
      
      // Override with database settings
      if (dbSettings) {
        localSettings = {
          ...localSettings,
          companyName: dbSettings.company_name || localSettings.companyName,
          siteTitle: dbSettings.company_name || localSettings.siteTitle,
          heroMainArticleId: dbSettings.hero_main_article_id || null,
        };
      }
      
      setSettings(localSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
      setSettings(DEFAULT_SETTINGS);
    }
  };

  const saveSettings = async (newSettings: Partial<SiteSettings>) => {
    setLoading(true);
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      localStorage.setItem('siteSettings', JSON.stringify(updatedSettings));
      toast.success("Settings saved successfully");
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("Failed to save settings");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateHomepageSection = (section: keyof HomepageSettings, enabled: boolean) => {
    const newHomepageSections = {
      ...settings.homepageSections,
      [section]: enabled
    };
    saveSettings({ homepageSections: newHomepageSections });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('siteSettings');
    toast.success("Settings reset to defaults");
  };

  return {
    settings,
    loading,
    saveSettings,
    updateHomepageSection,
    resetSettings,
    loadSettings
  };
};
