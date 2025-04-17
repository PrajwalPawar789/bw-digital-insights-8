
import { useParams, Link } from 'react-router-dom';
import { newsData } from '../data/newsData';
import { ChevronLeft } from 'lucide-react';

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const article = newsData.find(article => article.id === Number(id));

  if (!article) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-insightBlack mb-4">Article Not Found</h1>
          <p className="mb-6">The article you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-flex items-center bg-insightRed hover:bg-insightBlack text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center text-insightRed hover:text-insightBlack transition-colors text-sm font-medium"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Home
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-96 object-cover"
          />
          
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-md">
                {article.category}
              </span>
              <span className="text-sm text-gray-500">{article.date}</span>
            </div>
            
            <h1 className="text-3xl font-bold text-insightBlack mb-4">{article.title}</h1>
            
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">By {article.author}</p>
              <p className="mb-4">{article.excerpt}</p>
              <p className="mb-4">{article.content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
