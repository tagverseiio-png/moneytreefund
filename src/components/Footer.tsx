import { Landmark } from 'lucide-react';

interface FooterProps {
  onPageChange: (page: string) => void;
}

export const Footer = ({ onPageChange }: FooterProps) => {
  return (
    <footer className="bg-[#03120B] pt-24 pb-12 border-t border-[#D4AF37]/30 bg-texture-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 border-b border-white/10 pb-16">
          
          <div className="col-span-1 md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <Landmark className="h-8 w-8 text-[#D4AF37]" />
              <span className="font-serif text-2xl text-white tracking-[0.1em] uppercase font-bold">
                Money Tree<span className="text-[#D4AF37] italic lowercase tracking-normal">funds.</span>
              </span>
            </div>
            <p className="text-white/70 text-sm font-medium leading-relaxed max-w-sm">
              A private physical wealth management firm dedicated to optimizing the human asset through data, discipline, and elite facilities.
            </p>
          </div>
          
          <div className="col-span-1 md:col-span-3 md:col-start-7" id="contact">
            <h4 className="text-[#D4AF37] font-serif text-lg mb-6 font-bold">Corporate</h4>
            <ul className="space-y-4">
              <li><button onClick={() => onPageChange('About the Firm')} className="text-white/70 hover:text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase transition-colors text-left">About the Firm</button></li>
              <li><button onClick={() => onPageChange('Board of Advisors')} className="text-white/70 hover:text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase transition-colors text-left">Board of Advisors</button></li>
              <li><button onClick={() => onPageChange('Careers')} className="text-white/70 hover:text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase transition-colors text-left">Careers</button></li>
              <li><button onClick={() => onPageChange('Contact')} className="text-white/70 hover:text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase transition-colors text-left">Contact</button></li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-3">
            <h4 className="text-[#D4AF37] font-serif text-lg mb-6 font-bold">Legal</h4>
            <ul className="space-y-4">
              <li><button onClick={() => onPageChange('Terms of Service')} className="text-white/70 hover:text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase transition-colors text-left">Terms of Service</button></li>
              <li><button onClick={() => onPageChange('Privacy Policy')} className="text-white/70 hover:text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase transition-colors text-left">Privacy Policy</button></li>
              <li><button onClick={() => onPageChange('Liability Waiver')} className="text-white/70 hover:text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase transition-colors text-left">Liability Waiver</button></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/50 text-xs font-bold tracking-[0.2em] uppercase">
            &copy; 2026 Money Tree Funds. <span className="hidden sm:inline">|</span> <span className="text-[#D4AF37] italic font-serif lowercase tracking-normal text-base ml-2">Invest in your greatest asset.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
