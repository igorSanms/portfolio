import { useState } from 'react';
import { Activity, Eye, MessageSquareText, ExternalLink, Lock, Clock, ChevronDown, ChevronUp, Code2 } from 'lucide-react';

export function Projects() {
  const [showAll, setShowAll] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const projectsData = [
    {
      id: 1,
      title: "Mineração de dados aplicado à identificação de insucesso acadêmico",
      description: "Sistema end-to-end para prevenção de evasão acadêmica. Inclui o DHASY, ferramenta própria que automatiza a mineração de dados com Selenium e extração de PDFs para gerar bases estruturadas em CSV, além de um painel analítico para a coordenação e um modelo preditivo de classificação para identificar alunos com risco de retenção.",
      icon: Activity,
      tags: ["Python", "Selenium", "Streamlit"],
      link: "#",
      status: "privado" 
    },
    {
      id: 2,
      title: "Sistema ADAS The Crew 2",
      description: "",
      icon: Eye,
      tags: [""],
      link: "#",
      status: "em andamento"
    },
    {
      id: 3,
      title: "Gerenciamento de estacionamento",
      description: "",
      icon: MessageSquareText,
      tags: [""],
      link: "#",
      status: "em andamento" 
    },
  ];

  const displayedProjects = showAll ? projectsData : projectsData.slice(0, 3);

  return (
    <section id="projetos" className="py-24 bg-dark relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-3xl font-bold mb-4">Meus Projetos</h2>
            <p className="text-accent max-w-xl text-sm md:text-base">
              Projetos desenvolvidos durante minha graduação e pesquisas pessoais.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {displayedProjects.map((project) => {
            const IconComponent = project.icon;
            const hideLink = project.status === 'privado' || project.status === 'em andamento';

            return (
              <div key={project.id} className="glow-card p-6 flex flex-col h-full group" onMouseMove={handleMouseMove}>
                <div className="relative z-10 flex flex-col h-full">
                  
                  <div className="mb-6 h-40 bg-[#111111] rounded-xl flex items-center justify-center border border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-nardo to-transparent"></div>
                    <IconComponent className="w-12 h-12 text-nardo relative z-10 group-hover:scale-110 transition-transform duration-500" />

                    {project.status === 'privado' && (
                      <div className="absolute top-3 right-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm z-20">
                        <Lock className="w-3 h-3" /> Privado
                      </div>
                    )}
                    {project.status === 'em andamento' && (
                      <div className="absolute top-3 right-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm z-20">
                        <Clock className="w-3 h-3" /> Em andamento
                      </div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold">{project.title}</h3>

                      {!hideLink && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-white transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-accent text-sm mb-6 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/10">
                    {project.tags.map((tag, index) => (
                      <span key={index} className="text-[11px] font-medium text-nardo bg-nardo/10 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {projectsData.length > 3 && (
          <div className="mt-16 relative flex items-center justify-center">
            <div className="absolute w-full h-px bg-white/10 left-0 right-0"></div>

            <button 
              onClick={() => setShowAll(!showAll)}
              className="relative z-10 bg-dark border border-white/10 hover:border-nardo text-accent hover:text-nardo px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2"
            >
              {showAll ? (
                <>Ver menos <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Veja mais <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}

      </div>
    </section>
  );
}