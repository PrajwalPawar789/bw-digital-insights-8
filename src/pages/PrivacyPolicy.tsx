import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Seo from "@/components/seo/Seo";
import { buildBreadcrumbSchema, getSiteOrigin } from "@/lib/seo";
import { useCompanyName } from "@/hooks/useDatabaseSettings";

const PrivacyPolicy = () => {
  const companyName = useCompanyName();
  const siteOrigin = getSiteOrigin();
  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: "Privacy Policy", url: `${siteOrigin}/privacy-policy` },
      ])
    : undefined;

  return (
    <>
      <Seo
        title="Privacy Policy"
        description={`How ${companyName} collects, uses, and protects your data.`}
        schema={breadcrumbSchema ? [breadcrumbSchema] : undefined}
      />
      <div className="min-h-screen bg-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-insightBlack via-gray-900 to-insightRed py-20 text-white">
          <div className="absolute inset-0 bg-pattern opacity-10" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-white/10 text-white border-white/20">Trust & Transparency</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-lg text-white/85">
                We respect your privacy and design every experience to be secure, clear, and under your control.
                This policy explains what we collect and why.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/75">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Last updated: January 26, 2026</span>
                <span className="inline-flex items-center gap-2"><Lock className="h-4 w-4" /> Security-first practices</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Transparent collection",
                description: "We only collect what we need to deliver content, support, and analytics you accept.",
                icon: <Eye className="h-6 w-6 text-insightRed" />,
              },
              {
                title: "You stay in control",
                description: "Update preferences, unsubscribe, or request data removal at any time.",
                icon: <UserCheck className="h-6 w-6 text-insightRed" />,
              },
              {
                title: "Security baked in",
                description: "Encryption, access controls, and routine audits keep information protected.",
                icon: <Lock className="h-6 w-6 text-insightRed" />,
              },
            ].map((item) => (
              <Card key={item.title} className="border border-gray-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-insightBlack mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
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
                  <h2 className="text-2xl font-bold text-insightBlack mb-3">Information we collect</h2>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-3">
                      <Database className="h-5 w-5 text-insightRed mt-1" />
                      Contact details and subscription preferences you provide when signing up.
                    </li>
                    <li className="flex items-start gap-3">
                      <Database className="h-5 w-5 text-insightRed mt-1" />
                      Usage data such as pages viewed or time spent, when analytics cookies are accepted.
                    </li>
                    <li className="flex items-start gap-3">
                      <Database className="h-5 w-5 text-insightRed mt-1" />
                      Device and browser information for security, compatibility, and performance.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-insightBlack mb-3">How we use your data</h2>
                  <div className="grid gap-4 md:grid-cols-2 text-gray-600 text-sm">
                    <div className="rounded-lg border border-gray-200 p-4">
                      Deliver newsletters, premium access, and requested services.
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4">
                      Improve content strategy and editorial experiences.
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4">
                      Maintain platform security, fraud prevention, and auditing.
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4">
                      Respond to inquiries and provide support.
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-insightBlack mb-3">Sharing and retention</h2>
                  <p className="text-gray-600 mb-4">
                    We never sell your personal information. We share data with trusted service providers only
                    when required to deliver our services (such as email distribution or analytics).
                  </p>
                  <p className="text-gray-600">
                    We retain data only as long as necessary for business or legal needs, then delete or anonymize it.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border border-gray-200 bg-insightBlack text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Your rights</h3>
                  <ul className="space-y-2 text-sm text-white/85">
                    <li>Access, update, or delete your personal information.</li>
                    <li>Withdraw consent for non-essential cookies at any time.</li>
                    <li>Request a copy of the data we hold about you.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-insightBlack mb-2">Questions about privacy?</h3>
                  <p className="text-gray-600 mb-4">
                    Contact our privacy team and we will respond within two business days.
                  </p>
                  <Link to="/contact">
                    <Button className="bg-insightRed text-white hover:bg-insightRed/90">
                      <Mail className="mr-2 h-4 w-4" /> Contact support
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PrivacyPolicy;
