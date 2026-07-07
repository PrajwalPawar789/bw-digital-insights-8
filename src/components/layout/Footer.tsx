import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

const Footer = () => {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  const socialLinks: Array<{ Icon: typeof Facebook; href: string; label: string; external?: boolean }> = [
    // { Icon: Facebook, href: '#', label: 'Facebook' },
    // { Icon: Twitter, href: '#', label: 'Twitter' },
    { Icon: Linkedin, href: 'https://www.linkedin.com/company/theciovision', label: 'LinkedIn', external: true },
    { Icon: Instagram, href: 'https://www.instagram.com/theciovisionmagazine', label: 'Instagram', external: true },
    // { Icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-insightBlack text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 text-sm">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4">
            <Link to="/" className="inline-flex items-center group">
              <div className="relative">
                {settings.siteLogo ? (
                  <img src={settings.siteLogo} alt={settings.companyName} className="w-12 h-12 rounded-lg shadow-lg" />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-insightRed to-red-700 rounded-lg flex items-center justify-center shadow-lg">
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
                <span className="text-2xl font-bold font-premium tracking-tight text-white">
                  {settings.companyName}
                </span>
                <div className="text-xs font-semibold text-insightRed uppercase tracking-[0.2em] -mt-1">Business Magazine</div>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed mt-4">
              The CIO Vision is a business magazine a platform for business leaders to share their stories, strategies, and insights. We aim to be the source of inspiration for executives across the globe.
            </p>
            <div className="flex gap-2 mt-5">
              {socialLinks.map(({ Icon, href, label, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="w-9 h-9 flex items-center justify-center bg-insightRed hover:bg-insightRed/80 transition-colors"
                >
                  <Icon className="h-4 w-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-2">
            <p className="text-white font-bold mb-4">Quick Links</p>
            <ul className="space-y-2">
              <li><Link to="/newsroom" className="text-gray-400 hover:text-white transition-colors">Newsroom</Link></li>
              <li><Link to="/magazine" className="text-gray-400 hover:text-white transition-colors">Magazines</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/press-releases" className="text-gray-400 hover:text-white transition-colors">Press Release</Link></li>
              {/* <li><Link to="/become-an-author" className="text-gray-400 hover:text-white transition-colors">Become an Author</Link></li> */}
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="col-span-1 md:col-span-3">
            <p className="text-white font-bold mb-4">Contact Us</p>
            <p className="text-gray-400">Phone:</p>
            <a href="tel:+14843312864" className="flex items-center gap-2 mb-3 text-gray-200 hover:text-white transition-colors">
              <Phone className="h-3.5 w-3.5" />+1 (484) 331-2864
            </a>
            <p className="text-gray-400">Email:</p>
            <a href="mailto:info@theciovision.com" className="flex items-center gap-2 mb-3 text-gray-200 hover:text-white transition-colors">
              <Mail className="h-3.5 w-3.5" />info@theciovision.com
            </a>
            <p className="text-gray-400">Address:</p>
            <p className="flex items-start gap-2 text-gray-200">
              <MapPin className="h-3.5 w-3.5 mt-0.5" />Columbus, Ohio, USA
            </p>
          </div>

          {/* Outreach Partner */}
          <div className="col-span-2 md:col-span-3">
            <p className="text-white font-bold mb-4">Outreach Partner</p>
            <div className="flex flex-col items-start gap-3">
              <div className="bg-white px-3 py-2 flex items-center gap-2 rounded-sm">
                <span className="text-xl leading-none" style={{ color: '#7E57C2' }}>◆</span>
                <div>
                  <p className="text-black text-sm font-extrabold leading-none">GlobeNewswire</p>
                  <p className="text-neutral-500 text-[10px] mt-0.5">by notified</p>
                </div>
              </div>
              <div className="bg-white text-black px-3 py-2 flex items-center gap-2 border border-neutral-300 rounded-sm">
                <ShieldCheck className="h-7 w-7 text-insightRed" />
                <div>
                  <p className="text-sm font-extrabold leading-none text-insightRed">SAFE!</p>
                  <p className="text-[9px] text-neutral-600 leading-tight mt-0.5">
                    Verified Site<br />2024
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-gray-500">
          Copyright © {year} {settings.companyName}. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
