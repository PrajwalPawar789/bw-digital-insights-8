
import { useState } from "react";
import { Route, Routes, Link, useLocation, Navigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Book, 
  User, 
  FileCode, 
  LogOut, 
  Menu,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ArticleManager from "@/components/admin/ArticleManager";
import MagazineManager from "@/components/admin/MagazineManager";
import LeaderManager from "@/components/admin/LeaderManager";
import DocumentationManager from "@/components/admin/DocumentationManager";
import SettingsManager from "@/components/admin/SettingsManager";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Mock authentication check
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Articles", path: "/admin/articles", icon: FileText },
    { name: "Magazines", path: "/admin/magazines", icon: Book },
    { name: "Leadership", path: "/admin/leadership", icon: User },
    { name: "Documentation", path: "/admin/docs", icon: FileCode },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/admin" && location.pathname === "/admin") {
      return true;
    }
    return location.pathname.startsWith(path) && path !== "/admin";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">BW Digital</span>
            <span className="text-sm text-gray-500">Admin</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <Separator />
        <div className="py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium",
                  isActive(item.path)
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-0 w-full border-t p-4">
          <Button
            variant="outline"
            className="flex w-full items-center justify-start space-x-2"
            onClick={() => setIsAuthenticated(false)}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className={cn("md:hidden", sidebarOpen && "hidden")}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold">Admin Dashboard</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/" target="_blank">View Site</Link>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/articles/*" element={<ArticleManager />} />
            <Route path="/magazines/*" element={<MagazineManager />} />
            <Route path="/leadership/*" element={<LeaderManager />} />
            <Route path="/docs/*" element={<DocumentationManager />} />
            <Route path="/settings/*" element={<SettingsManager />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/admin/articles" className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-blue-100 p-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-medium">Articles</p>
              <p className="text-sm text-gray-500">Manage your articles</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/magazines" className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-green-100 p-3">
              <Book className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-medium">Magazines</p>
              <p className="text-sm text-gray-500">Manage your magazines</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/leadership" className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-purple-100 p-3">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-medium">Leadership</p>
              <p className="text-sm text-gray-500">Manage leader profiles</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/docs" className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-amber-100 p-3">
              <FileCode className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-lg font-medium">Documentation</p>
              <p className="text-sm text-gray-500">Manage API docs</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
