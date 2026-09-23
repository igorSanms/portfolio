export function About() {
  return (
    <section id="sobre" className="py-20 bg-darker">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-17 items-center">
          
          <div>
            <h3 className="text-3xl font-bold mb-6 border-b-2 border-nardo pb-2 inline-block">
              Stack & Sobre Mim
            </h3>
            <p className="text-accent mb-4 leading-relaxed">
              Sou estudante de Ciência da Computação e gosto de entender como as máquinas aprendem e como a Inteligência Artificial 
              pode ser aplicada para resolver problemas reais. Minha jornada acadêmica tem sido voltada para buscar desenvolver tanto os 
              conhecimentos matemáticos quanto a prática necessária para transformar ideias em soluções.
            </p>
            <p className="text-accent mb-4 leading-relaxed">
              Embora Machine Learning seja o subcampo que mais exploro no momento, treinando modelos, trabalhando com dados e ajustando 
              hiperparâmetros, busco uma visão mais ampla da Inteligência Artificial para criar soluções que realmente gerem impacto. Tenho 
              também um interesse especial por Visão Computacional e pela forma como máquinas podem aprender a interpretar imagens e 
              reconhecer padrões. Além disso, gosto de conceitos como cidades inteligentes e da possibilidade de utilizar a tecnologia 
              para criar soluções que tornem o dia a dia das pessoas mais simples e eficiente.
            </p>
            <p className="text-accent leading-relaxed">
              Quando não estou estudando ou criando algum projeto, gosto de assistir vídeos no YouTube, acompanhar séries e animes e, às vezes, jogar.
            </p>
          </div>

          <div className="w-full bg-[#0a0a0a] rounded-xl border border-white/10 p-1 overflow-hidden font-mono text-sm shadow-2xl">
            
            <div className="bg-[#1a1a1a] flex items-center px-4 py-2 border-b border-white/5 space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <span className="ml-4 text-gray-500 text-xs">~/brain/skills.sh</span>
            </div>
            
            <div className="p-6 text-gray-300">
              <div className="mb-2"><span className="text-green-400">user@ai-host:~$</span> load_modules</div>
              <div className="mb-4 text-nardo">[OK] Modules loaded successfully.</div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-4 text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400">{">>"}</span> <span>Python</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400">{">>"}</span> <span>SQL & NoSQL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400">{">>"}</span> <span>Scikit-Learn</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400">{">>"}</span> <span>Análise de Dados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400">{">>"}</span> <span>Pandas & NumPy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400">{">>"}</span> <span>Git & GitHub</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400">{">>"}</span> <span>PyTorch</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400">{">>"}</span> <span>TensorFlow</span>
                </div>
              </div>

              <div className="mt-4 text-nardo animate-pulse">_</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}