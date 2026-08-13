import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";

const navLinks = [
  { href: "/magazine", label: "NEXT2026", accent: true },
  { href: "/articles", label: "The CIO Diary" },
  { href: "/leadership", label: "Reviews" },
  { href: "/#subscribe", label: "Subscribe" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setSearchQuery("");
    setIsSearchOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="relative z-[1000] bg-black text-white border-b border-white/10">
      <div className="max-w-[1360px] mx-auto px-3 sm:px-5">
        <div className="h-[64px] flex items-center gap-6">
          <Link to="/" className="shrink-0" aria-label="The CIO Vision home">
            <img
              src="/ciovision-logo-cropped.png"
              alt="The CIO Vision Business Magazine"
              width="1680"
              height="385"
              className="w-[215px] sm:w-[260px] h-auto object-contain"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 ml-auto">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`text-[13px] font-bold whitespace-nowrap transition-colors ${
                  item.accent ? "text-[#ff3b19] hover:text-white" : "text-white hover:text-[#ef3340]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto lg:ml-2 flex items-center gap-1 relative">
            {isSearchOpen && (
              <form onSubmit={submitSearch} className="absolute right-[76px] top-1/2 -translate-y-1/2">
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setIsSearchOpen(false);
                  }}
                  placeholder="Search"
                  aria-label="Search articles"
                  className="h-9 w-48 sm:w-60 bg-white text-black px-3 text-sm outline-none border border-neutral-300"
                />
              </form>
            )}
            <button
              type="button"
              onClick={() => setIsSearchOpen((open) => !open)}
              aria-label={isSearchOpen ? "Close search" : "Open search"}
              className="w-9 h-9 inline-flex items-center justify-center hover:text-[#ef3340] transition-colors"
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} strokeWidth={3} />}
            </button>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="w-9 h-9 inline-flex items-center justify-center hover:text-[#ef3340] transition-colors"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} strokeWidth={3} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full inset-x-0 bg-black border-t border-white/10 shadow-xl lg:hidden">
          <nav className="px-4 py-3">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 border-b border-white/10 text-sm font-bold ${item.accent ? "text-[#ff3b19]" : "text-white"}`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block py-3 border-b border-white/10 text-sm font-bold">About</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block py-3 text-sm font-bold">Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
