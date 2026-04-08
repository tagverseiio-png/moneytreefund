import { useState } from 'react';
import { Modal } from './Modal';

export const AssetClasses = () => {
  const [selectedService, setSelectedService] = useState<{title: string, tag: string, content: string[]} | null>(null);

  const services = [
    {
      id: '01',
      title: 'Trust Administration',
      desc: 'Framework setup, documentation, beneficiary records, and comprehensive reporting.',
      details: [
        'Effective trust administration involves the precise setup of the fiduciary framework, including the drafting of trust deeds and jurisdictional registration.',
        'We maintain exhaustive beneficiary records and provide periodic reporting to ensure transparency for all stakeholders.',
        'Our administrative protocols are designed for long-term operational stability and seamless succession.'
      ],
      tag: 'FOUNDATIONAL'
    },
    {
      id: '02',
      title: 'Fiduciary Oversight',
      desc: 'Asset monitoring, compliance verification, and maintaining impartial governance over trust assets.',
      details: [
        'Our oversight system provides continuous monitoring of all trust assets to ensure they are managed in strict accordance with the trust\'s objectives.',
        'We perform rigorous compliance verification across multiple jurisdictions to mitigate regulatory and operational risks.',
        'Impartial governance is at the core of our fiduciary model, ensuring that the interests of the beneficiaries are always the primary focus.'
      ],
      tag: 'GOVERNANCE'
    },
    {
      id: '03',
      title: 'Beneficiary Distribution',
      desc: 'Eligibility verification, streamlined processing, and maintaining perfectly accurate entitlement records.',
      details: [
        'We manage the distribution of trust assets with meticulous care, verifying beneficiary eligibility and ensuring all jurisdictional requirements are met.',
        'Our processing systems are streamlined to provide efficient routing of entitlements while maintaining absolute record accuracy.',
        'We prioritize the safe and secure transit of capital to beneficiaries, backed by our institutional protection protocols.'
      ],
      tag: 'EXECUTION'
    },
    {
      id: '04',
      title: 'Compliance & Governance',
      desc: 'Strict document verification, regular operational checks, and ongoing systemic risk monitoring.',
      details: [
        'Compliance and governance are maintained through a combination of algorithmic risk monitoring and manual expert verification.',
        'We perform regular operational checks to ensure that the fiduciary framework remains robust against external institutional instability.',
        'Our ongoing risk monitoring identifies potential systemic vulnerabilities before they can impact the trust architecture.'
      ],
      tag: 'RISK CONTROL'
    }
  ];

  return (
    <section id="services" className="py-24 bg-[#03120B] relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-texture-dark opacity-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col gap-6">
          {services.map((service) => (
            <div 
              key={service.id} 
              onClick={() => setSelectedService({title: service.title, tag: service.tag, content: service.details})}
              className="group flex flex-col md:flex-row items-center gap-8 md:gap-16 p-8 lg:p-12 bg-[#0A2A1B]/40 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-500 rounded-sm cursor-pointer"
            >
              {/* Number Circle */}
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                <span className="font-serif text-2xl lg:text-3xl italic text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-colors duration-500 font-bold">
                  {service.id}
                </span>
              </div>

              {/* Title */}
              <div className="md:w-1/4">
                <h3 className="font-serif text-3xl lg:text-4xl font-bold text-[#FDFBF7] leading-[1.1]">
                  {service.title.split(' ').map((word, i) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </h3>
              </div>

              {/* Description */}
              <div className="md:flex-1">
                <p className="text-[#FDFBF7]/40 text-sm lg:text-base font-medium leading-relaxed max-w-md">
                  {service.desc}
                </p>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-[#D4AF37]/60 group-hover:text-[#D4AF37] transition-colors uppercase tracking-widest">
                  View Full Protocols <span className="text-xs">→</span>
                </div>
              </div>

              {/* Tag/Button */}
              <div className="shrink-0">
                <div className="bg-[#D4AF37] w-48 py-3.5 shadow-[0_4px_20px_-4px_rgba(212,175,55,0.4)] flex items-center justify-center">
                  <span className="text-[#03120B] text-[10px] font-black tracking-widest uppercase">
                    {service.tag}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={!!selectedService} 
        onClose={() => setSelectedService(null)} 
        title={selectedService?.title || ''}
        subtitle={selectedService?.tag}
        content={selectedService?.content || []}
      />
    </section>
  );
};
