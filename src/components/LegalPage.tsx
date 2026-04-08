import { ChevronLeft } from 'lucide-react';

interface LegalPageProps {
  title: string;
  onBack: () => void;
}

interface LegalSection {
  header: string;
  text: string;
  email?: string;
}

export const LegalPage = ({ title, onBack }: LegalPageProps) => {
  const getLegalContent = (): LegalSection[] => {
    const defaultContact: LegalSection = {
      header: "04. Contact & Inquiries",
      text: "For detailed queries regarding the specific clauses and jurisdictional applications of these protocols, please contact our executive relations department.",
      email: "admin@moneytreefundtrustee.com"
    };

    switch (title) {
      case 'Terms of Service':
        return [
          {
            header: "01. Professional Engagement",
            text: "By engaging with Money Tree Fund, you acknowledge that our services are concentrated on structured trustee administration and physical capital optimization. This engagement is governed by a commitment to fiduciary stewardship and the unyielding protection of institutional assets."
          },
          {
            header: "02. Proprietary Methodology",
            text: "All administrative structures, jurisdictional frameworks, and fiduciary protocols established by Money Tree Fund remain the exclusive intellectual property of the firm. Unauthorized replication or distribution of these professional frameworks is strictly prohibited."
          },
          {
            header: "03. Service Limitations",
            text: "Our operations constitute administrative and trustee services. They do not constitute investment, financial, or legal advice. Clients are encouraged to seek independent counsel for specific jurisdictional tax and legal implications of their trust structures."
          },
          defaultContact
        ];
      case 'Privacy Policy':
        return [
          {
            header: "01. Data Stewardship",
            text: "We maintain a rigorous protocol for the stewardship of all client data. Our systems are designed to ensure the absolute confidentiality of physical asset records and beneficiary identities, utilizing advanced encryption and isolated server environments."
          },
          {
            header: "02. Information Collection",
            text: "We collect only the essential documentation required for KYC (Know Your Customer) and AML (Anti-Money Laundering) compliance. This includes verified jurisdictional identities, record of physical capital origin, and beneficiary designated protocols."
          },
          {
            header: "03. Confidentiality Guarantee",
            text: "Money Tree Fund maintains a zero-sharing policy. No personal data or structural information is shared with third-party marketing entities. Disclosure only occurs through formal legal mandate within the specified governing jurisdictions."
          },
          defaultContact
        ];
      case 'Liability Waiver':
        return [
          {
            header: "01. Assumption of Risk",
            text: "Participation in multi-jurisdictional trust structures involves inherent complexities. By utilizing our services, the client acknowledges and assumes the risks associated with jurisdictional shifts, physical asset storage variables, and administrative transitions."
          },
          {
            header: "02. Indemnification",
            text: "Clients agree to indemnify and hold harmless Money Tree Fund, its trustees, and its executive officers from any claims, losses, or administrative liabilities arising from the execution of designated trust protocols or third-party jurisdictional interference."
          },
          {
            header: "03. Execution Performance",
            text: "Money Tree Fund does not guarantee specific performance outcomes of physical assets. Our role is strictly limited to the fiduciary oversight and administrative protection of the capital in accordance with the established trust deed."
          },
          defaultContact
        ];
      default:
        return [
          {
            header: "01. General Provisions",
            text: "This document outlines the general provisions for the specified legal category. We maintain the highest standards of transparency and professional conduct across all corporate documentation."
          },
          defaultContact
        ];
    }
  };

  const sections = getLegalContent();

  return (
    <div className="min-h-screen bg-[#03120B] pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-texture-dark">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#D4AF37] hover:text-[#FDFBF7] transition-colors mb-12 uppercase text-[10px] font-bold tracking-[0.3em]"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Home
        </button>

        <h1 className="font-serif text-5xl lg:text-7xl text-[#FDFBF7] mb-12 font-bold leading-tight uppercase tracking-tight">
          {title}<span className="text-[#D4AF37]">.</span>
        </h1>
        
        <div className="prose prose-invert prose-gold max-w-none">
          <div className="space-y-16">
            {sections.map((section, index) => (
              <section key={index} className="border-l border-[#D4AF37]/20 pl-8">
                <h2 className="text-[#D4AF37] font-serif text-2xl font-bold mb-6 uppercase tracking-widest text-[11px]">{section.header}</h2>
                <p className="text-[#FDFBF7]/70 text-base leading-relaxed font-medium">
                  {section.text}
                </p>
                {section.email && (
                  <div className="mt-8 bg-[#0A2A1B]/50 border border-[#D4AF37]/10 p-6 inline-block">
                    <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.2em] uppercase block mb-2">Executive Relations</span>
                    <a href={`mailto:${section.email}`} className="text-[#FDFBF7] font-serif text-xl italic hover:text-[#D4AF37] transition-colors">
                      {section.email}
                    </a>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
