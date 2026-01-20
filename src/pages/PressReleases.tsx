import { useEffect, useMemo, useState } from "react";
import EditorialList from "@/components/articles/EditorialList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Megaphone } from "lucide-react";
import { pressReleaseData } from "@/data/pressReleaseData";
import Seo from "@/components/seo/Seo";
import { buildBreadcrumbSchema, getSiteOrigin } from "@/lib/seo";

// Legacy mock removed. Normalizing real data for the editorial list
const pressReleases = pressReleaseData.map(pr => ({
  ...pr,
  image_url: pr.image
}));
const categoriesFromData = Array.from(new Set(pressReleases.map(r => r.category)));
const allCategories = ["All", ...categoriesFromData];

const PAGE_SIZE = 9;

const PressReleases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const siteOrigin = getSiteOrigin();
  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: "Press Releases", url: `${siteOrigin}/press-releases` },
      ])
    : undefined;

  const categories = allCategories;

  const filteredReleases = useMemo(() => pressReleases.filter(release => {
    const matchesSearch = release.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         release.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || release.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }), [searchTerm, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredReleases.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredReleases.slice(start, start + PAGE_SIZE);
  }, [filteredReleases, currentPage]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory]);

  return (
    <>
      <Seo
        title="Press Releases"
        description="Official announcements, company news, and media updates."
        schema={breadcrumbSchema ? [breadcrumbSchema] : undefined}
      />
      <div className="min-h-screen">
        <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col gap-4 mb-6">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search press releases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat ? "bg-insightRed hover:bg-insightRed/90 text-white" : ""}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <EditorialList
            articles={paginated}
            basePath="/press-releases"
            layout="grid"
          />

          <div className="flex items-center justify-between mt-8">
            <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              Previous
            </Button>
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <Button variant="outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default PressReleases;
