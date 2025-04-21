
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsData, NewsItem } from '../data/newsData';
import { magazineData } from '../data/magazineData';
import { testimonialData } from '../data/testimonialsData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ChevronLeft } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-insightBlack mb-8 flex items-center gap-2">
            Top Picks
            <span className="text-sm font-normal text-gray-500">(Featured Stories)</span>
          </h2>
          
          <div className="relative overflow-hidden rounded-xl shadow-lg bg-white">
            {/* Carousel */}
            <div className="relative h-[450px] md:h-[550px]">
              {featuredNews.map((news, index) => (
                <div
                  key={news.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                    index === activeSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className="relative h-full group">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 w-full">
                      <span className="inline-flex items-center bg-insightRed text-white px-3 py-1.5 text-sm font-semibold rounded-md mb-4">
                        {news.category}
                      </span>
                      <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">{news.title}</h3>
                      <p className="text-base md:text-lg mb-6 text-gray-200 max-w-3xl">{news.excerpt}</p>
                      <Link
                        to={`/article/${news.id}`}
                        className="inline-flex items-center text-white bg-insightBlack hover:bg-opacity-90 px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:scale-105"
                      >
                        Read Full Story <ChevronRight className="ml-2 h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
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
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
                  }`}
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
          <h2 className="text-3xl font-bold text-insightBlack mb-10">Latest News</h2>
          
          <Tabs defaultValue={categories[0]} className="w-full">
            <TabsList className="mb-8 bg-gray-100 p-1 rounded-lg">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category} value={category} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {getNewsByCategory(category).map((news: NewsItem) => (
                    <Card key={news.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-0 right-0 p-2">
                          <span className="inline-block px-3 py-1 text-xs font-semibold bg-white/90 backdrop-blur-sm text-insightBlack rounded-md">
                            {news.category}
                          </span>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2 group-hover:text-insightRed transition-colors">
                          {news.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          {news.date}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{news.excerpt}</p>
                        <Link
                          to={`/article/${news.id}`}
                          className="inline-flex items-center text-insightRed hover:text-insightBlack text-sm font-medium transition-colors"
                        >
                          Read More <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Latest Magazine Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-insightBlack mb-10">Latest Magazines</h2>
          
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
                  <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="aspect-[3/4] relative">
                      <img
                        src={magazine.coverImage}
                        alt={magazine.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90"></div>
                      <div className="absolute bottom-0 left-0 p-6 text-white">
                        <span className="inline-flex items-center bg-insightRed/90 backdrop-blur-sm px-3 py-1.5 text-sm font-semibold rounded-md mb-3">
                          {magazine.category}
                        </span>
                        <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:underline">
                          {magazine.title}
                        </h3>
                        <p className="text-sm text-gray-200 mb-4">{magazine.publicationDate}</p>
                        <Link
                          to={`/magazine/${magazine.id}`}
                          className="inline-flex items-center bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group-hover:scale-105"
                        >
                          View Magazine <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-12 bg-white hover:bg-gray-100" />
            <CarouselNext className="-right-12 bg-white hover:bg-gray-100" />
          </Carousel>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-insightBlack to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-16 text-center">What Our Readers Say</h2>
          
          <div className="relative px-8 md:px-16">
            <div className="relative overflow-hidden min-h-[300px]">
              {testimonialData.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`absolute inset-0 transition-all duration-700 transform ${
                    index === activeTestimonial ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 mb-6 rounded-full overflow-hidden border-2 border-insightRed p-1">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <blockquote className="max-w-3xl mb-6">
                      <p className="text-xl md:text-2xl italic leading-relaxed">"{testimonial.quote}"</p>
                    </blockquote>
                    <div>
                      <cite className="font-semibold text-xl text-white not-italic">{testimonial.name}</cite>
                      <p className="text-sm text-gray-400 mt-1">{testimonial.title}, {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Testimonial Indicators */}
            <div className="flex justify-center space-x-3 mt-10">
              {testimonialData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === activeTestimonial ? 'w-10 bg-insightRed' : 'w-2.5 bg-gray-600 hover:bg-gray-500'
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
