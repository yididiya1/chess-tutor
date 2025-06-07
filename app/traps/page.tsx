"use client";

import { useState } from "react";
import { ChevronLeft, Filter, TrendingUp } from "lucide-react";
import Link from "next/link";
import OpeningBoard from "../components/OpeningBoard";
import ChessBoardPreview from "../components/ChessBoardPreview";

// Opening traps data - you can modify the moves for each trap
const openingTraps = [
  {
    id: 1,
    name: "Italian Game Traps",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"],
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    whiteWinRate: 75.3,
    blackWinRate: 15.2,
    drawRate: 9.5,
    popularity: 85,
    difficulty: "Beginner",
    description: "Common traps in the Italian Game that can catch unprepared opponents.",
    variations: [
      {
        id: 11,
        name: "Legal's Mate Trap",
        moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "d6", "Nc3", "Bg4", "h3", "Bh5", "Nxe5", "Bxd1", "Bxf7+", "Ke7", "Nd5#"],
        fen: "r2qkbnr/pppbkppp/3p4/3Np3/2B1P3/7P/PPPP1PP1/R1bQK2R b KQq - 1 8",
        whiteWinRate: 100.0,
        blackWinRate: 0.0,
        drawRate: 0.0,
        description: "A classic tactical trap leading to forced mate if Black falls for it."
      },
      {
        id: 12,
        name: "Blackburne Shilling Trap",
        moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nd4", "Nxe5", "Qg5", "Nxf7", "Qxg2", "Rf1", "Qxe4+", "Be2", "Nf3#"],
        fen: "r1b1kbnr/ppp3pp/8/8/2B1q3/5n2/PPPPBPPP/RNBQ1RK1 w q - 1 8",
        whiteWinRate: 0.0,
        blackWinRate: 100.0,
        drawRate: 0.0,
        description: "A dangerous counter-trap for Black against over-aggressive White play."
      }
    ]
  },
  {
    id: 2,
    name: "Queen's Gambit Traps",
    moves: ["d4", "d5", "c4"],
    fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2",
    whiteWinRate: 68.8,
    blackWinRate: 22.7,
    drawRate: 8.5,
    popularity: 92,
    difficulty: "Intermediate",
    description: "Tactical traps that can arise in Queen's Gambit structures.",
    variations: [
      {
        id: 21,
        name: "Elephant Trap",
        moves: ["d4", "d5", "c4", "e6", "Nc3", "Nf6", "Bg5", "Nbd7", "cxd5", "exd5", "Nxd5", "Nxd5", "Bxd8", "Bb4+", "Qd2", "Bxd2+", "Kxd2", "Kxd8"],
        fen: "r1b1k2r/pppn1ppp/8/3n1B2/3P4/8/PP2PPPP/R3KBNR w KQkq - 0 8",
        whiteWinRate: 85.0,
        blackWinRate: 10.0,
        drawRate: 5.0,
        description: "A trap where Black can win White's queen if White plays carelessly."
      }
    ]
  },
  {
    id: 3,
    name: "Sicilian Defense Traps",
    moves: ["e4", "c5"],
    fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
    whiteWinRate: 72.2,
    blackWinRate: 18.1,
    drawRate: 9.7,
    popularity: 88,
    difficulty: "Advanced",
    description: "Dangerous tactical shots that can occur in Sicilian Defense openings.",
    variations: [
      {
        id: 31,
        name: "Siberian Trap",
        moves: ["e4", "c5", "d4", "cxd4", "Qxd4", "Nc6", "Qd2", "g6", "b3", "Bh6"],
        fen: "r1bqk1nr/pp1pppbp/2n3p1/8/4P3/1P6/P1PQ1PPP/RNB1KBNR w KQkq - 2 6",
        whiteWinRate: 90.0,
        blackWinRate: 5.0,
        drawRate: 5.0,
        description: "A trap that catches Black's queen if they're not careful with piece development."
      }
    ]
  },
  {
    id: 4,
    name: "French Defense Traps",
    moves: ["e4", "e6"],
    fen: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    whiteWinRate: 69.7,
    blackWinRate: 19.4,
    drawRate: 10.9,
    popularity: 65,
    difficulty: "Intermediate",
    description: "Tactical traps that can arise in French Defense structures.",
    variations: [
      {
        id: 41,
        name: "Milner-Barry Trap",
        moves: ["e4", "e6", "d4", "d5", "e5", "c5", "c3", "Nc6", "Nf3", "Qb6", "a3", "c4"],
        fen: "r1b1kbnr/pp3ppp/1qn1p3/3pP3/2pP4/P1P2N2/1P3PPP/RNBQKB1R w KQkq - 0 7",
        whiteWinRate: 80.0,
        blackWinRate: 15.0,
        drawRate: 5.0,
        description: "A positional trap where Black's queen gets trapped on the queenside."
      }
    ]
  },
  {
    id: 5,
    name: "Ruy Lopez Traps",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"],
    fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    whiteWinRate: 76.9,
    blackWinRate: 16.8,
    drawRate: 6.3,
    popularity: 78,
    difficulty: "Intermediate",
    description: "Classic traps from one of the oldest and most respected openings.",
    variations: [
      {
        id: 51,
        name: "Noah's Ark Trap",
        moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "d6", "d4", "b5", "Bb3", "Nxd4", "Nxd4", "exd4", "Qxd4", "c5"],
        fen: "r1bqkbnr/2p2ppp/p2p4/1p1p4/3QP3/1B6/PPP2PPP/RNB1K2R w KQkq c6 0 8",
        whiteWinRate: 95.0,
        blackWinRate: 3.0,
        drawRate: 2.0,
        description: "A famous trap where Black can win White's bishop with precise play."
      }
    ]
  },
  {
    id: 6,
    name: "King's Indian Traps",
    moves: ["d4", "Nf6", "c4", "g6"],
    fen: "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
    whiteWinRate: 71.3,
    blackWinRate: 20.2,
    drawRate: 8.5,
    popularity: 71,
    difficulty: "Advanced",
    description: "Sharp tactical traps in the King's Indian Defense.",
    variations: [
      {
        id: 61,
        name: "Petrosian Trap",
        moves: ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7", "e4", "d6", "f3", "O-O", "Be3", "c5"],
        fen: "rnbq1rk1/pp2ppbp/3p1np1/2p5/2PPP3/2N1BP2/PP3PPP/R2QKBNR w KQ c6 0 7",
        whiteWinRate: 85.0,
        blackWinRate: 10.0,
        drawRate: 5.0,
        description: "A positional trap that can win material if Black plays inaccurately."
      }
    ]
  }
];

