export function Navbar() {

  const scrollToSection = (e, targetId) => {
    e.preventDefault();

    if (targetId === 'contato') {
      window.scrollTo({ 
        top: document.documentElement.scrollHeight, 
        behavior: 'smooth' 
      });
      return; 
    }

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="fixed w-full z-50 glass top-0">
      <div className="max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 font-bold text-xl tracking-wider">
            {"{"} <span className="text-nardo">Igor Santana</span> {"}"}
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8 text-sm">
              <a href="#sobre" onClick={(e) => scrollToSection(e, 'sobre')} className="hover:text-nardo transition-colors duration-300">Sobre</a>
              <a href="#projetos" onClick={(e) => scrollToSection(e, 'projetos')} className="hover:text-nardo transition-colors duration-300">Projetos</a>
              <a href="#playground" onClick={(e) => scrollToSection(e, 'playground')} className="hover:text-nardo transition-colors duration-300">Lab</a>
              <a href="#contato" onClick={(e) => scrollToSection(e, 'contato')} className="px-4 py-2 rounded-md border border-nardo hover:bg-white hover:text-dark transition-all duration-300">Contato</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}