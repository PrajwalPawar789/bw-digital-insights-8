
import { Link } from 'react-router-dom';
import { Magazine } from '@/data/magazineData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Share2 } from 'lucide-react';

interface FeaturedMagazineProps {
  magazine: Magazine;
}

const FeaturedMagazine = ({ magazine }: FeaturedMagazineProps) => {
  return (
    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-500">
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={magazine.coverImage}
          alt={magazine.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <span className="inline-block px-3 py-1 bg-insightRed text-white text-sm font-semibold rounded-full mb-4">
            Featured Issue
          </span>
          <h2 className="text-3xl font-bold text-white mb-3">{magazine.title}</h2>
          <p className="text-gray-200 mb-6 line-clamp-2">{magazine.description}</p>
          
          <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <Link to={`/magazine/${magazine.id}`}>
              <Button className="bg-white text-insightBlack hover:bg-gray-100">
                Read Magazine
              </Button>
            </Link>
            <Button variant="ghost" className="text-white" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FeaturedMagazine;
