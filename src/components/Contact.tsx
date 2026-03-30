import { Send } from 'lucide-react';

export const Contact = () => {
  return (
    <section id="contact" className="py-32 bg-[#FDFBF7] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center mb-16">
          <span className="text-[#AA8825] text-sm font-bold tracking-[0.2em] uppercase mb-4">Engagement</span>
          <div className="w-12 h-1 bg-[#03120B] mb-8"></div>
          <h2 className="font-serif text-4xl lg:text-6xl text-[#03120B] text-center font-bold leading-tight">
            Contact & <br />
            <span className="italic text-[#AA8825] font-medium">Feedback.</span>
          </h2>
          <p className="text-[#03120B]/70 text-center mt-6 max-w-lg font-medium">
            We value your inquiries and feedback. Our team is dedicated to providing professional and timely responses to all communications.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#03120B]/60 ml-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full bg-white border border-[#03120B]/10 px-6 py-4 text-[#03120B] focus:outline-none focus:border-[#D4AF37] transition-colors rounded-sm shadow-sm placeholder:text-[#03120B]/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#03120B]/60 ml-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full bg-white border border-[#03120B]/10 px-6 py-4 text-[#03120B] focus:outline-none focus:border-[#D4AF37] transition-colors rounded-sm shadow-sm placeholder:text-[#03120B]/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#03120B]/60 ml-1">Subject</label>
              <input 
                type="text" 
                placeholder="How can we assist you?"
                className="w-full bg-white border border-[#03120B]/10 px-6 py-4 text-[#03120B] focus:outline-none focus:border-[#D4AF37] transition-colors rounded-sm shadow-sm placeholder:text-[#03120B]/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#03120B]/60 ml-1">Message</label>
              <textarea 
                rows={6}
                placeholder="Share your feedback or inquiry here..."
                className="w-full bg-white border border-[#03120B]/10 px-6 py-4 text-[#03120B] focus:outline-none focus:border-[#D4AF37] transition-colors rounded-sm shadow-sm resize-none placeholder:text-[#03120B]/20"
              ></textarea>
            </div>

            <div className="flex justify-center pt-4">
              <button 
                type="button"
                className="bg-[#03120B] text-white px-12 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#D4AF37] hover:text-[#03120B] transition-all duration-300 flex items-center gap-3 rounded-sm shadow-lg group"
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
