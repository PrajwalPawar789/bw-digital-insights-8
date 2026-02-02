
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useSettings } from "@/hooks/useSettings";
import { useUpdateDatabaseSettings } from "@/hooks/useUpdateDatabaseSettings";
import { useDatabaseSettings } from "@/hooks/useDatabaseSettings";
import { useArticles } from "@/hooks/useArticles";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Upload, X, Save } from "lucide-react";
import React from "react";

const SettingsManager = () => {
  const { settings, loading, saveSettings, updateHomepageSection, resetSettings } = useSettings();
  const { data: dbSettings } = useDatabaseSettings();
  const { data: articles = [], isLoading: articlesLoading } = useArticles();
  const { mutate: updateDbSetting, isPending: updatingDbSetting } = useUpdateDatabaseSettings();
  const { uploadImage, uploading } = useImageUpload();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [tempCompanyName, setTempCompanyName] = useState("");
  const [companyNameChanged, setCompanyNameChanged] = useState(false);
  const [tempAnalyticsCode, setTempAnalyticsCode] = useState("");
  const [analyticsCodeChanged, setAnalyticsCodeChanged] = useState(false);

  // Initialize temp company name when dbSettings loads
  React.useEffect(() => {
    if (dbSettings?.company_name && !companyNameChanged) {
      setTempCompanyName(dbSettings.company_name);
    }
  }, [dbSettings?.company_name, companyNameChanged]);

  React.useEffect(() => {
    if (settings.analyticsCode && !analyticsCodeChanged) {
      setTempAnalyticsCode(settings.analyticsCode);
    }
  }, [settings.analyticsCode, analyticsCodeChanged]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewLogo(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = async () => {
    let logoUrl = settings.siteLogo;

    // Upload logo if new file is selected
    if (logoFile) {
      try {
        logoUrl = await uploadImage(logoFile, "logos");
      } catch (error) {
        console.error("Failed to upload logo:", error);
        return;
      }
    }

    // Save all settings
    const success = await saveSettings({
      siteLogo: logoUrl,
    });

    if (success) {
      setLogoFile(null);
      setPreviewLogo(null);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setPreviewLogo(null);
    saveSettings({ siteLogo: null });
  };

  const handleSiteTitleChange = (value: string) => {
    saveSettings({ siteTitle: value });
  };

  const handleCompanyNameInputChange = (value: string) => {
    setTempCompanyName(value);
    setCompanyNameChanged(true);
  };

  const handleSaveCompanyName = () => {
    updateDbSetting({ key: 'company_name', value: tempCompanyName }, {
      onSuccess: () => {
        setCompanyNameChanged(false);
        toast.success("Company name updated successfully");
      },
      onError: () => {
        setTempCompanyName(dbSettings?.company_name || "");
        setCompanyNameChanged(false);
      }
    });
  };

  const handlePrimaryColorChange = (value: string) => {
    saveSettings({ primaryColor: value });
  };

  const handleAnalyticsCodeInputChange = (value: string) => {
    setTempAnalyticsCode(value);
    setAnalyticsCodeChanged(true);
  };

  const handleSaveAnalyticsCode = async () => {
    const success = await saveSettings({ analyticsCode: tempAnalyticsCode });
    if (success) {
      setAnalyticsCodeChanged(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Site Identity */}
      <Card>
        <CardHeader>
          <CardTitle>Site Identity</CardTitle>
          <CardDescription>
            Configure your site's basic information and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="site-title">Site Title</Label>
            <Input
              id="site-title"
              value={settings.siteTitle}
              onChange={(e) => handleSiteTitleChange(e.target.value)}
              placeholder="Enter site title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <div className="flex gap-2">
              <Input
                id="company-name"
                value={tempCompanyName}
                onChange={(e) => handleCompanyNameInputChange(e.target.value)}
                placeholder="Enter company name"
                disabled={updatingDbSetting}
              />
              <Button 
                onClick={handleSaveCompanyName}
                disabled={updatingDbSetting || !companyNameChanged}
                size="sm"
              >
                {updatingDbSetting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
            </div>
            {updatingDbSetting && (
              <p className="text-sm text-muted-foreground">Updating...</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-logo">Site Logo</Label>
            <div className="flex items-center space-x-4">
              {(previewLogo || settings.siteLogo) && (
                <div className="relative">
                  <img
                    src={previewLogo || settings.siteLogo || ''}
                    alt="Site logo"
                    className="h-16 w-16 object-contain border rounded"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={handleRemoveLogo}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <div className="flex-1">
                <Input
                  id="site-logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primary-color">Primary Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="primary-color"
                type="color"
                value={settings.primaryColor}
                onChange={(e) => handlePrimaryColorChange(e.target.value)}
                className="w-16 h-10"
              />
              <Input
                value={settings.primaryColor}
                onChange={(e) => handlePrimaryColorChange(e.target.value)}
                placeholder="#000000"
              />
            </div>
          </div>

          {(logoFile || previewLogo) && (
            <Button 
              onClick={handleSaveSettings} 
              disabled={uploading || loading}
              className="w-full"
            >
              {uploading || loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Homepage Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Homepage Sections</CardTitle>
          <CardDescription>
            Control which sections appear on your homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero-main-article">Hero Main Feature</Label>
            <Select
              value={settings.heroMainArticleId || "auto"}
              onValueChange={(value) =>
                updateDbSetting({ key: "hero_main_article_id", value: value === "auto" ? null : value })
              }
              disabled={articlesLoading || updatingDbSetting}
            >
              <SelectTrigger id="hero-main-article">
                <SelectValue placeholder="Select main feature (auto)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (latest Editor's Pick)</SelectItem>
                {Array.isArray(articles) && articles.map((article: any) => (
                  <SelectItem key={article.id} value={article.id}>
                    {article.title || "Untitled"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose a specific article to show in the homepage hero main feature.
            </p>
            {updatingDbSetting && (
              <p className="text-sm text-muted-foreground">Updating...</p>
            )}
          </div>

          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="featured-articles">Featured Articles</Label>
              <p className="text-sm text-muted-foreground">
                Show featured articles section on homepage
              </p>
            </div>
            <Switch
              id="featured-articles"
              checked={settings.homepageSections.featuredArticles}
              onCheckedChange={(checked) => updateHomepageSection('featuredArticles', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="latest-magazine">Latest Magazine</Label>
              <p className="text-sm text-muted-foreground">
                Show latest magazine section on homepage
              </p>
            </div>
            <Switch
              id="latest-magazine"
              checked={settings.homepageSections.latestMagazine}
              onCheckedChange={(checked) => updateHomepageSection('latestMagazine', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="leadership-profiles">Leadership Profiles</Label>
              <p className="text-sm text-muted-foreground">
                Show leadership profiles section on homepage
              </p>
            </div>
            <Switch
              id="leadership-profiles"
              checked={settings.homepageSections.leadershipProfiles}
              onCheckedChange={(checked) => updateHomepageSection('leadershipProfiles', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="press-releases">Press Releases</Label>
              <p className="text-sm text-muted-foreground">
                Show press releases section on homepage
              </p>
            </div>
            <Switch
              id="press-releases"
              checked={settings.homepageSections.pressReleases}
              onCheckedChange={(checked) => updateHomepageSection('pressReleases', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>
            Add tracking codes for analytics and other services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="analytics-code">Google Analytics Code</Label>
            <div className="flex items-center gap-2">
              <Input
                id="analytics-code"
                value={tempAnalyticsCode}
                onChange={(e) => handleAnalyticsCodeInputChange(e.target.value)}
                placeholder="GA-XXXXXXXXX-X"
                disabled={loading}
              />
              <Button
                onClick={handleSaveAnalyticsCode}
                disabled={loading || !analyticsCodeChanged}
                size="sm"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={resetSettings}>
            Reset All Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsManager;
