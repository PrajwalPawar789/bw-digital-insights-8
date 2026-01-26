import { Link } from "react-router-dom";
import { Megaphone, BarChart3, Mail, Layers, Globe2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Seo from "@/components/seo/Seo";
import { buildBreadcrumbSchema, getSiteOrigin } from "@/lib/seo";
import { useCompanyName } from "@/hooks/useDatabaseSettings";

const Advertise = () => {
  const companyName = useCompanyName();
  const siteOrigin = getSiteOrigin();
  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: "Advertise", url: `${siteOrigin}/advertise` },
      ])
    : undefined;

  return (
    <>
      <Seo
        title="Advertise"
        description={`Advertising solutions from ${companyName} for executive audiences.`}
        schema={breadcrumbSchema ? [breadcrumbSchema] : undefined}
      />
      <div className="min-h-screen bg-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-insightBlack via-gray-900 to-red-700 py-20 text-white">
          <div className="absolute inset-0 bg-pattern opacity-10" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Badge className="mb-4 bg-white/10 text-white border-white/20">Premium media</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Advertise with {companyName}</h1>
            <p className="text-lg text-white/85 max-w-3xl">
              Reach decision-makers through premium placements, sponsored features, and high-impact campaigns.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/75">
              <span className="inline-flex items-center gap-2"><Megaphone className="h-4 w-4" /> Brand-safe leadership media</span>
              <span className="inline-flex items-center gap-2"><Globe2 className="h-4 w-4" /> Global executive reach</span>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Display & takeovers",
                description: "High-visibility homepage and section placements for brand awareness.",
                icon: <Layers className="h-6 w-6 text-insightRed" />,
              },
              {
                title: "Sponsored features",
                description: "Editorially led stories that align your brand with thought leadership.",
                icon: <Sparkles className="h-6 w-6 text-insightRed" />,
              },
              {
                title: "Newsletter spotlights",
                description: "Reach subscribers with curated placements in executive newsletters.",
                icon: <BarChart3 className="h-6 w-6 text-insightRed" />,
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
                  <h2 className="text-2xl font-bold text-insightBlack mb-3">Why advertisers choose us</h2>
                  <ul className="space-y-3 text-gray-600">
                    <li>Executive readership focused on technology, finance, and strategy.</li>
                    <li>Curated editorial context to elevate brand trust.</li>
                    <li>Cross-channel amplification across web, magazine, and email.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-insightBlack mb-3">Campaign flow</h2>
                  <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-600">
                    <div className="rounded-lg border border-gray-200 p-4">Strategy alignment and targeting plan.</div>
                    <div className="rounded-lg border border-gray-200 p-4">Creative review with editorial standards.</div>
                    <div className="rounded-lg border border-gray-200 p-4">Launch across agreed placements.</div>
                    <div className="rounded-lg border border-gray-200 p-4">Performance reporting and insights.</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border border-gray-200 bg-insightBlack text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Request the media kit</h3>
                  <p className="text-sm text-white/85 mb-4">
                    Get audience insights, format options, and timelines tailored to your campaign goals.
                  </p>
                  <Link to="/contact">
                    <Button className="bg-insightRed text-white hover:bg-insightRed/90">
                      <Mail className="mr-2 h-4 w-4" /> Contact advertising
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-insightBlack mb-2">Performance standards</h3>
                  <p className="text-sm text-gray-600">
                    We monitor placement quality and engagement to ensure campaigns deliver meaningful impact.
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

export default Advertise;
