import { Link } from "react-router-dom";
import { FileText, ShieldCheck, AlertTriangle, Scale, PenTool, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Seo from "@/components/seo/Seo";
import { buildBreadcrumbSchema, getSiteOrigin } from "@/lib/seo";
import { useCompanyName } from "@/hooks/useDatabaseSettings";

const TermsOfService = () => {
  const companyName = useCompanyName();
  const siteOrigin = getSiteOrigin();
  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: "Terms of Service", url: `${siteOrigin}/terms-of-service` },
      ])
    : undefined;

  return (
    <>
      <Seo
        title="Terms of Service"
        description={`The terms that govern your use of ${companyName} products and services.`}
        schema={breadcrumbSchema ? [breadcrumbSchema] : undefined}
      />
      <div className="min-h-screen bg-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-insightBlack to-insightRed py-20 text-white">
          <div className="absolute inset-0 bg-pattern opacity-10" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Badge className="mb-4 bg-white/10 text-white border-white/20">Clear & Fair</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-lg text-white/85 max-w-3xl">
              These terms explain how you can use {companyName} content and services. By accessing our
              platform, you agree to the guidelines below.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/75">
              <span className="inline-flex items-center gap-2"><FileText className="h-4 w-4" /> Effective: January 26, 2026</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Designed for trust</span>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Respectful use",
                description: "Use our platform responsibly and avoid actions that harm users or operations.",
                icon: <ShieldCheck className="h-6 w-6 text-insightRed" />,
              },
              {
                title: "Intellectual property",
                description: "Our articles, designs, and branding are protected and require permission to reuse.",
                icon: <PenTool className="h-6 w-6 text-insightRed" />,
              },
              {
                title: "Fair access",
                description: "We may suspend access for violations or misuse that disrupts the service.",
                icon: <AlertTriangle className="h-6 w-6 text-insightRed" />,
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-insightBlack mb-3">Using our content</h2>
                  <p className="text-gray-600 mb-4">
                    You may access and share our content for personal or internal business purposes. Republishing,
                    redistributing, or reselling content requires written permission.
                  </p>
                  <p className="text-gray-600">
                    Account holders are responsible for safeguarding login credentials and ensuring authorized use.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-insightBlack mb-3">Acceptable use</h2>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-insightRed mt-1" />
                      Do not attempt to access restricted areas, scrape content, or disrupt site operations.
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-insightRed mt-1" />
                      Do not upload or transmit malicious code or harmful material.
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-insightRed mt-1" />
                      Do not misrepresent your affiliation with {companyName}.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-insightBlack mb-3">Disclaimers & limitation of liability</h2>
                  <p className="text-gray-600">
                    We provide content for informational purposes only and do not guarantee accuracy or completeness.
                    To the extent permitted by law, {companyName} is not liable for indirect damages arising from use
                    of the platform.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border border-gray-200 bg-insightBlack text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Governing principles</h3>
                  <div className="space-y-3 text-sm text-white/85">
                    <div className="flex items-start gap-3">
                      <Scale className="h-5 w-5 text-insightRed mt-1" />
                      Terms may be updated with notice, and continued use means acceptance.
                    </div>
                    <div className="flex items-start gap-3">
                      <Scale className="h-5 w-5 text-insightRed mt-1" />
                      We may suspend access to protect users, partners, or the platform.
                    </div>
                    <div className="flex items-start gap-3">
                      <Scale className="h-5 w-5 text-insightRed mt-1" />
                      Any disputes are handled through good-faith resolution before legal action.
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-insightBlack mb-2">Questions about these terms?</h3>
                  <p className="text-gray-600 mb-4">
                    Reach out and we will help clarify anything you need before you proceed.
                  </p>
                  <Link to="/contact">
                    <Button className="bg-insightRed text-white hover:bg-insightRed/90">
                      <Mail className="mr-2 h-4 w-4" /> Contact us
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

export default TermsOfService;
