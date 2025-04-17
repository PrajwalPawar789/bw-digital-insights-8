import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Magazine from "./pages/Magazine";
import MagazineDetail from "./pages/MagazineDetail";
import Leadership from "./pages/Leadership";
import PressReleases from "./pages/PressReleases";
import PressReleaseDetail from "./pages/PressReleaseDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/magazine" element={<Magazine />} />
            <Route path="/magazine/:id" element={<MagazineDetail />} />
            <Route path="/leadership" element={<Leadership />} />
            <Route path="/press-releases" element={<PressReleases />} />
            <Route path="/press-releases/:id" element={<PressReleaseDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
