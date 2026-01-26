import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie, ShieldCheck, BarChart3, Target, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Seo from "@/components/seo/Seo";
import { buildBreadcrumbSchema, getSiteOrigin } from "@/lib/seo";
import { useCompanyName } from "@/hooks/useDatabaseSettings";

const CONSENT_KEY = "cookie-consent";

type ConsentState = "accepted" | "rejected" | null;

const CookiePolicy = () => {
  const companyName = useCompanyName();
  const siteOrigin = getSiteOrigin();
  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: "Cookie Policy", url: `${siteOrigin}/cookie-policy` },
      ])
    : undefined;

  const [preference, setPreference] = useState<ConsentState>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (stored === "accepted" || stored === "rejected") {
      setPreference(stored);
    } else {
      setPreference(null);
    }
  }, []);

  const updatePreference = (value: Exclude<ConsentState, null>) => {
    window.localStorage.setItem(CONSENT_KEY, value);
    setPreference(value);
    window.dispatchEvent(new Event("cookie-consent"));
  };

  const preferenceLabel = preference === "accepted" ? "Accepted" : preference === "rejected" ? "Rejected" : "Not set";

  return (
    <>
      <Seo
        title="Cookie Policy"
        description={`Learn how ${companyName} uses cookies and how you can control preferences.`}
        schema={breadcrumbSchema ? [breadcrumbSchema] : undefined}
      />
      <div className="min-h-screen bg-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-insightBlack via-gray-900 to-gray-800 py-20 text-white">
          <div className="absolute inset-0 bg-pattern opacity-10" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Badge className="mb-4 bg-white/10 text-white border-white/20">Your choice matters</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-lg text-white/85 max-w-3xl">
              Cookies help us keep {companyName} secure, functional, and focused on what matters to you.
              You control whether optional analytics cookies are enabled.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/75">
              <span className="inline-flex items-center gap-2"><Cookie className="h-4 w-4" /> Essentials always on</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Updated January 26, 2026</span>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Essential",
                description: "Required for security, preferences, and core platform functions.",
                icon: <ShieldCheck className="h-6 w-6 text-insightRed" />,
              },
              {
                title: "Analytics",
                description: "Optional measurement cookies to improve content and site performance.",
                icon: <BarChart3 className="h-6 w-6 text-insightRed" />,
              },
              {
                title: "Personalization",
                description: "Helps tailor experiences, recommendations, and navigation flow.",
                icon: <Target className="h-6 w-6 text-insightRed" />,
              },
            ].map((item) => (
              <Card key={item.title} className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-insightBlack mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-insightBlack mb-3">How we use cookies</h2>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-3">
                      <Cookie className="h-5 w-5 text-insightRed mt-1" />
                      Maintain secure sessions and protect against fraud.
                    </li>
                    <li className="flex items-start gap-3">
                      <Cookie className="h-5 w-5 text-insightRed mt-1" />
                      Remember your language, theme, and content preferences.
                    </li>
                    <li className="flex items-start gap-3">
                      <Cookie className="h-5 w-5 text-insightRed mt-1" />
                      Measure engagement when analytics consent is granted.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-insightBlack mb-3">Manage your preferences</h2>
                  <p className="text-gray-600 mb-4">
                    Your current preference: <span className="font-semibold text-insightBlack">{preferenceLabel}</span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:text-insightBlack"
                      onClick={() => updatePreference("rejected")}
                    >
                      Reject non-essential
                    </Button>
                    <Button
                      className="bg-insightRed text-white hover:bg-insightRed/90"
                      onClick={() => updatePreference("accepted")}
                    >
                      Accept all
                    </Button>
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    You can also clear cookies directly in your browser settings.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border border-gray-200 bg-insightBlack text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Need help?</h3>
                  <p className="text-sm text-white/85">
                    If you have questions about cookies, consent, or data practices, our team is ready to help.
                  </p>
                  <Link to="/contact" className="mt-4 inline-flex">
                    <Button className="bg-insightRed text-white hover:bg-insightRed/90">
                      <Mail className="mr-2 h-4 w-4" /> Contact privacy team
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-insightBlack mb-2">Browser controls</h3>
                  <p className="text-gray-600 text-sm">
                    You can block or delete cookies through your browser settings. Blocking essential cookies may
                    impact site functionality.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CookiePolicy;
