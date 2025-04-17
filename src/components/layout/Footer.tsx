
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-insightBlack text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <svg className="h-8 w-8 text-insightRed" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span className="ml-2 text-xl font-bold text-white">InsightsBW</span>
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              Delivering actionable business intelligence and market insights to help organizations navigate complexity and drive growth.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-insightRed text-sm">Home</Link>
              </li>
              <li>
                <Link to="/magazine" className="text-gray-300 hover:text-insightRed text-sm">Magazine</Link>
              </li>
              <li>
                <Link to="/leadership" className="text-gray-300 hover:text-insightRed text-sm">Leadership</Link>
              </li>
              <li>
                <Link to="/press-releases" className="text-gray-300 hover:text-insightRed text-sm">Press Releases</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-insightRed text-sm">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-insightRed text-sm">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-insightRed text-sm">Latest Research</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-insightRed text-sm">Insights Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-insightRed text-sm">Events & Webinars</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-insightRed text-sm">Subscribe</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-insightRed text-sm">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-insightRed text-sm">Terms of Service</a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-insightRed mr-2 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  InsightsBW Headquarters<br />
                  350 Fifth Avenue<br />
                  New York, NY 10118
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-insightRed mr-2" />
                <span className="text-gray-300 text-sm">+1 (212) 555-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-insightRed mr-2" />
                <span className="text-gray-300 text-sm">info@insightsbw.com</span>
              </li>
            </ul>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-insightRed transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-insightRed transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-insightRed transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-insightRed transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 mt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} InsightsBW Marketing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
