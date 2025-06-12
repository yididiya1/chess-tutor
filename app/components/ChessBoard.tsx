"use client";

import { useState, useEffect } from "react";
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

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div className={`text-lg font-semibold ${isComplete ? 'text-green-600' : showHint ? 'text-blue-600' : 'text-gray-700'}`}>
            {message}
          </div>
          <div className="flex space-x-2">
            {!isComplete && (
              <button
                onClick={showHintArrow}
                disabled={showHint || !isPlayerTurn}
                className={`px-4 py-2 rounded-md transition-colors ${
                  showHint || !isPlayerTurn
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-yellow-500 text-white hover:bg-yellow-600'
                }`}
              >
                💡 Show Hint
              </button>
            )}
            <button
              onClick={resetPuzzle}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{currentMoveIndex}/{puzzleMoves.length} moves</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(100, (currentMoveIndex / puzzleMoves.length) * 100)}%` }}
            ></div>
          </div>
        </div>
        
        {moveHistory.length > 0 && (
          <div className="text-sm text-gray-600">
            <strong>Moves:</strong> {moveHistory.join(", ")}
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Chessboard Section */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <Chessboard
            position={gamePosition}
            onPieceDrop={onDrop}
            boardOrientation={playerColor}
            boardWidth={Math.min(600, typeof window !== 'undefined' ? window.innerWidth - 400 : 600)}
            customBoardStyle={{
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            customDarkSquareStyle={{ backgroundColor: "#779952" }}
            customLightSquareStyle={{ backgroundColor: "#edeed1" }}
            customArrows={hintArrow ? [hintArrow] : []}
            customArrowColor="rgb(255, 170, 0)"
          />
        </div>

        {/* Puzzle Information Panel */}
        <div className="w-[30em] bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Puzzle Information</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Type:</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {puzzle.type}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Rating:</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                {puzzle.rating}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Playing as:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                playerColor === 'white' 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'bg-gray-800 text-white'
              }`}>
                {playerColor === 'white' ? '⚪ White' : '⚫ Black'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isComplete ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {isComplete ? '✅ Completed' : '🎯 In Progress'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}