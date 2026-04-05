import { Loader2, ShieldAlert } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAdminAuth } from "@/components/admin/AdminAuthProvider";

const AdminAccessLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
    <div className="flex max-w-md flex-col items-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
        <ShieldAlert className="h-7 w-7" />
      </div>
      <div className="space-y-2">
        <p className="text-lg font-semibold">Checking admin session</p>
        <p className="text-sm text-slate-300">
          Verifying whether this browser has an active administrator login.
        </p>
      </div>
      <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
    </div>
  </div>
);

const RequireAdminAuth = () => {
  const { isAdmin, isLoading } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return <AdminAccessLoader />;
  }

  if (!isAdmin) {
    const redirectTarget = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/admin/login" replace state={{ from: redirectTarget }} />;
  }

  return <Outlet />;
};

export default RequireAdminAuth;
