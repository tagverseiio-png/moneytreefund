import { CheckCircle2 } from 'lucide-react';

export const Tiers = () => {
  return (
    <section id="tiers" className="py-32 bg-[#03120B] bg-texture-dark border-t border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-[#D4AF37] text-sm font-bold tracking-[0.2em] uppercase mb-4 block">Capitalization</span>
          <div className="w-12 h-1 bg-white mx-auto mb-8"></div>
          <h2 className="font-serif text-4xl lg:text-5xl text-white mb-6 font-bold">Investment Tiers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          
          {/* Silver Tier */}
          <div className="bg-[#0A2A1B] p-10 border border-[#D4AF37]/20 flex flex-col h-full rounded-sm">
            <h3 className="font-serif text-3xl text-white mb-2 font-bold">Standard</h3>
            <p className="text-[#E6C762] text-xs font-bold tracking-[0.2em] uppercase mb-8">Core Access</p>
            <div className="mb-8 pb-8 border-b border-white/10">
              <span className="text-5xl font-serif text-white font-bold">$150</span>
              <span className="text-white/50 text-xs font-bold uppercase ml-1">/ mo</span>
            </div>
            <ul className="space-y-5 mb-12 flex-grow">
              <li className="flex items-center text-sm text-white/80 font-medium">
                <CheckCircle2 className="h-5 w-5 text-[#D4AF37] mr-4" /> 24/7 Facility Access
              </li>
              <li className="flex items-center text-sm text-white/80 font-medium">
                <CheckCircle2 className="h-5 w-5 text-[#D4AF37] mr-4" /> Towel Service
              </li>
            </ul>
            <button className="w-full py-4 border-2 border-[#D4AF37] text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#D4AF37] hover:text-[#03120B] transition-all duration-300 rounded-sm">
              Apply Now
            </button>
          </div>

          {/* Gold Tier: Crisp White & Gold */}
          <div className="bg-[#FDFBF7] p-12 relative shadow-[0_25px_50px_-12px_rgba(255,255,255,0.15)] transform md:-translate-y-4 flex flex-col h-full rounded-sm border-2 border-[#D4AF37]">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#D4AF37] text-[#03120B] px-6 py-2 text-xs font-bold tracking-[0.2em] uppercase rounded-sm shadow-md">
              Recommended
            </div>
            <h3 className="font-serif text-4xl text-[#03120B] mb-2 font-bold mt-2">Executive</h3>
            <p className="text-[#AA8825] text-xs font-bold tracking-[0.2em] uppercase mb-8">Comprehensive</p>
            <div className="mb-8 pb-8 border-b border-[#0A2A1B]/10">
              <span className="text-6xl font-serif text-[#03120B] font-bold">$300</span>
              <span className="text-[#0A2A1B]/50 text-xs font-bold uppercase ml-1">/ mo</span>
            </div>
            <ul className="space-y-5 mb-12 flex-grow">
              <li className="flex items-center text-sm text-[#0A2A1B] font-bold">
                <CheckCircle2 className="h-5 w-5 text-[#D4AF37] mr-4" /> 24/7 Facility Access
              </li>
              <li className="flex items-center text-sm text-[#0A2A1B] font-bold">
                <CheckCircle2 className="h-5 w-5 text-[#D4AF37] mr-4" /> Premium Recovery Suite
              </li>
              <li className="flex items-center text-sm text-[#0A2A1B] font-bold">
                <CheckCircle2 className="h-5 w-5 text-[#D4AF37] mr-4" /> Quarterly Biometric Audit
              </li>
              <li className="flex items-center text-sm text-[#0A2A1B] font-bold">
                <CheckCircle2 className="h-5 w-5 text-[#D4AF37] mr-4" /> 1 Advisory Session / mo
              </li>
            </ul>
            <button className="w-full py-4 bg-[#03120B] text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#D4AF37] hover:text-[#03120B] transition-all duration-300 rounded-sm shadow-lg">
              Open Account
            </button>
          </div>

          {/* Platinum Tier */}
          <div className="bg-[#0A2A1B] p-10 border border-[#D4AF37]/20 flex flex-col h-full rounded-sm">
            <h3 className="font-serif text-3xl text-white mb-2 font-bold">Private Client</h3>
            <p className="text-[#E6C762] text-xs font-bold tracking-[0.2em] uppercase mb-8">Bespoke 1-on-1</p>
            <div className="mb-8 pb-8 border-b border-white/10">
              <span className="text-5xl font-serif text-white font-bold">$950</span>
              <span className="text-white/50 text-xs font-bold uppercase ml-1">/ mo</span>
            </div>
            <ul className="space-y-5 mb-12 flex-grow">
              <li className="flex items-center text-sm text-white/80 font-medium">
                <CheckCircle2 className="h-5 w-5 text-[#D4AF37] mr-4" /> All Executive Benefits
              </li>
              <li className="flex items-center text-sm text-white/80 font-medium">
                <CheckCircle2 className="h-5 w-5 text-[#D4AF37] mr-4" /> Dedicated Advisor
              </li>
              <li className="flex items-center text-sm text-white/80 font-medium">
                <CheckCircle2 className="h-5 w-5 text-[#D4AF37] mr-4" /> 3 Sessions / week
              </li>
            </ul>
            <button className="w-full py-4 border-2 border-[#D4AF37] text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#D4AF37] hover:text-[#03120B] transition-all duration-300 rounded-sm">
              Inquire
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
