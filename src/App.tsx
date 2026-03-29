import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Ticker } from './components/Ticker';
import { Methodology } from './components/Methodology';
import { AssetClasses } from './components/AssetClasses';
import { Tiers } from './components/Tiers';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="font-sans bg-[#03120B] text-white antialiased font-light overflow-x-hidden">
      <Navbar />
      <Hero />
      <Ticker />
      <Methodology />
      <AssetClasses />
      <Tiers />
      <Footer />
    </div>
  );
}

export default App;
