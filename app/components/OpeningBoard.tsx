"use client";

import { useState, useEffect } from "react";
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

  return (
    <div className="w-full max-w-5xl mx-auto">
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
              onClick={resetOpening}
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
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{currentMoveIndex}/{openingLine.moves.length} moves</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentMoveIndex / openingLine.moves.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Chess Board */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <Chessboard
            position={gamePosition}
            onPieceDrop={onDrop}
            boardOrientation={playerSide}
            boardWidth={700}
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

        {/* Opening Information Panel */}
        <div className="w-80 p-4 bg-gray-50 rounded-lg flex-shrink-0">
          <h3 className="font-semibold text-gray-800 mb-3">Opening Information</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-600">Opening:</span>
              <div className="font-medium text-gray-800 mt-1">{openingLine.name}</div>
            </div>
            <div>
              <span className="text-gray-600">Difficulty:</span>
              <div className="font-medium text-gray-800 mt-1">{openingLine.difficulty}</div>
            </div>
            <div>
              <span className="text-gray-600">Playing As:</span>
              <div className={`font-medium mt-1 ${playerSide === 'white' ? 'text-gray-800' : 'text-gray-600'}`}>
                {playerSide === 'white' ? '⚪ White' : '⚫ Black'}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Progress:</span>
              <div className="font-medium text-gray-800 mt-1">
                {currentMoveIndex}/{openingLine.moves.length} moves
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <span className="text-gray-600 text-sm">Description:</span>
            <p className="text-sm text-gray-700 mt-1">{openingLine.description}</p>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <span className="text-gray-600 text-sm mb-2 block">Statistics:</span>
            <div className="flex flex-col space-y-2 text-xs">
              <span className="bg-green-100 px-2 py-1 rounded text-green-800">
                White: {openingLine.whiteWinRate}%
              </span>
              <span className="bg-red-100 px-2 py-1 rounded text-red-800">
                Black: {openingLine.blackWinRate}%
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded text-gray-800">
                Draws: {openingLine.drawRate}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 