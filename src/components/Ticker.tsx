import { ShieldCheck, Lock, TrendingUp, Star } from 'lucide-react';

export const Ticker = () => {
  const items = [
    { icon: ShieldCheck, text: "Audited & Secure" },
    { icon: Lock, text: "Independent Trustees" },
    { icon: TrendingUp, text: "Capital Protected" },
    { icon: Star, text: "Elite Membership" },
    { icon: ShieldCheck, text: "Global Compliance" },
    { icon: Lock, text: "Institutional Custody" },
  ];

  return (
    <div className="bg-[#0A2A1B] border-b border-[#D4AF37]/20 py-4 relative z-20 overflow-hidden">
      {/* Subtle shimmer bar */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent pointer-events-none z-10" />
      
      <div className="flex whitespace-nowrap overflow-hidden">
        {/* Doubled for seamless loop */}
        <div className="flex animate-marquee gap-10 md:gap-16 items-center px-4">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 shrink-0">
              <item.icon className="h-4 w-4 text-[#D4AF37]" />
              <span className="text-[9px] md:text-[10px] font-bold tracking-[0.22em] text-[#FDFBF7]/60 uppercase whitespace-nowrap">
                {item.text}
              </span>
              <span className="w-px h-4 bg-[#D4AF37]/20 ml-10 md:ml-16" />
            </div>
          ))}
        </div>
        <div className="flex animate-marquee gap-10 md:gap-16 items-center px-4" aria-hidden="true">
          {items.map((item, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-3 shrink-0">
              <item.icon className="h-4 w-4 text-[#D4AF37]" />
              <span className="text-[9px] md:text-[10px] font-bold tracking-[0.22em] text-[#FDFBF7]/60 uppercase whitespace-nowrap">
                {item.text}
              </span>
              <span className="w-px h-4 bg-[#D4AF37]/20 ml-10 md:ml-16" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};
