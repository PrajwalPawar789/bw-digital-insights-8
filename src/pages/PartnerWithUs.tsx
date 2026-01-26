import { Link } from "react-router-dom";
import { Handshake, Globe, Sparkles, Target, ArrowRight, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Seo from "@/components/seo/Seo";
import { buildBreadcrumbSchema, getSiteOrigin } from "@/lib/seo";
import { useCompanyName } from "@/hooks/useDatabaseSettings";

const PartnerWithUs = () => {
  const companyName = useCompanyName();
  const siteOrigin = getSiteOrigin();
  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: "Partner With Us", url: `${siteOrigin}/partner-with-us` },
      ])
    : undefined;

  return (
    <>
      <Seo
        title="Partner With Us"
        description={`Strategic partnerships with ${companyName} to reach executive audiences.`}
        schema={breadcrumbSchema ? [breadcrumbSchema] : undefined}
      />
      <div className="min-h-screen bg-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-insightBlack via-gray-900 to-insightRed py-20 text-white">
          <div className="absolute inset-0 bg-pattern opacity-10" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Badge className="mb-4 bg-white/10 text-white border-white/20">Strategic growth</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Partner With {companyName}</h1>
            <p className="text-lg text-white/85 max-w-3xl">
              Build influence with decision-makers through premium content, research collaborations, and executive events.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/75">
              <span className="inline-flex items-center gap-2"><Handshake className="h-4 w-4" /> Co-create thought leadership</span>
              <span className="inline-flex items-center gap-2"><Globe className="h-4 w-4" /> Global executive reach</span>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Executive storytelling",
                description: "Spotlight your leaders with interviews, cover features, and editorial series.",
                icon: <Sparkles className="h-6 w-6 text-insightRed" />,
              },
              {
                title: "Research partnerships",
                description: "Launch surveys, whitepapers, and custom insights with our editorial team.",
                icon: <Target className="h-6 w-6 text-insightRed" />,
              },
              {
                title: "Event activations",
                description: "Sponsor roundtables, virtual summits, and leadership forums.",
                icon: <Globe className="h-6 w-6 text-insightRed" />,
              },
            ].map((item) => (
              <Card key={item.title} className="border border-gray-200 bg-white shadow-sm">
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
                  <h2 className="text-2xl font-bold text-insightBlack mb-3">What partners receive</h2>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-3">
                      <ArrowRight className="h-5 w-5 text-insightRed mt-1" />
                      Dedicated editorial strategy and premium storytelling formats.
                    </li>
                    <li className="flex items-start gap-3">
                      <ArrowRight className="h-5 w-5 text-insightRed mt-1" />
                      Multi-channel distribution across magazine, web, and newsletters.
                    </li>
                    <li className="flex items-start gap-3">
                      <ArrowRight className="h-5 w-5 text-insightRed mt-1" />
                      Executive audience engagement insights and performance reporting.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-insightBlack mb-3">How it works</h2>
                  <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-600">
                    <div className="rounded-lg border border-gray-200 p-4">Discovery call and objectives alignment.</div>
                    <div className="rounded-lg border border-gray-200 p-4">Joint planning with our editorial team.</div>
                    <div className="rounded-lg border border-gray-200 p-4">Content development and approval workflow.</div>
                    <div className="rounded-lg border border-gray-200 p-4">Launch, amplification, and reporting.</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border border-gray-200 bg-insightBlack text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Let us build your partnership plan</h3>
                  <p className="text-sm text-white/85 mb-4">
                    Share your goals and we will craft a tailored program to reach executives who matter most.
                  </p>
                  <Link to="/contact">
                    <Button className="bg-insightRed text-white hover:bg-insightRed/90">
                      <Mail className="mr-2 h-4 w-4" /> Start a partnership
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-insightBlack mb-2">Brand safety promise</h3>
                  <p className="text-sm text-gray-600">
                    Every collaboration is curated and aligned with our editorial integrity standards.
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

export default PartnerWithUs;
