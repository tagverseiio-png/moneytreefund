import { useState, useEffect } from 'react';
import { Landmark, ArrowRight, Menu } from 'lucide-react';

export const Navbar = () => {
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
            <a href="#tiers" className="text-white hover:text-[#D4AF37] transition-colors text-[10px] xl:text-xs font-bold tracking-[0.15em] xl:tracking-[0.2em] uppercase whitespace-nowrap">Tiers</a>
          </div>

          {/* Center Logo */}
          <div className="flex justify-center items-center gap-2 xl:gap-3 cursor-pointer group px-2">
            <Landmark className="h-5 w-5 xl:h-6 xl:w-6 text-[#D4AF37] group-hover:scale-110 transition-transform duration-500" />
            <span className="font-serif text-lg xl:text-2xl text-white tracking-[0.1em] xl:tracking-[0.15em] uppercase font-bold whitespace-nowrap">
              Money Tree<span className="text-[#D4AF37] italic lowercase ml-1 tracking-normal font-medium">funds.</span>
            </span>
          </div>

          {/* Right CTA */}
          <div className="flex justify-end items-center">
            <a href="#contact" className="group relative px-4 xl:px-6 py-2 xl:py-2.5 bg-[#D4AF37] overflow-hidden text-[#03120B] text-[10px] xl:text-xs font-bold tracking-[0.15em] xl:tracking-[0.2em] uppercase transition-all duration-500 whitespace-nowrap">
              <span className="absolute inset-0 w-0 bg-white transition-all duration-500 ease-out group-hover:w-full z-0"></span>
              <span className="relative z-10 flex items-center gap-2 group-hover:text-[#0A2A1B] transition-colors">Open Account <ArrowRight className="h-4 w-4" /></span>
            </a>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className={`flex lg:hidden justify-between items-center transition-all duration-500 ${isScrolled ? 'h-16' : 'h-20'}`} id="nav-container-mobile">
          <div className="flex items-center gap-2 cursor-pointer">
            <Landmark className="h-6 w-6 text-[#D4AF37]" />
            <span className="font-serif text-lg text-white tracking-[0.1em] uppercase font-bold">
              Money Tree<span className="text-[#D4AF37] italic lowercase tracking-normal">funds.</span>
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
