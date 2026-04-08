import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  content: string[];
}

export const Modal = ({ isOpen, onClose, title, subtitle, content }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#03120B]/95 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-[#0A2A1B] border border-[#D4AF37]/30 max-w-2xl w-full p-8 lg:p-12 shadow-2xl animate-in fade-in zoom-in duration-300 rounded-sm">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-10">
          {subtitle && (
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block">
              {subtitle}
            </span>
          )}
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
            {title}<span className="text-[#D4AF37]">.</span>
          </h2>
        </div>

        <div className="space-y-6">
          {content.map((paragraph, i) => (
            <p key={i} className="text-[#FDFBF7]/70 text-base leading-relaxed font-medium">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-[#D4AF37] text-[#03120B] px-8 py-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#FDFBF7] transition-all"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
