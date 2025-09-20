import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Facebook, Twitter, Instagram, Linkedin, Search } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

const categories = [
  { href: '/', label: 'Home' },
  { href: '/magazine', label: 'Magazine' },
  { href: '/leadership', label: 'Leadership' },
  { href: '/press-releases', label: 'Press Releases' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useSettings();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-[1000] shadow-sm">
      {/* Top Bar */}
      <div className="hidden md:block bg-insightBlack text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="opacity-80">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="opacity-80 hover:opacity-100 transition"><Facebook size={16} /></a>
            <a href="#" className="opacity-80 hover:opacity-100 transition"><Twitter size={16} /></a>
            <a href="#" className="opacity-80 hover:opacity-100 transition"><Instagram size={16} /></a>
            <a href="https://www.linkedin.com/company/theciovision" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition"><Linkedin size={16} /></a>
            <Link to="/magazine" className="ml-4 inline-flex items-center px-3 py-1 rounded-full bg-insightRed hover:bg-insightRed/90 text-white font-medium">Subscribe</Link>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="relative">
                {settings.siteLogo ? (
                  <img src={settings.siteLogo} alt={settings.companyName} className="w-12 h-12 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300" />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-insightRed to-red-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <div className="w-8 h-8 relative">
                      <div className="absolute inset-0 bg-white rounded-sm opacity-90" />
                      <div className="absolute top-1 left-1 right-1 h-1 bg-insightRed rounded-full" />
                      <div className="absolute top-3 left-1 right-2 h-0.5 bg-gray-400 rounded-full" />
                      <div className="absolute top-[18px] left-1 right-3 h-0.5 bg-gray-400 rounded-full" />
                      <div className="absolute top-6 left-1 right-1.5 h-0.5 bg-gray-400 rounded-full" />
                    </div>
                  </div>
                )}
              </div>
              <div className="ml-4">
                <span className="text-3xl font-bold font-premium tracking-tight text-insightBlack group-hover:text-insightRed transition-colors duration-300">
                  {settings.companyName}
                </span>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-[0.2em] -mt-1">Business Magazine</div>
              </div>
            </Link>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="relative">
                <input className="h-10 w-64 pl-10 pr-3 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:border-insightRed outline-none transition" placeholder="Search" />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <Link to="/magazine" className="inline-flex items-center h-10 px-4 rounded-md bg-insightRed text-white hover:bg-insightRed/90 transition">Read Latest</Link>
            </div>
            <button className="lg:hidden inline-flex items-center justify-center p-3 rounded-md text-insightBlack hover:text-insightRed hover:bg-gray-100 focus:outline-none transition-colors duration-200" onClick={toggleMenu}>
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Nav */}
      <nav className="hidden lg:block bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-6 h-12">
            {categories.map((c) => (
              <li key={c.href}>
                <Link to={c.href} className="px-2 py-1 text-sm font-semibold tracking-wide uppercase text-insightBlack/80 hover:text-insightRed relative group">
                  {c.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-insightRed transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 shadow-lg">
          <div className="px-4 pb-4 pt-2 space-y-1">
            {categories.map((c) => (
              <Link
                key={c.href}
                to={c.href}
                className="block px-4 py-3 text-base font-medium text-insightBlack hover:text-insightRed hover:bg-gray-50 rounded-lg transition-colors"
                onClick={toggleMenu}
              >
                {c.label}
              </Link>
            ))}
          </div>
          <div className="px-4 pb-4">
            <Link to="/magazine" className="inline-flex w-full items-center justify-center h-11 rounded-md bg-insightRed text-white font-medium hover:bg-insightRed/90">
              Subscribe
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
