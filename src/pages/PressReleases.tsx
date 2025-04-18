
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { pressReleaseData } from '../data/pressReleaseData';
import { ArrowRight, Newspaper, Calendar, Tag, Share2, Eye } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const PressReleases = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Get all unique categories
  const categories = ['all', ...Array.from(new Set(pressReleaseData.map(pr => pr.category)))];
  
  // Filter press releases by category
  const filteredPressReleases = selectedCategory === 'all'
    ? pressReleaseData
    : pressReleaseData.filter(pr => pr.category === selectedCategory);
  
  // Get featured (first 3) press releases
  const featuredPressReleases = pressReleaseData.slice(0, 3);

  const handleShare = (title: string) => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: `Share "${title}" with your network`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section with Animation */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-insightBlack mb-4 relative inline-block group">
            Press Releases
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-insightRed transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
          </h1>
          <p className="max-w-3xl mx-auto text-gray-600 text-lg md:text-xl leading-relaxed">
            Stay up-to-date with the latest announcements, partnerships, and innovations from InsightsBW.
          </p>
        </div>

        {/* Featured Carousel */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-insightBlack mb-6 flex items-center">
            <Newspaper className="mr-2 h-6 w-6 text-insightRed" /> 
            <span className="relative">
              Featured Announcements
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-insightRed"></span>
            </span>
          </h2>
          <Carousel className="w-full">
            <CarouselContent>
              {featuredPressReleases.map((pressRelease) => (
                <CarouselItem key={pressRelease.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                    <div className="h-48 overflow-hidden relative group">
                      <img
                        src={pressRelease.image}
                        alt={pressRelease.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-0 right-0 m-3">
                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-insightRed text-white rounded-full">
                          {pressRelease.category}
                        </span>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <Calendar className="h-4 w-4 mr-1" /> {pressRelease.date}
                      </div>
                      <CardTitle className="text-xl hover:text-insightRed transition-colors line-clamp-2">
                        {pressRelease.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-gray-600 line-clamp-2">{pressRelease.excerpt}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <Link
                        to={`/press-releases/${pressRelease.id}`}
                        className="text-insightRed hover:text-insightBlack text-sm font-medium transition-colors flex items-center group"
                      >
                        Read More 
                        <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(pressRelease.title)}
                        className="text-gray-500 hover:text-insightRed"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="!-left-5" />
              <CarouselNext className="!-right-5" />
            </div>
          </Carousel>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <span className="font-medium text-gray-700 flex items-center mr-2">
            <Tag className="h-4 w-4 mr-1" /> Filter by:
          </span>
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={`${
                selectedCategory === category
                  ? "bg-insightRed hover:bg-insightRed/90 transform hover:scale-105"
                  : "hover:bg-gray-100"
              } transition-all duration-300`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Press Release List */}
        <div className="space-y-8">
          {filteredPressReleases.map((pressRelease) => (
            <div 
              key={pressRelease.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48 md:h-auto overflow-hidden relative group">
                  <img
                    src={pressRelease.image}
                    alt={pressRelease.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex flex-col h-full">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-insightRed text-white rounded-full">
                          {pressRelease.category}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" /> {pressRelease.date}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-insightBlack mb-3 hover:text-insightRed transition-colors">
                        {pressRelease.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">{pressRelease.excerpt}</p>
                    </div>
                    <div className="mt-auto flex justify-between items-center">
                      <Link
                        to={`/press-releases/${pressRelease.id}`}
                        className="inline-flex items-center text-insightRed hover:text-insightBlack text-sm font-medium transition-colors group"
                      >
                        Read More 
                        <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(pressRelease.title)}
                          className="text-gray-500 hover:text-insightRed"
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        <span className="flex items-center text-sm text-gray-500">
                          <Eye className="h-4 w-4 mr-1" />
                          {Math.floor(Math.random() * 1000) + 100} views
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredPressReleases.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No press releases found in this category.</p>
              <Button 
                onClick={() => setSelectedCategory('all')}
                variant="outline"
                className="mt-3"
              >
                Show All
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PressReleases;
