import { Send } from 'lucide-react';

export const Contact = () => {
  return (
    <section id="contact" className="py-32 relative overflow-hidden bg-[#03120B]">
      {/* Gold radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#D4AF37]/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-texture-dark pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center mb-16">
          <span className="text-[#D4AF37] text-sm font-bold tracking-[0.2em] uppercase mb-4">Engagement</span>
          <div className="w-12 h-1 bg-[#D4AF37]/40 mb-8" />
          <h2 className="font-serif text-4xl lg:text-6xl text-[#FDFBF7] text-center font-bold leading-tight">
            Contact &amp; <br />
            <span className="italic text-[#D4AF37] font-medium">Correspondence.</span>
          </h2>
          <p className="text-[#FDFBF7]/50 text-center mt-6 max-w-lg font-medium text-sm leading-relaxed">
            We value your enquiries and correspondence. Our team is dedicated to providing professional and timely responses to all communications.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FDFBF7]/40 ml-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-[#0A2A1B]/60 border border-[#D4AF37]/15 hover:border-[#D4AF37]/30 px-6 py-4 text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37] transition-colors rounded-sm shadow-sm placeholder:text-[#FDFBF7]/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FDFBF7]/40 ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-[#0A2A1B]/60 border border-[#D4AF37]/15 hover:border-[#D4AF37]/30 px-6 py-4 text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37] transition-colors rounded-sm shadow-sm placeholder:text-[#FDFBF7]/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FDFBF7]/40 ml-1">Subject</label>
              <input
                type="text"
                placeholder="How can we assist you?"
                className="w-full bg-[#0A2A1B]/60 border border-[#D4AF37]/15 hover:border-[#D4AF37]/30 px-6 py-4 text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37] transition-colors rounded-sm shadow-sm placeholder:text-[#FDFBF7]/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FDFBF7]/40 ml-1">Message</label>
              <textarea
                rows={6}
                placeholder="Share your enquiry or feedback here..."
                className="w-full bg-[#0A2A1B]/60 border border-[#D4AF37]/15 hover:border-[#D4AF37]/30 px-6 py-4 text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37] transition-colors rounded-sm shadow-sm resize-none placeholder:text-[#FDFBF7]/20"
              />
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="button"
                className="bg-[#D4AF37] text-[#03120B] px-12 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#FDFBF7] transition-all duration-300 flex items-center gap-3 rounded-sm shadow-[0_12px_32px_-8px_rgba(212,175,55,0.5)] group"
              >
                Submit Message <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
