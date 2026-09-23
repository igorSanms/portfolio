import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Projects } from "./components/Projects";
import { Playground } from "./components/Playground";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="antialiased selection:bg-nardo selection:text-white bg-[#050505]">
      <Navbar />      
      <main className="relative z-10 bg-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,1)]">
        <Hero />
        <About />
        <Projects />
        <Playground />
      </main>
      <Footer />
    </div>
  );
}

export default App;