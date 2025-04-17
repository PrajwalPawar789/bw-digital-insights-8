
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsData, NewsItem } from '../data/newsData';
import { magazineData } from '../data/magazineData';
import { testimonialData } from '../data/testimonialsData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ChevronLeft } from 'lucide-react';

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
      <section className="relative bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-insightBlack mb-6">Top Picks</h2>
          
          <div className="relative overflow-hidden rounded-lg shadow-lg">
            {/* Carousel */}
            <div className="relative h-[400px] md:h-[450px]">
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
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                      <span className="bg-insightRed text-white px-2 py-1 text-xs font-semibold rounded-md mb-3 inline-block">
                        {news.category}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">{news.title}</h3>
                      <p className="text-sm md:text-base mb-4 text-gray-200">{news.excerpt}</p>
                      <Link
                        to={`/article/${news.id}`}
                        className="inline-flex items-center text-white bg-insightBlack hover:bg-opacity-80 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Read More <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 text-white backdrop-blur-sm transition"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 text-white backdrop-blur-sm transition"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            
            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {featuredNews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === activeSlide ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
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

      {/* Latest Magazine Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-insightBlack mb-8">Latest Release Magazine</h2>
          
          <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:w-1/3">
              <img
                src={latestMagazine.coverImage}
                alt={latestMagazine.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
            <div className="md:w-2/3 p-6 md:p-8">
              <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-md mb-2">
                {latestMagazine.category}
              </span>
              <h3 className="text-2xl font-bold mb-3">{latestMagazine.title}</h3>
              <p className="text-gray-600 mb-6">{latestMagazine.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Published: {latestMagazine.publicationDate}</span>
                <Link
                  to={`/magazine/${latestMagazine.id}`}
                  className="inline-flex items-center bg-insightRed hover:bg-insightBlack text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  View PDF <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
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
