import { ShieldCheck, Lock } from 'lucide-react';

export const Ticker = () => {
  return (
    <div className="bg-[#F5F1E8] border-b border-[#0A2A1B]/10 py-4 flex justify-center relative z-20">
      <div className="flex gap-12 md:gap-20 text-xs font-bold tracking-[0.2em] text-[#0A2A1B] uppercase items-center">
        <span className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-[#D4AF37]" /> Audited Data</span>
        <span className="flex items-center gap-3"><Lock className="h-4 w-4 text-[#D4AF37]" /> Secure Access</span>
      </div>
    </div>
  );
};
