import { Anchor, Shield, Scale } from 'lucide-react';

export const Methodology = () => {
  return (
    <section id="about" className="py-32 relative overflow-hidden bg-[#03120B]">
      {/* Subtle gold gradients for coordination */}
      <div className="absolute -left-32 top-1/4 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-72 h-72 rounded-full bg-[#D4AF37]/5 blur-2xl pointer-events-none" />
      <div className="absolute inset-0 bg-texture-dark opacity-40 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-[#FDFBF7]">
        <div className="flex flex-col items-center mb-24">
          <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.3em] uppercase mb-4">About The Firm</span>
          <div className="w-12 h-1 bg-[#D4AF37]/40 mb-8"></div>
          <h2 className="font-serif text-4xl lg:text-7xl text-center font-bold leading-tight">
            Established for Structured <br />
            <span className="italic text-[#D4AF37] font-medium">Trust Administration.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          {/* Firm Overview */}
          <div className="group bg-[#0A2A1B]/80 border border-[#D4AF37]/10 hover:border-[#D4AF37]/40 p-10 shadow-[0_20px_40px_-10px_rgba(3,18,11,0.6)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden rounded-sm">
            <div className="absolute -right-4 -top-4 font-serif text-9xl font-bold text-[#D4AF37]/5 group-hover:text-[#D4AF37]/10 transition-colors pointer-events-none">1</div>
            <div className="w-14 h-14 bg-[#D4AF37]/10 border border-[#D4AF37]/20 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] text-[#D4AF37] group-hover:text-[#03120B] flex items-center justify-center mb-8 transition-all duration-500">
              <Anchor className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-4 group-hover:text-[#D4AF37] transition-colors">Firm Overview</h3>
            <p className="text-[#FDFBF7]/50 text-sm font-medium leading-relaxed group-hover:text-[#FDFBF7]/70 transition-colors">
              Established to provide structured trustee administration and fiduciary services for individuals, institutions, and beneficiary groups across complex multi-jurisdictional landscapes.
            </p>
          </div>
          
          {/* Our Mission */}
          <div className="group bg-[#0A2A1B]/80 border border-[#D4AF37]/10 hover:border-[#D4AF37]/40 p-10 shadow-[0_20px_40px_-10px_rgba(3,18,11,0.6)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden rounded-sm">
            <div className="absolute -right-4 -top-4 font-serif text-9xl font-bold text-[#D4AF37]/5 group-hover:text-[#D4AF37]/10 transition-colors pointer-events-none">2</div>
            <div className="w-14 h-14 bg-[#D4AF37]/10 border border-[#D4AF37]/20 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] text-[#D4AF37] group-hover:text-[#03120B] flex items-center justify-center mb-8 transition-all duration-500">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-4 group-hover:text-[#D4AF37] transition-colors">Our Mission</h3>
            <p className="text-[#FDFBF7]/50 text-sm font-medium leading-relaxed group-hover:text-[#FDFBF7]/70 transition-colors">
              To protect beneficiary interests through reliable governance, unyielding transparency, and structural integrity.
            </p>
          </div>

          {/* Core Values */}
          <div className="group bg-[#0A2A1B]/80 border border-[#D4AF37]/10 hover:border-[#D4AF37]/40 p-10 shadow-[0_20px_40px_-10px_rgba(3,18,11,0.6)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden rounded-sm">
            <div className="absolute -right-4 -top-4 font-serif text-9xl font-bold text-[#D4AF37]/5 group-hover:text-[#D4AF37]/10 transition-colors pointer-events-none">3</div>
            <div className="w-14 h-14 bg-[#D4AF37]/10 border border-[#D4AF37]/20 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] text-[#D4AF37] group-hover:text-[#03120B] flex items-center justify-center mb-8 transition-all duration-500">
              <Scale className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-4 group-hover:text-[#D4AF37] transition-colors">Core Values</h3>
            <p className="text-[#FDFBF7]/50 text-sm font-medium leading-relaxed group-hover:text-[#FDFBF7]/70 transition-colors">
              We combine trustee expertise with stringent compliance practices, building our foundation on four pillars: <span className="text-[#FDFBF7] font-bold">Integrity, Transparency, Security, and Accountability.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
