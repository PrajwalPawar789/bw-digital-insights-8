import { useEffect, useState, type FormEvent } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import Seo from "@/components/seo/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminLogin = () => {
  const { isAdmin, isLoading, signIn } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTarget =
    typeof location.state?.from === "string" && location.state.from.startsWith("/admin")
      ? location.state.from
      : "/admin";

  useEffect(() => {
    if (!isLoading && isAdmin) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isAdmin, isLoading, navigate, redirectTarget]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await signIn(identifier, password);
      navigate(redirectTarget, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Seo title="Admin Login" noindex />
      <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.28),transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(2,6,23,0.98))]" />

        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] items-center justify-center">
          <div className="grid w-full gap-8">
            <Card className="mx-auto w-full max-w-md border-white/15 bg-white/95 shadow-2xl backdrop-blur">
              <CardHeader className="space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <LockKeyhole className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-3xl">Admin login</CardTitle>
                  <CardDescription>Sign in to access the dashboard.</CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="admin-identifier">Username</Label>
                    <Input
                      id="admin-identifier"
                      autoComplete="username"
                      disabled={isSubmitting || isLoading}
                      onChange={(event) => setIdentifier(event.target.value)}
                      placeholder="admin"
                      type="text"
                      value={identifier}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      autoComplete="current-password"
                      disabled={isSubmitting || isLoading}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      type="password"
                      value={password}
                    />
                  </div>

                  {errorMessage ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {errorMessage}
                    </div>
                  ) : null}

                  <Button className="w-full" disabled={isSubmitting || isLoading} type="submit">
                    {isSubmitting || isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>

                  <Button asChild className="w-full" variant="outline">
                    <Link to="/">Back to website</Link>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
