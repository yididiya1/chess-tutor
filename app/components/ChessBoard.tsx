"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";
import { CheckCircle2, Flame, TrendingUp, TrendingDown } from "lucide-react";
import {
  useUserProgress,
  type PuzzleRatingOutcome,
  type PuzzleStreakOutcome,
} from "@/hooks/useUserProgress";

interface Puzzle {
  fen: string;
  moves: string; // Space-separated moves in "from-to" format like "f2g3 e6e7 b2b1"
  rating: number;
  type: string;
}

interface ChessBoardProps {
  position: string;
  puzzle: Puzzle;
  onSolved?: () => void;
  onAttempt?: () => void;
  onProgressUpdate?: (
    rating: PuzzleRatingOutcome | null,
    streak: PuzzleStreakOutcome | null
  ) => void;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

export default function ChessBoard({ position, puzzle, onSolved, onAttempt, onProgressUpdate }: ChessBoardProps) {
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
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [solvedStats, setSolvedStats] = useState<{
    timeSpent: number;
    mistakes: number;
    rating: PuzzleRatingOutcome | null;
    streak: PuzzleStreakOutcome | null;
  } | null>(null);
  
  const { updatePuzzleProgress } = useUserProgress();

  const boardContainerRef = useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = useState(480);

  // Track every pending setTimeout so they can be canceled on puzzle change or unmount.
  // Without this, callbacks like the 1s computer-move delay or the 5s hint timeout
  // can fire after the component unmounts (e.g. when navigating away mid-puzzle),
  // triggering setState-on-unmounted-component errors during route transitions.
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const trackedTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);
  useEffect(() => () => clearAllTimers(), [clearAllTimers]);

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
    // Cancel anything pending from the previous puzzle before scheduling new work.
    clearAllTimers();

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
    setStartTime(new Date());
    setFeedback(null);
    setMistakes(0);
    setSolvedStats(null);

    // If it's Black's turn in the FEN, then player is White (computer is Black)
    // If it's White's turn in the FEN, then player is Black (computer is White)
    const determinedPlayerColor = newGame.turn() === 'b' ? 'white' : 'black';
    setPlayerColor(determinedPlayerColor);

    // Computer always makes the first move
    if (puzzleMoves.length > 0) {
      trackedTimeout(() => {
        makeComputerMove(0, newGame);
      }, 1000);
    }

    // Update message to show correct player color (after computer move completes)
    trackedTimeout(() => {
      setMessage(`${determinedPlayerColor === 'white' ? 'White' : 'Black'} to play — find the best move.`);
    }, 1500);

    return () => clearAllTimers();
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
          setMessage("Puzzle completed.");
          setIsComplete(true);
          setIsPlayerTurn(false);
          setSolvedStats({ timeSpent, mistakes, rating: null, streak: null });

