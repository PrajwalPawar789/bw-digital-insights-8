
import { useState } from 'react';
import { useIndustryNews } from '@/hooks/useIndustryNews';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Calendar, ExternalLink, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const IndustryNews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const { data: newsData = [], isLoading } = useIndustryNews();

  const industries = ['all', ...Array.from(new Set(newsData.map(news => news.industry)))];

  const filteredNews = newsData.filter(news => {
    const matchesSearch = searchTerm === '' || 
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = selectedIndustry === 'all' || news.industry === selectedIndustry;
    
    return matchesSearch && matchesIndustry;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-insightRed" />
          <span className="text-lg">Loading industry news...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-insightBlack to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Industry News & Analysis</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stay informed with the latest developments and insights across key business sectors
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search news articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="md:w-48">
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry === 'all' ? 'All Industries' : industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredNews.map((news) => (
            <Card key={news.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={news.image_url}
                  alt={news.title}
                  className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                />
                <Badge className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-700">
                  {news.industry}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg group-hover:text-insightRed transition-colors line-clamp-2">
                  {news.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {news.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{news.source}</span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {news.date}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-insightRed group-hover:text-white group-hover:border-insightRed"
                  asChild
                >
                  <a href={`#news-${news.slug}`}>
                    Read Full Analysis
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <Card className="p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No news found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or browse all news.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedIndustry('all');
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link to="/">
            <Button size="lg" variant="outline" className="px-8 py-3">
              Back to Home
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IndustryNews;
