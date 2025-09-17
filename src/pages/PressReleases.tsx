import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EditorialList from "@/components/articles/EditorialList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Megaphone } from "lucide-react";
import { pressReleaseData } from "@/data/pressReleaseData";

// Legacy mock removed. Normalizing real data for the editorial list
const pressReleases = pressReleaseData.map(pr => ({
  ...pr,
  image_url: pr.image
}));
const categoriesFromData = Array.from(new Set(pressReleases.map(r => r.category)));
const allCategories = ["All", ...categoriesFromData];

const PressReleases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = allCategories;

  const filteredReleases = useMemo(() => pressReleases.filter(release => {
    const matchesSearch = release.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         release.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || release.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }), [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen">
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-6">
            <Megaphone className="h-8 w-8 text-insightRed" />
            <h1 className="text-3xl md:text-4xl font-bold text-insightBlack">Press Releases</h1>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search press releases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-insightRed hover:bg-red-700" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <EditorialList
            articles={filteredReleases}
            basePath="/press-releases"
          />
        </div>
      </section>
    </div>
  );
};

export default PressReleases;
