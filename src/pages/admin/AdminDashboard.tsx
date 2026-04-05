import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Users, FileText, BookOpen, Megaphone, BarChart3, Loader2, LogOut } from 'lucide-react';
import ArticleManager from '@/components/admin/ArticleManager';
import MagazineManager from '@/components/admin/MagazineManager';
import LeaderManager from '@/components/admin/LeaderManager';
import DocumentationManager from '@/components/admin/DocumentationManager';
import SettingsManager from '@/components/admin/SettingsManager';
import PressReleaseManager from '@/components/admin/PressReleaseManager';
import TestimonialManager from '@/components/admin/TestimonialManager';
import ClientLogosManager from "@/pages/admin/ClientLogosManager";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import Seo from "@/components/seo/Seo";

const AdminDashboard = () => {
  const { data: stats } = useDashboardStats();
  const { session, signOut } = useAdminAuth();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <>
      <Seo title="Admin Dashboard" noindex />
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-insightBlack">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your content and website settings</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                Signed in as{" "}
                <span className="font-medium text-insightBlack">{session?.user.email || "Admin user"}</span>
              </div>
              <Button disabled={isSigningOut} onClick={handleSignOut} type="button" variant="outline">
                {isSigningOut ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing out
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </>
                )}
              </Button>
            </div>
          </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.articles || 0}</div>
              <p className="text-xs text-muted-foreground">
                Published articles
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Magazines</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.magazines || 0}</div>
              <p className="text-xs text-muted-foreground">
                Published magazines
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leadership Profiles</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.leadership || 0}</div>
              <p className="text-xs text-muted-foreground">
                Featured leaders
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Press Releases</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pressReleases || 0}</div>
              <p className="text-xs text-muted-foreground">
                Published releases
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="magazines" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Magazines
            </TabsTrigger>
            <TabsTrigger value="leadership" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Leadership
            </TabsTrigger>
            <TabsTrigger value="press-releases" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Press Releases
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Testimonials
            </TabsTrigger>
            <TabsTrigger value="client-logos" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Client Logos
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Docs
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            <ArticleManager />
          </TabsContent>

          <TabsContent value="magazines" className="space-y-6">
            <MagazineManager />
          </TabsContent>

          <TabsContent value="leadership" className="space-y-6">
            <LeaderManager />
          </TabsContent>

          <TabsContent value="press-releases" className="space-y-6">
            <PressReleaseManager />
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-6">
            <TestimonialManager />
          </TabsContent>

          <TabsContent value="client-logos" className="space-y-6">
            <ClientLogosManager />
          </TabsContent>

          <TabsContent value="documentation" className="space-y-6">
            <DocumentationManager />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsManager />
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