          updatePuzzleProgress({
            puzzleId: puzzle.fen,
            solved: true,
            timeSpent,
            mistakes,
            puzzleRating: puzzle.rating,
          })
            .then(res => {
              setSolvedStats(prev =>
                prev ? { ...prev, rating: res.rating ?? null, streak: res.streak ?? null } : prev
              );
              onProgressUpdate?.(res.rating ?? null, res.streak ?? null);
            })
            .catch(error => console.error('Failed to track puzzle progress:', error));
          onSolved?.();
        } else {
          // It's now player's turn
          setMessage(`${playerColor === 'white' ? 'White' : 'Black'} to play — find the best move.`);
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
        setMessage("Hint shown — look at the highlighted move.");

        // Hide hint after 5 seconds
        trackedTimeout(() => {
          setHintArrow(null);
          setShowHint(false);
          if (!isComplete && isPlayerTurn) {
            setMessage(`${playerColor === 'white' ? 'White' : 'Black'} to play — find the best move.`);
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
    onAttempt?.();

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
        setMessage("Puzzle completed.");
        setIsComplete(true);
        setSolvedStats({ timeSpent, mistakes, rating: null, streak: null });

        updatePuzzleProgress({
          puzzleId: puzzle.fen,
          solved: true,
          timeSpent,
          mistakes,
          puzzleRating: puzzle.rating,
        })
          .then(res => {
            setSolvedStats(prev =>
              prev ? { ...prev, rating: res.rating ?? null, streak: res.streak ?? null } : prev
            );
            onProgressUpdate?.(res.rating ?? null, res.streak ?? null);
          })
          .catch(error => console.error('Failed to track puzzle progress:', error));
        onSolved?.();
      } else {
        // Computer should make the next move
        setMessage("Correct. Computer is responding…");
        setFeedback('correct');
        trackedTimeout(() => setFeedback(null), 1200);
        trackedTimeout(() => {
          makeComputerMove(currentMoveIndex + 1, gameCopy);
        }, 1000);
      }
    } else {
      console.log(`Incorrect move! Player: "${playerMoveStr}", Expected: "${expectedMove}"`);
      setMessage("Not the best move. Try again.");
      setFeedback('incorrect');
      setMistakes(m => m + 1);
      trackedTimeout(() => setFeedback(null), 1200);
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
    clearAllTimers();
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
    setFeedback(null);
    setMistakes(0);
    setSolvedStats(null);
    
    // Determine player color based on whose turn it is to move
    const currentTurn = newGame.turn();
    const determinedPlayerColor = currentTurn === 'b' ? 'white' : 'black';
    setPlayerColor(determinedPlayerColor);
    
    // Computer always makes the first move
    if (puzzleMoves.length > 0) {
      trackedTimeout(() => {
        makeComputerMove(0, newGame);
      }, 1000);
    }
  }

  const progressPct = puzzleMoves.length > 0
    ? Math.min(100, (currentMoveIndex / puzzleMoves.length) * 100)
    : 0;

  const boardFeedbackClass =
    isComplete || feedback === 'correct'
      ? 'border-success ring-2 ring-success/20'
      : feedback === 'incorrect'
      ? 'border-destructive ring-2 ring-destructive/20'
      : '';

  return (
    <div className="flex gap-6 w-full items-start">
      {/* ── Board ─────────────────────────────────────────── */}
      <div
        ref={boardContainerRef}
        className={`flex-[3] min-w-0 rounded-lg overflow-hidden bg-card border p-3 transition-colors duration-200 ${boardFeedbackClass}`}
      >
        <Chessboard
          position={gamePosition}
          onPieceDrop={onDrop}
          boardOrientation={playerColor}
          boardWidth={boardWidth}
          customBoardStyle={{ borderRadius: '6px' }}
          customDarkSquareStyle={{ backgroundColor: '#8b8170' }}
          customLightSquareStyle={{ backgroundColor: '#ede9dd' }}
          customArrows={hintArrow ? [hintArrow] : []}
          customArrowColor="hsl(var(--primary))"
        />
      </div>

      {/* ── Right Panel ───────────────────────────────────── */}
      <div className="flex-[1] min-w-0 flex flex-col gap-4">
        {/* Status / Success */}
        {isComplete && solvedStats ? (
          <div className="panel px-4 py-4 border-success/40 bg-success/5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={18} className="text-success" />
              <h3 className="text-sm font-medium text-foreground">Puzzle solved</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Time</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{formatDuration(solvedStats.timeSpent)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Mistakes</p>
                <p className={`text-sm font-medium mt-0.5 ${solvedStats.mistakes === 0 ? 'text-success' : 'text-foreground'}`}>
                  {solvedStats.mistakes}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Puzzle</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{puzzle.rating}</p>
              </div>
            </div>

            {solvedStats.rating && (
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-success/30">
                <div className="flex items-center gap-1.5">
                  {solvedStats.rating.delta >= 0
                    ? <TrendingUp size={14} className="text-success" />
                    : <TrendingDown size={14} className="text-destructive" />}
                  <span className="text-xs text-muted-foreground">Your rating</span>
                  <span className="text-sm font-medium text-foreground">{solvedStats.rating.new}</span>
                  <span className={`text-xs font-medium ${solvedStats.rating.delta >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {solvedStats.rating.delta >= 0 ? '+' : ''}{solvedStats.rating.delta}
                  </span>
                  {solvedStats.rating.speedBonus > 0 && (
                    <span className="text-[10px] uppercase tracking-wider text-success ml-1">
                      +{solvedStats.rating.speedBonus} speed
                    </span>
                  )}
                </div>
                {solvedStats.streak && (
                  <div className="flex items-center gap-1 text-xs">
                    <Flame size={12} className="text-success" />
                    <span className="font-medium text-foreground">{solvedStats.streak.current}</span>
                    <span className="text-muted-foreground">streak</span>
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-3">
              {solvedStats.mistakes === 0
                ? "Solved cleanly — no mistakes."
                : solvedStats.mistakes === 1
                ? "Solved with one wrong attempt."
                : `Solved after ${solvedStats.mistakes} wrong attempts.`}
            </p>
          </div>
        ) : (
          <div className="panel px-4 py-3">
            <p className={`text-sm font-medium leading-snug ${
              feedback === 'incorrect' ? 'text-destructive' : feedback === 'correct' ? 'text-success' : 'text-foreground'
            }`}>
              {message}
            </p>
          </div>
        )}

        {/* Progress */}
        <div className="panel px-4 py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Progress
            </span>
            <span className="text-xs font-medium text-foreground">
              {currentMoveIndex} / {puzzleMoves.length} moves
            </span>
          </div>
          <div className="w-full rounded-full h-1.5 bg-muted">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                isComplete ? 'bg-success' : 'bg-primary'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {moveHistory.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {moveHistory.join(' · ')}
            </p>
          )}
        </div>

        {/* Puzzle Info */}
        <div className="panel px-4 py-4 flex flex-col gap-2.5">
          <h3 className="text-xs font-medium uppercase tracking-wider mb-1 text-muted-foreground">
            Puzzle Info
          </h3>

          {[
            { label: 'Type',       value: puzzle.type },
            { label: 'Rating',     value: puzzle.rating.toString() },
            { label: 'Playing as', value: playerColor === 'white' ? 'White' : 'Black' },
            { label: 'Status',     value: isComplete ? 'Solved' : 'In Progress' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded border bg-muted text-foreground">
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
              className="btn-outline flex-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hint
            </button>
          )}
          <button
            onClick={resetPuzzle}
            className="btn-outline flex-1 text-xs"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}