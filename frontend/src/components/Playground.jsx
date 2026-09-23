import { useState, useRef, useEffect, useCallback } from 'react';
import { MousePointerClick, SlidersHorizontal, Dices, Bot, Trash2, Swords, RotateCcw, BrainCircuit, Loader2 } from 'lucide-react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

function ClusteringSimulator() {
  const [algo, setAlgo] = useState('kmeans');
  const [k, setK] = useState(3);
  const [centroids, setCentroids] = useState([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [epsilon, setEpsilon] = useState(40);
  const [minPts, setMinPts] = useState(4);
  const [dbscanClusterId, setDbscanClusterId] = useState(0);
  const [dbscanDone, setDbscanDone] = useState(false);
  const [dataPoints, setDataPoints] = useState([]);
  const [status, setStatus] = useState("Aguardando dados...");
  
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const clusterColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (algo === 'kmeans' && hasInitialized) {
      dataPoints.forEach(point => {
        if (point.cluster !== -1 && centroids[point.cluster]) {
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(centroids[point.cluster].x, centroids[point.cluster].y);
          ctx.strokeStyle = `${centroids[point.cluster].color}33`; 
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    }

    dataPoints.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      
      if (point.cluster === -1) {
        ctx.fillStyle = '#404040';
      } else if (point.cluster === -2) {
        ctx.fillStyle = '#78350f';
        ctx.strokeStyle = '#fb923c';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.fillStyle = algo === 'kmeans' && !centroids[point.cluster] 
            ? '#797B7A' 
            : clusterColors[point.cluster % clusterColors.length];
      }
      ctx.fill();
    });

    if (algo === 'kmeans') {
      centroids.forEach(centroid => {
        ctx.beginPath();
        ctx.arc(centroid.x, centroid.y, 9, 0, Math.PI * 2);
        ctx.fillStyle = centroid.color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centroid.x - 4, centroid.y - 4);
        ctx.lineTo(centroid.x + 4, centroid.y + 4);
        ctx.moveTo(centroid.x + 4, centroid.y - 4);
        ctx.lineTo(centroid.x - 4, centroid.y + 4);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }
  }, [dataPoints, centroids, hasInitialized, algo]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
        draw();
      }
    };
    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 100);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  useEffect(() => { draw(); }, [draw]);

  const resetTrainingOnly = (pointsToReset = dataPoints) => {
    setCentroids([]);
    setHasInitialized(false);
    setDbscanClusterId(0);
    setDbscanDone(false);
    setDataPoints(pointsToReset.map(p => ({ ...p, cluster: -1, visited: false })));
  };

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newPoints = [...dataPoints, { x, y, cluster: -1, visited: false }];
    resetTrainingOnly(newPoints);
    setStatus(`Dados: ${newPoints.length} | Pronto para agrupar`);
  };

  const generateRandomData = () => {
    if (!canvasRef.current) return;
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    const newPoints = [];
    const numClustersToGenerate = Math.floor(Math.random() * 3) + 2;

    for (let c = 0; c < numClustersToGenerate; c++) {
      const centerX = Math.random() * width * 0.8 + width * 0.1;
      const centerY = Math.random() * height * 0.8 + height * 0.1;
      const spread = Math.random() * 40 + 20;

      for (let i = 0; i < 35; i++) {
        newPoints.push({
          x: centerX + (Math.random() - 0.5) * spread * 2,
          y: centerY + (Math.random() - 0.5) * spread * 2,
          cluster: -1, visited: false
        });
      }
    }
    for (let i = 0; i < 15; i++) {
      newPoints.push({ x: Math.random() * width, y: Math.random() * height, cluster: -1, visited: false });
    }

    resetTrainingOnly(newPoints);
    setStatus(`Dados gerados: ${newPoints.length} | Pronto para agrupar`);
  };

  const resetAll = () => {
    setDataPoints([]);
    setCentroids([]);
    setHasInitialized(false);
    setDbscanClusterId(0);
    setDbscanDone(false);
    setStatus("Aguardando dados...");
  };

  const stepKMeans = () => {
    let currentData = dataPoints.map(p => ({ ...p }));
    let currentCentroids = [...centroids];

    if (!hasInitialized) {
      if (currentData.length < k) { setStatus(`Erro: Adicione pelo menos ${k} pontos.`); return; }
      const shuffled = [...currentData].sort(() => 0.5 - Math.random());
      currentCentroids = shuffled.slice(0, k).map((p, i) => ({
        x: p.x, y: p.y, color: clusterColors[i % clusterColors.length]
      }));
      setCentroids(currentCentroids);
      setHasInitialized(true);
      setDataPoints(currentData);
      setStatus("Centróides inicializados. Atribuindo pontos...");
      return;
    }

    let changed = false;
    currentData = currentData.map(point => {
      let minDist = Infinity;
      let closestCluster = -1;
      currentCentroids.forEach((centroid, idx) => {
        let d = Math.hypot(point.x - centroid.x, point.y - centroid.y);
        if (d < minDist) { minDist = d; closestCluster = idx; }
      });
      if (point.cluster !== closestCluster) changed = true;
      return { ...point, cluster: closestCluster };
    });

    const clusterSums = Array(k).fill(null).map(() => ({ x: 0, y: 0, count: 0 }));
    currentData.forEach(point => {
      if (point.cluster !== -1) {
        clusterSums[point.cluster].x += point.x;
        clusterSums[point.cluster].y += point.y;
        clusterSums[point.cluster].count += 1;
      }
    });

    currentCentroids = currentCentroids.map((centroid, idx) => {
      if (clusterSums[idx].count > 0) {
        return { ...centroid, x: clusterSums[idx].x / clusterSums[idx].count, y: clusterSums[idx].y / clusterSums[idx].count };
      }
      return centroid;
    });

    setDataPoints(currentData);
    setCentroids(currentCentroids);
    if (!changed) setStatus("K-Means: Convergência alcançada! Modelo treinado.");
    else setStatus("K-Means: Recalculando posições médias...");
  };

  const stepDBSCAN = () => {
    if (dbscanDone) return;
    
    let currentData = dataPoints.map(p => ({ ...p }));
    let unvisitedIdx = currentData.findIndex(p => !p.visited);

    if (unvisitedIdx === -1) {
      setDbscanDone(true);
      setStatus(`DBSCAN: Concluído! ${dbscanClusterId} cluster(s) encontrados.`);
      return;
    }

    let p0 = currentData[unvisitedIdx];
    p0.visited = true;

    const getNeighborsIdx = (point) => {
      let n = [];
      currentData.forEach((p, idx) => { if (Math.hypot(point.x - p.x, point.y - p.y) <= epsilon) n.push(idx); });
      return n;
    };

    let neighborsIdx = getNeighborsIdx(p0);

    if (neighborsIdx.length < minPts) {
      p0.cluster = -2; 
      setStatus("DBSCAN: Ponto isolado classificado como ruído (Outlier).");
      setDataPoints(currentData);
      return;
    }

    let cId = dbscanClusterId;
    p0.cluster = cId;
    let queue = [...neighborsIdx];
    
    let i = 0;
    while (i < queue.length) {
      let pIdx = queue[i];
      let p = currentData[pIdx];

      if (!p.visited) {
        p.visited = true;
        let pNeighbors = getNeighborsIdx(p);
        if (pNeighbors.length >= minPts) {
          pNeighbors.forEach(nIdx => { if (!queue.includes(nIdx)) queue.push(nIdx); });
        }
      }
      if (p.cluster === -1 || p.cluster === -2) p.cluster = cId;
      i++;
    }

    setDbscanClusterId(cId + 1);
    setDataPoints(currentData);
    setStatus(`DBSCAN: Região densa detectada! Formando Cluster ${cId + 1}.`);
  };

  const handleStep = () => {
    if (dataPoints.length === 0) { setStatus("Adicione pontos primeiro clicando no quadro!"); return; }
    if (algo === 'kmeans') stepKMeans();
    else stepDBSCAN();
  };

  return (
    <div className="bg-dark/60 backdrop-blur-md rounded-xl border border-white/10 flex flex-col lg:flex-row overflow-hidden shadow-2xl animate-fade-in">
      <div className="w-full lg:w-1/3 bg-[#121212] p-6 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between">
        <div>
          <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <SlidersHorizontal className="text-nardo w-5 h-5" /> Controles
          </h4>
          <div className="mb-6">
            <label className="block text-sm font-medium text-accent mb-2">Algoritmo de Clusterização</label>
            <select 
              value={algo}
              onChange={(e) => { setAlgo(e.target.value); resetTrainingOnly(dataPoints); setStatus(`Algoritmo alterado para ${e.target.value.toUpperCase()}.`); }}
              className="w-full bg-[#0a0a0a] border border-white/10 text-white rounded-md p-2.5 focus:outline-none focus:border-nardo transition-colors cursor-pointer text-sm"
            >
              <option value="kmeans">K-Means (Centróides)</option>
              <option value="dbscan">DBSCAN (Densidade)</option>
            </select>
          </div>
          
          {algo === 'kmeans' && (
            <div className="mb-6 animate-fade-in">
              <label className="block text-sm font-medium text-accent mb-2 flex justify-between">
                <span>Clusters (K)</span><span className="text-nardo font-bold">{k}</span>
              </label>
              <input type="range" min="2" max="6" value={k} onChange={(e) => { setK(parseInt(e.target.value)); resetTrainingOnly(); }} className="w-full" />
            </div>
          )}

          {algo === 'dbscan' && (
            <div className="mb-6 animate-fade-in">
              <label className="block text-sm font-medium text-accent mb-2 flex justify-between">
                <span>Epsilon</span><span className="text-nardo font-bold">{epsilon}</span>
              </label>
              <input type="range" min="15" max="100" value={epsilon} onChange={(e) => { setEpsilon(parseInt(e.target.value)); resetTrainingOnly(); }} className="w-full mb-4" />
              <label className="block text-sm font-medium text-accent mb-2 flex justify-between">
                <span>MinPts</span><span className="text-nardo font-bold">{minPts}</span>
              </label>
              <input type="range" min="2" max="10" value={minPts} onChange={(e) => { setMinPts(parseInt(e.target.value)); resetTrainingOnly(); }} className="w-full" />
            </div>
          )}
        </div>
        <div className="mt-8 space-y-3">
          <button onClick={generateRandomData} className="w-full py-2.5 px-4 bg-[#1a1a1a] hover:bg-[#222222] text-white rounded border border-white/10 transition-colors text-sm flex items-center justify-center gap-2">
            <Dices className="w-4 h-4" /> Gerar Dados Aleatórios
          </button>
          <button onClick={handleStep} className="w-full py-3 px-4 bg-nardo hover:bg-gray-400 text-dark font-bold rounded transition-colors shadow-lg shadow-nardo/20 flex items-center justify-center gap-2">
            <Bot className="w-5 h-5" /> Avançar Algoritmo
          </button>
          <button onClick={resetAll} className="w-full py-2 px-4 bg-transparent hover:bg-red-900/20 text-red-400 rounded border border-transparent hover:border-red-900/50 transition-colors text-sm flex items-center justify-center gap-2">
            <Trash2 className="w-4 h-4" /> Limpar Dados
          </button>
        </div>
      </div>
      <div ref={containerRef} className="w-full lg:w-2/3 bg-[#0a0a0a] relative min-h-[400px]">
        <div className="absolute top-4 left-4 bg-[#121212]/90 backdrop-blur-sm text-xs text-accent px-4 py-1.5 rounded-full border border-white/10 pointer-events-none z-10 shadow-lg">
          {status}
        </div>
        <canvas ref={canvasRef} onClick={handleCanvasClick} className="w-full h-full cursor-crosshair block"></canvas>
      </div>
    </div>
  );
}