export default function TrapsPage() {
  const [selectedTrap, setSelectedTrap] = useState<number | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null);
  const [playerSide, setPlayerSide] = useState<"white" | "black">("white");
  const [filters, setFilters] = useState({
    side: "All", // All, White, Black
    difficulty: "All",
    minWinRate: 0
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredTraps = openingTraps.filter(trap => {
    const sideMatch = filters.side === "All" || 
      (filters.side === "White" && trap.whiteWinRate > trap.blackWinRate) ||
      (filters.side === "Black" && trap.blackWinRate > trap.whiteWinRate);
    
    const difficultyMatch = filters.difficulty === "All" || trap.difficulty === filters.difficulty;
    
    const winRateMatch = Math.max(trap.whiteWinRate, trap.blackWinRate) >= filters.minWinRate;
    
    return sideMatch && difficultyMatch && winRateMatch;
  });

  const currentTrap = selectedTrap ? openingTraps.find(o => o.id === selectedTrap) : null;
  const currentVariation = selectedVariation && currentTrap ? 
    currentTrap.variations?.find(v => v.id === selectedVariation) : null;

  // Reset variation when trap changes
  const handleTrapSelect = (trapId: number) => {
    setSelectedTrap(trapId);
    setSelectedVariation(null);
  };

  const handleBackToTraps = () => {
    setSelectedTrap(null);
    setSelectedVariation(null);
  };

  const handleBackToVariations = () => {
    setSelectedVariation(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {selectedVariation && currentVariation && currentTrap ? (
        // Chess Board View - Level 3
        <div className="flex h-screen bg-background">
          {/* Left Panel - Trap Info */}
          <div className="w-80 bg-card shadow-lg flex flex-col border-r border-border">
            <div className="p-4 border-b border-border">
              <button
                onClick={handleBackToVariations}
                className="flex items-center text-muted-foreground hover:text-foreground mb-4"
              >
                <ChevronLeft size={20} />
                <span className="ml-1">Back to Traps</span>
              </button>
              <h1 className="text-xl font-bold text-foreground">{currentVariation.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">{currentTrap.name}</p>
              <p className="text-sm text-muted-foreground mt-2">{currentVariation.description}</p>
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-muted p-3 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Play As</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPlayerSide("white")}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      playerSide === "white"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    ⚪ White
                  </button>
                  <button
                    onClick={() => setPlayerSide("black")}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      playerSide === "black"
                        ? "bg-gray-800 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    ⚫ Black
                  </button>
                </div>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Trap Success Rate</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>White Success:</span>
                    <span className="font-medium text-green-600">{currentVariation.whiteWinRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Black Success:</span>
                    <span className="font-medium text-red-600">{currentVariation.blackWinRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Draw Rate:</span>
                    <span className="font-medium text-gray-600">{currentVariation.drawRate}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Trap Sequence</h3>
                <div className="text-sm text-muted-foreground">
                  {currentVariation.moves.map((move, index) => (
                    <span key={index} className="mr-2">
                      {Math.floor(index / 2) + 1}{index % 2 === 0 ? '.' : '...'} {move}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Chess Board */}
          <div className="flex-1 flex items-center justify-center p-8">
            <OpeningBoard 
              openingLine={{
                id: currentVariation.id,
                name: currentVariation.name,
                moves: currentVariation.moves,
                fen: currentVariation.fen,
                whiteWinRate: currentVariation.whiteWinRate,
                blackWinRate: currentVariation.blackWinRate,
                drawRate: currentVariation.drawRate,
                description: currentVariation.description,
                difficulty: currentTrap.difficulty
              }}
              playerSide={playerSide}
            />
          </div>
        </div>
      ) : selectedTrap && currentTrap ? (
        // Trap Variations Grid View - Level 2
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <button
                onClick={handleBackToTraps}
                className="flex items-center text-muted-foreground hover:text-foreground mb-4"
              >
                <ChevronLeft size={20} />
                <span className="ml-1">Back to Opening Traps</span>
              </button>
              <h1 className="text-3xl font-bold text-foreground">{currentTrap.name}</h1>
              <p className="text-muted-foreground mt-2">{currentTrap.description}</p>
              <div className="mt-4 flex space-x-4 text-sm">
                <span className="bg-green-100 px-3 py-1 rounded-full text-green-800">
                  White Success: {currentTrap.whiteWinRate}%
                </span>
                <span className="bg-red-100 px-3 py-1 rounded-full text-red-800">
                  Black Success: {currentTrap.blackWinRate}%
                </span>
                <span className="bg-blue-100 px-3 py-1 rounded-full text-blue-800">
                  Popularity: {currentTrap.popularity}%
                </span>
              </div>
            </div>

            {/* Trap Variations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(currentTrap.variations || []).map((variation) => (
                <div
                  key={variation.id}
                  onClick={() => setSelectedVariation(variation.id)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Chess Position Preview at Top */}
                  <div className="bg-muted p-4">
                    <ChessBoardPreview fen={variation.fen} />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-foreground">{variation.name}</h3>
                      <span className="text-2xl">🪤</span>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4">{variation.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">White Success:</span>
                        <div className="flex items-center">
                          <TrendingUp size={14} className="text-green-500 mr-1" />
                          <span className="font-medium text-green-600">{variation.whiteWinRate}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Black Success:</span>
                        <div className="flex items-center">
                          <TrendingUp size={14} className="text-red-500 mr-1" />
                          <span className="font-medium text-red-600">{variation.blackWinRate}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-xs text-gray-500">
                        <strong>Key Moves:</strong> {variation.moves.slice(-3).join(", ")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(currentTrap.variations || []).length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <div className="text-4xl mb-4">🪤</div>
                  <h3 className="text-lg font-semibold mb-2">No trap variations available</h3>
                  <p>Trap variations for this opening will be added soon.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Opening Traps Grid View - Level 1
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
                  <ChevronLeft size={20} />
                  <span className="ml-1">Back to Home</span>
                </Link>
                <h1 className="text-3xl font-bold text-foreground">Opening Traps</h1>
                <p className="text-muted-foreground mt-2">Learn and practice deadly opening traps to catch your opponents</p>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                <Filter size={16} />
                <span className="ml-2">Filters</span>
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mb-8 p-4 bg-card rounded-lg shadow-sm border border-border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Side</label>
                    <select
                      value={filters.side}
                      onChange={(e) => setFilters(prev => ({ ...prev, side: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="All">All Sides</option>
                      <option value="White">White Traps</option>
                      <option value="Black">Black Traps</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    <select
                      value={filters.difficulty}
                      onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="All">All Difficulties</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Success Rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={filters.minWinRate}
                      onChange={(e) => setFilters(prev => ({ ...prev, minWinRate: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Opening Traps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTraps.map((trap) => (
                <div
                  key={trap.id}
                  onClick={() => handleTrapSelect(trap.id)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Chess Position Preview at Top */}
                  <div className="bg-muted p-4">
                    <ChessBoardPreview fen={trap.fen} />
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{trap.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          trap.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                          trap.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {trap.difficulty}
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                          🪤 {trap.variations?.length || 0} traps
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{trap.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">White Success:</span>
                        <div className="flex items-center">
                          <TrendingUp size={14} className="text-green-500 mr-1" />
                          <span className="font-medium text-green-600">{trap.whiteWinRate}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Black Success:</span>
                        <div className="flex items-center">
                          <TrendingUp size={14} className="text-red-500 mr-1" />
                          <span className="font-medium text-red-600">{trap.blackWinRate}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Popularity:</span>
                        <span className="font-medium text-blue-600">{trap.popularity}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-xs text-gray-500">
                        <strong>Setup:</strong> {trap.moves.slice(0, 3).join(", ")}
                        {trap.moves.length > 3 && "..."}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTraps.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold mb-2">No traps found</h3>
                  <p>Try adjusting your filters to see more results.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 