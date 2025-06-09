
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
  breakingNewsEnabled: boolean;
  breakingNewsTitle: string;
  breakingNewsSubtitle: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: "Insights Business Magazine",
  companyName: "Insights Business Magazine",
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
  breakingNewsEnabled: true,
  breakingNewsTitle: "Breaking Business News",
  breakingNewsSubtitle: "Latest updates from the business world"
};

export const useSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const { data: dbSettings, isLoading: dbLoading } = useDatabaseSettings();

  useEffect(() => {
    if (dbSettings) {
      const updatedSettings = {
        ...DEFAULT_SETTINGS,
        companyName: dbSettings.company_name || DEFAULT_SETTINGS.companyName,
        breakingNewsEnabled: dbSettings.breaking_news_enabled === 'true',
        breakingNewsTitle: dbSettings.breaking_news_title || DEFAULT_SETTINGS.breakingNewsTitle,
        breakingNewsSubtitle: dbSettings.breaking_news_subtitle || DEFAULT_SETTINGS.breakingNewsSubtitle,
      };
      setSettings(updatedSettings);
    }
  }, [dbSettings]);

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('siteSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
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
    loading: loading || dbLoading,
    saveSettings,
    updateHomepageSection,
    resetSettings,
    loadSettings
  };
};
