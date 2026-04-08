import { ChevronRight } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative bg-[#03120B] min-h-screen flex flex-col items-center justify-center overflow-hidden bg-texture-dark pt-20 border-b border-[#D4AF37]/30">
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2070&auto=format&fit=crop" alt="Institutional Finance" className="w-full h-full object-cover opacity-10 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03120B] via-[#03120B]/80 to-[#03120B]/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center mt-12 mb-20">
        <div className="inline-flex items-center gap-4 px-5 py-2 border border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_20px_40px_-10px_rgba(212,175,55,0.3)] rounded-sm mb-10">
          <span className="w-2 h-2 rounded-full bg-[#E6C762] animate-pulse"></span>
          <span className="text-[#E6C762] text-[10px] font-bold tracking-[0.3em] uppercase">Fiduciary &amp; Administrative Services</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-[7.5rem] font-serif font-bold text-[#FDFBF7] leading-tight mb-4">
          Money Tree <br />
          <span className="text-[#D4AF37] italic font-medium">Fund.</span>
        </h1>
        <h2 className="text-2xl md:text-3xl font-serif text-[#FDFBF7]/40 italic mb-12">
          Secure Trustee Administration
        </h2>
        
        <p className="text-base md:text-xl text-[#FDFBF7]/60 mb-12 max-w-3xl font-medium leading-relaxed">
          Money Tree Fund provides structured trustee administration, fiduciary oversight, and strategically secured financial protection across multiple jurisdictions.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <a href="#about" className="bg-[#D4AF37] text-[#03120B] px-10 py-5 text-xs font-bold tracking-[0.25em] uppercase hover:bg-[#FDFBF7] transition-all duration-300 flex items-center gap-3">
            Learn More <ChevronRight className="h-4 w-4" />
          </a>
          <a href="#contact" className="border border-[#D4AF37]/40 text-[#D4AF37] px-10 py-5 text-xs font-bold tracking-[0.25em] uppercase hover:bg-[#D4AF37] hover:text-[#03120B] transition-all duration-300">
            Contact Our Team
          </a>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 w-full bg-[#03120B]/80 backdrop-blur-md py-8 border-t border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center md:items-start border-l md:border-l-0 md:border-r border-[#D4AF37]/10 pl-6 md:pl-0 md:pr-10">
            <span className="text-[#D4AF37] text-2xl font-bold font-serif">850+</span>
            <span className="text-[#FDFBF7]/40 text-[9px] font-bold tracking-[0.25em] uppercase mt-1">Clients</span>
          </div>
          <div className="flex flex-col items-center md:items-start border-l md:border-l-0 md:border-r border-[#D4AF37]/10 pl-6 md:pl-0 md:pr-10">
            <span className="text-[#D4AF37] text-2xl font-bold font-serif">320+</span>
            <span className="text-[#FDFBF7]/40 text-[9px] font-bold tracking-[0.25em] uppercase mt-1">Trust Structures</span>
          </div>
          <div className="flex flex-col items-center md:items-start border-l md:border-l-0 md:border-r border-[#D4AF37]/10 pl-6 md:pl-0 md:pr-10">
            <span className="text-[#D4AF37] text-2xl font-bold font-serif">USD 480M+</span>
            <span className="text-[#FDFBF7]/40 text-[9px] font-bold tracking-[0.25em] uppercase mt-1">AUA</span>
          </div>
          <div className="flex flex-col items-center md:items-start border-l md:border-l-0 pl-6 md:pl-0">
            <span className="text-[#D4AF37] text-2xl font-bold font-serif">18+</span>
            <span className="text-[#FDFBF7]/40 text-[9px] font-bold tracking-[0.25em] uppercase mt-1">Jurisdictions</span>
          </div>
        </div>
      </div>
    </section>
  );
};
