import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Ticker } from './components/Ticker';
import { Methodology } from './components/Methodology';
import { AssetClasses } from './components/AssetClasses';
import { Process } from './components/Process';
import { Insights } from './components/Insights';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { LegalPage } from './components/LegalPage';

function App() {
  const [activePage, setActivePage] = useState<string | null>(null);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage]);

  if (activePage) {
    return (
      <div className="font-sans bg-[#03120B] text-[#FDFBF7] antialiased font-light overflow-x-hidden">
        <Navbar onHome={() => setActivePage(null)} onSectionClick={() => setActivePage(null)} />
        <LegalPage title={activePage} onBack={() => setActivePage(null)} />
        <Footer onPageChange={setActivePage} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03120B] selection:bg-[#D4AF37] selection:text-[#03120B] snap-y snap-mandatory overflow-y-auto">
      <Navbar onHome={() => setActivePage(null)} onSectionClick={() => setActivePage(null)} />
      
      <main className="snap-start" id="home">
        <Hero />
        <Ticker />
      </main>

      <div className="snap-start">
        <Methodology />
      </div>

      <div className="snap-start">
        <AssetClasses />
      </div>

      <div className="snap-start">
        <Process />
      </div>

      <div className="snap-start">
        <Insights />
      </div>

      <div className="snap-start">
        <Contact />
      </div>

      <Footer onPageChange={setActivePage} />
    </div>
  );
}

export default App;
