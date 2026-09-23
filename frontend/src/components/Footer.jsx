import { useState, useRef, useEffect } from 'react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { FiMail, FiArrowRight } from 'react-icons/fi';

export function Footer() {
  const footerRef = useRef(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '', email: '', mensagem: '' });

  const handleSendEmail = (e) => {
    e.preventDefault(); 
    
    const assunto = encodeURIComponent(`Contato do Portfólio: ${formData.nome}`);
    const corpo = encodeURIComponent(`${formData.mensagem}\n\n---\nEnviado por: ${formData.nome}\nEmail de retorno: ${formData.email}`);
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=igorsantanasampaio2023@gmail.com&su=${assunto}&body=${corpo}`;
    
    window.open(gmailUrl, '_blank');
    
    setIsModalOpen(false);
    setFormData({ nome: '', email: '', mensagem: '' });
  };
  
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (footerRef.current) {
        setFooterHeight(footerRef.current.offsetHeight);
      }
    };
    
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 100); 
    
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width, height;
    let nodes = [];
    const numNodes = 100;
    let radius = 50;

    let rotationX = 0;
    let rotationY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    class Node3D {
      constructor() {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        this.nx = Math.sin(phi) * Math.cos(theta);
        this.ny = Math.sin(phi) * Math.sin(theta);
        this.nz = Math.cos(phi);
        
        this.size = Math.random() * 1.5 + 0.5;
        this.isHighlight = Math.random() > 0.85;
      }
    }

    const initNodes = () => {
      nodes = [];
      for (let i = 0; i < numNodes; i++) nodes.push(new Node3D());
    };

    const resizeCanvas = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
      radius = Math.min(width, height) * 0.45;
    };

    const handleMouseMove = (e) => {
      const mouseX = (e.clientX / window.innerWidth) - 0.5;
      const mouseY = (e.clientY / window.innerHeight) - 0.5;
      
      targetRotationY = mouseX * 0.5;
      targetRotationX = mouseY * 0.5;
    };

    const renderLatentSpace = () => {
      ctx.clearRect(0, 0, width, height);
      
      rotationY += 0.002 + (targetRotationY - rotationY) * 0.05;
      rotationX += 0.001 + (targetRotationX - rotationX) * 0.05;

      const sinY = Math.sin(rotationY);
      const cosY = Math.cos(rotationY);
      const sinX = Math.sin(rotationX);
      const cosX = Math.cos(rotationX);

      const projectedNodes = [];

      for (let i = 0; i < numNodes; i++) {
        const node = nodes[i];
        
        const nx = node.nx * radius;
        const ny = node.ny * radius;
        const nz = node.nz * radius;

        let x1 = nx * cosY - nz * sinY;
        let z1 = nz * cosY + nx * sinY;

        let y2 = ny * cosX - z1 * sinX;
        let z2 = z1 * cosX + ny * sinX;

        const perspective = 600;
        const scale = perspective / (perspective + z2);
        
        const x2d = (x1 * scale) + (width / 2);
        const y2d = (y2 * scale) + (height / 2);
        
        const alpha = Math.min(Math.max((z2 + radius) / (radius * 2), 0.1), 1);

        projectedNodes.push({
          x: x2d, y: y2d, scale: scale, alpha: alpha, node: node, z: z2
        });
      }

      projectedNodes.sort((a, b) => b.z - a.z);

      ctx.lineWidth = 0.5;
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < Math.min(i + 4, projectedNodes.length); j++) {
          const p1 = projectedNodes[i];
          const p2 = projectedNodes[j];
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx*dx + dy*dy;
          
          if (distSq < (radius * radius * 0.3)) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(121, 123, 122, ${p1.alpha * 0.3})`;
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < projectedNodes.length; i++) {
        const p = projectedNodes[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.node.size * p.scale, 0, Math.PI * 2);
        
        if (p.node.isHighlight) {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.8})`;
        } else {
          ctx.fillStyle = `rgba(121, 123, 122, ${p.alpha})`;
        }
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(renderLatentSpace);
    };

    initNodes();
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    renderLatentSpace();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div style={{ height: footerHeight }} className="w-full pointer-events-none" />

      <footer
        id="contato"
        ref={footerRef}
        className="fixed bottom-0 left-0 w-full z-0 bg-[#050505] border-t border-white/5 py-10 md:py-12"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 pointer-events-none"></div>

        <div className="relative z-10 w-full px-6 md:px-16 lg:px-24">
          <div className="flex items-center justify-between w-full">

            <div className="flex flex-col items-start text-left">
              <p className="text-nardo tracking-widest text-xs uppercase mb-2 font-semibold flex items-center gap-2">
                <span className="w-8 h-[1px] bg-nardo"></span>
                CONTATO
              </p>

              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white hover:text-nardo transition-colors duration-500 cursor-default">
                LET'S TALK.
              </h2>

              <div className="flex flex-wrap items-center gap-4 mt-6 md:mt-8">
                <div className="flex gap-3">

                  <button onClick={() => setIsModalOpen(true)} className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 ease-in-out group shadow-lg shadow-black/20">
                    <FiMail className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
                  </button>

                  <a href="https://www.linkedin.com/in/igor-santana-1409522a7/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 ease-in-out group shadow-lg shadow-black/20">
                    <FaLinkedinIn className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
                  </a>

                  <a href="https://github.com/igorSanms" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 ease-in-out group shadow-lg shadow-black/20">
                    <FaGithub className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
                  </a>
                </div>

                <button onClick={() => setIsModalOpen(true)} className="group inline-flex items-center justify-center px-6 py-3.5 text-sm font-medium rounded-full text-white border border-white/20 bg-transparent hover:bg-white hover:text-black hover:border-white transition-all duration-500 ease-in-out shadow-xl">
                  Diga Olá
                  <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-500" />
                </button>
              </div>
            </div>

            <div 
              ref={containerRef} 
              className="w-32 h-32 md:w-48 md:h-48 relative flex items-center justify-center shrink-0"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-nardo/10 via-transparent to-transparent opacity-50 blur-xl pointer-events-none"></div>
              <canvas 
                ref={canvasRef} 
                className="relative z-10 block pointer-events-none"
              ></canvas>
            </div>

          </div>
        </div>
      </footer>
      
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 pointer-events-auto">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl relative animate-fade-in">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-5 text-zinc-500 hover:text-white transition-colors font-bold text-xl"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-white mb-6">Enviar Mensagem</h3>
            
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Nome</label>
                <input 
                  type="text" required value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-nardo transition-colors text-sm"
                  placeholder="Como você se chama?"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">E-mail para retorno</label>
                <input 
                  type="email" required value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-nardo transition-colors text-sm"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Mensagem</label>
                <textarea 
                  required rows="4" value={formData.mensagem}
                  onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-nardo transition-colors resize-none text-sm"
                  placeholder="Me fale sobre sua ideia ou proposta..."
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-white text-black font-bold rounded-lg px-4 py-3 hover:bg-nardo hover:text-white transition-colors mt-2"
              >
                Abrir no Gmail
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}