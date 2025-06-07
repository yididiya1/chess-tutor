"use client";

import { useState } from "react";
import { ChevronLeft, Filter } from "lucide-react";
import Link from "next/link";
import ChessBoard from "../components/ChessBoard";

// 20 Real Chess Puzzles with complete solutions
const generatePuzzles = () => {
  const puzzlePositions = [
    // Puzzle 1: White to play - Scholar's Mate setup
    {
      "fen": "r1bqk1nr/pppp1ppp/2n5/4p3/2B1P1b1/5N2/PPPP1PPP/RNBQ1RK1 w kq - 4 5",
      "solution": ["Bxf7+", "Kxf7", "Ng5+", "Qxg5", "Qxg4"],
      "computerResponse": ["Kxf7", "Qxg5"],
      "playerColor": "white",
      "type": "Tactics",
      "difficulty": "Beginner",
      "elo": 900
    },
    // Puzzle 2: Black to play - Win material
    { 
      fen: "rnbq1r2/1p2b1k1/p3p2p/5ppQ/3PN3/P2B2N1/1P3PPP/2R2RK1 b - - 0 17", 
      solution: ["f5", "e4", "d3", "e4", "d8", "e8", "c1", "c8", "e8", "h5", "g3", "h5"], 
      computerResponse: ["e4", "d8", "c1", "c8", "e8", "h5", "g3", "h5"], 
      playerColor: "black",
      type: "Tactics", 
      difficulty: "Beginner", 
      elo: 950 
      // f5e4 d3e4 d8e8 c1c8 e8h5 g3h5
    },
    // Puzzle 3: White to play - Bishop sacrifice
    { 
      fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 5", 
      solution: ["Bxf7+", "Kxf7", "Ng5+", "Kg8"], 
      computerResponse: ["Kxf7", "Kg8"], 
      playerColor: "white",
      type: "Tactics", 
      difficulty: "Intermediate", 
      elo: 1200 
    },
    // Puzzle 4: Black to play - Fork tactic
    { 
      fen: "rnbqk2r/ppp2ppp/3p1n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 0 5", 
      solution: ["Bxf2+", "Kh1", "Ng4"], 
      computerResponse: ["Kh1"], 
      playerColor: "black",
      type: "Tactics", 
      difficulty: "Intermediate", 
      elo: 1150 
    },
    // Puzzle 5: White to play - Back rank mate
    { 
      fen: "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1", 
      solution: ["Re8#"], 
      computerResponse: [], 
      playerColor: "white",
      type: "Tactics", 
      difficulty: "Beginner", 
      elo: 1000 
    },
    // Puzzle 6: Black to play - Pin and win
    { 
      fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 2 3", 
      solution: ["Bg4", "Be2"], 
      computerResponse: ["Be2"], 
      playerColor: "black",
      type: "Opening", 
      difficulty: "Beginner", 
      elo: 800 
    },
    // Puzzle 7: White to play - Knight fork
    { 
      fen: "r2qkb1r/ppp2ppp/2np1n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w kq - 0 6", 
      solution: ["Ng5", "d6", "Nxf7", "Kxf7"], 
      computerResponse: ["d6", "Kxf7"], 
      playerColor: "white",
      type: "Tactics", 
      difficulty: "Intermediate", 
      elo: 1300 
    },
    // Puzzle 8: Black to play - Capture and develop
    { 
      fen: "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq c3 0 4", 
      solution: ["dxc4", "Bxc4"], 
      computerResponse: ["Bxc4"], 
      playerColor: "black",
      type: "Opening", 
      difficulty: "Intermediate", 
      elo: 1100 
    },
    // Puzzle 9: White to play - Smothered mate pattern
    { 
      fen: "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 0 7", 
      solution: ["Ng5", "h6", "Nxf7", "Rxf7"], 
      computerResponse: ["h6", "Rxf7"], 
      playerColor: "white",
      type: "Tactics", 
      difficulty: "Advanced", 
      elo: 1400 
    },
    // Puzzle 10: Black to play - Counter-attack
    { 
      fen: "rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/8/PPPP1PPP/RNBQK1NR b KQkq - 2 4", 
      solution: ["d6", "Bb3"], 
      computerResponse: ["Bb3"], 
      playerColor: "black",
      type: "Opening", 
      difficulty: "Intermediate", 
      elo: 1050 
    },
    // Puzzle 11: White to play - Queen and Bishop attack
    { 
      fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 4 4", 
      solution: ["Qh5", "g6", "Qxc5", "Nf6"], 
      computerResponse: ["g6", "Nf6"], 
      playerColor: "white",
      type: "Tactics", 
      difficulty: "Beginner", 
      elo: 900 
    },
    // Puzzle 12: Black to play - Development with tempo
    { 
      fen: "rnbqkb1r/ppp2ppp/3p1n2/4p3/4P3/3P4/PPP2PPP/RNBQKBNR b KQkq - 0 4", 
      solution: ["Bg4", "Be2"], 
      computerResponse: ["Be2"], 
      playerColor: "black",
      type: "Opening", 
      difficulty: "Beginner", 
      elo: 850 
    },
    // Puzzle 13: White to play - Discovered attack
    { 
      fen: "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 1 3", 
      solution: ["d5", "exd5"], 
      computerResponse: ["exd5"], 
      playerColor: "white",
      type: "Opening", 
      difficulty: "Beginner", 
      elo: 800 
    },
    // Puzzle 14: Black to play - Tactical shot
    { 
      fen: "rnbqk2r/ppp2ppp/3p1n2/2b1p3/2B1P3/2NP4/PPP2PPP/R1BQK1NR b KQkq - 0 5", 
      solution: ["Ng4", "Nh3"], 
      computerResponse: ["Nh3"], 
      playerColor: "black",
      type: "Opening", 
      difficulty: "Intermediate", 
      elo: 1200 
    },
    // Puzzle 15: White to play - Pawn breakthrough
    { 
      fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5", 
      solution: ["d4", "exd4"], 
      computerResponse: ["exd4"], 
      playerColor: "white",
      type: "Opening", 
      difficulty: "Intermediate", 
      elo: 1100 
    },
    // Puzzle 16: White to play - King and pawn endgame
    { 
      fen: "8/8/8/8/8/3k4/3P4/3K4 w - - 0 1", 
      solution: ["Kd2", "Kd4", "Ke2", "Kc5"], 
      computerResponse: ["Kd4", "Kc5"], 
      playerColor: "white",
      type: "Endgame", 
      difficulty: "Beginner", 
      elo: 900 
    },
    // Puzzle 17: Black to play - Opposition
    { 
      fen: "8/8/8/8/8/2k5/2P5/2K5 b - - 0 1", 
      solution: ["Kd4", "Kd2"], 
      computerResponse: ["Kd2"], 
      playerColor: "black",
      type: "Endgame", 
      difficulty: "Beginner", 
      elo: 850 
    },
    // Puzzle 18: White to play - Pawn promotion
    { 
      fen: "8/8/8/8/3k4/8/3P4/3K4 w - - 0 1", 
      solution: ["d3", "Ke5", "d4+", "Kd5"], 
      computerResponse: ["Ke5", "Kd5"], 
      playerColor: "white",
      type: "Endgame", 
      difficulty: "Intermediate", 
      elo: 1000 
    },
    // Puzzle 19: Black to play - Zugzwang
    { 
      fen: "8/8/8/8/8/8/1k1P4/3K4 b - - 0 1", 
      solution: ["Kc3", "Ke2"], 
      computerResponse: ["Ke2"], 
      playerColor: "black",
      type: "Endgame", 
      difficulty: "Beginner", 
      elo: 800 
    },
    // Puzzle 20: White to play - Breakthrough
    { 
      fen: "8/8/8/8/8/1k6/2P5/2K5 w - - 0 1", 
      solution: ["c4+", "Kb4", "Kd2", "Kxc4"], 
      computerResponse: ["Kb4", "Kxc4"], 
      playerColor: "white",
      type: "Endgame", 
      difficulty: "Intermediate", 
      elo: 1150 
    },
  ];

  return puzzlePositions.map((puzzle, index) => ({
    id: index + 1,
    elo: puzzle.elo,
    type: puzzle.type,
    difficulty: puzzle.difficulty,
    fen: puzzle.fen,
    solution: puzzle.solution,
    computerResponse: puzzle.computerResponse,
    playerColor: puzzle.playerColor,
    completed: Math.random() > 0.8 // Fewer completed puzzles
  }));
};

