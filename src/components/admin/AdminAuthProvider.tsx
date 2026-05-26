import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

type AdminAuthContextValue = {
  isAdmin: boolean;
  isLoading: boolean;
  session: Session | null;
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

const SAMPLE_ADMIN_EMAIL = "admin@theciovision.local";

const normalizeAdminEmail = (identifier: string) => {
  const normalized = identifier.trim().toLowerCase();

  if (!normalized.includes("@")) {
    return normalized === "admin" ? SAMPLE_ADMIN_EMAIL : `${normalized}@theciovision.local`;
  }

  return normalized;
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const evaluateAdminAccess = async (nextSession: Session | null, purgeUnauthorized: boolean) => {
    setSession(nextSession);

    if (!nextSession) {
      setIsAdmin(false);
      return false;
    }

    const { data, error } = await supabase.rpc("is_admin");

    if (error) {
      console.error("Failed to verify admin access:", error);
      setIsAdmin(false);
      return false;
    }

    const hasAdminAccess = data === true;
    setIsAdmin(hasAdminAccess);

    if (!hasAdminAccess && purgeUnauthorized) {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error("Failed to sign out unauthorized session:", signOutError);
      }
      setSession(null);
      setIsAdmin(false);
    }

    return hasAdminAccess;
  };

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      setIsLoading(true);

      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Failed to load current session:", error);
          if (isMounted) {
            setSession(null);
            setIsAdmin(false);
          }
          return;
        }

        if (!isMounted) return;
        await evaluateAdminAccess(currentSession, true);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!isMounted) return;

      // Token refreshes (including the ones Supabase fires when the tab regains
      // focus) don't change admin status — just keep the session reference fresh
      // so we don't unmount the admin tree mid-edit.
      if (event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        setSession(nextSession);
        return;
      }

      // For SIGNED_IN / SIGNED_OUT, update state in the background without
      // flipping isLoading — that would unmount RequireAdminAuth's children
      // (open dialogs, form state) on every visibility change.
      void evaluateAdminAccess(nextSession, event !== "SIGNED_OUT");
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (identifier: string, password: string) => {
    setIsLoading(true);

    try {
      const normalizedEmail = normalizeAdminEmail(identifier);
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        throw error;
      }

      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      const hasAdminAccess = await evaluateAdminAccess(currentSession, true);
      if (!hasAdminAccess) {
        throw new Error("This account does not have admin access.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }

      setSession(null);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdmin,
        isLoading,
        session,
        signIn,
        signOut,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider.");
  }

  return context;
};
