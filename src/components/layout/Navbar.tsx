import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

const Navbar = () => {
  const { settings } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src="/placeholder.svg" alt={settings.companyName} />
              <span className="ml-2 text-xl font-bold text-insightBlack">{settings.companyName}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-insightRed px-3 py-2 text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/articles"
              className="text-gray-700 hover:text-insightRed px-3 py-2 text-sm font-medium transition-colors"
            >
              Articles
            </Link>
            <Link
              to="/magazine"
              className="text-gray-700 hover:text-insightRed px-3 py-2 text-sm font-medium transition-colors"
            >
              Magazine
            </Link>
            <Link
              to="/leadership"
              className="text-gray-700 hover:text-insightRed px-3 py-2 text-sm font-medium transition-colors"
            >
              Leadership
            </Link>
            <Link
              to="/press-releases"
              className="text-gray-700 hover:text-insightRed px-3 py-2 text-sm font-medium transition-colors"
            >
              Press Releases
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-insightRed px-3 py-2 text-sm font-medium transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-insightRed px-3 py-2 text-sm font-medium transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/admin"
              className="bg-insightRed hover:bg-insightBlack text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-insightRed p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                to="/"
                className="block text-gray-700 hover:text-insightRed px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/articles"
                className="block text-gray-700 hover:text-insightRed px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Articles
              </Link>
              <Link
                to="/magazine"
                className="block text-gray-700 hover:text-insightRed px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Magazine
              </Link>
              <Link
                to="/leadership"
                className="block text-gray-700 hover:text-insightRed px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Leadership
              </Link>
              <Link
                to="/press-releases"
                className="block text-gray-700 hover:text-insightRed px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Press Releases
              </Link>
              <Link
                to="/about"
                className="block text-gray-700 hover:text-insightRed px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block text-gray-700 hover:text-insightRed px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/admin"
                className="block bg-insightRed hover:bg-insightBlack text-white px-4 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
