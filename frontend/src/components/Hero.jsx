import { NetworkCanvas } from './NetworkCanvas';

export function Hero() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      <NetworkCanvas />
      
      <div className="relative z-10 w-full max-w-[90%] md:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
        {/* AUMENTAMOS de max-w-3xl para max-w-5xl para dar espaço à frase */}
        <div className="max-w-5xl mt-16">

          <div className="inline-flex items-center space-x-2 border border-nardo/30 bg-nardo/10 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md max-w-full">
             <span className="w-1.5 h-1.5 rounded-full bg-nardo animate-ping shrink-0"></span>
             <span className="font-sans text-[10px] sm:text-xs font-medium text-nardo tracking-widest uppercase truncate">Graduando em Ciência da Computação</span>
          </div>
          
          {/* Ajuste suave na responsividade da fonte para garantir o encaixe perfeito */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Transformando dados <br />
            em <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-nardo">
              Inteligência.
            </span>
          </h1>
          
          {/* Limitei a largura apenas do parágrafo para ele não esticar muito nas telas grandes */}
          <p className="text-accent text-base sm:text-lg md:text-xl font-light max-w-2xl">
            Olá, meu nome é Igor e sou estudante de Ciência da Computação na UFC.
          </p>
        </div>
      </div>
    </section>
  );
}