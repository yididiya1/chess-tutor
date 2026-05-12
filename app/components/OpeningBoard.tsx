"use client";

import { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";
import LessonChat from "./LessonChat";
import type { Lesson } from "../types/openings";

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
  lesson?: Lesson;
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
  const [message, setMessage] = useState(`${playerSide === 'white' ? 'White' : 'Black'} to play — learn the ${openingLine.name}.`);
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
    setMessage(`${playerSide === 'white' ? 'White' : 'Black'} to play — learn the ${openingLine.name}.`);
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
      setMessage("Opening sequence completed.");
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
        const promoMatch = computerMoveStr.match(/=([QRBN])/i);
        const promotion = promoMatch ? promoMatch[1].toLowerCase() : 'q';
        result = gameCopy.move({ from, to, promotion });
      }
      
      if (result) {
        console.log(`Computer move successful: ${result.san}`);
        setGame(gameCopy);
        setGamePosition(gameCopy.fen());
        setMoveHistory(prev => [...prev, result.san]);
        setCurrentMoveIndex(nextMoveIndex + 1);
        
        // Check if opening is complete
        if (nextMoveIndex + 1 >= openingLine.moves.length) {
          setMessage("Opening sequence completed.");
          setIsComplete(true);
          setIsPlayerTurn(false);
        } else {
          setMessage(`${playerSide === 'white' ? 'White' : 'Black'} to play — continue the sequence.`);
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
          setMessage("Hint shown — look at the highlighted move.");
          
          setTimeout(() => {
            setHintArrow(null);
            setShowHint(false);
            if (!isComplete && isPlayerTurn) {
              setMessage(`${playerSide === 'white' ? 'White' : 'Black'} to play — continue the sequence.`);
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
        setMessage("Opening sequence completed.");
        setIsComplete(true);
      } else {
        // Make computer move after delay
        setMessage("Correct. Computer is responding…");
        setTimeout(() => {
          makeComputerMove(currentMoveIndex + 1, gameCopy);
        }, 1000);
      }
    } else {
      setMessage("Not the correct opening move. Try again.");
      return null;
    }
    
    return result;
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    const expectedMove = openingLine.moves[currentMoveIndex];
    const promoMatch = expectedMove?.match(/=([QRBN])/i);
    const promotion = promoMatch ? promoMatch[1].toLowerCase() : 'q';

    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion,
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
    setMessage(`${playerSide === 'white' ? 'White' : 'Black'} to play — learn the ${openingLine.name}.`);
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

  return (
    <div className="flex gap-6 w-full items-start p-16 pt-2">
      {/* ── Board ─────────────────────────────────────────── */}
      <div
        ref={boardContainerRef}
        className="flex-[3] min-w-0 rounded-lg overflow-hidden bg-card border p-3"
      >
        <Chessboard
          position={gamePosition}
          onPieceDrop={onDrop}
          boardOrientation={playerSide}
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
        {openingLine.lesson ? (
          <>
            <LessonChat
              lesson={openingLine.lesson}
              currentMoveIndex={currentMoveIndex}
              totalMoves={openingLine.moves.length}
              isComplete={isComplete}
            />

            {/* Status (compact, always-visible turn/feedback line) */}
            <div className="panel px-4 py-2">
              <p className={`text-xs leading-snug ${
                isComplete ? 'text-success' : 'text-muted-foreground'
              }`}>
                {message}
              </p>
            </div>

            {/* Actions */}
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
                onClick={resetOpening}
                className="btn-outline flex-1 text-xs"
              >
                Reset
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Status */}
            <div className="panel px-4 py-3">
              <p className={`text-sm font-medium leading-snug ${
                isComplete ? 'text-success' : 'text-foreground'
              }`}>
                {message}
              </p>
            </div>

            {/* Progress */}
            <div className="panel px-4 py-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Progress</span>
                <span className="text-xs font-medium text-foreground">{currentMoveIndex} / {openingLine.moves.length} moves</span>
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

            {/* Opening Info */}
            <div className="panel px-4 py-4 flex flex-col gap-2.5">
              <h3 className="text-xs font-medium uppercase tracking-wider mb-1 text-muted-foreground">Opening Info</h3>

              {[
                { label: 'Opening',    value: openingLine.name },
                { label: 'Difficulty', value: openingLine.difficulty },
                { label: 'Playing as', value: playerSide === 'white' ? 'White' : 'Black' },
                { label: 'Status',     value: isComplete ? 'Completed' : 'In Progress' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded border bg-muted text-foreground">{value}</span>
                </div>
              ))}

              <div className="pt-3 mt-1 border-t">
                <p className="text-xs leading-relaxed text-muted-foreground">{openingLine.description}</p>
              </div>

              <div className="pt-3 border-t">
                <p className="text-xs font-medium uppercase tracking-wider mb-2 text-muted-foreground">Statistics</p>
                <div className="flex gap-2">
                  {[
                    { label: 'White', value: `${openingLine.whiteWinRate}%` },
                    { label: 'Black', value: `${openingLine.blackWinRate}%` },
                    { label: 'Draw',  value: `${openingLine.drawRate}%` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex-1 rounded-md px-2 py-1.5 text-center bg-muted border">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium text-foreground">{value}</p>
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
                  className="btn-outline flex-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hint
                </button>
              )}
              <button
                onClick={resetOpening}
                className="btn-outline flex-1 text-xs"
              >
                Reset
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 