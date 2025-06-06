
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useSettings();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center group">
              {/* Professional Magazine Logo */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-insightRed to-red-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <div className="w-8 h-8 relative">
                    {/* Magazine Icon */}
                    <div className="absolute inset-0 bg-white rounded-sm opacity-90"></div>
                    <div className="absolute top-1 left-1 right-1 h-1 bg-insightRed rounded-full"></div>
                    <div className="absolute top-3 left-1 right-2 h-0.5 bg-gray-400 rounded-full"></div>
                    <div className="absolute top-4.5 left-1 right-3 h-0.5 bg-gray-400 rounded-full"></div>
                    <div className="absolute top-6 left-1 right-1.5 h-0.5 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="ml-4">
                <span className="text-2xl font-bold text-insightBlack group-hover:text-insightRed transition-colors duration-300">
                  {settings.companyName}
                </span>
                <div className="text-sm font-semibold text-gray-600 -mt-1">BUSINESS MAGAZINE</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link to="/" className="px-3 py-2 text-base font-medium text-insightBlack hover:text-insightRed transition-colors duration-200 relative group whitespace-nowrap">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-insightRed transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/magazine" className="px-3 py-2 text-base font-medium text-insightBlack hover:text-insightRed transition-colors duration-200 relative group whitespace-nowrap">
                Magazine
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-insightRed transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/leadership" className="px-3 py-2 text-base font-medium text-insightBlack hover:text-insightRed transition-colors duration-200 relative group whitespace-nowrap">
                Leadership
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-insightRed transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/press-releases" className="px-3 py-2 text-base font-medium text-insightBlack hover:text-insightRed transition-colors duration-200 relative group whitespace-nowrap">
                Press&nbsp;Releases
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-insightRed transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/about" className="px-3 py-2 text-base font-medium text-insightBlack hover:text-insightRed transition-colors duration-200 relative group whitespace-nowrap">
                About&nbsp;Us
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-insightRed transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/contact" className="px-3 py-2 text-base font-medium text-insightBlack hover:text-insightRed transition-colors duration-200 relative group whitespace-nowrap">
                Contact&nbsp;Us
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-insightRed transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {/* Social Media Icons - Desktop */}
          <div className="hidden lg:flex items-center">
            <div className="ml-6 flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-insightRed transition-colors duration-200 p-2 rounded-full hover:bg-gray-100">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-insightRed transition-colors duration-200 p-2 rounded-full hover:bg-gray-100">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-insightRed transition-colors duration-200 p-2 rounded-full hover:bg-gray-100">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-insightRed transition-colors duration-200 p-2 rounded-full hover:bg-gray-100">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-3 rounded-md text-insightBlack hover:text-insightRed hover:bg-gray-100 focus:outline-none transition-colors duration-200"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-4 py-3 text-base font-medium text-insightBlack hover:text-insightRed hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/magazine"
              className="block px-4 py-3 text-base font-medium text-insightBlack hover:text-insightRed hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={toggleMenu}
            >
              Magazine
            </Link>
            <Link
              to="/leadership"
              className="block px-4 py-3 text-base font-medium text-insightBlack hover:text-insightRed hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={toggleMenu}
            >
              Leadership
            </Link>
            <Link
              to="/press-releases"
              className="block px-4 py-3 text-base font-medium text-insightBlack hover:text-insightRed hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={toggleMenu}
            >
              Press Releases
            </Link>
            <Link
              to="/about"
              className="block px-4 py-3 text-base font-medium text-insightBlack hover:text-insightRed hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={toggleMenu}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-3 text-base font-medium text-insightBlack hover:text-insightRed hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={toggleMenu}
            >
              Contact Us
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center justify-center px-5">
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-insightRed transition-colors duration-200">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-insightRed transition-colors duration-200">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-insightRed transition-colors duration-200">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-insightRed transition-colors duration-200">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
