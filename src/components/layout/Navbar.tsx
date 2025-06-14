
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <svg className="h-8 w-8 text-insightRed" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span className="ml-2 text-xl font-bold text-insightBlack">InsightsBW</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="px-3 py-2 text-sm font-medium text-insightBlack hover:text-insightRed">
                Home
              </Link>
              <Link to="/magazine" className="px-3 py-2 text-sm font-medium text-insightBlack hover:text-insightRed">
                Magazine
              </Link>
              <Link to="/leadership" className="px-3 py-2 text-sm font-medium text-insightBlack hover:text-insightRed">
                Leadership
              </Link>
              <Link to="/press-releases" className="px-3 py-2 text-sm font-medium text-insightBlack hover:text-insightRed">
                Press Releases
              </Link>
              <Link to="/about" className="px-3 py-2 text-sm font-medium text-insightBlack hover:text-insightRed">
                About Us
              </Link>
              <Link to="/contact" className="px-3 py-2 text-sm font-medium text-insightBlack hover:text-insightRed">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Social Media Icons - Desktop */}
          <div className="hidden md:flex items-center">
            <div className="ml-4 flex items-center space-x-3">
              <a href="#" className="text-gray-400 hover:text-insightRed">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-insightRed">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-insightRed">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-insightRed">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-insightBlack hover:text-insightRed focus:outline-none"
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
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-insightBlack hover:text-insightRed"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/magazine"
              className="block px-3 py-2 text-base font-medium text-insightBlack hover:text-insightRed"
              onClick={toggleMenu}
            >
              Magazine
            </Link>
            <Link
              to="/leadership"
              className="block px-3 py-2 text-base font-medium text-insightBlack hover:text-insightRed"
              onClick={toggleMenu}
            >
              Leadership
            </Link>
            <Link
              to="/press-releases"
              className="block px-3 py-2 text-base font-medium text-insightBlack hover:text-insightRed"
              onClick={toggleMenu}
            >
              Press Releases
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-base font-medium text-insightBlack hover:text-insightRed"
              onClick={toggleMenu}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-base font-medium text-insightBlack hover:text-insightRed"
              onClick={toggleMenu}
            >
              Contact Us
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-insightRed">
                  <Facebook size={18} />
                </a>
                <a href="#" className="text-gray-400 hover:text-insightRed">
                  <Twitter size={18} />
                </a>
                <a href="#" className="text-gray-400 hover:text-insightRed">
                  <Instagram size={18} />
                </a>
                <a href="#" className="text-gray-400 hover:text-insightRed">
                  <Linkedin size={18} />
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
