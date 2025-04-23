
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    if (isMenuOpen) setIsMenuOpen(false);
  };

  // Add scroll detection for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation links with active state tracking
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Magazine', path: '/magazine' },
    { name: 'Leadership', path: '/leadership' },
    { name: 'Press Releases', path: '/press-releases' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header>
      <nav 
        className={`${isScrolled ? 'shadow-md backdrop-blur-sm bg-white/90' : 'bg-white'} 
                   sticky top-0 z-50 transition-all duration-300`}
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to="/" 
                className="flex items-center" 
                onClick={closeMenu}
                aria-label="InsightsBW - Home"
              >
                <svg className="h-8 w-8 text-insightRed" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <span className="ml-2 text-xl font-bold text-insightBlack">InsightsBW</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 text-sm font-medium transition-colors hover:text-insightRed
                              ${isActive(link.path) ? 'text-insightRed' : 'text-insightBlack'}`}
                    aria-current={isActive(link.path) ? 'page' : undefined}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Media Icons - Desktop */}
            <div className="hidden md:flex items-center">
              <div className="ml-4 flex items-center space-x-3">
                <a href="#" className="text-gray-400 hover:text-insightRed transition-colors" aria-label="Facebook">
                  <Facebook size={18} aria-hidden="true" />
                </a>
                <a href="#" className="text-gray-400 hover:text-insightRed transition-colors" aria-label="Twitter">
                  <Twitter size={18} aria-hidden="true" />
                </a>
                <a href="#" className="text-gray-400 hover:text-insightRed transition-colors" aria-label="Instagram">
                  <Instagram size={18} aria-hidden="true" />
                </a>
                <a href="#" className="text-gray-400 hover:text-insightRed transition-colors" aria-label="LinkedIn">
                  <Linkedin size={18} aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-insightBlack hover:text-insightRed focus:outline-none"
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? 
                  <X className="block h-6 w-6" aria-hidden="true" /> : 
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 text-base font-medium rounded-md ${
                  isActive(link.path) 
                    ? 'text-insightRed bg-gray-50' 
                    : 'text-insightBlack hover:text-insightRed hover:bg-gray-50'
                }`}
                onClick={closeMenu}
                aria-current={isActive(link.path) ? 'page' : undefined}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center justify-center px-5">
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-insightRed" aria-label="Facebook">
                  <Facebook size={20} aria-hidden="true" />
                </a>
                <a href="#" className="text-gray-400 hover:text-insightRed" aria-label="Twitter">
                  <Twitter size={20} aria-hidden="true" />
                </a>
                <a href="#" className="text-gray-400 hover:text-insightRed" aria-label="Instagram">
                  <Instagram size={20} aria-hidden="true" />
                </a>
                <a href="#" className="text-gray-400 hover:text-insightRed" aria-label="LinkedIn">
                  <Linkedin size={20} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
