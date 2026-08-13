import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail, MapPin, Phone, ShieldCheck, Youtube } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Footer = () => {
  const { settings } = useSettings();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const year = new Date().getFullYear();

  const subscribe = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: email.trim() });
    setSubmitting(false);
    if (error) {
      toast({ title: "Subscription failed", description: error.message, variant: "destructive" });
      return;
    }
    setEmail("");
    toast({ title: "Thank you for subscribing!" });
  };

  const socialLinks = [
    { Icon: Linkedin, href: "https://www.linkedin.com/company/theciovision", label: "LinkedIn" },
    { Icon: Instagram, href: "https://www.instagram.com/theciovisionmagazine", label: "Instagram" },
    { Icon: Youtube, href: "https://www.youtube.com", label: "YouTube" },
  ];

  return (
    <footer className="bg-black text-white">
      <div id="subscribe" className="border-b border-white/15">
        <div className="max-w-[1200px] mx-auto px-4 py-7 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-12 items-center">
          <div>
            <h2 className="text-[22px] font-bold" style={{ fontFamily: "Georgia, serif" }}>Join The Newsletter</h2>
            <p className="text-[12px] text-neutral-300 mt-1">Subscribe to our newsletter now and stay informed!</p>
          </div>
          <form onSubmit={subscribe} className="flex h-11">
            <label htmlFor="footer-email" className="sr-only">Email Address</label>
            <input
              id="footer-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email Address"
              className="min-w-0 flex-1 bg-white px-4 text-[12px] text-black outline-none"
            />
            <button disabled={submitting} className="w-[34%] bg-[#e11d2a] px-4 text-[11px] font-bold uppercase hover:bg-red-700 disabled:opacity-60">
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-9">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2.2fr_1fr_1.35fr_1fr] gap-8 lg:gap-10 text-[12px]">
          <div>
            <Link to="/" className="inline-block">
              <span className="inline-flex overflow-hidden">
                <img
                  src="/ciovision-logo-cropped.png"
                  alt={settings.companyName}
                  width="1680"
                  height="385"
                  className="w-[260px] sm:w-[300px] h-auto object-contain"
                />
              </span>
            </Link>
            <p className="mt-4 max-w-md leading-relaxed text-neutral-300">
              The CIO Vision transforms business stories across sectors and global regions into captivating, insightful features. We help leaders and enterprises build their presence through authentic storytelling while inspiring the next generation of entrepreneurs.
            </p>
            <div className="flex gap-2 mt-5">
              {socialLinks.map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-8 h-8 rounded-sm bg-neutral-900 flex items-center justify-center hover:bg-[#e11d2a] transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[16px] font-bold mb-4" style={{ fontFamily: "Georgia, serif" }}>Quick Links</h3>
            <ul className="space-y-2.5 text-neutral-300">
              <li><Link to="/magazine" className="hover:text-white">Magazines</Link></li>
              <li><Link to="/articles" className="hover:text-white">The CIO Diary</Link></li>
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/press-releases" className="hover:text-white">Press Release</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white">Terms of Use</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[16px] font-bold mb-4" style={{ fontFamily: "Georgia, serif" }}>Contact Us</h3>
            <div className="space-y-3 text-neutral-300">
              <a href="tel:+14843312864" className="flex items-start gap-2 hover:text-white"><Phone className="w-4 h-4 mt-0.5 shrink-0" />+1 (484) 331-2864</a>
              <a href="mailto:info@theciovision.com" className="flex items-start gap-2 break-all hover:text-white"><Mail className="w-4 h-4 mt-0.5 shrink-0" />info@theciovision.com</a>
              <Link to="/contact" className="flex items-start gap-2 hover:text-white"><MapPin className="w-4 h-4 mt-0.5 shrink-0" />Columbus, Ohio, USA</Link>
            </div>
          </div>

          <div>
            <h3 className="text-[16px] font-bold mb-4" style={{ fontFamily: "Georgia, serif" }}>Outreach Partner</h3>
            <a
              href="https://www.globenewswire.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GlobeNewswire outreach partner"
              className="inline-block"
            >
              <img
                src="/globenewswire-logo.svg"
                alt="GlobeNewswire"
                loading="lazy"
                className="h-14 w-auto max-w-[190px] object-contain object-left"
              />
            </a>
            {/* <div className="mt-3 bg-white text-black px-3 py-2 inline-flex items-center gap-2 border border-neutral-300">
              <ShieldCheck className="w-7 h-7 text-[#e11d2a]" />
              <div><p className="font-extrabold text-[#e11d2a] leading-none">SAFE!</p><p className="text-[9px] text-neutral-600 mt-1">Verified Site · {year}</p></div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="border-t border-white/15 py-4 text-center text-[11px] text-neutral-400">
        Copyright © {year}: <Link to="/" className="text-white hover:underline">{settings.companyName}</Link> | All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
