
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Carousel - Top Picks */}
      <section className="relative bg-gradient-to-b from-gray-900 to-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Featured Stories</h2>
          
          <div className="relative overflow-hidden rounded-xl shadow-2xl">
            {/* Carousel */}
            <div className="relative h-[500px] md:h-[600px]">
              {featuredNews.map((news, index) => (
                <div
                  key={news.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === activeSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="relative h-full group">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 w-full">
                      <span className="inline-block bg-insightRed text-white px-3 py-1.5 text-sm font-semibold rounded-md mb-4">
                        {news.category}
                      </span>
                      <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">{news.title}</h3>
                      <p className="text-lg mb-6 text-gray-200 max-w-3xl">{news.excerpt}</p>
                      <Link
                        to={`/article/${news.id}`}
                        className="inline-flex items-center text-white bg-insightRed hover:bg-red-600 px-6 py-3 rounded-md text-lg font-medium transition-colors"
                      >
                        Read Full Story <ChevronRight className="ml-2 h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-3 text-white backdrop-blur-sm transition-all hover:scale-110"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-3 text-white backdrop-blur-sm transition-all hover:scale-110"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {featuredNews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2 transition-all ${
                    index === activeSlide ? 'w-8 bg-insightRed' : 'w-2 bg-white/50'
                  } rounded-full`}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News By Category Tabs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-insightBlack mb-12">Latest News</h2>
          
          <Tabs defaultValue={categories[0]} className="w-full">
            <TabsList className="mb-8 flex justify-center">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="px-6 py-3">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category} value={category} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {getNewsByCategory(category).map((news: NewsItem) => (
                    <Link
                      key={news.id}
                      to={`/article/${news.id}`}
                      className="group"
                    >
                      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={news.image}
                            alt={news.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="inline-block px-3 py-1.5 text-sm font-semibold bg-white text-insightBlack rounded-md">
                              {news.category}
                            </span>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold mb-3 group-hover:text-insightRed transition-colors line-clamp-2">
                            {news.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">{news.excerpt}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{news.date}</span>
                            <span className="text-insightRed font-medium group-hover:translate-x-2 transition-transform duration-300 inline-flex items-center">
                              Read More <ChevronRight className="ml-1 h-4 w-4" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Latest Magazine Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-insightRed/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-insightBlack mb-4">Latest Magazines</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our curated collection of in-depth insights and analysis from industry leaders
            </p>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {magazineData.map((magazine) => (
                <CarouselItem key={magazine.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Link to={`/magazine/${magazine.id}`} className="block group">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                      <div className="aspect-[3/4] relative">
                        <img
                          src={magazine.coverImage}
                          alt={magazine.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-0 left-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <span className="inline-block px-3 py-1.5 text-sm font-semibold bg-insightRed rounded-md mb-3">
                            {magazine.category}
                          </span>
                          <h3 className="text-xl font-bold mb-2">{magazine.title}</h3>
                          <p className="text-sm text-gray-200 mb-4">{magazine.publicationDate}</p>
                          <span className="inline-flex items-center text-white text-sm font-medium">
                            View Magazine <ChevronRight className="ml-1 h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-12 h-12 w-12 border-2 bg-white/80 backdrop-blur-sm hover:bg-white" />
            <CarouselNext className="-right-12 h-12 w-12 border-2 bg-white/80 backdrop-blur-sm hover:bg-white" />
          </Carousel>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-insightBlack text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyYTQgNCAwIDEwMCA4IDQgNCAwIDAwMC04eiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-3xl font-bold mb-16 text-center">What Our Readers Say</h2>
          
          <div className="relative px-8 md:px-16">
            <div className="relative overflow-hidden min-h-[300px]">
              {testimonialData.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`absolute inset-0 transition-all duration-700 ${
                    index === activeTestimonial ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 mb-6 rounded-full overflow-hidden border-4 border-insightRed/20">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <blockquote className="max-w-3xl mb-6">
                      <p className="text-2xl italic text-gray-200">"{testimonial.quote}"</p>
                    </blockquote>
                    <div>
                      <cite className="font-semibold text-xl text-white not-italic">{testimonial.name}</cite>
                      <p className="text-gray-400">{testimonial.title}, {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Indicators */}
            <div className="flex justify-center space-x-3 mt-8">
              {testimonialData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-3 transition-all duration-300 rounded-full ${
                    index === activeTestimonial ? 'w-12 bg-insightRed' : 'w-3 bg-white/20 hover:bg-white/40'
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
