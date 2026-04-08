import { BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Modal } from './Modal';

export const Insights = () => {
  const [selectedArticle, setSelectedArticle] = useState<{title: string, tag: string, content: string[]} | null>(null);

  const articles = [
    {
      title: 'Trustee Responsibilities',
      tag: 'GOVERNANCE',
      details: [
        'A trustee has a strict fiduciary duty to manage assets for the benefit of others. This involves high standards of care, loyalty, and impartiality.',
        'Core responsibilities include preserving the trust property, maintaining accurate accounting records, and ensuring that all distributions align with the trust deed.',
        'Money Tree Fund trustees are accredited professionals specialized in multi-generational wealth preservation and multi-jurisdictional compliance.'
      ]
    },
    {
      title: 'Fiduciary Governance',
      tag: 'COMPLIANCE',
      details: [
        'Institutional fiduciary governance requires a robust framework of internal controls and independent auditing to protect asset integrity.',
        'We implement strict protocols for asset oversight, ensuring that every transaction is verified and every beneficiary distribution is authenticated.',
        'Our governance model is designed to exceed standard regulatory requirements, providing an elite layer of protection for private physical capital.'
      ]
    },
    {
      title: 'Asset Protection Through Trust Structures',
      tag: 'STRATEGY',
      details: [
        'Advanced trust structures provide a powerful shield against unforeseen institutional instability and jurisdictional wealth erosion.',
        'By isolating physical capital within bespoke trusts, clients can ensure that their legacy remains untouched by external financial volatility.',
        'Money Tree Fund architects specific strategies tailored to the unique jurisdictional needs of each trust, maximizing structural security.'
      ]
    },
    {
      title: 'Trust Structures & Long-Term Wealth Planning',
      tag: 'PLANNING',
      details: [
        'Successful wealth planning is not just about asset growth, but about ensuring the safe transit of capital across generations.',
        'Trust structures facilitate seamless succession planning, allowing for the controlled distribution of wealth while avoiding costly probate delays.',
        'Our planning methodology emphasizes the preservation of both the physical capital and the strategic intent of the original trust settlor.'
      ]
    }
  ];

  return (
    <section id="insights" className="py-24 bg-[#03120B] relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-texture-dark opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center mb-20">
          <div className="w-12 h-1 bg-[#D4AF37]/40 mb-10"></div>
          <h2 className="font-serif text-5xl lg:text-7xl text-[#FDFBF7] text-center font-bold leading-tight">
            Financial <br />
            <span className="italic text-[#D4AF37] font-medium">Insights.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, i) => (
            <div key={i} className="bg-[#0A2A1B]/60 border border-[#D4AF37]/10 p-8 pt-10 h-[380px] flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all duration-500 rounded-sm group">
              <div>
                <div className="w-12 h-12 border border-[#D4AF37]/20 flex items-center justify-center rounded-sm mb-12">
                  <BookOpen className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-5 block opacity-80">{article.tag}</span>
                <h3 className="font-serif text-2xl font-bold text-[#FDFBF7] leading-[1.2] mb-8 group-hover:text-[#D4AF37] transition-colors">{article.title}</h3>
              </div>
              
              <button 
                onClick={() => setSelectedArticle({title: article.title, tag: article.tag, content: article.details})}
                className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase text-[#D4AF37] hover:text-[#FDFBF7] transition-all"
              >
                READ FURTHER <span className="text-sm font-medium transition-transform group-hover:translate-x-1">&gt;</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={!!selectedArticle} 
        onClose={() => setSelectedArticle(null)} 
        title={selectedArticle?.title || ''}
        subtitle={selectedArticle?.tag}
        content={selectedArticle?.content || []}
      />
    </section>
  );
};
