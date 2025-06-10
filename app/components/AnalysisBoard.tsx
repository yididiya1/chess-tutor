"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";
import EvaluationBar from "./EvaluationBar";
import MoveAnalysis from "./MoveAnalysis";

interface AnalysisLine {
  move: string;
  evaluation: number;
  pv: string[]; // Principal variation (sequence of moves)
  depth: number;
}

export default function AnalysisBoard() {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [evaluation, setEvaluation] = useState(0);
  const [analysisLines, setAnalysisLines] = useState<AnalysisLine[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [engineReady, setEngineReady] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'checkmate' | 'stalemate' | 'draw'>('playing');
  const [winner, setWinner] = useState<'white' | 'black' | null>(null);
  const [userSide, setUserSide] = useState<'white' | 'black'>('white'); // User's chosen side
  
  const stockfishRef = useRef<Worker | null>(null);
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Simplified debug logging function - only console.log
  const addDebugLog = (message: string) => {
    console.log("🐟 DEBUG:", message);
  };

  // Simple position evaluation function for immediate feedback
  const evaluatePosition = (chess: Chess): number => {
    addDebugLog(`Evaluating position: ${chess.fen()}`);
    
    // Check for game ending conditions first
    if (chess.isCheckmate()) {
      const mateScore = chess.turn() === 'w' ? -9999 : 9999;
      // Convert to user's perspective
      const userPerspectiveScore = userSide === 'white' ? mateScore : -mateScore;
      addDebugLog(`Checkmate detected! Score: ${userPerspectiveScore} (from ${userSide}'s perspective)`);
      return userPerspectiveScore;
    }
    if (chess.isStalemate() || chess.isDraw()) {
      addDebugLog("Stalemate or draw detected! Score: 0");
      return 0;
    }

    // Basic material evaluation
    const pieces = chess.board().flat();
    let score = 0;
    
    const pieceValues: { [key: string]: number } = {
      'p': -100, 'P': 100,
      'n': -320, 'N': 320,
      'b': -330, 'B': 330,
      'r': -500, 'R': 500,
      'q': -900, 'Q': 900,
      'k': 0, 'K': 0
    };

    pieces.forEach(piece => {
      if (piece) {
        const value = pieceValues[piece.type.toUpperCase()] || 0;
        const pieceScore = piece.color === 'w' ? value : -value;
        score += pieceScore;
      }
    });

    // Add small positional bonuses
    const centerSquares = ['e4', 'e5', 'd4', 'd5'];
    centerSquares.forEach(square => {
      const piece = chess.get(square as Square);
      if (piece) {
        if (piece.type === 'p' || piece.type === 'n') {
          score += piece.color === 'w' ? 20 : -20;
        }
      }
    });

    // Check bonus/penalty
    if (chess.inCheck()) {
      score += chess.turn() === 'w' ? -50 : 50;
    }

    // Convert to user's perspective (positive = user advantage, negative = opponent advantage)
    const userPerspectiveScore = userSide === 'white' ? score : -score;
    
    addDebugLog(`Material evaluation: ${userPerspectiveScore} centipawns (from ${userSide}'s perspective)`);
    return userPerspectiveScore;
  };

  // Update game status based on current position
  const updateGameStatus = (chess: Chess) => {
    if (chess.isCheckmate()) {
      setGameStatus('checkmate');
      setWinner(chess.turn() === 'w' ? 'black' : 'white'); // Opposite of current turn
      addDebugLog(`Checkmate! Winner: ${chess.turn() === 'w' ? 'black' : 'white'}`);
    } else if (chess.isStalemate()) {
      setGameStatus('stalemate');
      setWinner(null);
      addDebugLog("Stalemate detected!");
    } else if (chess.isDraw()) {
      setGameStatus('draw');
      setWinner(null);
      addDebugLog("Draw detected!");
    } else {
      setGameStatus('playing');
      setWinner(null);
    }
  };

  // Initialize engine with direct approach
  useEffect(() => {
    const initializeEngine = async () => {
      try {
        addDebugLog("Initializing engine with basic evaluation...");
        
        // Set engine as ready and use our evaluation function
        setEngineReady(true);
        const initialEval = evaluatePosition(game);
        setEvaluation(initialEval);
        addDebugLog(`Initial evaluation set: ${initialEval}`);
        
        // Try to create Stockfish worker for advanced analysis
        try {
          addDebugLog("Attempting to create Stockfish worker...");
          
          // Create a simple worker that directly loads Stockfish
          const stockfishWorker = new Worker('/stockfish/stockfish.js');
          stockfishRef.current = stockfishWorker;
          
          stockfishWorker.onmessage = (event) => {
            const line = event.data;
            addDebugLog(`Stockfish: ${line}`);
            handleEngineOutput(line);
          };
          
          stockfishWorker.onerror = (error) => {
            addDebugLog(`Stockfish worker error: ${error.message}`);
          };
          
          // Initialize UCI
          stockfishWorker.postMessage('uci');
          addDebugLog("Sent UCI command to worker");
          
        } catch (workerError) {
          addDebugLog(`Worker creation failed: ${workerError}, using fallback evaluation`);
        }
        
      } catch (error) {
        addDebugLog(`Engine initialization failed: ${error}`);
        setEngineReady(true);
        const initialEval = evaluatePosition(game);
        setEvaluation(initialEval);
      }
    };

    initializeEngine();

    return () => {
      if (stockfishRef.current) {
        stockfishRef.current.terminate();
      }
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
    };
  }, []);

  const sendCommand = (command: string) => {
    addDebugLog(`Sending command: ${command}`);
    if (stockfishRef.current) {
      stockfishRef.current.postMessage(command);
    }
  };

  const handleEngineOutput = (line: string) => {
    if (line.includes('uciok')) {
      addDebugLog("UCI protocol established");
      sendCommand('setoption name Threads value 1');
      sendCommand('setoption name Hash value 128');
      sendCommand('ucinewgame');
    } else if (line.includes('info depth')) {
      parseAnalysisLine(line);
    }
  };

  const parseAnalysisLine = (line: string) => {
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
      // Convert Stockfish evaluation (from side to move) to user's perspective
      if (game.turn() === 'b') {
        evaluation = -evaluation; // Convert to White's perspective first
      }
      if (userSide === 'black') {
        evaluation = -evaluation; // Then convert to user's perspective if they're Black
      }
      addDebugLog(`Found evaluation: ${evaluation} centipawns (from ${userSide}'s perspective)`);
    } else if (mateMatch) {
      const mateIn = parseInt(mateMatch[1]);
      evaluation = mateIn > 0 ? 9999 : -9999;
      // Convert Stockfish evaluation (from side to move) to user's perspective
      if (game.turn() === 'b') {
        evaluation = -evaluation; // Convert to White's perspective first
      }
      if (userSide === 'black') {
        evaluation = -evaluation; // Then convert to user's perspective if they're Black
      }
      addDebugLog(`Found mate in ${mateIn}: evaluation ${evaluation} (from ${userSide}'s perspective)`);
    }
    
    const pvMoves = pvMatch[1].split(' ');
    const bestMoveUci = pvMoves[0] || "";
    
    // Validate that bestMoveUci is a proper UCI move (at least 4 characters, like "e2e4")
    if (depth >= 8 && bestMoveUci && bestMoveUci.length >= 4 && /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(bestMoveUci)) {
      // Convert UCI move to SAN for display
      try {
        const tempGame = new Chess(game.fen());
        const move = tempGame.move({
          from: bestMoveUci.slice(0, 2),
          to: bestMoveUci.slice(2, 4),
          promotion: bestMoveUci.length > 4 ? bestMoveUci[4] : undefined
        });
        
        if (move) {
          const bestMoveSan = move.san;
          addDebugLog(`Analysis: ${bestMoveSan} (${evaluation} cp from ${userSide}'s perspective, depth ${depth})`);
          
          // Update main evaluation with the best line
          if (multipv === 1) {
            setEvaluation(evaluation);
            addDebugLog(`Updated main evaluation to: ${evaluation} (from ${userSide}'s perspective)`);
          }
          
          // Convert remaining PV moves to SAN
          const pvSan = [bestMoveSan];
          const pvGame = new Chess(game.fen());
          pvGame.move(move);
          
          for (let i = 1; i < Math.min(pvMoves.length, 4); i++) {
            const uciMove = pvMoves[i];
            // Validate UCI move format before processing
            if (uciMove.length >= 4 && /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(uciMove)) {
              try {
                const sanMove = pvGame.move({
                  from: uciMove.slice(0, 2),
                  to: uciMove.slice(2, 4),
                  promotion: uciMove.length > 4 ? uciMove[4] : undefined
                });
                if (sanMove) {
                  pvSan.push(sanMove.san);
                }
              } catch {
                break;
              }
            }
          }
          
          // Update analysis lines
          setAnalysisLines(prevLines => {
            const newLines = [...prevLines];
            const existingIndex = newLines.findIndex(line => line.move === bestMoveSan);
            
            const newLine: AnalysisLine = {
              move: bestMoveSan,
              evaluation,
              pv: pvSan.slice(1), // Exclude the main move
              depth
            };
            
            if (existingIndex >= 0) {
              newLines[existingIndex] = newLine;
            } else {
              newLines.push(newLine);
            }
            
            // Sort by evaluation from user's perspective (higher is better for user)
            return newLines
              .sort((a, b) => b.evaluation - a.evaluation)
              .slice(0, 3);
          });
        }
      } catch (error) {
        addDebugLog(`Error converting UCI move ${bestMoveUci} to SAN: ${error}`);
      }
    } else if (bestMoveUci && bestMoveUci.length < 4) {
      addDebugLog(`Skipping invalid UCI move: ${bestMoveUci} (too short)`);
    }
  };

  const analyzePosition = useCallback((fen: string) => {
    // Always update basic evaluation first
    const basicEval = evaluatePosition(new Chess(fen));
    setEvaluation(basicEval);
    addDebugLog(`Set evaluation to: ${basicEval} (from ${userSide}'s perspective)`);
    
    // Generate basic analysis for all positions
    const gameCopy = new Chess(fen);
    const legalMoves = gameCopy.moves({ verbose: true });
    
    if (legalMoves.length > 0) {
      const basicAnalysis: AnalysisLine[] = legalMoves.slice(0, 3).map((move) => {
        const tempGame = new Chess(fen);
        tempGame.move(move);
        const moveEval = evaluatePosition(tempGame);
        
        return {
          move: move.san, // Use SAN notation (e.g., "Nf3", "Bxc5+", "e8=Q")
          evaluation: moveEval, // Already from user's perspective
          pv: [move.san],
          depth: 1
        };
      });
      
      // Sort by evaluation from user's perspective (higher is better for user)
      basicAnalysis.sort((a, b) => b.evaluation - a.evaluation);
      
      setAnalysisLines(basicAnalysis);
      addDebugLog(`Generated ${basicAnalysis.length} analysis lines (from ${userSide}'s perspective)`);
    } else {
      setAnalysisLines([]);
      addDebugLog("No legal moves available");
    }
    
    // Try Stockfish if available
    if (stockfishRef.current && legalMoves.length > 0) {
      addDebugLog(`Starting Stockfish analysis of: ${fen}`);
      setIsAnalyzing(true);
      
      // Clear previous analysis
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
      
      sendCommand('stop');
      
      // Send position with move history for better analysis
      if (moveHistory.length === 0) {
        // Starting position
        sendCommand(`position startpos`);
        addDebugLog(`Sent to Stockfish: position startpos`);
      } else {
        // Position with moves
        const moveHistoryUci = moveHistory.map((sanMove, index) => {
          // Convert SAN back to UCI for Stockfish
          const tempGame = new Chess();
          // Replay all moves up to this point
          for (let i = 0; i <= index; i++) {
            const moves = tempGame.moves({ verbose: true });
            const move = moves.find(m => m.san === moveHistory[i]);
            if (move) {
              tempGame.move(move);
              if (i === index) {
                return move.from + move.to + (move.promotion || '');
              }
            }
          }
          return '';
        }).filter(Boolean);
        
        const uciMoves = moveHistoryUci.join(' ');
        sendCommand(`position startpos moves ${uciMoves}`);
        addDebugLog(`Sent to Stockfish: position startpos moves ${uciMoves}`);
      }
      
      sendCommand('setoption name MultiPV value 3');
      sendCommand('go depth 15');
      
      // Stop analysis after 3 seconds
      analysisTimeoutRef.current = setTimeout(() => {
        addDebugLog("Analysis timeout, stopping engine");
        sendCommand('stop');
        setIsAnalyzing(false);
      }, 3000);
    }
  }, [userSide, moveHistory]);

  useEffect(() => {
    // Always analyze position regardless of game status for educational purposes
    const currentEval = evaluatePosition(game);
    setEvaluation(currentEval);
    addDebugLog(`Position changed, new evaluation: ${currentEval}`);
    
    // Start analysis
    analyzePosition(position);
  }, [position, analyzePosition, game]);

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    // Don't allow moves if game is over
    if (gameStatus !== 'playing') {
      return false;
    }

    const gameCopy = new Chess(game.fen());
    
    try {
      const move = gameCopy.move({
        from: sourceSquare as Square,
        to: targetSquare as Square,
        promotion: "q" // Always promote to queen for simplicity
      });
      
      if (move === null) return false; // Illegal move
      
      addDebugLog(`Move made: ${move.san} (${sourceSquare}-${targetSquare})`);
      
      setGame(gameCopy);
      setPosition(gameCopy.fen());
      setMoveHistory(prev => [...prev, move.san]);
      
      // Update game status
      updateGameStatus(gameCopy);
      
      return true;
    } catch {
      return false;
    }
  };

  const resetBoard = () => {
    addDebugLog("Resetting board to starting position");
    const newGame = new Chess();
    setGame(newGame);
    setPosition(newGame.fen());
    setMoveHistory([]);
    setEvaluation(0);
    setAnalysisLines([]);
    setGameStatus('playing');
    setWinner(null);
  };

  const undoMove = () => {
    if (gameStatus !== 'playing' && moveHistory.length > 0) {
      setGameStatus('playing');
      setWinner(null);
    }

    const gameCopy = new Chess(game.fen());
    const move = gameCopy.undo();
    
    if (move) {
      addDebugLog(`Undoing move: ${move.san}`);
      setGame(gameCopy);
      setPosition(gameCopy.fen());
      setMoveHistory(prev => prev.slice(0, -1));
      updateGameStatus(gameCopy);
    }
  };

  const getGameStatusMessage = () => {
    switch (gameStatus) {
      case 'checkmate':
        return `🎉 Checkmate! ${winner === 'white' ? 'White' : 'Black'} wins!`;
      case 'stalemate':
        return "🤝 Stalemate! The game is a draw.";
      case 'draw':
        return "🤝 Draw! The game ended in a draw.";
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Side Selection */}
      <div className="mb-6 flex justify-center">
        <div className="bg-white rounded-lg shadow-md p-4 border">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Choose Your Side</h3>
          <div className="flex gap-4">
            <button
              onClick={() => setUserSide('white')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                userSide === 'white'
                  ? 'bg-white text-gray-800 border-2 border-gray-800 shadow-md'
                  : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              ⚪ Play as White
            </button>
            <button
              onClick={() => setUserSide('black')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                userSide === 'black'
                  ? 'bg-gray-800 text-white border-2 border-gray-800 shadow-md'
                  : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              ⚫ Play as Black
            </button>
          </div>
          <div className="text-sm text-gray-600 mt-2 text-center">
            Evaluations will be shown from your perspective
          </div>
        </div>
      </div>

      {/* Game Status Message */}
      {gameStatus !== 'playing' && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-800 mb-2">
            {getGameStatusMessage()}
          </div>
          <div className="text-blue-600">
            The game has ended. Analysis continues for educational purposes. You can undo moves or reset the board.
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - Evaluation Bar */}
        <div className="flex justify-center lg:justify-start">
          <EvaluationBar evaluation={evaluation} />
        </div>

        {/* Center - Chess Board */}
        <div className="flex-1 flex flex-col items-center">
          <div className="mb-4 flex gap-2">
            <button
              onClick={resetBoard}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Reset Board
            </button>
            <button
              onClick={undoMove}
              disabled={moveHistory.length === 0}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Undo Move
            </button>
          </div>
          
          <div className="w-full max-w-lg">
            <Chessboard
              id="AnalysisBoard"
              position={position}
              onPieceDrop={onDrop}
              customBoardStyle={{
                borderRadius: "4px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                opacity: gameStatus !== 'playing' ? 0.8 : 1
              }}
              boardOrientation={userSide}
              arePiecesDraggable={gameStatus === 'playing'}
              customDarkSquareStyle={{ backgroundColor: "#B58863" }}
              customLightSquareStyle={{ backgroundColor: "#F0D9B5" }}
            />
          </div>

          {/* Current Turn Indicator */}
          {gameStatus === 'playing' && (
            <div className="mt-4 p-2 bg-gray-100 rounded-lg">
              <div className="text-center font-semibold text-gray-800">
                {game.turn() === 'w' ? '⚪ White' : '⚫ Black'} to move
                {game.inCheck() && <span className="text-red-600 ml-2">👑 CHECK!</span>}
              </div>
            </div>
          )}

          {/* Move History */}
          {moveHistory.length > 0 && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg max-w-lg w-full">
              <h4 className="font-semibold text-gray-800 mb-2">Move History:</h4>
              <div className="text-sm font-mono text-gray-700 max-h-32 overflow-y-auto">
                {moveHistory.map((move, index) => (
                  <span key={index} className="mr-2">
                    {Math.floor(index / 2) + 1}{index % 2 === 0 ? '.' : '...'} {move}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right side - Move Analysis */}
        <div className="w-full lg:w-96">
          <MoveAnalysis 
            analysisLines={analysisLines}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </div>

      {/* Engine Status */}
      <div className="mt-6 text-center text-sm text-gray-600">
        Engine Status: {engineReady ? (
          <span className="text-green-600 font-semibold">Engine Ready ✓</span>
        ) : (
          <span className="text-yellow-600 font-semibold">Initializing...</span>
        )}
        <div className="text-xs mt-1">
          Current Evaluation (from {userSide}&apos;s perspective): {evaluation > 0 ? `+${(evaluation/100).toFixed(1)}` : (evaluation/100).toFixed(1)} 
          {Math.abs(evaluation) >= 9999 ? ' (Mate)' : ' pawns'}
        </div>
      </div>
    </div>
  );
} 