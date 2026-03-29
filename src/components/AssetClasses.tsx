
export const AssetClasses = () => {
  return (
    <section id="portfolios" className="py-32 bg-[#FDFBF7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-[#0A2A1B]/20 pb-8">
          <div>
            <span className="text-[#AA8825] text-sm font-bold tracking-[0.2em] uppercase mb-3 block">Our Services</span>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#03120B]">Asset Classes</h2>
          </div>
          <p className="text-[#0A2A1B]/80 font-medium max-w-sm text-sm leading-relaxed mt-6 md:mt-0 md:text-right">
            Diversified physical investments designed to yield compounding long-term health benefits.
          </p>
        </div>

        <div className="space-y-6">
          {/* Class Row */}
          <div className="group bg-[#03120B] p-8 flex flex-col md:flex-row justify-between md:items-center gap-6 hover:bg-[#0A2A1B] hover:shadow-[0_20px_40px_-10px_rgba(10,42,27,0.4)] transition-all duration-300 rounded-sm">
            <div className="flex items-center gap-6 md:w-1/3">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#03120B] flex items-center justify-center font-serif text-xl italic group-hover:bg-white transition-colors">01</div>
              <h4 className="font-serif text-2xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">Equities</h4>
            </div>
            <p className="text-white/80 text-sm font-medium leading-relaxed md:w-1/2">Compound movements to build foundational physical capital. Precision free weight conditioning.</p>
            <div className="md:w-auto text-right">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#03120B] bg-[#D4AF37] px-4 py-2 rounded-sm">High Yield</span>
            </div>
          </div>
          
          <div className="group bg-[#03120B] p-8 flex flex-col md:flex-row justify-between md:items-center gap-6 hover:bg-[#0A2A1B] hover:shadow-[0_20px_40px_-10px_rgba(10,42,27,0.4)] transition-all duration-300 rounded-sm">
            <div className="flex items-center gap-6 md:w-1/3">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#03120B] flex items-center justify-center font-serif text-xl italic group-hover:bg-white transition-colors">02</div>
              <h4 className="font-serif text-2xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">Bonds</h4>
            </div>
            <p className="text-white/80 text-sm font-medium leading-relaxed md:w-1/2">Steady-state training for cardiovascular stability, utilizing state-of-the-art ergometers.</p>
            <div className="md:w-auto text-right">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white border border-white/30 px-4 py-2 rounded-sm">Low Risk</span>
            </div>
          </div>

          <div className="group bg-[#03120B] p-8 flex flex-col md:flex-row justify-between md:items-center gap-6 hover:bg-[#0A2A1B] hover:shadow-[0_20px_40px_-10px_rgba(10,42,27,0.4)] transition-all duration-300 rounded-sm">
            <div className="flex items-center gap-6 md:w-1/3">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#03120B] flex items-center justify-center font-serif text-xl italic group-hover:bg-white transition-colors">03</div>
              <h4 className="font-serif text-2xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">Dividends</h4>
            </div>
            <p className="text-white/80 text-sm font-medium leading-relaxed md:w-1/2">Sauna, cold plunge, and mobility work to protect and compound gains over time.</p>
            <div className="md:w-auto text-right">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white border border-white/30 px-4 py-2 rounded-sm">Recovery</span>
            </div>
          </div>

          <div className="group bg-[#03120B] p-8 flex flex-col md:flex-row justify-between md:items-center gap-6 hover:bg-[#0A2A1B] hover:shadow-[0_20px_40px_-10px_rgba(10,42,27,0.4)] transition-all duration-300 rounded-sm">
            <div className="flex items-center gap-6 md:w-1/3">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#03120B] flex items-center justify-center font-serif text-xl italic group-hover:bg-white transition-colors">04</div>
              <h4 className="font-serif text-2xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">Advisory</h4>
            </div>
            <p className="text-white/80 text-sm font-medium leading-relaxed md:w-1/2">Bespoke 1-on-1 portfolio management with a dedicated physical wealth manager.</p>
            <div className="md:w-auto text-right">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#03120B] bg-[#D4AF37] px-4 py-2 rounded-sm">Premium</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
