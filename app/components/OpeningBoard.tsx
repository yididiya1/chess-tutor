"use client";

import { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";

interface OpeningLine {
  id: number;
  name: string;
  moves: string[];
  fen: string;
  whiteWinRate: number;
  blackWinRate: number;
  drawRate: number;
  description: string;
  difficulty: string;
}

interface OpeningBoardProps {
  openingLine: OpeningLine;
  playerSide: "white" | "black";
}

export default function OpeningBoard({ openingLine, playerSide }: OpeningBoardProps) {
  const [game, setGame] = useState(new Chess());
  const [gamePosition, setGamePosition] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [message, setMessage] = useState(`${playerSide === 'white' ? 'White' : 'Black'} to play - Learn the ${openingLine.name}!`);
  const [showHint, setShowHint] = useState(false);
  const [hintArrow, setHintArrow] = useState<[Square, Square] | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(playerSide === 'white');

  const boardContainerRef = useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = useState(480);

  useEffect(() => {
    if (!boardContainerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setBoardWidth(Math.floor(entry.contentRect.width) - 24);
      }
    });
    observer.observe(boardContainerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const newGame = new Chess();
    setGame(newGame);
    setGamePosition(newGame.fen());
    setMoveHistory([]);
    setCurrentMoveIndex(0);
    setIsComplete(false);
    setMessage(`${playerSide === 'white' ? 'White' : 'Black'} to play - Learn the ${openingLine.name}!`);
    setShowHint(false);
    setHintArrow(null);
    setIsPlayerTurn(playerSide === 'white');
    
    // If player is Black, computer (White) should make the first move automatically
    if (playerSide === 'black' && openingLine.moves.length > 0) {
      setTimeout(() => {
        makeComputerMove(0, newGame);
      }, 500);
    }
  }, [openingLine.id, playerSide]);

  function makeComputerMove(nextMoveIndex: number, updatedGame?: Chess) {
    const gameToUse = updatedGame || game;
    
    if (nextMoveIndex >= openingLine.moves.length) {
      setMessage("🎉 Opening sequence completed! Well done!");
      setIsComplete(true);
      setIsPlayerTurn(false);
      return;
    }

    const computerMoveStr = openingLine.moves[nextMoveIndex];
    console.log(`Computer making move: ${computerMoveStr}`);

    const gameCopy = new Chess(gameToUse.fen());
    
    try {
      let result = gameCopy.move(computerMoveStr);
      
      if (!result && computerMoveStr.length >= 4) {
        const from = computerMoveStr.substring(0, 2);
        const to = computerMoveStr.substring(2, 4);
        result = gameCopy.move({ from, to });
      }
      
      if (result) {
        console.log(`Computer move successful: ${result.san}`);
        setGame(gameCopy);
        setGamePosition(gameCopy.fen());
        setMoveHistory(prev => [...prev, result.san]);
        setCurrentMoveIndex(nextMoveIndex + 1);
        
        // Check if opening is complete
        if (nextMoveIndex + 1 >= openingLine.moves.length) {
          setMessage("🎉 Opening sequence completed! Well done!");
          setIsComplete(true);
          setIsPlayerTurn(false);
        } else {
          setMessage(`${playerSide === 'white' ? 'White' : 'Black'} to play - Continue the sequence!`);
          setIsPlayerTurn(true);
        }
      } else {
        console.error(`Failed to execute computer move: ${computerMoveStr}`);
        setMessage("Error with computer move. Try resetting.");
      }
    } catch (error) {
      console.error(`Error executing computer move: ${computerMoveStr}`, error);
      setMessage("Error with computer move. Try resetting.");
    }
  }

  function showHintArrow() {
    if (currentMoveIndex < openingLine.moves.length && !isComplete && isPlayerTurn) {
      const currentExpectedMove = openingLine.moves[currentMoveIndex];
      console.log(`Showing hint for move: ${currentExpectedMove}`);
      
      const testGame = new Chess(game.fen());
      
      try {
        let result = testGame.move(currentExpectedMove);
        
        if (!result && currentExpectedMove.length >= 4) {
          const from = currentExpectedMove.substring(0, 2);
          const to = currentExpectedMove.substring(2, 4);
          result = testGame.move({ from, to });
        }
        
        if (result) {
          setHintArrow([result.from as Square, result.to as Square]);
          setShowHint(true);
          setMessage("💡 Hint: Look at the highlighted move!");
          
          setTimeout(() => {
            setHintArrow(null);
            setShowHint(false);
            if (!isComplete && isPlayerTurn) {
              setMessage(`${playerSide === 'white' ? 'White' : 'Black'} to play - Continue the sequence!`);
            }
          }, 5000);
        }
      } catch (error) {
        console.error(`Error parsing hint move: ${currentExpectedMove}`, error);
      }
    }
  }

  function makeAMove(move: { from: string; to: string; promotion?: string }) {
    if (!isPlayerTurn || isComplete) return null;

    const gameCopy = new Chess(game.fen());
    
    // Check if the piece belongs to the player
    const piece = gameCopy.get(move.from as Square);
    if (!piece || piece.color !== (playerSide === 'white' ? 'w' : 'b')) {
      return null;
    }

    const result = gameCopy.move(move);
    
    if (result === null) {
      return null;
    }
    
    setHintArrow(null);
    setShowHint(false);
    
    // Check if the move matches the expected opening move
    const expectedMove = openingLine.moves[currentMoveIndex];
    const isCorrectMove = expectedMove === result.san || expectedMove === (result.from + result.to);
    
    console.log(`Player move: ${result.san}, Expected: ${expectedMove}`);
    
    if (isCorrectMove) {
      console.log(`✅ Correct opening move!`);
      
      setGame(gameCopy);
      setGamePosition(gameCopy.fen());
      setMoveHistory(prev => [...prev, result.san]);
      setCurrentMoveIndex(prev => prev + 1);
      setIsPlayerTurn(false);
      
      // Check if opening is complete
      if (currentMoveIndex + 1 >= openingLine.moves.length) {
        setMessage("🎉 Opening sequence completed! Well done!");
        setIsComplete(true);
      } else {
        // Make computer move after delay
        setMessage("✅ Correct! Computer is responding...");
        setTimeout(() => {
          makeComputerMove(currentMoveIndex + 1, gameCopy);
        }, 1000);
      }
    } else {
      setMessage("❌ Not the correct opening move. Try again!");
      return null;
    }
    
    return result;
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) return false;
    return true;
  }

  function resetOpening() {
    const newGame = new Chess();
    setGame(newGame);
    setGamePosition(newGame.fen());
    setMoveHistory([]);
    setCurrentMoveIndex(0);
    setIsComplete(false);
    setMessage(`${playerSide === 'white' ? 'White' : 'Black'} to play - Learn the ${openingLine.name}!`);
    setShowHint(false);
    setHintArrow(null);
    setIsPlayerTurn(playerSide === 'white');
    
    // If player is Black, computer (White) should make the first move automatically
    if (playerSide === 'black' && openingLine.moves.length > 0) {
      setTimeout(() => {
        makeComputerMove(0, newGame);
      }, 500);
    }
  }

  const progressPct = openingLine.moves.length > 0
    ? Math.min(100, (currentMoveIndex / openingLine.moves.length) * 100)
    : 0;
  const msgColor = isComplete ? '#10b981' : showHint ? '#06b6d4' : '#f0e6c8';

  return (
    <div className="flex gap-6 w-full items-start p-16 pt-2">
      {/* ── Board ─────────────────────────────────────────── */}
      <div
        ref={boardContainerRef}
        className="flex-[3] min-w-0 rounded-xl overflow-hidden"
        style={{
          background: '#0a0f1c',
          border: '1px solid rgba(245,158,11,0.2)',
          boxShadow: '0 0 40px rgba(245,158,11,0.06)',
          padding: '12px',
        }}
      >
        <Chessboard
          position={gamePosition}
          onPieceDrop={onDrop}
          boardOrientation={playerSide}
          boardWidth={boardWidth}
          customBoardStyle={{ borderRadius: '6px' }}
          customDarkSquareStyle={{ backgroundColor: '#2d4a22' }}
          customLightSquareStyle={{ backgroundColor: '#8fb36a' }}
          customArrows={hintArrow ? [hintArrow] : []}
          customArrowColor="rgba(245,158,11,0.85)"
        />
      </div>

      {/* ── Right Panel ───────────────────────────────────── */}
      <div className="flex-[1] min-w-0 flex flex-col gap-4">
        {/* Status */}
        <div
          className="rounded-xl px-4 py-3"
          style={{
            background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.18)',
          }}
        >
          <p className="text-sm font-rajdhani font-semibold leading-snug" style={{ color: msgColor }}>
            {message}
          </p>
        </div>

        {/* Progress */}
        <div
          className="rounded-xl px-4 py-4"
          style={{
            background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1426 100%)',
            border: '1px solid rgba(245,158,11,0.15)',
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-cinzel font-semibold uppercase tracking-widest" style={{ color: 'rgba(245,158,11,0.6)' }}>Progress</span>
            <span className="text-xs font-rajdhani font-semibold" style={{ color: '#f59e0b' }}>{currentMoveIndex} / {openingLine.moves.length} moves</span>
          </div>
          <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                background: isComplete ? 'linear-gradient(90deg,#10b981,#34d399)' : 'linear-gradient(90deg,#f59e0b,#fbbf24)',
                boxShadow: isComplete ? '0 0 8px #10b98180' : '0 0 8px #f59e0b60',
              }}
            />
          </div>
          {moveHistory.length > 0 && (
            <p className="mt-2 text-xs font-rajdhani" style={{ color: 'rgba(226,232,240,0.4)' }}>
              {moveHistory.join(' · ')}
            </p>
          )}
        </div>

        {/* Opening Info */}
        <div
          className="rounded-xl px-4 py-4 flex flex-col gap-3"
          style={{
            background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1426 100%)',
            border: '1px solid rgba(245,158,11,0.15)',
          }}
        >
          <h3 className="text-xs font-cinzel font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(245,158,11,0.6)' }}>Opening Info</h3>

          {[
            { label: 'Opening',    value: openingLine.name,                                   accent: '#f0e6c8' },
            { label: 'Difficulty', value: openingLine.difficulty,                              accent: '#f59e0b' },
            { label: 'Playing as', value: playerSide === 'white' ? '⚪ White' : '⚫ Black',  accent: playerSide === 'white' ? '#e2e8f0' : '#94a3b8' },
            { label: 'Status',     value: isComplete ? '✅ Completed' : '🎯 In Progress',    accent: isComplete ? '#10b981' : '#94a3b8' },
          ].map(({ label, value, accent }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-xs font-rajdhani" style={{ color: 'rgba(226,232,240,0.45)' }}>{label}</span>
              <span className="text-xs font-rajdhani font-semibold px-2 py-0.5 rounded-full" style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}>{value}</span>
            </div>
          ))}

          <div className="pt-3 mt-1" style={{ borderTop: '1px solid rgba(245,158,11,0.1)' }}>
            <p className="text-xs font-rajdhani leading-relaxed" style={{ color: 'rgba(226,232,240,0.45)' }}>{openingLine.description}</p>
          </div>

          <div className="pt-3" style={{ borderTop: '1px solid rgba(245,158,11,0.1)' }}>
            <p className="text-xs font-cinzel font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(245,158,11,0.5)' }}>Statistics</p>
            <div className="flex gap-2">
              {[
                { label: 'White', value: `${openingLine.whiteWinRate}%`, color: '#e2e8f0' },
                { label: 'Black', value: `${openingLine.blackWinRate}%`, color: '#94a3b8' },
                { label: 'Draw',  value: `${openingLine.drawRate}%`,     color: '#f59e0b' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex-1 rounded-lg px-2 py-1.5 text-center" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                  <p className="text-xs font-rajdhani" style={{ color: 'rgba(226,232,240,0.4)' }}>{label}</p>
                  <p className="text-sm font-cinzel font-bold" style={{ color }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {!isComplete && (
            <button
              onClick={showHintArrow}
              disabled={showHint || !isPlayerTurn}
              className="flex-1 py-2 rounded-lg text-xs font-cinzel font-semibold uppercase tracking-wider transition-all duration-200"
              style={{
                background: showHint || !isPlayerTurn ? 'rgba(255,255,255,0.04)' : 'rgba(245,158,11,0.12)',
                border: `1px solid ${showHint || !isPlayerTurn ? 'rgba(255,255,255,0.08)' : 'rgba(245,158,11,0.4)'}`,
                color: showHint || !isPlayerTurn ? 'rgba(226,232,240,0.25)' : '#f59e0b',
                cursor: showHint || !isPlayerTurn ? 'not-allowed' : 'pointer',
              }}
            >
              💡 Hint
            </button>
          )}
          <button
            onClick={resetOpening}
            className="flex-1 py-2 rounded-lg text-xs font-cinzel font-semibold uppercase tracking-wider transition-all duration-200"
            style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.35)', color: '#06b6d4' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(6,182,212,0.2)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(6,182,212,0.1)'; }}
          >
            ↺ Reset
          </button>
        </div>
      </div>
    </div>
  );
} 