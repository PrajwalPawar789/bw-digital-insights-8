import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "cookie-consent";

type ConsentState = "accepted" | "rejected" | "unset";

const CookieConsent = () => {
  const [consent, setConsent] = useState<ConsentState>("unset");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (stored === "accepted" || stored === "rejected") {
      setConsent(stored);
      setIsVisible(false);
      return;
    }
    setConsent("unset");
    setIsVisible(true);
  }, []);

  const updateConsent = (value: Exclude<ConsentState, "unset">) => {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
    setIsVisible(false);
    window.dispatchEvent(new Event("cookie-consent"));
  };

  if (!isVisible || consent !== "unset") {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="rounded-2xl border border-gray-200 bg-white/95 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur">
          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <Cookie className="h-6 w-6 text-insightRed" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-insightBlack">We use cookies for essential site features and optional analytics.</h3>
                <p className="mt-2 max-w-2xl text-sm text-gray-600">
                  Essentials keep the site secure and working. Optional analytics help us improve content and
                  performance. You can accept all cookies or reject non-essential ones.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" /> Essentials always on
                  </span>
                  <Link to="/cookie-policy" className="font-semibold text-insightRed hover:text-insightBlack">
                    Read cookie policy
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:text-insightBlack"
                onClick={() => updateConsent("rejected")}
              >
                Reject non-essential
              </Button>
              <Button
                className="bg-insightRed text-white hover:bg-insightRed/90"
                onClick={() => updateConsent("accepted")}
              >
                Accept all
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
