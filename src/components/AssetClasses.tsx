
export const AssetClasses = () => {
  return (
    <section id="portfolios" className="py-32 bg-[#FDFBF7] relative overflow-hidden">
      {/* Premium subtle background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#D4AF37]/5 -skew-x-12 transform translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-[#0A2A1B]/10 pb-12">
          <div className="relative">
            <span className="text-[#AA8825] text-sm font-bold tracking-[0.3em] uppercase mb-4 block">Our Services</span>
            <h2 className="font-serif text-5xl lg:text-6xl font-bold text-[#03120B] leading-tight">Asset Classes</h2>
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-1 h-16 bg-[#D4AF37]"></div>
          </div>
          <p className="text-[#03120B]/60 font-medium max-w-sm text-sm leading-relaxed mt-8 md:mt-0 md:text-right border-l md:border-l-0 md:border-r border-[#D4AF37]/30 pl-6 md:pl-0 md:pr-6">
            Diversified physical investments designed to yield compounding long-term health benefits.
          </p>
        </div>

        <div className="space-y-6">
          {/* Class Row */}
          <div className="group bg-[#03120B] p-8 lg:p-10 flex flex-col md:flex-row justify-between md:items-center gap-6 hover:bg-[#0A2A1B] hover:shadow-[0_40px_80px_-15px_rgba(3,18,11,0.5)] transition-all duration-500 rounded-sm border border-[#D4AF37]/5 hover:border-[#D4AF37]/20">
            <div className="flex items-center gap-8 md:w-1/3">
              <div className="w-14 h-14 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center font-serif text-2xl italic group-hover:bg-[#D4AF37] group-hover:text-[#03120B] transition-all duration-500">01</div>
              <h4 className="font-serif text-3xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">Equities</h4>
            </div>
            <p className="text-white/70 text-sm font-medium leading-relaxed md:w-1/2 group-hover:text-white transition-colors">Compound movements to build foundational physical capital. Precision free weight conditioning.</p>
            <div className="md:w-auto text-right">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#03120B] bg-[#D4AF37] px-6 py-3 rounded-sm shadow-lg shadow-[#D4AF37]/10">High Yield</span>
            </div>
          </div>
          
          <div className="group bg-[#03120B] p-8 lg:p-10 flex flex-col md:flex-row justify-between md:items-center gap-6 hover:bg-[#0A2A1B] hover:shadow-[0_40px_80px_-15px_rgba(3,18,11,0.5)] transition-all duration-500 rounded-sm border border-[#D4AF37]/5 hover:border-[#D4AF37]/20">
            <div className="flex items-center gap-8 md:w-1/3">
              <div className="w-14 h-14 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center font-serif text-2xl italic group-hover:bg-[#D4AF37] group-hover:text-[#03120B] transition-all duration-500">02</div>
              <h4 className="font-serif text-3xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">Bonds</h4>
            </div>
            <p className="text-white/70 text-sm font-medium leading-relaxed md:w-1/2 group-hover:text-white transition-colors">Steady-state training for cardiovascular stability, utilizing state-of-the-art ergometers.</p>
            <div className="md:w-auto text-right">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#03120B] bg-[#D4AF37] px-6 py-3 rounded-sm shadow-lg shadow-[#D4AF37]/10">Low Risk</span>
            </div>
          </div>

          <div className="group bg-[#03120B] p-8 lg:p-10 flex flex-col md:flex-row justify-between md:items-center gap-6 hover:bg-[#0A2A1B] hover:shadow-[0_40px_80px_-15px_rgba(3,18,11,0.5)] transition-all duration-500 rounded-sm border border-[#D4AF37]/5 hover:border-[#D4AF37]/20">
            <div className="flex items-center gap-8 md:w-1/3">
              <div className="w-14 h-14 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center font-serif text-2xl italic group-hover:bg-[#D4AF37] group-hover:text-[#03120B] transition-all duration-500">03</div>
              <h4 className="font-serif text-3xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">Dividends</h4>
            </div>
            <p className="text-white/70 text-sm font-medium leading-relaxed md:w-1/2 group-hover:text-white transition-colors">Sauna, cold plunge, and mobility work to protect and compound gains over time.</p>
            <div className="md:w-auto text-right">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#03120B] bg-[#D4AF37] px-6 py-3 rounded-sm shadow-lg shadow-[#D4AF37]/10">Recovery</span>
            </div>
          </div>

          <div className="group bg-[#03120B] p-8 lg:p-10 flex flex-col md:flex-row justify-between md:items-center gap-6 hover:bg-[#0A2A1B] hover:shadow-[0_40px_80px_-15px_rgba(3,18,11,0.5)] transition-all duration-500 rounded-sm border border-[#D4AF37]/5 hover:border-[#D4AF37]/20">
            <div className="flex items-center gap-8 md:w-1/3">
              <div className="w-14 h-14 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center font-serif text-2xl italic group-hover:bg-[#D4AF37] group-hover:text-[#03120B] transition-all duration-500">04</div>
              <h4 className="font-serif text-3xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">Advisory</h4>
            </div>
            <p className="text-white/70 text-sm font-medium leading-relaxed md:w-1/2 group-hover:text-white transition-colors">Bespoke 1-on-1 portfolio management with a dedicated physical wealth manager.</p>
            <div className="md:w-auto text-right">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#03120B] bg-[#D4AF37] px-6 py-3 rounded-sm shadow-lg shadow-[#D4AF37]/10">Premium</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
