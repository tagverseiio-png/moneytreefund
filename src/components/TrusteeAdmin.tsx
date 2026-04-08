import { ShieldCheck, Lock, Activity } from 'lucide-react';
import { useState } from 'react';
import { Modal } from './Modal';

export const TrusteeAdmin = () => {
  const [selectedItem, setSelectedItem] = useState<{title: string, subtitle: string, content: string[]} | null>(null);

  const categories = [
    {
      title: 'Indemnity',
      subtitle: 'PROFESSIONAL',
      icon: ShieldCheck,
      details: [
        'Our Professional Indemnity framework provides comprehensive coverage for errors and omissions in the execution of complex trust mandates.',
        'We maintain high-limit specialized legal defense mapping to ensure that all fiduciary actions are shielded from operational vulnerabilities.',
        'Every professional engagement is backed by an institutional commitment to absolute structural integrity.'
      ],
      items: ['Errors & Omissions', 'Specialized legal defense mapping'],
      tag: null
    },
    {
      title: 'Liability',
      subtitle: 'ADMINISTRATIVE',
      icon: Lock,
      details: [
        'Strategic shielding for trustee frameworks involves the isolation of individual trust assets from broader institutional or jurisdictional liabilities.',
        'Our Fiduciary Operation Coverage is designed to protect both the trust itself and the assigned trustees during the distribution of Entitlements.',
        'We provide integrated advisory services to navigate the complexities of multi-jurisdictional liability landscapes.'
      ],
      items: ['Shielding Trustee Frameworks', 'Fiduciary Operation Coverage', 'Integrated Advisory'],
      tag: 'COMPREHENSIVE'
    },
    {
      title: 'Prevention',
      subtitle: 'OPERATIONAL RISK',
      icon: Activity,
      details: [
        'Risk prevention is maintained through systematic, quarterly vulnerability audits of all trust structures and asset storage protocols.',
        'We offer multi-jurisdictional cover that anticipates changes in regulatory environments before they impact the trust stability.',
        'Our systemic risk monitoring utilizes advanced governance frameworks to ensure ongoing protection of physical capital.'
      ],
      items: ['Systematic Vulnerability Audits', 'Multi-Jurisdictional Cover'],
      tag: null
    }
  ];

  return (
    <section id="risk" className="py-36 relative overflow-hidden bg-[#03120B]">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-texture-dark opacity-40 pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center mb-24">
          <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Risk Management</span>
          <div className="w-12 h-1 bg-[#D4AF37]/40 mb-10"></div>
          <h2 className="font-serif text-5xl lg:text-[5.5rem] font-bold text-[#FDFBF7] text-center leading-none mb-6">
            Money Tree Fund
          </h2>
          <p className="font-serif text-2xl lg:text-4xl text-[#D4AF37] italic font-medium text-center opacity-80">
            Secure Trustee Administration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <div key={i} className={`relative flex flex-col p-10 border transition-all duration-500 rounded-sm ${cat.tag ? 'bg-[#0A2A1B] border-[#D4AF37] scale-105 shadow-[0_40px_80px_-20px_rgba(3,18,11,0.6)]' : 'bg-[#0A2A1B]/50 border-[#D4AF37]/10 hover:border-[#D4AF37]/40 hover:bg-[#0A2A1B] shadow-xl'}`}>
              {cat.tag && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-[#03120B] text-[9px] font-bold tracking-[0.2em] px-6 py-2 rounded-sm shadow-lg whitespace-nowrap uppercase">
                  {cat.tag}
                </div>
              )}
              
              <div className="mb-10 text-center">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4 block text-[#D4AF37]/50">{cat.subtitle}</span>
                <h3 className="font-serif text-4xl font-bold mb-8 text-[#FDFBF7]">{cat.title}</h3>
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-sm mb-10 border bg-[#D4AF37]/10 border-[#D4AF37]/20 text-[#D4AF37]">
                  <cat.icon className="h-7 w-7" />
                </div>
              </div>

              <div className="space-y-4">
                {cat.items.map((item, j) => (
                  <div key={j} className="flex items-start gap-4">
                    <div className="mt-1.5 w-4 h-4 rounded-full border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    </div>
                    <span className="text-sm font-medium leading-relaxed text-[#FDFBF7]/60">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setSelectedItem({title: cat.title, subtitle: cat.subtitle, content: cat.details})}
                className="mt-12 py-4 px-8 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#03120B] rounded-sm text-center"
              >
                {cat.title === 'Prevention' ? 'Inquire' : cat.title === 'Liability' ? 'Explore Structure' : 'Discover'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        title={selectedItem?.title || ''}
        subtitle={selectedItem?.subtitle}
        content={selectedItem?.content || []}
      />
    </section>
  );
};
