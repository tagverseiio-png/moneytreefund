import { Microscope, Users, Lock } from 'lucide-react';

export const Methodology = () => {
  return (
    <section id="philosophy" className="py-32 bg-[#D4AF37] relative overflow-hidden">
      {/* Subtle background pattern for coordination */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-texture-dark"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center mb-24">
          <span className="text-[#03120B] text-sm font-bold tracking-[0.2em] uppercase mb-4">Secure Trustee Administration</span>
          <div className="w-12 h-1 bg-white mb-8"></div>
          <h2 className="font-serif text-4xl lg:text-6xl text-[#03120B] text-center font-bold leading-tight">
            A Calculated Approach <br />
            <span className="italic text-white font-medium">to Wealth & Wellness.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* 01 */}
          <div className="bg-[#FDFBF7] p-10 shadow-[0_20px_40px_-10px_rgba(10,42,27,0.4)] hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden group border border-[#D4AF37]/10">
            <div className="absolute -right-4 -top-4 font-serif text-9xl font-bold text-[#0A2A1B]/5 group-hover:text-[#D4AF37]/10 transition-colors duration-500 pointer-events-none">1</div>
            <div className="w-14 h-14 bg-[#03120B] text-[#D4AF37] flex items-center justify-center rounded-sm mb-8">
              <Microscope className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-2xl text-[#03120B] font-bold mb-4">Biometric Auditing</h3>
            <p className="text-[#0A2A1B]/80 font-medium text-sm leading-relaxed">
              Quarterly DEXA scans, VO2 max, and metabolic testing. We establish precise baseline metrics to track your portfolio's physiological growth with absolute transparency.
            </p>
          </div>
          
          {/* 02 */}
          <div className="bg-[#FDFBF7] p-10 shadow-[0_20px_40px_-10px_rgba(10,42,27,0.4)] hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden group border border-[#D4AF37]/10">
            <div className="absolute -right-4 -top-4 font-serif text-9xl font-bold text-[#0A2A1B]/5 group-hover:text-[#D4AF37]/10 transition-colors duration-500 pointer-events-none">2</div>
            <div className="w-14 h-14 bg-[#03120B] text-[#D4AF37] flex items-center justify-center rounded-sm mb-8">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-2xl text-[#03120B] font-bold mb-4">Money Tree Fund</h3>
            <p className="text-[#0A2A1B]/80 font-medium text-sm leading-relaxed">
              Our core offering ensures certified performance guidance tailored to your physical goals. No fads, only peer-reviewed, evidence-based regimens.
            </p>
          </div>

          {/* 03 */}
          <div className="bg-[#FDFBF7] p-10 shadow-[0_20px_40px_-10px_rgba(10,42,27,0.4)] hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden group border border-[#D4AF37]/10">
            <div className="absolute -right-4 -top-4 font-serif text-9xl font-bold text-[#0A2A1B]/5 group-hover:text-[#D4AF37]/10 transition-colors duration-500 pointer-events-none">3</div>
            <div className="w-14 h-14 bg-[#03120B] text-[#D4AF37] flex items-center justify-center rounded-sm mb-8">
              <Lock className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-2xl text-[#03120B] font-bold mb-4">Exclusive Access</h3>
            <p className="text-[#0A2A1B]/80 font-medium text-sm leading-relaxed">
              Membership is strictly capped, ensuring immediate equipment availability and a high-focus environment. Your privacy and security remain our paramount concerns.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
