
export const Process = () => {
  const steps = [
    {
      id: '01',
      title: 'Consultation',
      desc: 'Initial deep-dive to review structures and analyze multi-generational objectives.'
    },
    {
      id: '02',
      title: 'Trust Structure Planning',
      desc: 'Rigorous architecting of bespoke, jurisdictional-compliant fiduciary frameworks.'
    },
    {
      id: '03',
      title: 'Trustee Appointment',
      desc: 'Direct assignment of accredited fiduciary personnel to manage the assets.'
    },
    {
      id: '04',
      title: 'Ongoing Administration',
      desc: 'Continuous systemic asset monitoring, tax alignment, and operational auditing.'
    },
    {
      id: '05',
      title: 'Beneficiary Distribution',
      desc: 'Calculated routing of liquidity and entitlements safely to beneficiaries.'
    }
  ];

  return (
    <section id="process" className="py-24 bg-[#03120B] relative overflow-hidden">
      <div className="absolute inset-0 bg-texture-dark opacity-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center mb-16">
          <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.3em] uppercase mb-4 opacity-40">Execution</span>
          <h2 className="font-serif text-5xl text-[#FDFBF7] font-bold">Our Process</h2>
        </div>

        <div className="flex flex-col gap-6">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="group flex flex-col md:flex-row items-center gap-8 md:gap-16 p-8 lg:p-12 bg-[#FDFBF7]/3 border border-[#D4AF37]/5 hover:border-[#D4AF37]/25 transition-all duration-500 rounded-sm"
            >
              {/* Number Circle */}
              <div className="w-16 h-16 rounded-full border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                <span className="font-serif text-2xl italic text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-all duration-500 font-bold">
                  {step.id}
                </span>
              </div>

              {/* Title */}
              <div className="md:w-1/4">
                <h3 className="font-serif text-3xl font-bold text-[#FDFBF7] leading-tight">
                  {step.title}
                </h3>
              </div>

              {/* Description */}
              <div className="md:flex-1">
                <p className="text-[#FDFBF7]/40 text-sm font-medium leading-relaxed max-w-md">
                  {step.desc}
                </p>
              </div>

              {/* Tag/Button */}
              <div className="shrink-0">
                <div className="bg-[#D4AF37] w-32 py-2.5 shadow-lg shadow-[#D4AF37]/10 flex items-center justify-center">
                  <span className="text-[#03120B] text-[9px] font-bold tracking-[0.25em] uppercase">
                    Step {step.id}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
