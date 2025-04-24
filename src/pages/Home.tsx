import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsData, NewsItem } from '../data/newsData';
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

const Home = () => {
  const featuredNews = newsData.filter(news => news.isFeatured).slice(0, 10);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const latestMagazine = magazineData[0]; // Most recent magazine
  
  // Categories for the news tabs
  const categories = ['Trending', 'Business', 'Technology'];
  
  // Function to get news by category
  const getNewsByCategory = (category: string) => {
    return newsData
      .filter(news => news.category === category)
      .slice(0, 6);
  };

  // Top executives from testimonials (using them as featured executives)
  const featuredExecutives = testimonialData.slice(0, 3);

  // Carousel auto-play for top picks
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prevSlide) => (prevSlide + 1) % featuredNews.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [featuredNews.length]);
  
  // Carousel auto-play for testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prevSlide) => (prevSlide + 1) % testimonialData.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  // Previous slide function
  const prevSlide = () => {
    setActiveSlide((prevSlide) => (prevSlide - 1 + featuredNews.length) % featuredNews.length);
  };

  // Next slide function
  const nextSlide = () => {
    setActiveSlide((prevSlide) => (prevSlide + 1) % featuredNews.length);
  };

  return (
    <div className="min-h-screen">
      {/* New Hero Section with Magazine Brand Statement */}
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
                  src={latestMagazine.coverImage} 
                  alt="Latest Magazine Cover" 
                  className="rounded-lg shadow-2xl w-80 h-auto transform rotate-6 z-10" 
                />
                <img 
                  src={magazineData[1].coverImage} 
                  alt="Previous Magazine Cover" 
                  className="absolute -left-10 -bottom-5 rounded-lg shadow-xl w-72 h-auto transform -rotate-6" 
                />
                <div className="absolute -right-8 -top-8 bg-insightRed text-white rounded-full p-4 shadow-lg z-20">
                  <BookOpen className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cover Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-insightBlack">Cover Story</h2>
              <p className="text-gray-600">Our most impactful feature of the month</p>
            </div>
            <Link 
              to={`/article/${featuredNews[0].id}`} 
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

      {/* Top Picks Carousel - More Focused */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-insightBlack">Editor's Picks</h2>
              <p className="text-gray-600">Curated content from our latest issues</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-lg shadow-lg">
            {/* Carousel */}
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
                        to={`/article/${news.id}`}
                        className="inline-flex items-center text-white bg-insightRed hover:bg-red-700 px-6 py-3 rounded-md text-base font-medium transition-colors"
                      >
                        Read Full Article <ChevronRight className="ml-2 h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Arrows */}
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
            
            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {featuredNews.slice(0, 5).map((_, index) => (
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

      {/* Latest Magazines Carousel - Enhanced */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-insightBlack">Our Publications</h2>
              <p className="text-gray-600">Explore our collection of business magazines</p>
            </div>
            <Link 
              to="/magazine" 
              className="inline-flex items-center text-insightRed hover:text-insightBlack font-medium transition-colors"
            >
              View All Issues <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
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
                <CarouselItem key={magazine.id} className="pl-4 basis-[280px] md:basis-[320px] lg:basis-[400px] transition-all duration-300 data-[center=true]:scale-110">
                  <Link to={`/magazine/${magazine.id}`} className="block group">
                    <div className="overflow-hidden rounded-lg shadow-lg bg-white h-full transition-transform duration-300 group-hover:shadow-xl">
                      <div className="relative aspect-[3/4]">
                        <img
                          src={magazine.coverImage}
                          alt={magazine.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-0 right-0 m-3">
                          <span className="inline-flex items-center px-2 py-1 bg-insightRed text-white text-xs font-semibold rounded">
                            {magazine.publicationDate}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-0 left-0 p-4 text-white transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <h3 className="text-lg font-semibold">{magazine.title}</h3>
                          <p className="text-sm text-gray-200 mt-1">{magazine.category}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 space-x-4">
              <CarouselPrevious className="relative static bg-white hover:bg-gray-100 text-insightBlack border-insightRed" />
              <CarouselNext className="relative static bg-white hover:bg-gray-100 text-insightBlack border-insightRed" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* News By Category - Improved UI */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-insightBlack">Business Insights</h2>
              <p className="text-gray-600">The latest industry news and analysis</p>
            </div>
          </div>
          
          <Tabs defaultValue={categories[0]} className="w-full">
            <TabsList className="mb-8 flex justify-center bg-gray-100 p-1 rounded-lg">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category} 
                  className="px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md data-[state=active]:text-insightBlack"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getNewsByCategory(category).map((news: NewsItem) => (
                    <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-shadow group border-0 shadow-md">
                      <div className="relative overflow-hidden aspect-video">
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-0 right-0 m-3">
                          <span className="inline-flex items-center px-2 py-1 bg-gray-800 text-white text-xs font-semibold rounded">
                            {news.category}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-insightRed transition-colors">{news.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{news.excerpt}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{news.date}</span>
                          <Link
                            to={`/article/${news.id}`}
                            className="inline-flex items-center text-insightRed hover:text-insightBlack text-sm font-medium transition-colors"
                          >
                            Read Article <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="flex justify-center mt-8">
                  <Link
                    to={`/category/${category.toLowerCase()}`}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 hover:bg-gray-50 rounded-md font-medium transition-colors"
                  >
                    View All {category} Articles <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Executive Spotlight - NEW SECTION */}
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
                  <blockquote className="italic text-gray-300 text-sm mb-4">"{executive.quote.substring(0, 80)}..."</blockquote>
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

      {/* Testimonials - Improved version */}
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
            
            {/* Indicators */}
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

      {/* Call to Action */}
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
                src={magazineData[0].coverImage} 
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
