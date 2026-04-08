import { useState, useEffect } from 'react';
import { Landmark, Menu, X } from 'lucide-react';

interface NavbarProps {
  onHome: () => void;
  onSectionClick?: () => void;
}

export const Navbar = ({ onHome, onSectionClick }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    if (onSectionClick) {
      onSectionClick();
    }
  };

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
        <div className={`hidden lg:flex justify-between items-center transition-all duration-500 w-full ${isScrolled ? 'h-16' : 'h-20'}`} id="nav-container-desktop">
          <div className="flex items-center gap-12 xl:gap-20 w-full">
            <div className="flex gap-10 items-center">
              <a href="#about" onClick={handleLinkClick} className="text-[#FDFBF7] hover:text-[#D4AF37] transition-colors text-[10px] font-bold tracking-[0.25em] uppercase whitespace-nowrap">About</a>
              <a href="#services" onClick={handleLinkClick} className="text-[#FDFBF7] hover:text-[#D4AF37] transition-colors text-[10px] font-bold tracking-[0.25em] uppercase whitespace-nowrap">Services</a>
              <a href="#risk" onClick={handleLinkClick} className="text-[#FDFBF7] hover:text-[#D4AF37] transition-colors text-[10px] font-bold tracking-[0.25em] uppercase whitespace-nowrap">Risk Management</a>
              <a href="#process" onClick={handleLinkClick} className="text-[#FDFBF7] hover:text-[#D4AF37] transition-colors text-[10px] font-bold tracking-[0.25em] uppercase whitespace-nowrap">Process</a>
              <a href="#contact" onClick={handleLinkClick} className="text-[#FDFBF7] hover:text-[#D4AF37] transition-colors text-[10px] font-bold tracking-[0.25em] uppercase whitespace-nowrap">Contact</a>
            </div>

            <div 
              className="flex items-center gap-3 cursor-pointer group ml-auto"
              onClick={onHome}
            >
              <Landmark className="h-6 w-6 text-[#D4AF37] group-hover:scale-110 transition-transform duration-500" />
              <span className="font-serif text-2xl text-[#FDFBF7] tracking-[0.1em] uppercase font-bold whitespace-nowrap">
                Money Tree <span className="text-[#D4AF37] italic font-medium">Fund</span>
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className={`flex lg:hidden justify-between items-center transition-all duration-500 ${isScrolled ? 'h-16' : 'h-20'}`} id="nav-container-mobile">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onHome}>
            <Landmark className="h-6 w-6 text-[#D4AF37]" />
            <span className="font-serif text-lg text-[#FDFBF7] tracking-[0.1em] uppercase font-bold">
              Money Tree <span className="text-[#D4AF37] italic">Fund</span>
            </span>
          </div>
          <button 
            className="text-[#FDFBF7] hover:text-[#D4AF37] focus:outline-none transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-80 border-t border-[#D4AF37]/20 bg-[#03120B]/95' : 'max-h-0'}`}>
        <div className="flex flex-col p-6 gap-6">
          <a href="#about" onClick={handleLinkClick} className="text-[#FDFBF7] hover:text-[#D4AF37] transition-colors text-[10px] font-bold tracking-[0.25em] uppercase">About</a>
          <a href="#services" onClick={handleLinkClick} className="text-[#FDFBF7] hover:text-[#D4AF37] transition-colors text-[10px] font-bold tracking-[0.25em] uppercase">Services</a>
          <a href="#risk" onClick={handleLinkClick} className="text-[#FDFBF7] hover:text-[#D4AF37] transition-colors text-[10px] font-bold tracking-[0.25em] uppercase">Risk Management</a>
          <a href="#process" onClick={handleLinkClick} className="text-[#FDFBF7] hover:text-[#D4AF37] transition-colors text-[10px] font-bold tracking-[0.25em] uppercase">Process</a>
          <a href="#contact" onClick={handleLinkClick} className="text-[#FDFBF7] hover:text-[#D4AF37] transition-colors text-[10px] font-bold tracking-[0.25em] uppercase">Contact</a>
        </div>
      </div>
    </nav>
  );
};
