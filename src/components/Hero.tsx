import { ChevronRight } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative bg-[#03120B] min-h-screen flex items-center justify-center overflow-hidden bg-texture-dark pt-20 border-b border-[#D4AF37]/30">
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop" alt="Luxury Facility" className="w-full h-full object-cover opacity-20 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03120B] via-[#03120B]/80 to-[#03120B]/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center mt-12">
        
        <div className="inline-flex items-center gap-4 px-5 py-2 border border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_20px_40px_-10px_rgba(212,175,55,0.3)] rounded-sm mb-10">
          <span className="w-2 h-2 rounded-full bg-[#E6C762] animate-pulse"></span>
          <span className="text-[#E6C762] text-xs font-bold tracking-[0.2em] uppercase">Private Capital Fitness</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-serif font-bold text-[#D4AF37] leading-tight mb-8">
          Money Tree Fund
        </h1>
        
        <p className="text-base md:text-xl text-white/80 mb-12 max-w-2xl font-medium leading-relaxed">
          Money Tree Fund provides precision-engineered physical conditioning for the high-performance individual. Secure your physical legacy today.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <a href="#philosophy" className="bg-[#D4AF37] text-[#03120B] px-10 py-4 text-sm font-bold tracking-[0.2em] uppercase hover:bg-white transition-all duration-300 flex items-center gap-3">
            Read Prospectus <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
