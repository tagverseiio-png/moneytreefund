import { Landmark } from 'lucide-react';

interface FooterProps {
  onPageChange: (page: string) => void;
}

export const Footer = ({ onPageChange }: FooterProps) => {
  return (
    <footer className="bg-[#03120B] py-16 border-t border-[#D4AF37]/30 bg-texture-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-3">
            <Landmark className="h-8 w-8 text-[#D4AF37]" />
            <span className="font-serif text-2xl text-white tracking-[0.1em] uppercase font-bold">
              Money Tree<span className="text-[#D4AF37] italic ml-1 tracking-normal font-medium">Fund</span>
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            <button onClick={() => onPageChange('Terms of Service')} className="text-white/40 hover:text-[#D4AF37] text-[10px] font-bold tracking-[0.2em] uppercase transition-colors">Terms of Service</button>
            <button onClick={() => onPageChange('Privacy Policy')} className="text-white/40 hover:text-[#D4AF37] text-[10px] font-bold tracking-[0.2em] uppercase transition-colors">Privacy Policy</button>
            <button onClick={() => onPageChange('Liability Waiver')} className="text-white/40 hover:text-[#D4AF37] text-[10px] font-bold tracking-[0.2em] uppercase transition-colors">Liability Waiver</button>
          </div>

          <div className="w-full h-px bg-white/10"></div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full">
            <p className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase">
              &copy; 2026 Money Tree Fund. All Rights Reserved.
            </p>
            <span className="text-[#D4AF37] italic font-serif text-base tracking-normal">Invest in your greatest asset.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