export default function PuzzlesPage() {
  const [puzzles] = useState(generatePuzzles());
  const [selectedPuzzle, setSelectedPuzzle] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    elo: { min: 800, max: 1800 },
    type: "All",
    difficulty: "All"
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredPuzzles = puzzles.filter(puzzle => {
    const eloMatch = puzzle.elo >= filters.elo.min && puzzle.elo <= filters.elo.max;
    const typeMatch = filters.type === "All" || puzzle.type === filters.type;
    const difficultyMatch = filters.difficulty === "All" || puzzle.difficulty === filters.difficulty;
    return eloMatch && typeMatch && difficultyMatch;
  });

  const currentPuzzle = selectedPuzzle ? puzzles.find(p => p.id === selectedPuzzle) : null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel */}
      <div className="w-80 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ChevronLeft size={20} />
              <span className="ml-1">Back to Home</span>
            </Link>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <Filter size={16} />
              <span className="ml-1">Filters</span>
            </button>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Chess Puzzles</h1>
          <p className="text-sm text-gray-600">{filteredPuzzles.length} puzzles available</p>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Elo Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.elo.min}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      elo: { ...prev.elo, min: parseInt(e.target.value) || 800 }
                    }))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.elo.max}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      elo: { ...prev.elo, max: parseInt(e.target.value) || 1800 }
                    }))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="All">All Types</option>
                  <option value="Tactics">Tactics</option>
                  <option value="Endgame">Endgame</option>
                  <option value="Opening">Opening</option>
                  <option value="Middlegame">Middlegame</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Puzzle Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-4 gap-3">
            {filteredPuzzles.map((puzzle) => (
              <button
                key={puzzle.id}
                onClick={() => setSelectedPuzzle(puzzle.id)}
                className={`
                  aspect-square flex items-center justify-center text-sm font-medium rounded-md border-2 transition-all
                  ${selectedPuzzle === puzzle.id
                    ? 'bg-blue-500 text-white border-blue-500'
                    : puzzle.completed
                    ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }
                `}
                title={`Puzzle ${puzzle.id} - ${puzzle.type} (${puzzle.difficulty}) - Elo: ${puzzle.elo} - ${puzzle.playerColor} to play`}
              >
                {puzzle.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        {selectedPuzzle && currentPuzzle ? (
          <div className="max-w-2xl w-full">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Puzzle #{selectedPuzzle}</h2>
              <div className="flex justify-center space-x-4 text-sm text-gray-600 mb-2">
                <span className="bg-blue-100 px-2 py-1 rounded">{currentPuzzle.type}</span>
                <span className="bg-purple-100 px-2 py-1 rounded">{currentPuzzle.difficulty}</span>
                <span className="bg-yellow-100 px-2 py-1 rounded">Elo: {currentPuzzle.elo}</span>
              </div>
              <div className="text-lg font-semibold">
                <span className={`px-3 py-1 rounded-full ${
                  currentPuzzle.playerColor === 'white' 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-gray-800 text-white'
                }`}>
                  {currentPuzzle.playerColor === 'white' ? '⚪ White' : '⚫ Black'} to play
                </span>
              </div>
            </div>
            <ChessBoard 
              position={currentPuzzle.fen}
              puzzle={currentPuzzle}
            />
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">♟️</div>
            <h2 className="text-xl font-semibold mb-2">Select a Puzzle</h2>
            <p>Choose a puzzle from the left panel to start practicing</p>
          </div>
        )}
      </div>
    </div>
  );
} 