function ChessSimulator() {
  const [game, setGame] = useState(new Chess());
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [difficulty, setDifficulty] = useState(5); 
  const [autoEvolve, setAutoEvolve] = useState(true);
  const [gameStatus, setGameStatus] = useState("Sua vez de jogar (Brancas)");
  const [moveCount, setMoveCount] = useState(0);
  const [playerMoveCount, setPlayerMoveCount] = useState(0);

  useEffect(() => {
    if (game.isCheckmate()) {
      setGameStatus(game.turn() === 'w' ? "Xeque-mate! IA Venceu." : "Xeque-mate! Você Venceu!");
    } else if (game.isDraw()) {
      setGameStatus("Empate!");
    } else if (game.isCheck()) {
      setGameStatus("Xeque!");
    } else {
      setGameStatus(game.turn() === 'w' ? "Sua vez (Brancas)" : "IA Pensando...");
    }
  }, [game]);

  useEffect(() => {
    if (game.turn() === 'b' && !game.isGameOver()) {
      makeStockfishMove();
    }
  }, [game]);

  const makeStockfishMove = async () => {
    setIsAiThinking(true);
    
    try {
      const currentFen = game.fen();
      
      const res = await fetch(`https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(currentFen)}&depth=${difficulty}`);

      const data = await res.json();

      if (data.success && data.bestmove) {
        const bestMoveStr = data.bestmove.split(" ")[1];
        
        const moveDetails = {
          from: bestMoveStr.substring(0, 2),
          to: bestMoveStr.substring(2, 4),
          promotion: bestMoveStr.length > 4 ? bestMoveStr[4] : 'q' 
        };

        const gameCopy = new Chess(game.fen());
        gameCopy.move(moveDetails);
        setGame(gameCopy);
        setMoveCount(prev => prev + 1);

      }
    } catch (error) {
      console.error("Erro na API do Stockfish, jogando aleatório...", error);
      const possibleMoves = game.moves();
      if (possibleMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        const gameCopy = new Chess(game.fen());
        gameCopy.move(possibleMoves[randomIndex]);
        setGame(gameCopy);
      }
    }
    
    setIsAiThinking(false);
  };

  const onDrop = ({ sourceSquare, targetSquare }) => {

    if (game.turn() === 'b' || game.isGameOver()) return false;

    const gameCopy = new Chess(game.fen());

    try {
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (move === null) return false;

      setGame(gameCopy);
      setMoveCount(prev => prev + 1);
      setPlayerMoveCount(prev => {
        const newCount = prev + 1;

        if (autoEvolve && newCount % 4 === 0) {
          setDifficulty(current => Math.min(current + 1, 15));
        }

        return newCount;
      });

      return true;

    } catch (e) {
      setGameStatus("Movimento inválido. Tente novamente.");
      return false;
    }
  };

  const restartGame = () => {
    setGame(new Chess());
    setDifficulty(5);
    setMoveCount(0);
    setPlayerMoveCount(0);
    setGameStatus("Sua vez de jogar (Brancas)");
  };

  return (
    <div className="bg-dark/60 backdrop-blur-md rounded-xl border border-white/10 flex flex-col lg:flex-row overflow-hidden shadow-2xl animate-fade-in">

      <div className="w-full lg:w-1/3 bg-[#121212] p-6 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between">
        <div>
          <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Swords className="text-nardo w-5 h-5" /> Xadrez vs IA
          </h4>
          
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            Jogue contra o <strong>Stockfish</strong> através de uma API. Modifique a profundidade de cálculo ou ligue a <em>Auto-Evolução</em> para ver a IA se aprimorar durante a partida.
          </p>

          <div className="bg-[#1a1a1a] rounded-lg border border-white/10 p-4 mb-6 shadow-inner">
             <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white flex items-center gap-2">
                  Status
                </span>
                {isAiThinking && <Loader2 className="w-4 h-4 text-nardo animate-spin" />}
             </div>
             <p className={`text-lg font-bold ${game.isGameOver() ? 'text-red-400' : 'text-nardo'}`}>
               {gameStatus}
             </p>
          </div>

          <div className="mb-6 animate-fade-in">
            <label className="block text-sm font-medium text-accent mb-2 flex justify-between items-center">
              <span>Profundidade (Depth)</span>
              <span className="bg-white/10 text-white px-2 py-1 rounded text-xs font-bold">{difficulty}</span>
            </label>
            <input 
              type="range" min="5" max="15" 
              value={difficulty} 
              onChange={(e) => { setDifficulty(parseInt(e.target.value)); setAutoEvolve(false); }} 
              disabled={autoEvolve}
              className={`w-full mb-2 ${autoEvolve ? 'opacity-50 cursor-not-allowed' : ''}`} 
            />
            <p className="text-[10px] text-zinc-500">Quantos lances futuros a IA consegue prever.</p>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-lg p-4 flex items-center justify-between cursor-pointer" onClick={() => setAutoEvolve(!autoEvolve)}>
            <div>
              <p className="text-sm text-white font-medium flex items-center gap-2">
                <BrainCircuit className={`w-4 h-4 ${autoEvolve ? 'text-nardo' : 'text-zinc-500'}`} />
                Auto-Evolução
              </p>
              <p className="text-[10px] text-zinc-500 mt-1">IA aumenta dificuldade sozinha</p>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${autoEvolve ? 'bg-nardo' : 'bg-zinc-700'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${autoEvolve ? 'left-5' : 'left-0.5'}`}></div>
            </div>
          </div>
        </div>

        <button 
          onClick={restartGame} 
          className="mt-6 w-full py-3 px-4 bg-transparent hover:bg-white/5 text-white rounded border border-white/20 transition-colors text-sm flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Reiniciar Partida
        </button>
      </div>

      <div className="w-full lg:w-2/3 bg-[#0a0a0a] relative flex items-center justify-center p-4 lg:p-8 min-h-[400px]">
        <div className="w-full max-w-[450px] shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded overflow-hidden border-4 border-[#1a1a1a]">
          <Chessboard 
            options={{
              position: game.fen(),
              onPieceDrop: onDrop,
              boardOrientation: 'white',
              darkSquareStyle: { backgroundColor: '#779556' },
              lightSquareStyle: { backgroundColor: '#ebecd0' },
              animationDuration: 300
            }}
          />
          
        </div>
      </div>
    </div>
  );
}

export function Playground() {
  const [activeTab, setActiveTab] = useState('clustering');

  return (
    <section id="playground" className="py-20 bg-darker relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-nardo opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-nardo text-sm mb-4">
            <MousePointerClick className="w-4 h-4" /> Área Interativa
          </div>
          <h3 className="text-3xl font-bold mb-2">Playground de Algoritmos</h3>
          <p className="text-accent max-w-2xl mx-auto">
            Explore uma área interativa do site, onde você pode experimentar modelos de inteligência artificial, jogos e outras experiências dinâmicas diretamente no navegador.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-[#121212] p-1.5 rounded-full border border-white/10 inline-flex overflow-x-auto max-w-full custom-scrollbar">
            
            <button 
              onClick={() => setActiveTab('clustering')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'clustering' 
                  ? 'bg-white text-black shadow-md' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <MousePointerClick className="w-4 h-4" /> Agrupamento
            </button>

            <button 
              onClick={() => setActiveTab('chess')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'chess' 
                  ? 'bg-white text-black shadow-md' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Swords className="w-4 h-4" /> Xadrez vs IA
            </button>
            
          </div>
        </div>

        <div className="mt-4">
          {activeTab === 'clustering' && <ClusteringSimulator />}
          {activeTab === 'chess' && <ChessSimulator />}
        </div>

      </div>
    </section>
  );
}