"use client";

import { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";
import { useUserProgress } from "@/hooks/useUserProgress";

interface Puzzle {
  fen: string;
  moves: string; // Space-separated moves in "from-to" format like "f2g3 e6e7 b2b1"
  rating: number;
  type: string;
}

interface ChessBoardProps {
  position: string;
  puzzle: Puzzle;
}

export default function ChessBoard({ position, puzzle }: ChessBoardProps) {
  const [game, setGame] = useState(new Chess(position));
  const [gamePosition, setGamePosition] = useState(position);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [message, setMessage] = useState("Computer is making the first move...");
  const [showHint, setShowHint] = useState(false);
  const [hintArrow, setHintArrow] = useState<[Square, Square] | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [startTime, setStartTime] = useState<Date>(new Date());
  
  const { updatePuzzleProgress } = useUserProgress();

  const boardContainerRef = useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = useState(480);

  useEffect(() => {
    if (!boardContainerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        // subtract 24px padding (12px each side)
        setBoardWidth(Math.floor(entry.contentRect.width) - 24);
      }
    });
    observer.observe(boardContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Parse moves string into array
  const puzzleMoves = puzzle.moves.split(' ').filter(move => move.trim() !== '');

  useEffect(() => {
    // Clear any pending timeouts to prevent state conflicts
    const timeoutIds: NodeJS.Timeout[] = [];
    
    const resetPuzzleState = () => {
      const newGame = new Chess(position);
      setGame(newGame);
      setGamePosition(position);
      setMoveHistory([]);
      setCurrentMoveIndex(0);
      setIsComplete(false);
      setShowHint(false);
      setHintArrow(null);
      setIsPlayerTurn(false);
      setMessage("Computer is making the first move...");
      setStartTime(new Date()); // Reset timer when puzzle starts
      
      // Determine player color based on whose turn it is to move
      // If it's Black's turn in the FEN, then player is White (computer is Black)
      // If it's White's turn in the FEN, then player is Black (computer is White)
      const currentTurn = newGame.turn();
      console.log("currentTurn", currentTurn);
      console.log("FEN position:", position);
      const determinedPlayerColor = currentTurn === 'b' ? 'white' : 'black';
      console.log("determinedPlayerColor", determinedPlayerColor);
      setPlayerColor(determinedPlayerColor);
      
      // Computer always makes the first move
      if (puzzleMoves.length > 0) {
        const timeoutId = setTimeout(() => {
          makeComputerMove(0, newGame);
        }, 1000);
        timeoutIds.push(timeoutId);
      }
      
      // Update message to show correct player color
      setTimeout(() => {
        setMessage(`${determinedPlayerColor === 'white' ? 'White' : 'Black'} to play - Find the best move!`);
      }, 1500); // Show after computer move completes
    };
    
    resetPuzzleState();
    
    // Cleanup function to clear timeouts when component unmounts or dependencies change
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [position, puzzle.fen, puzzle.moves]); // Use puzzle.fen and puzzle.moves instead of puzzle.id

  function makeComputerMove(moveIndex: number, gameCopy?: Chess) {
    console.log(`Making computer move ${moveIndex}: ${puzzleMoves[moveIndex]}`);
    
    if (moveIndex >= puzzleMoves.length) {
      console.log("No more computer moves available");
      return;
    }
    
    const computerMoveStr = puzzleMoves[moveIndex];
    const gameToUse = gameCopy || new Chess(game.fen());
    
    try {
      // Parse the move in "from-to" format (e.g., "f2g3")
      const from = computerMoveStr.substring(0, 2);
      const to = computerMoveStr.substring(2, 4);
      let promotion = computerMoveStr.length > 4 ? computerMoveStr.substring(4) : undefined;
      
      // Handle promotion notation
      if (promotion) {
        // Convert promotion letter to lowercase if needed
        promotion = promotion.toLowerCase();
      }
      
      const moveObj: { from: string; to: string; promotion?: string } = { from, to };
      if (promotion) {
        moveObj.promotion = promotion;
      }
      
      const result = gameToUse.move(moveObj);
      
      if (result) {
        console.log(`Computer move successful: ${result.san}`);
        setGame(gameToUse);
        setGamePosition(gameToUse.fen());
        setMoveHistory(prev => [...prev, result.san]);
        setCurrentMoveIndex(prev => prev + 1);
        
        // Check if puzzle is complete (all moves played)
        if (moveIndex + 1 >= puzzleMoves.length) {
          const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
          setMessage("🎉 Puzzle completed! Well done!");
          setIsComplete(true);
          setIsPlayerTurn(false);
          
          // Track puzzle completion
          updatePuzzleProgress({
            puzzleId: puzzle.fen, // Using FEN as unique puzzle ID
            solved: true,
            timeSpent
          }).catch(error => console.error('Failed to track puzzle progress:', error));
        } else {
          // It's now player's turn
          setMessage(`${playerColor === 'white' ? 'White' : 'Black'} to play - Find the best move!`);
          setIsPlayerTurn(true);
        }
      } else {
        console.error(`Failed to execute computer move: ${computerMoveStr}`);
        setMessage("Error in computer move. Please reset the puzzle.");
      }
    } catch (error) {
      console.error(`Error executing computer move: ${computerMoveStr}`, error);
      setMessage("Error in computer move. Please reset the puzzle.");
    }
  }

  function showHintArrow() {
    if (currentMoveIndex < puzzleMoves.length && !isComplete && isPlayerTurn) {
      const currentExpectedMove = puzzleMoves[currentMoveIndex];
      console.log('=== HINT DEBUG ===');
      console.log(`Current Move Index: ${currentMoveIndex}`);
      console.log(`Showing hint for move: "${currentExpectedMove}"`);
      console.log(`Puzzle moves array:`, puzzleMoves);
      console.log('==================');
      
      try {
        // Parse the expected move
        const from = currentExpectedMove.substring(0, 2);
        const to = currentExpectedMove.substring(2, 4);
        
        setHintArrow([from as Square, to as Square]);
        setShowHint(true);
        setMessage("💡 Hint: Look at the highlighted move!");
        
        // Hide hint after 5 seconds
        setTimeout(() => {
          setHintArrow(null);
          setShowHint(false);
          if (!isComplete && isPlayerTurn) {
            setMessage(`${playerColor === 'white' ? 'White' : 'Black'} to play - Find the best move!`);
          }
        }, 5000);
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
    if (!piece || piece.color !== (playerColor === 'white' ? 'w' : 'b')) {
      return null; // Not player's piece
    }

    console.log('=== BEFORE CHESS.JS MOVE ===');
    console.log(`Input move object:`, move);
    console.log(`Move.from: "${move.from}", Move.to: "${move.to}", Move.promotion: "${move.promotion}"`);
    console.log('============================');

    const result = gameCopy.move(move);
    
    if (result === null) {
      return null; // Invalid move
    }
    
    console.log('=== AFTER CHESS.JS MOVE ===');
    console.log(`Chess.js result object:`, result);
    console.log(`Result.from: "${result.from}", Result.to: "${result.to}"`);
    console.log(`Result.promotion: "${result.promotion}"`);
    console.log('===========================');
    
    // Clear hint when user makes a move
    setHintArrow(null);
    setShowHint(false);
    
    // Check if the move matches the expected move
    const expectedMove = puzzleMoves[currentMoveIndex];
    const playerMoveStr = move.from + move.to + (move.promotion ? move.promotion : '');
    
    console.log('=== MOVE COMPARISON DEBUG ===');
    console.log(`Current Move Index: ${currentMoveIndex}`);
    console.log(`Expected Move: "${expectedMove}"`);
    console.log(`Player Move String: "${playerMoveStr}"`);
    console.log(`Player Move Object:`, move);
    console.log(`Move promotion value: "${move.promotion}"`);
    console.log(`Expected Move Length: ${expectedMove.length}`);
    console.log(`Player Move String Length: ${playerMoveStr.length}`);
    console.log(`Are they equal? ${expectedMove === playerMoveStr}`);
    console.log('=============================');
    
    // Check if the move matches exactly
    const isCorrectMove = expectedMove === playerMoveStr;
    
    if (isCorrectMove) {
      console.log(`✅ Correct move!`);
      
      // Update game state
      setGame(gameCopy);
      setGamePosition(gameCopy.fen());
      setMoveHistory(prev => [...prev, result.san]);
      setCurrentMoveIndex(prev => prev + 1);
      setIsPlayerTurn(false);
      
      // Check if puzzle is complete
      if (currentMoveIndex + 1 >= puzzleMoves.length) {
        const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
        setMessage("🎉 Puzzle completed! Well done!");
        setIsComplete(true);
        
        // Track puzzle completion
        updatePuzzleProgress({
          puzzleId: puzzle.fen, // Using FEN as unique puzzle ID
          solved: true,
          timeSpent
        }).catch(error => console.error('Failed to track puzzle progress:', error));
      } else {
        // Computer should make the next move
        setMessage("✅ Correct! Computer is responding...");
        setTimeout(() => {
          makeComputerMove(currentMoveIndex + 1, gameCopy);
        }, 1000);
      }
    } else {
      console.log(`❌ Incorrect move! Player: "${playerMoveStr}", Expected: "${expectedMove}"`);
      setMessage("❌ Not the best move. Try again!");
      return null;
    }
    
    return result;
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    // Check if this is a pawn promotion move
    const piece = game.get(sourceSquare as Square);
    const isPromotion = piece?.type === 'p' && 
      ((piece.color === 'w' && targetSquare[1] === '8') || 
       (piece.color === 'b' && targetSquare[1] === '1'));
    
    console.log('=== ON DROP DEBUG ===');
    console.log(`Source: ${sourceSquare}, Target: ${targetSquare}`);
    console.log(`Piece:`, piece);
    console.log(`Is Promotion: ${isPromotion}`);
    console.log(`Promotion value: ${isPromotion ? "q" : undefined}`);
    console.log('====================');
    
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: isPromotion ? "q" : undefined, // Only promote when it's actually a pawn promotion
    });

    if (move === null) return false;
    return true;
  }

  function resetPuzzle() {
    const newGame = new Chess(position);
    setGame(newGame);
    setGamePosition(position);
    setMoveHistory([]);
    setCurrentMoveIndex(0);
    setIsComplete(false);
    setShowHint(false);
    setHintArrow(null);
    setIsPlayerTurn(false);
    setMessage("Computer is making the first move...");
    setStartTime(new Date()); // Reset timer when puzzle resets
    
    // Determine player color based on whose turn it is to move
    const currentTurn = newGame.turn();
    const determinedPlayerColor = currentTurn === 'b' ? 'white' : 'black';
    setPlayerColor(determinedPlayerColor);
    
    // Computer always makes the first move
    if (puzzleMoves.length > 0) {
      setTimeout(() => {
        makeComputerMove(0, newGame);
      }, 1000);
    }
  }

  const progressPct = puzzleMoves.length > 0
    ? Math.min(100, (currentMoveIndex / puzzleMoves.length) * 100)
    : 0;

  const msgColor = isComplete ? '#10b981' : showHint ? '#06b6d4' : '#f0e6c8';

  return (
    <div className="flex gap-6 w-full items-start">
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
          boardOrientation={playerColor}
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
        {/* Status message */}
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
            <span className="text-xs font-cinzel font-semibold uppercase tracking-widest" style={{ color: 'rgba(245,158,11,0.6)' }}>
              Progress
            </span>
            <span className="text-xs font-rajdhani font-semibold" style={{ color: '#f59e0b' }}>
              {currentMoveIndex} / {puzzleMoves.length} moves
            </span>
          </div>
          <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                background: isComplete
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
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

        {/* Puzzle Info */}
        <div
          className="rounded-xl px-4 py-4 flex flex-col gap-3"
          style={{
            background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1426 100%)',
            border: '1px solid rgba(245,158,11,0.15)',
          }}
        >
          <h3 className="text-xs font-cinzel font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(245,158,11,0.6)' }}>
            Puzzle Info
          </h3>

          {[
            { label: 'Type',       value: puzzle.type,                                    accent: '#06b6d4' },
            { label: 'Rating',     value: `★ ${puzzle.rating}`,                           accent: '#f59e0b' },
            { label: 'Playing as', value: playerColor === 'white' ? '⚪ White' : '⚫ Black', accent: playerColor === 'white' ? '#e2e8f0' : '#94a3b8' },
            { label: 'Status',     value: isComplete ? '✅ Solved' : '🎯 In Progress',    accent: isComplete ? '#10b981' : '#94a3b8' },
          ].map(({ label, value, accent }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-xs font-rajdhani" style={{ color: 'rgba(226,232,240,0.45)' }}>{label}</span>
              <span
                className="text-xs font-rajdhani font-semibold px-2 py-0.5 rounded-full"
                style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
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
            onClick={resetPuzzle}
            className="flex-1 py-2 rounded-lg text-xs font-cinzel font-semibold uppercase tracking-wider transition-all duration-200"
            style={{
              background: 'rgba(6,182,212,0.1)',
              border: '1px solid rgba(6,182,212,0.35)',
              color: '#06b6d4',
            }}
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