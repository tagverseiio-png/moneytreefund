import { Landmark } from 'lucide-react';

interface FooterProps {
  onPageChange: (page: string) => void;
}

export const Footer = ({ onPageChange }: FooterProps) => {
  return (
    <footer className="bg-[#03120B] pt-24 pb-12 border-t border-[#D4AF37]/20 bg-texture-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div className="space-y-10">
            <div className="flex items-center gap-3">
              <Landmark className="h-10 w-10 text-[#D4AF37]" />
              <span className="font-serif text-3xl text-[#FDFBF7] tracking-[0.1em] uppercase font-bold">
                Money Tree<span className="text-[#D4AF37] italic ml-1 tracking-normal font-medium">Fund</span>
              </span>
            </div>
            
            <p className="text-[#FDFBF7]/40 text-xs leading-relaxed max-w-md font-medium">
              For general informational purposes only. Does not constitute financial, legal, or investment advice. Services administered in accordance with applicable trust agreements and governing regulations.
            </p>

            <div className="pt-4">
              <a href="mailto:admin@moneytreefundtrustee.com" className="text-[#D4AF37] font-bold text-sm hover:text-[#FDFBF7] transition-colors border-b border-[#D4AF37]/30 pb-1">
                admin@moneytreefundtrustee.com
              </a>
              <div className="mt-8">
                <button className="bg-[#D4AF37] text-[#03120B] px-8 py-3.5 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#FDFBF7] transition-all">
                  Request Consultation
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-8">
              <h4 className="text-[#D4AF37] text-[10px] font-bold tracking-[0.3em] uppercase">Corporate</h4>
              <nav className="flex flex-col gap-4">
                <a href="#about" className="text-[#FDFBF7]/50 hover:text-[#D4AF37] text-[11px] font-bold tracking-widest uppercase transition-colors">About the Firm</a>
                <a href="#services" className="text-[#FDFBF7]/50 hover:text-[#D4AF37] text-[11px] font-bold tracking-widest uppercase transition-colors">Trustee Services</a>
                <a href="#risk" className="text-[#FDFBF7]/50 hover:text-[#D4AF37] text-[11px] font-bold tracking-widest uppercase transition-colors">Risk Management</a>
                <a href="#contact" className="text-[#FDFBF7]/50 hover:text-[#D4AF37] text-[11px] font-bold tracking-widest uppercase transition-colors">Contact</a>
              </nav>
            </div>
            <div className="space-y-8">
              <h4 className="text-[#D4AF37] text-[10px] font-bold tracking-[0.3em] uppercase">Legal</h4>
              <nav className="flex flex-col gap-4">
                <button onClick={() => onPageChange('Terms of Service')} className="text-left text-[#FDFBF7]/50 hover:text-[#D4AF37] text-[11px] font-bold tracking-widest uppercase transition-colors">Terms of Service</button>
                <button onClick={() => onPageChange('Privacy Policy')} className="text-left text-[#FDFBF7]/50 hover:text-[#D4AF37] text-[11px] font-bold tracking-widest uppercase transition-colors">Privacy Policy</button>
                <button onClick={() => onPageChange('Liability Waiver')} className="text-left text-[#FDFBF7]/50 hover:text-[#D4AF37] text-[11px] font-bold tracking-widest uppercase transition-colors">Liability Waiver</button>
              </nav>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-[#D4AF37]/10 mb-10"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full">
          <div className="flex items-center gap-6">
            <p className="text-[#FDFBF7]/30 text-[9px] font-bold tracking-[0.2em] uppercase">
              &copy; Money Tree Fund. <span className="text-[#D4AF37]/40 lowercase italic font-serif text-[11px] tracking-normal ml-2">secure trustee administration &amp; oversight.</span>
            </p>
          </div>
          <p className="text-[#FDFBF7]/20 text-[9px] font-bold tracking-[0.1em] uppercase">
            Developed by TagVerseXStrucureo
          </p>
        </div>
      </div>
    </footer>
  );
};
