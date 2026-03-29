import { ChevronLeft } from 'lucide-react';

interface LegalPageProps {
  title: string;
  onBack: () => void;
}

export const LegalPage = ({ title, onBack }: LegalPageProps) => {
  return (
    <div className="min-h-screen bg-[#03120B] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors mb-12 uppercase text-xs font-bold tracking-[0.2em]"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Home
        </button>

        <h1 className="font-serif text-4xl lg:text-6xl text-white mb-12 font-bold">{title}</h1>
        
        <div className="prose prose-invert prose-gold max-w-none">
          <p className="text-white/70 text-lg leading-relaxed mb-8 font-medium">
            This document outlines the official {title.toLowerCase()} for Money Tree Fund. As a private physical wealth management firm, we maintain the highest standards of transparency and professional conduct.
          </p>
          
          <div className="space-y-12">
            <section>
              <h2 className="text-[#D4AF37] font-serif text-2xl font-bold mb-4 uppercase tracking-wide">Overview</h2>
              <p className="text-white/60 leading-relaxed">
                Money Tree Fund operates with the objective of providing elite performance management and physical capital optimization. Our policies and corporate structure are designed to protect our clients' interests and ensure long-term physical legacy growth.
              </p>
            </section>

            <section>
              <h2 className="text-[#D4AF37] font-serif text-2xl font-bold mb-4 uppercase tracking-wide">Regulatory Compliance</h2>
              <p className="text-white/60 leading-relaxed">
                We adhere to strict internal protocols and industry best practices. While our focus is on physical assets, we maintain the same level of auditing and security as a traditional financial institution.
              </p>
            </section>

            <section>
              <h2 className="text-[#D4AF37] font-serif text-2xl font-bold mb-4 uppercase tracking-wide">Inquiries</h2>
              <p className="text-white/60 leading-relaxed">
                For detailed information regarding {title.toLowerCase()}, please contact our executive relations department at <span className="text-white font-bold italic">admin@moneytreefund.com</span>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
