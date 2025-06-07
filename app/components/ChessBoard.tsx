"use client";

import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";

interface Puzzle {
  id: number;
  elo: number;
  type: string;
  difficulty: string;
  fen: string;
  solution: string[];
  computerResponse: string[];
  playerColor: string;
  completed: boolean;
}

interface ChessBoardProps {
  position: string;
  puzzle: Puzzle;
}

export default function ChessBoard({ position, puzzle }: ChessBoardProps) {
  const [game, setGame] = useState(new Chess(position));
  const [gamePosition, setGamePosition] = useState(position);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [playerMoveCount, setPlayerMoveCount] = useState(0);
  const [totalMoveIndex, setTotalMoveIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [message, setMessage] = useState(`${puzzle.playerColor === 'white' ? 'White' : 'Black'} to play - Find the best move!`);
  const [showHint, setShowHint] = useState(false);
  const [hintArrow, setHintArrow] = useState<[Square, Square] | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  useEffect(() => {
    const newGame = new Chess(position);
    setGame(newGame);
    setGamePosition(position);
    setMoveHistory([]);
    setPlayerMoveCount(0);
    setTotalMoveIndex(0);
    setIsComplete(false);
    setMessage(`${puzzle.playerColor === 'white' ? 'White' : 'Black'} to play - Find the best move!`);
    setShowHint(false);
    setHintArrow(null);
    setIsPlayerTurn(true);

    // For puzzles, player always moves first regardless of color
    // No automatic computer first move needed
  }, [position, puzzle.id, puzzle.playerColor]);

  function makeComputerMove(currentPlayerMoveCount?: number, gameCopy?: Chess) {
    // Use the passed parameter or fall back to state (for reset scenarios)
    const actualPlayerMoveCount = currentPlayerMoveCount ?? playerMoveCount;
    
    // Check if there's a computer response available
    // Computer responses are indexed by the player move they're responding to (0-based)
    // Player makes move 1 (playerMoveCount=1), computer responds with response[0]
    const computerResponseIndex = actualPlayerMoveCount - 1;
    console.log(`makeComputerMove called with playerMoveCount: ${actualPlayerMoveCount}, computerResponseIndex: ${computerResponseIndex}`);
    
    if (computerResponseIndex >= 0 && computerResponseIndex < puzzle.computerResponse.length) {
      const computerMoveStr = puzzle.computerResponse[computerResponseIndex];
      console.log(`Attempting computer move: ${computerMoveStr}`);
      console.log(`Current position: ${gameCopy?.fen() || game.fen()}`);
      
      // Create a copy of the game to make the move
      const gameCopyToUse = gameCopy || new Chess(game.fen());
      
      try {
        // Try to make the move directly as SAN first
        let result = gameCopyToUse.move(computerMoveStr);
        
        if (!result && computerMoveStr.length >= 4) {
          // If SAN fails, try coordinate notation
          const from = computerMoveStr.substring(0, 2);
          const to = computerMoveStr.substring(2, 4);
          result = gameCopyToUse.move({ from, to });
        }
        
        if (result) {
          console.log(`Computer move successful: ${result.san}`);
          setGame(gameCopyToUse);
          setGamePosition(gameCopyToUse.fen());
          setMoveHistory(prev => [...prev, result.san]);
          setTotalMoveIndex(prev => prev + 1);
          
          // Check if puzzle is complete
          if (actualPlayerMoveCount >= puzzle.solution.length) {
            setMessage("🎉 Puzzle completed! Well done!");
            setIsComplete(true);
            setIsPlayerTurn(false);
          } else {
            setMessage(`${puzzle.playerColor === 'white' ? 'White' : 'Black'} to play - Continue the sequence!`);
            setIsPlayerTurn(true);
          }
          return;
        } else {
          console.error(`Failed to execute computer move: ${computerMoveStr}`);
        }
      } catch (error) {
        console.error(`Error executing computer move: ${computerMoveStr}`, error);
      }
      
      // If computer move failed, continue with player
      setMessage(`${puzzle.playerColor === 'white' ? 'White' : 'Black'} to play - Continue the sequence!`);
      setIsPlayerTurn(true);
    } else {
      // No computer response available, continue with player
      setMessage(`${puzzle.playerColor === 'white' ? 'White' : 'Black'} to play - Continue the sequence!`);
      setIsPlayerTurn(true);
    }
  }

  function showHintArrow() {
    if (totalMoveIndex < puzzle.solution.length && !isComplete && isPlayerTurn) {
      // The solution array contains ALL moves (player + computer), so use totalMoveIndex
      const currentExpectedMove = puzzle.solution[totalMoveIndex];
      console.log(`Showing hint for move: ${currentExpectedMove}, Total Move Index: ${totalMoveIndex}`);
      
      // Create a test game to get move details
      const testGame = new Chess(game.fen());
      
      try {
        // Try to make the move to get the from/to squares
        let result = testGame.move(currentExpectedMove);
        
        if (!result && currentExpectedMove.length >= 4) {
          // If SAN fails, try coordinate notation
          const from = currentExpectedMove.substring(0, 2);
          const to = currentExpectedMove.substring(2, 4);
          result = testGame.move({ from, to });
        }
        
        if (result) {
          setHintArrow([result.from as Square, result.to as Square]);
          setShowHint(true);
          setMessage("💡 Hint: Look at the highlighted move!");
          
          // Hide hint after 5 seconds
          setTimeout(() => {
            setHintArrow(null);
            setShowHint(false);
            if (!isComplete && isPlayerTurn) {
              setMessage(`${puzzle.playerColor === 'white' ? 'White' : 'Black'} to play - Find the best move!`);
            }
          }, 5000);
        } else {
          console.error(`Failed to parse hint move: ${currentExpectedMove}`);
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
    if (!piece || piece.color !== (puzzle.playerColor === 'white' ? 'w' : 'b')) {
      return null; // Not player's piece
    }

    const result = gameCopy.move(move);
    
    if (result === null) {
      return null; // Invalid move
    }
    
    // Clear hint when user makes a move
    setHintArrow(null);
    setShowHint(false);
    
    // Check if the move matches the expected solution
    // The solution array contains ALL moves (player + computer), so use totalMoveIndex
    const expectedMove = puzzle.solution[totalMoveIndex];
    console.log(`Player move: ${result.san}, Expected: ${expectedMove}, Total Move Index: ${totalMoveIndex}`);
    
    // Check multiple formats: SAN and coordinate notation
    const isCorrectMove = expectedMove === result.san || 
                         expectedMove === (result.from + result.to) ||
                         expectedMove === result.from + result.to + (result.promotion || '');
    
    if (isCorrectMove) {
      console.log(`✅ Correct move! Incrementing playerMoveCount from ${playerMoveCount} to ${playerMoveCount + 1}`);
      
      // Update game state
      setGame(gameCopy);
      setGamePosition(gameCopy.fen());
      setMoveHistory(prev => [...prev, result.san]);
      setPlayerMoveCount(prev => prev + 1);
      setTotalMoveIndex(prev => prev + 1);
      setIsPlayerTurn(false);
      
      // Check if puzzle is complete (no more moves needed)
      if (totalMoveIndex + 1 >= puzzle.solution.length) {
        setMessage("🎉 Puzzle completed! Well done!");
        setIsComplete(true);
      } else {
        // Check if computer should respond
        const newPlayerMoveCount = playerMoveCount + 1; // Calculate the new value
        // Computer responses are indexed by the player move they're responding to (0-based)
        // First player move (index 0) gets computer response 0, etc.
        const computerResponseIndex = playerMoveCount; // Use current playerMoveCount as index
        if (computerResponseIndex >= 0 && computerResponseIndex < puzzle.computerResponse.length) {
          setMessage("✅ Correct! Computer is responding...");
          // Make computer move after a short delay, passing the updated game state
          setTimeout(() => {
            makeComputerMove(newPlayerMoveCount, gameCopy); // Pass the correct updated value
          }, 1000);
        } else {
          // No computer response, continue with player
          setMessage(`${puzzle.playerColor === 'white' ? 'White' : 'Black'} to play - Continue the sequence!`);
          setIsPlayerTurn(true);
        }
      }
    } else {
      console.log(`❌ Incorrect move! Player: ${result.san}, Expected: ${expectedMove}`);
      setMessage("❌ Not the best move. Try again!");
      return null;
    }
    
    return result;
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Always promote to queen for simplicity
    });

    if (move === null) return false;
    return true;
  }

  function resetPuzzle() {
    const newGame = new Chess(position);
    setGame(newGame);
    setGamePosition(position);
    setMoveHistory([]);
    setPlayerMoveCount(0);
    setTotalMoveIndex(0);
    setIsComplete(false);
    setMessage(`${puzzle.playerColor === 'white' ? 'White' : 'Black'} to play - Find the best move!`);
    setShowHint(false);
    setHintArrow(null);
    setIsPlayerTurn(true);

    // For puzzles, player always moves first regardless of color
    // No automatic computer first move needed
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
            boardOrientation={puzzle.playerColor === 'white' ? 'white' : 'black'}
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
        <div className="w-80 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Puzzle Information</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Type:</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {puzzle.type}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Difficulty:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                puzzle.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                puzzle.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {puzzle.difficulty}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Rating:</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                {puzzle.elo}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Playing as:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                puzzle.playerColor === 'white' 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'bg-gray-800 text-white'
              }`}>
                {puzzle.playerColor === 'white' ? '⚪ White' : '⚫ Black'}
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
            
            <div className="pt-4 border-t border-gray-200">
              <span className="text-gray-600 font-medium">Progress:</span>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Moves completed</span>
                  <span>{Math.floor(totalMoveIndex / 2)}/{Math.ceil(puzzle.solution.length / 2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(100, (totalMoveIndex / puzzle.solution.length) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}