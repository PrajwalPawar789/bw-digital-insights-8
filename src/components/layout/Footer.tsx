
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-insightBlack text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h3 className="text-3xl font-bold">Subscribe to Our Newsletter</h3>
              <p className="text-gray-400 mt-3 text-lg">Stay updated with the latest business insights and executive news</p>
            </div>
            <div className="flex w-full max-w-lg space-x-3">
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-gray-800 border-gray-700 placeholder-gray-500 text-white h-12 text-base"
              />
              <Button size="lg" className="bg-insightRed hover:bg-insightRed/90 text-white border-insightRed px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-semibold mb-6">About</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-base">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-base">
                  Team
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-base">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/documentation" className="text-gray-400 hover:text-white transition-colors text-base">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-6">Content</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/magazine" className="text-gray-400 hover:text-white transition-colors text-base">
                  Magazine
                </Link>
              </li>
              <li>
                <Link to="/leadership" className="text-gray-400 hover:text-white transition-colors text-base">
                  Leadership
                </Link>
              </li>
              <li>
                <Link to="/press-releases" className="text-gray-400 hover:text-white transition-colors text-base">
                  Press Releases
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-6">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-base">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-base">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-base">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-6">Connect</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-base">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-base">
                  Partner With Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-base">
                  Advertise
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-700 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="w-10 h-10 bg-gradient-to-br from-insightRed to-red-700 rounded-lg flex items-center justify-center shadow-lg mr-3">
                  <div className="w-6 h-6 relative">
                    <div className="absolute inset-0 bg-white rounded-sm opacity-90"></div>
                    <div className="absolute top-0.5 left-0.5 right-0.5 h-0.5 bg-insightRed rounded-full"></div>
                    <div className="absolute top-2 left-0.5 right-1 h-0.5 bg-gray-400 rounded-full"></div>
                    <div className="absolute top-3 left-0.5 right-1.5 h-0.5 bg-gray-400 rounded-full"></div>
                    <div className="absolute top-4 left-0.5 right-1 h-0.5 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <span className="text-xl font-bold text-white">Insights</span>
                  <div className="text-xs font-semibold text-gray-400 -mt-1">BUSINESS MAGAZINE</div>
                </div>
              </Link>
              <span className="text-gray-400 ml-6 text-base">© 2025 Insights Business Magazine. All rights reserved.</span>
            </div>
            
            <div className="flex space-x-6 mt-6 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800">
                <Facebook size={22} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800">
                <Twitter size={22} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800">
                <Instagram size={22} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800">
                <Linkedin size={22} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800">
                <Mail size={22} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
