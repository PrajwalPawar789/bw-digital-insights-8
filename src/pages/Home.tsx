import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsData, NewsItem } from '../data/newsData';
import { magazineData } from '../data/magazineData';
import { testimonialData } from '../data/testimonialsData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ChevronLeft } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import FeaturedMagazine from '@/components/home/FeaturedMagazine';

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
      {/* Hero Carousel - Top Picks */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-insightBlack mb-8 text-center">
            Featured Stories
          </h2>
          
          <div className="relative overflow-hidden rounded-xl shadow-2xl">
            {/* Carousel */}
            <div className="relative h-[450px] md:h-[550px]">
              {featuredNews.map((news, index) => (
                <div
                  key={news.id}
                  className={`absolute inset-0 transition-all duration-700 transform ${
                    index === activeSlide 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className="relative h-full group">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8 text-white max-w-3xl">
                      <span className="inline-block px-3 py-1 bg-insightRed text-white text-sm font-semibold rounded-full mb-4">
                        {news.category}
                      </span>
                      <h3 className="text-3xl md:text-4xl font-bold mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {news.title}
                      </h3>
                      <p className="text-lg mb-6 text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {news.excerpt}
                      </p>
                      <Link
                        to={`/article/${news.id}`}
                        className="inline-flex items-center bg-white text-insightBlack hover:bg-gray-100 px-6 py-3 rounded-full text-sm font-medium transition-colors"
                      >
                        Read Article <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white backdrop-blur-sm transition-all duration-300"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white backdrop-blur-sm transition-all duration-300"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Latest Magazine Section with enhanced design */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4">
              Latest Release
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Join the ranks of industry leaders featured in our prestigious publication.
              Get insights that shape the future of business.
            </p>
          </div>

          <div className="mb-12">
            <FeaturedMagazine magazine={magazineData[0]} />
          </div>

          <div className="mt-16">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {magazineData.slice(1, 5).map((magazine) => (
                  <CarouselItem key={magazine.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <Link
                      to={`/magazine/${magazine.id}`}
                      className="block group"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-lg">
                        <img
                          src={magazine.coverImage}
                          alt={magazine.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                          <span className="inline-block px-2 py-1 bg-insightRed text-white text-xs font-semibold rounded-full mb-2">
                            {magazine.category}
                          </span>
                          <h3 className="text-lg font-bold text-white mb-2">
                            {magazine.title}
                          </h3>
                          <p className="text-sm text-gray-200">
                            {magazine.publicationDate}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 bg-white" />
              <CarouselNext className="hidden md:flex -right-12 bg-white" />
            </Carousel>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/magazine"
              className="inline-flex items-center bg-insightBlack text-white hover:bg-opacity-90 px-8 py-4 rounded-full text-lg font-medium transition-colors"
            >
              View All Magazines <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* News By Category Tabs */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-insightBlack mb-6">Latest News</h2>
          
          <Tabs defaultValue={categories[0]} className="w-full">
            <TabsList className="mb-6">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="px-4 py-2">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category} value={category} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getNewsByCategory(category).map((news: NewsItem) => (
                    <div key={news.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-md mb-2">
                          {news.category}
                        </span>
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{news.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{news.excerpt}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">{news.date}</span>
                          <Link
                            to={`/article/${news.id}`}
                            className="text-insightRed hover:text-insightBlack text-sm font-medium transition-colors"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-insightBlack text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-12 text-center">What Our Readers Say</h2>
          
          <div className="relative px-8 md:px-16">
            <div className="relative overflow-hidden min-h-[250px]">
              {testimonialData.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === activeTestimonial ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 mb-4 rounded-full overflow-hidden border-2 border-insightRed">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <blockquote className="max-w-2xl mb-4">
                      <p className="text-lg italic">"{testimonial.quote}"</p>
                    </blockquote>
                    <div>
                      <cite className="font-semibold text-white not-italic">{testimonial.name}</cite>
                      <p className="text-sm text-gray-400">{testimonial.title}, {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonialData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === activeTestimonial ? 'bg-insightRed w-4' : 'bg-gray-600'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
