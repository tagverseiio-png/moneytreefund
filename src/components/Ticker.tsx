import { ShieldCheck, Lock, TrendingUp, Star } from 'lucide-react';

export const Ticker = () => {
  return (
    <div className="bg-[#0A2A1B] border-b border-[#D4AF37]/20 py-5 flex justify-center relative z-20 overflow-hidden">
      {/* Subtle shimmer bar */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent pointer-events-none" />
      <div className="flex gap-10 md:gap-16 text-[10px] font-bold tracking-[0.22em] text-[#FDFBF7]/60 uppercase items-center">
        <span className="flex items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 text-[#D4AF37] shrink-0" />
          Audited & Secure
        </span>
        <span className="w-px h-4 bg-[#D4AF37]/20" />
        <span className="flex items-center gap-2.5">
          <Lock className="h-4 w-4 text-[#D4AF37] shrink-0" />
          Independent Trustees
        </span>
        <span className="w-px h-4 bg-[#D4AF37]/20" />
        <span className="flex items-center gap-2.5">
          <TrendingUp className="h-4 w-4 text-[#D4AF37] shrink-0" />
          Capital Protected
        </span>
        <span className="hidden md:flex items-center gap-2.5">
          <span className="w-px h-4 bg-[#D4AF37]/20" />
          <Star className="h-4 w-4 text-[#D4AF37] shrink-0" />
          Elite Membership
        </span>
      </div>
    </div>
  );
};
