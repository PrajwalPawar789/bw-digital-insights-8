
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsData, Article as NewsItem } from '../data/newsData';
import { magazineData } from '../data/magazineData';
import { testimonialData } from '../data/testimonialsData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ChevronLeft, BookOpen, Star, Award, TrendingUp } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import ClientLogos from '@/components/ClientLogos';

// Helper accessors for different magazine field shapes
function getMagCover(magObj) {
  return magObj?.cover_image_url || magObj?.coverImage || magObj?.image || '/placeholder.svg';
}
function getMagTitle(magObj) {
  return magObj?.title || magObj?.name || 'Untitled';
}
function getMagDesc(magObj) {
  return magObj?.description || '';
}
function getMagDate(magObj) {
  return (
    magObj?.publicationDate ||
    magObj?.publish_date ||
    magObj?.releaseDate ||
    ""
  );
}
function getMagId(magObj) {
  return magObj?.slug || magObj?.id;
}

const Home = () => {
  const featuredNews = newsData.filter(news => news.isFeatured || false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const latestMagazine = magazineData[0] || {};
  const categories = ['Trending', 'Business', 'Technology'];
  const getNewsByCategory = (category: string) => {
    if (category === 'Trending') {
      return newsData
        .filter(news => news.isFeatured || new Date(news.date) > new Date('2025-02-01'))
        .slice(0, 6);
    }
    return newsData
      .filter(news => news.category === category)
      .slice(0, 6);
  };
  const featuredExecutives = testimonialData.slice(0, 3);
  const upcomingEditions = [
    {
      id: 1,
      title: "Tech Disruption 2026",
      description: "How emerging technologies are reshaping global industries and transforming business models across sectors",
      image: "https://insightscare.in/wp-content/uploads/2023/09/Indias-10-Most-Trusted-Medical-Device-Companies-to-Know-1-scaled.jpg",
      releaseDate: "January 2026",
      status: "In Production"
    },
    {
      id: 2,
      title: "Sustainable Business Leaders",
      description: "The executives pioneering environmental innovation and sustainable practices in the corporate landscape",
      image: "https://insightscare.in/wp-content/uploads/2023/09/5-Most-Empowering-Women-Leaders-in-Healthcare-2023-min-1-scaled.jpg",
      releaseDate: "March 2026",
      status: "Content Development"
    },
    {
      id: 3,
      title: "AI & Human Capital",
      description: "Exploring the balance between artificial intelligence advancement and workforce development strategies",
      image: "https://insightscare.in/wp-content/uploads/2023/09/10-Best-Companies-in-the-Nutraceutical-Market-2023-1-scaled.jpg",
      releaseDate: "May 2026",
      status: "Initial Planning"
    }
  ];

  // Carousel auto-play for top picks
  useEffect(() => {
    if (!featuredNews.length) return;
    const interval = setInterval(() => {
      setActiveSlide((prevSlide) => (prevSlide + 1) % featuredNews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredNews.length]);
  useEffect(() => {
    if (!testimonialData.length) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prevSlide) => (prevSlide + 1) % testimonialData.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setActiveSlide((prevSlide) => (prevSlide - 1 + featuredNews.length) % featuredNews.length);
  };
  const nextSlide = () => {
    setActiveSlide((prevSlide) => (prevSlide + 1) % featuredNews.length);
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-insightBlack to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-insightRed rounded-full text-sm font-medium">
                <Star className="w-4 h-4 mr-2" /> The Leading Business Magazine
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Exclusive Insights from <span className="text-insightRed">C-Suite Leaders</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300">
                Spotlighting the strategic minds behind global business success. 
                Discover exclusive interviews, success stories, and expert insights from 
                the world's top executives.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/magazine" 
                  className="inline-flex items-center px-6 py-3 bg-insightRed hover:bg-red-700 text-white rounded-md font-medium transition-colors"
                >
                  Latest Issue <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/leadership" 
                  className="inline-flex items-center px-6 py-3 border border-white/30 hover:bg-white/20 text-white rounded-md font-medium transition-colors"
                >
                  Meet The Executives <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-end">
              <div className="relative">
                <img 
                  src={getMagCover(latestMagazine)}
                  alt="Latest Magazine Cover" 
                  className="rounded-lg shadow-2xl w-80 h-auto transform rotate-6 z-10" 
                />
                {magazineData[1] && (
                  <img 
                    src={getMagCover(magazineData[1])}
                    alt="Previous Magazine Cover" 
                    className="absolute -left-10 -bottom-5 rounded-lg shadow-xl w-72 h-auto transform -rotate-6" 
                  />
                )}
                <div className="absolute -right-8 -top-8 bg-insightRed text-white rounded-full p-4 shadow-lg z-20">
                  <BookOpen className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- Cover Story -- */}
      {featuredNews[0] && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-insightBlack">Cover Story</h2>
                <p className="text-gray-600">Our most impactful feature of the month</p>
              </div>
              <Link 
                to={`/article/${featuredNews[0].slug}`} 
                className="inline-flex items-center text-insightRed hover:text-insightBlack font-medium transition-colors"
              >
                Read Full Story <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 relative h-[400px] rounded-xl overflow-hidden">
                <img 
                  src={featuredNews[0].image} 
                  alt={featuredNews[0].title}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <div className="flex items-center mb-4">
                    <span className="bg-insightRed text-white px-3 py-1 text-sm font-bold rounded-md">
                      Cover Story
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold mb-2 max-w-xl">{featuredNews[0].title}</h3>
                  <p className="text-gray-200 mb-4 max-w-xl">{featuredNews[0].excerpt}</p>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-start space-x-4">
                  <span className="text-insightRed font-bold text-5xl">01</span>
                  <div>
                    <h4 className="text-xl font-bold mb-2">The Leadership Approach That's Reshaping Industries</h4>
                    <p className="text-gray-600">Explore how today's C-level executives are implementing transformative strategies that drive unprecedented growth and innovation.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-insightRed font-bold text-5xl">02</span>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Key Insights from the Interview</h4>
                    <p className="text-gray-600">Strategic thinking, bold decision-making, and innovative approaches to market disruption defined our conversation with industry leaders.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-insightRed font-bold text-5xl">03</span>
                  <div>
                    <h4 className="text-xl font-bold mb-2">What's Next for Industry Leaders</h4>
                    <p className="text-gray-600">Examining future trends and upcoming challenges that will shape the next generation of executive leadership and business strategy.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* -- Editor's Picks Carousel -- */}
      {featuredNews.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-insightBlack">Editor's Picks</h2>
                <p className="text-gray-600">Curated content from our latest issues</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <div className="relative h-[400px] md:h-[500px]">
                {featuredNews.map((news, index) => (
                  <div
                    key={news.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === activeSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="relative h-full">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-8 text-white max-w-3xl">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="bg-insightRed text-white px-3 py-1 text-sm font-bold rounded-md">
                            {news.category}
                          </span>
                          <span className="text-sm text-gray-300">
                            {news.date}
                          </span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold mb-3">{news.title}</h3>
                        <p className="text-base md:text-lg mb-6 text-gray-200">{news.excerpt}</p>
                        <Link
                          to={`/article/${news.slug}`}
                          className="inline-flex items-center text-white bg-insightRed hover:bg-red-700 px-6 py-3 rounded-md text-base font-medium transition-colors"
                        >
                          Read Full Article <ChevronRight className="ml-2 h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white backdrop-blur-sm transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white backdrop-blur-sm transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {featuredNews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === activeSlide ? 'bg-white w-8' : 'bg-white/50 w-2'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      {/* -- Publications -- */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] opacity-5 bg-fixed"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center px-3 py-1 bg-insightRed/10 text-insightRed rounded-full text-sm font-medium mb-4">
                <BookOpen className="w-4 h-4 mr-2" /> Premium Business Publications
              </div>
              <h2 className="text-4xl font-bold text-insightBlack mb-4 relative">
                Our Exclusive C-Suite Magazine Collection
                <span className="absolute -bottom-2 left-0 w-24 h-1 bg-insightRed"></span>
              </h2>
              <p className="text-gray-600 text-lg">
                Discover in-depth interviews, strategic insights, and success stories from the world's most influential business leaders.
              </p>
            </div>
          </div>
          <Carousel
            opts={{
              align: "center",
              loop: true,
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {magazineData.map((magazine) => (
                <CarouselItem 
                  key={getMagId(magazine)} 
                  className="pl-4 basis-[280px] md:basis-[320px] lg:basis-[400px] transition-all duration-300 data-[center=true]:scale-110"
                >
                  <Link to={`/magazine/${getMagId(magazine)}`} className="block group perspective-1000">
                    <div className="relative transform transition-all duration-500 group-hover:rotate-y-6 preserve-3d">
                      <div className="overflow-hidden rounded-xl shadow-2xl bg-white">
                        <div className="relative aspect-[3/4]">
                          <img
                            src={getMagCover(magazine)}
                            alt={getMagTitle(magazine)}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-white/20 to-transparent transform scale-y-[-1] opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-sm"></div>
                          <div className="absolute top-0 right-0 m-4">
                            <span className="inline-flex items-center px-3 py-1.5 bg-white/90 backdrop-blur-sm text-insightBlack text-sm font-semibold rounded-full">
                              {getMagDate(magazine)}
                            </span>
                          </div>
                          <div className="absolute bottom-0 left-0 p-6 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <h3 className="text-xl font-bold mb-2">{getMagTitle(magazine)}</h3>
                            <p className="text-sm text-gray-200 line-clamp-2 mb-4">{getMagDesc(magazine)}</p>
                            <span className="inline-flex items-center text-sm font-medium text-white">
                              Read Issue <ChevronRight className="ml-1 h-4 w-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-12 space-x-4">
              <CarouselPrevious className="relative static bg-white hover:bg-gray-50 text-insightBlack border-insightRed shadow-lg hover:shadow-xl transition-all hover:scale-105" />
              <CarouselNext className="relative static bg-white hover:bg-gray-50 text-insightBlack border-insightRed shadow-lg hover:shadow-xl transition-all hover:scale-105" />
            </div>
          </Carousel>
        </div>
      </section>
      {/* -- Upcoming Editions -- */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center px-3 py-1 bg-insightRed/10 text-insightRed rounded-full text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4 mr-2" /> Coming Soon
            </div>
            <h2 className="text-4xl font-bold text-insightBlack mb-4">Upcoming Editions</h2>
            <p className="text-lg text-gray-600">
              A sneak peek at our future editions currently in development
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEditions.map((edition, index) => (
              <div 
                key={edition.id} 
                className="group relative overflow-hidden rounded-xl shadow-lg transform transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 z-10 group-hover:from-black/80"></div>
                <img
                  src={edition.image}
                  alt={edition.title}
                  className="w-full h-80 object-cover filter blur-[8px] scale-110 group-hover:scale-125 group-hover:blur-[12px] transition-all duration-1000"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                  <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-3 w-fit">
                    <span className="animate-pulse mr-2 h-2 w-2 bg-insightRed rounded-full"></span>
                    {edition.releaseDate}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-insightRed transition-colors">
                    {edition.title}
                  </h3>
                  <p className="text-gray-200 mb-5 line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                    {edition.description}
                  </p>
                  <div className="flex items-center text-sm font-medium border-t border-white/20 pt-3">
                    <span className="pb-0.5">In Development</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 z-30">
                  <span className="inline-flex items-center px-3 py-1 bg-insightRed/90 backdrop-blur-sm text-white text-sm font-bold rounded-full group-hover:shadow-glow animate-pulse">
                    {edition.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* -- Business Insights (Tabs) -- */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center px-3 py-1 bg-insightRed/10 text-insightRed rounded-full text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4 mr-2" /> Executive Intelligence
            </div>
            <h2 className="text-4xl font-bold text-insightBlack mb-4">Business Insights from Top Leaders</h2>
            <p className="text-lg text-gray-600">
              Expert analysis, market trends, and strategic perspectives from C-suite executives shaping the future of business.
            </p>
          </div>
          <Tabs defaultValue={categories[0]} className="w-full">
            <TabsList className="mb-8 flex justify-center bg-white/50 backdrop-blur-sm p-1 rounded-lg border border-gray-200 shadow-sm">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category} 
                  className="px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md data-[state=active]:text-insightRed transition-all"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {getNewsByCategory(category).map((news: NewsItem) => (
                    <Card key={news.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                      <div className="relative overflow-hidden aspect-video">
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-0 right-0 m-4">
                          <span className="inline-flex items-center px-3 py-1.5 bg-white/90 backdrop-blur-sm text-insightBlack text-sm font-semibold rounded-full">
                            {news.category}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-3 group-hover:text-insightRed transition-colors line-clamp-2">{news.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{news.excerpt}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{news.date}</span>
                          <Link
                            to={`/article/${news.slug}`}
                            className="inline-flex items-center text-insightRed hover:text-insightBlack text-sm font-medium transition-colors"
                          >
                            Read Full Article <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="flex justify-center mt-12">
                  <Link
                    to={`/category/${category.toLowerCase()}`}
                    className="inline-flex items-center px-8 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg font-medium transition-all hover:shadow-lg group"
                  >
                    View All {category} Articles <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
      {/* -- Prestigious Clients -- */}
      <ClientLogos />
      {/* -- Executive Spotlight -- */}
      <section className="py-16 bg-insightBlack text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center px-3 py-1 bg-insightRed rounded-full text-sm font-medium mb-2">
                <Award className="w-4 h-4 mr-2" /> Executive Spotlight
              </div>
              <h2 className="text-3xl font-bold">Featured C-Suite Leaders</h2>
              <p className="text-gray-400 mt-2">Meet the visionary executives shaping business today</p>
            </div>
            <Link 
              to="/leadership" 
              className="inline-flex items-center text-insightRed hover:text-white font-medium transition-colors"
            >
              View All Leaders <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredExecutives.map((executive) => (
              <div key={executive.id} className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors">
                <div className="flex flex-col items-center text-center">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-insightRed mb-4">
                    <img 
                      src={executive.avatar} 
                      alt={executive.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{executive.name}</h3>
                  <p className="text-insightRed font-medium mb-2">{executive.title}</p>
                  <p className="text-gray-400 mb-4 text-sm">{executive.company}</p>
                  <blockquote className="italic text-gray-300 text-sm mb-4">"{executive.quote?.substring(0, 80)}..."</blockquote>
                  <Link 
                    to={`/leadership/${executive.id}`}
                    className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm font-medium transition-colors"
                  >
                    Read Profile <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* -- Testimonials -- */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center px-3 py-1 bg-gray-200 rounded-full text-sm font-medium mb-2">
              <TrendingUp className="w-4 h-4 mr-2" /> Reader Insights
            </div>
            <h2 className="text-3xl font-bold text-insightBlack">What Industry Leaders Say</h2>
            <p className="text-gray-600 mt-2">Feedback from our community of business professionals</p>
          </div>
          <div className="relative px-8 md:px-16">
            <div className="relative overflow-hidden min-h-[300px]">
              {testimonialData.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === activeTestimonial ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 mb-6 rounded-full overflow-hidden border-2 border-insightRed">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <blockquote className="max-w-2xl mb-6 text-xl font-medium text-gray-700 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <div>
                      <cite className="font-semibold text-insightBlack text-lg not-italic">{testimonial.name}</cite>
                      <p className="text-insightRed font-medium">{testimonial.title}, {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-2 mt-8">
              {testimonialData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-3 rounded-full transition-all ${
                    index === activeTestimonial ? 'bg-insightRed w-8' : 'bg-gray-300 w-3'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* -- CTA -- */}
      <section className="py-16 bg-insightRed text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Subscribe to Our Magazine</h2>
              <p className="text-lg opacity-90 mb-6">
                Join thousands of C-level executives receiving our monthly magazine. 
                Get exclusive insights, industry analysis, and leadership strategies 
                delivered directly to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/magazine" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-insightRed hover:bg-gray-100 rounded-md font-medium transition-colors"
                >
                  Explore Latest Issue
                </Link>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-white bg-transparent hover:bg-white/10 text-white rounded-md font-medium transition-colors"
                >
                  Subscribe Now
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src={getMagCover(latestMagazine)}
                alt="Latest Magazine" 
                className="w-full max-w-md mx-auto rounded-lg shadow-2xl transform -rotate-6" 
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

