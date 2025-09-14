import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { pressReleaseData, PressRelease } from '../data/pressReleaseData';
import { ChevronLeft, Calendar, Share2, ArrowUpRight, Globe, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

const PressReleaseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [pressRelease, setPressRelease] = useState<PressRelease | undefined>();
  const [relatedPressReleases, setRelatedPressReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPressRelease = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        // First try to fetch from Supabase
        const { data: supabaseRelease, error } = await supabase
          .from('press_releases')
          .select('*')
          .eq('slug', slug)
          .single();

        if (supabaseRelease && !error) {
          // Convert Supabase data to PressRelease format
          const convertedRelease: PressRelease = {
            id: supabaseRelease.id, // Now both are strings (UUID)
            title: supabaseRelease.title,
            excerpt: supabaseRelease.excerpt || '',
            content: supabaseRelease.content,
            date: supabaseRelease.date,
            category: 'Press Release', // Default category
            slug: supabaseRelease.slug,
            image: supabaseRelease.image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
            author: supabaseRelease.author
          };
          setPressRelease(convertedRelease);

          // Fetch related press releases from Supabase
          const { data: relatedData } = await supabase
            .from('press_releases')
            .select('*')
            .neq('id', supabaseRelease.id)
            .limit(2);

          if (relatedData) {
            const convertedRelated: PressRelease[] = relatedData.map(item => ({
              id: item.id, // Now both are strings
              title: item.title,
              excerpt: item.excerpt || '',
              content: item.content,
              date: item.date,
              category: 'Press Release',
              slug: item.slug,
              image: item.image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
              author: item.author
            }));
            setRelatedPressReleases(convertedRelated);
          }
        } else {
          // Fallback to mock data
          const mockRelease = pressReleaseData.find(pr => pr.slug === slug);
          setPressRelease(mockRelease);
          
          if (mockRelease) {
            const related = pressReleaseData
              .filter(pr => pr.id !== mockRelease.id && pr.category === mockRelease.category)
              .slice(0, 2);
            setRelatedPressReleases(related);
          }
        }
      } catch (error) {
        console.error('Error fetching press release:', error);
        // Fallback to mock data
        const mockRelease = pressReleaseData.find(pr => pr.slug === slug);
        setPressRelease(mockRelease);
        
        if (mockRelease) {
          const related = pressReleaseData
            .filter(pr => pr.id !== mockRelease.id && pr.category === mockRelease.category)
            .slice(0, 2);
          setRelatedPressReleases(related);
        }
      }

      // Simulate loading delay
      const timer = setTimeout(() => {
        setLoading(false);
      }, 700);

      return () => clearTimeout(timer);
    };

    fetchPressRelease();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pressRelease?.title,
        text: pressRelease?.excerpt,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Press release link copied to clipboard",
        duration: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-insightRed"></div>
      </div>
    );
  }

  if (!pressRelease) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-insightBlack mb-4">Press Release Not Found</h1>
          <p className="mb-6">The press release you're looking for doesn't exist.</p>
          <Link
            to="/press-releases"
            className="inline-flex items-center bg-insightRed hover:bg-insightBlack text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Press Releases
          </Link>
        </div>
      </div>
    );
  }

  // Format the date for display
  const formattedDate = new Date(pressRelease.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/press-releases"
            className="inline-flex items-center text-insightRed hover:text-insightBlack transition-colors text-sm font-medium"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Press Releases
          </Link>
        </div>

        <div className="mb-8">
          <span className="inline-block px-3 py-1 text-sm font-semibold bg-insightRed text-white rounded-full mb-4">
            {pressRelease.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-insightBlack mb-4 leading-tight">
            {pressRelease.title}
          </h1>
          
          <div className="flex items-center text-sm text-gray-600 mb-6">
            <Calendar className="h-4 w-4 mr-1" />
            {formattedDate}
          </div>
          
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">{pressRelease.excerpt}</p>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
            className="flex items-center"
          >
            <Share2 className="h-4 w-4 mr-1.5" /> Share Press Release
          </Button>
        </div>

        <div className="rounded-lg overflow-hidden mb-8 shadow-md">
          <img
            src={pressRelease.image}
            alt={pressRelease.title}
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="prose max-w-none mb-12">
          {pressRelease.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-gray-700 mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-12">
          <div className="flex items-center mb-4">
            <Globe className="h-5 w-5 mr-2 text-insightRed" />
            <h3 className="text-lg font-semibold text-insightBlack">About InsightsBW</h3>
          </div>
          <p className="text-gray-600 mb-4">
            InsightsBW is a leading global research and advisory firm, providing executives with actionable insights, strategic guidance, and data-driven analysis to make informed decisions in rapidly evolving markets. 
            With a global network of industry experts and innovative research methodologies, we help organizations navigate complexity and drive sustainable growth.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              asChild
            >
              <Link to="/about">
                Learn More <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              asChild
            >
              <Link to="/contact">
                Contact Us <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>

        {relatedPressReleases.length > 0 && (
          <div className="border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-bold text-insightBlack mb-6">Related Press Releases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPressReleases.map(relatedPR => (
                <Link
                  key={relatedPR.id}
                  to={`/press-releases/${relatedPR.slug}`}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={relatedPR.image}
                      alt={relatedPR.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded mb-2">
                        {relatedPR.category}
                      </span>
                      <h3 className="font-semibold text-insightBlack hover:text-insightRed transition-colors mb-2 line-clamp-2">
                        {relatedPR.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{relatedPR.excerpt}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {new Date(relatedPR.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <div className="flex items-center text-insightRed text-sm font-medium">
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        Read More
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PressReleaseDetail;
