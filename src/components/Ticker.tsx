import { ShieldCheck, Lock } from 'lucide-react';

export const Ticker = () => {
  return (
    <div className="bg-[#FDFBF7] border-b border-[#0A2A1B]/10 py-4 flex justify-center relative z-20">
      <div className="flex gap-12 md:gap-24 text-xs font-bold tracking-[0.2em] text-[#0A2A1B] uppercase items-center">
        <span className="hidden md:flex items-center gap-3 text-[#0A2A1B]">NYSE: <span className="text-[#AA8825]">MTF</span></span>
        <span className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-[#D4AF37]" /> Audited Data</span>
        <span className="flex items-center gap-3"><Lock className="h-4 w-4 text-[#D4AF37]" /> Secure Access</span>
        <span className="hidden sm:inline text-[#0A2A1B]">Est. 2024</span>
      </div>
    </div>
  );
};
