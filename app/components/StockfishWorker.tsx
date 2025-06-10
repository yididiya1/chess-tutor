"use client";

interface AnalysisLine {
  move: string;
  evaluation: number;
  pv: string[];
  depth: number;
}

export class StockfishEngine {
  private worker: Worker | null = null;
  private onAnalysisUpdate?: (lines: AnalysisLine[], evaluation: number) => void;
  private currentLines: Map<string, AnalysisLine> = new Map();

  constructor() {
    this.initializeEngine();
  }

  private async initializeEngine() {
    try {
      // Create worker that loads the Stockfish script
      const workerBlob = new Blob([`
        importScripts('/stockfish/stockfish.js');
        
        let stockfish = null;
        
        // Wait for Stockfish to be ready
        const initStockfish = () => {
          if (typeof Stockfish !== 'undefined') {
            stockfish = Stockfish();
            stockfish.addMessageListener((line) => {
              self.postMessage({type: 'engine-output', data: line});
            });
            self.postMessage({type: 'ready'});
          } else {
            setTimeout(initStockfish, 100);
          }
        };
        
        initStockfish();
        
        self.onmessage = function(e) {
          if (stockfish && e.data.command) {
            stockfish.postMessage(e.data.command);
          }
        };
      `], { type: 'application/javascript' });

      this.worker = new Worker(URL.createObjectURL(workerBlob));

      this.worker.onmessage = (event) => {
        const { type, data } = event.data;
        
        if (type === 'ready') {
          this.sendCommand('uci');
        } else if (type === 'engine-output') {
          this.handleEngineOutput(data);
        }
      };

      this.worker.onerror = (error) => {
        console.error('Stockfish worker error:', error);
      };

    } catch (error) {
      console.error('Failed to initialize Stockfish:', error);
    }
  }

  private handleEngineOutput(line: string) {
    console.log('Stockfish:', line);
    
    if (line.includes('uciok')) {
      this.sendCommand('setoption name Threads value 1');
      this.sendCommand('setoption name Hash value 128');
      this.sendCommand('ucinewgame');
    } else if (line.includes('info depth')) {
      this.parseAnalysisLine(line);
    }
  }

  private parseAnalysisLine(line: string) {
    const depthMatch = line.match(/depth (\d+)/);
    const scoreMatch = line.match(/score cp (-?\d+)/);
    const mateMatch = line.match(/score mate (-?\d+)/);
    const pvMatch = line.match(/pv (.+)/);
    const multipvMatch = line.match(/multipv (\d+)/);
    
    if (!depthMatch || !pvMatch) return;
    
    const depth = parseInt(depthMatch[1]);
    const multipv = multipvMatch ? parseInt(multipvMatch[1]) : 1;
    let evaluation = 0;
    
    if (scoreMatch) {
      evaluation = parseInt(scoreMatch[1]);
    } else if (mateMatch) {
      const mateIn = parseInt(mateMatch[1]);
      evaluation = mateIn > 0 ? 1000 : -1000;
    }
    
    const pv = pvMatch[1].split(' ');
    const bestMove = pv[0] || "";
    
    if (depth >= 8 && bestMove) {
      const lineKey = `${multipv}-${bestMove}`;
      
      this.currentLines.set(lineKey, {
        move: bestMove,
        evaluation,
        pv: pv.slice(1),
        depth
      });
      
      // Convert map to array and sort by evaluation
      const lines = Array.from(this.currentLines.values())
        .sort((a, b) => b.evaluation - a.evaluation)
        .slice(0, 3);
      
      const mainEvaluation = lines[0]?.evaluation || 0;
      
      if (this.onAnalysisUpdate) {
        this.onAnalysisUpdate(lines, mainEvaluation);
      }
    }
  }

  public analyzePosition(fen: string, callback: (lines: AnalysisLine[], evaluation: number) => void) {
    this.onAnalysisUpdate = callback;
    this.currentLines.clear();
    
    if (this.worker) {
      this.sendCommand('stop');
      this.sendCommand(`position fen ${fen}`);
      this.sendCommand('setoption name MultiPV value 3');
      this.sendCommand('go depth 18');
    }
  }

  public stopAnalysis() {
    if (this.worker) {
      this.sendCommand('stop');
    }
  }

  private sendCommand(command: string) {
    if (this.worker) {
      this.worker.postMessage({ command });
    }
  }

  public terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
} 