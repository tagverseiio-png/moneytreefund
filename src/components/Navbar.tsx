import { useState, useEffect } from 'react';
import { Landmark, Menu } from 'lucide-react';

interface NavbarProps {
  onHome: () => void;
}

export const Navbar = ({ onHome }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed left-1/2 transform -translate-x-1/2 max-w-7xl z-50 transition-all duration-700 rounded-sm ${
        isScrolled 
          ? 'top-2 w-[98%] bg-[#03120B]/95 backdrop-blur-2xl border border-[#D4AF37]/50 shadow-[0_20px_40px_-10px_rgba(10,42,27,0.4)]' 
          : 'top-6 w-[95%] bg-[#03120B]/80 backdrop-blur-xl border border-[#D4AF37]/20 shadow-[0_20px_40px_-10px_rgba(10,42,27,0.4)]'
      }`}
      id="navbar"
    >
      <div className="px-6 lg:px-10">
        <div className={`hidden lg:grid grid-cols-[1fr_auto_1fr] items-center gap-4 transition-all duration-500 w-full ${isScrolled ? 'h-16' : 'h-20'}`} id="nav-container-desktop">
          {/* Left Links */}
          <div className="flex justify-start gap-4 xl:gap-10 items-center overflow-hidden">
            <a href="#philosophy" className="text-white hover:text-[#D4AF37] transition-colors text-[10px] xl:text-xs font-bold tracking-[0.15em] xl:tracking-[0.2em] uppercase whitespace-nowrap">Methodology</a>
            <a href="#portfolios" className="text-white hover:text-[#D4AF37] transition-colors text-[10px] xl:text-xs font-bold tracking-[0.15em] xl:tracking-[0.2em] uppercase whitespace-nowrap">Asset Classes</a>
            <a href="#contact" className="text-white hover:text-[#D4AF37] transition-colors text-[10px] xl:text-xs font-bold tracking-[0.15em] xl:tracking-[0.2em] uppercase whitespace-nowrap">Contact</a>
          </div>

          {/* Center Logo */}
          <div 
            className="flex justify-center items-center gap-2 xl:gap-3 cursor-pointer group px-2"
            onClick={onHome}
          >
            <Landmark className="h-5 w-5 xl:h-6 xl:w-6 text-[#D4AF37] group-hover:scale-110 transition-transform duration-500" />
            <span className="font-serif text-lg xl:text-2xl text-white tracking-[0.1em] xl:tracking-[0.15em] uppercase font-bold whitespace-nowrap">
              Money Tree<span className="text-[#D4AF37] italic ml-1 tracking-normal font-medium">Fund</span>
            </span>
          </div>

          {/* Right Placeholder */}
          <div className="flex justify-end items-center">
            {/* Keeping empty for balance or could put a small element here */}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className={`flex lg:hidden justify-between items-center transition-all duration-500 ${isScrolled ? 'h-16' : 'h-20'}`} id="nav-container-mobile">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onHome}>
            <Landmark className="h-6 w-6 text-[#D4AF37]" />
            <span className="font-serif text-lg text-white tracking-[0.1em] uppercase font-bold">
              Money Tree<span className="text-[#D4AF37] italic tracking-normal">Fund</span>
            </span>
          </div>
          <button className="text-white hover:text-[#D4AF37] focus:outline-none transition-colors">
            <Menu className="h-7 w-7" />
          </button>
        </div>
      </div>
    </nav>
  );
};
