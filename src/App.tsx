import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Magazine from "@/pages/Magazine";
import MagazineDetail from "@/pages/MagazineDetail";
import Articles from "@/pages/Articles";
import Leadership from "@/pages/Leadership";
import LeadershipProfile from "@/pages/LeadershipProfile";
import PressReleases from "@/pages/PressReleases";
import PressReleaseDetail from "@/pages/PressReleaseDetail";
import ArticleDetail from "@/pages/ArticleDetail";
import CategoryPage from "@/pages/CategoryPage";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import Documentation from "@/pages/Documentation";
import IndustryNews from "@/pages/IndustryNews";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AnalyticsInjector from "@/components/AnalyticsInjector";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AnalyticsInjector />
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/magazine" element={<Magazine />} />
                <Route path="/magazine/:slug" element={<MagazineDetail />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/industry-news" element={<IndustryNews />} />
                <Route path="/leadership" element={<Leadership />} />
                <Route path="/leadership/:slug" element={<LeadershipProfile />} />
                <Route path="/press-releases" element={<PressReleases />} />
                <Route path="/press-releases/:slug" element={<PressReleaseDetail />} />
                <Route path="/article/:slug" element={<ArticleDetail />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;