"use client";

import { useState } from "react";
import { ChevronLeft, Filter, TrendingUp, BookOpen } from "lucide-react";
import Link from "next/link";
import ChessBoard from "../components/ChessBoard";
import ChessBoardPreview from "../components/ChessBoardPreview";

// Sample opening data with variations
const chessOpenings = [
  {
    id: 1,
    name: "Italian Game",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"],
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    whiteWinRate: 52.3,
    blackWinRate: 31.2,
    drawRate: 16.5,
    popularity: 85,
    difficulty: "Beginner",
    description: "A classical opening focusing on rapid development and central control.",
    variations: [
      {
        id: 11,
        name: "Giuoco Piano",
        moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5"],
        fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        whiteWinRate: 53.1,
        blackWinRate: 30.8,
        drawRate: 16.1,
        description: "The quiet game - a solid positional approach to the Italian Game."
      },
      {
        id: 12,
        name: "Two Knights Defense",
        moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6"],
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        whiteWinRate: 51.8,
        blackWinRate: 32.1,
        drawRate: 16.1,
        description: "Sharp tactical play with early knight development."
      },
      {
        id: 13,
        name: "Hungarian Defense",
        moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Be7"],
        fen: "r1bqk1nr/ppppbppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        whiteWinRate: 54.2,
        blackWinRate: 29.3,
        drawRate: 16.5,
        description: "A solid but passive defense for Black."
      }
    ]
  },
  {
    id: 2,
    name: "Queen's Gambit",
    moves: ["d4", "d5", "c4"],
    fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2",
    whiteWinRate: 55.8,
    blackWinRate: 28.7,
    drawRate: 15.5,
    popularity: 92,
    difficulty: "Intermediate",
    description: "A strategic opening offering a pawn to gain central control.",
    variations: [
      {
        id: 21,
        name: "Queen's Gambit Accepted",
        moves: ["d4", "d5", "c4", "dxc4"],
        fen: "rnbqkbnr/ppp1pppp/8/8/2pP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        whiteWinRate: 56.2,
        blackWinRate: 27.8,
        drawRate: 16.0,
        description: "Black accepts the gambit pawn."
      },
      {
        id: 22,
        name: "Queen's Gambit Declined",
        moves: ["d4", "d5", "c4", "e6"],
        fen: "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        whiteWinRate: 55.4,
        blackWinRate: 29.1,
        drawRate: 15.5,
        description: "Black declines the gambit and maintains central tension."
      },
      {
        id: 23,
        name: "Slav Defense",
        moves: ["d4", "d5", "c4", "c6"],
        fen: "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        whiteWinRate: 54.9,
        blackWinRate: 29.8,
        drawRate: 15.3,
        description: "A solid defense supporting the d5 pawn with c6."
      }
    ]
  },
  {
    id: 3,
    name: "Sicilian Defense",
    moves: ["e4", "c5"],
    fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
    whiteWinRate: 48.2,
    blackWinRate: 35.1,
    drawRate: 16.7,
    popularity: 88,
    difficulty: "Advanced",
    description: "Black's most popular response to e4, leading to sharp tactical play.",
    variations: [
      {
        id: 31,
        name: "Sicilian Najdorf",
        moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"],
        fen: "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6",
        whiteWinRate: 47.8,
        blackWinRate: 36.2,
        drawRate: 16.0,
        description: "The most popular and sharp variation of the Sicilian."
      },
      {
        id: 32,
        name: "Sicilian Dragon",
        moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "g6"],
        fen: "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6",
        whiteWinRate: 46.9,
        blackWinRate: 37.1,
        drawRate: 16.0,
        description: "A hypermodern setup with fianchettoed bishop."
      },
      {
        id: 33,
        name: "Sicilian Accelerated Dragon",
        moves: ["e4", "c5", "Nf3", "g6", "d4", "cxd4", "Nxd4", "Bg7"],
        fen: "rnbqk1nr/pp1pppbp/6p1/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 2 5",
        whiteWinRate: 48.1,
        blackWinRate: 35.8,
        drawRate: 16.1,
        description: "An early g6 setup avoiding some of White's attacking lines."
      }
    ]
  },
  {
    id: 4,
    name: "French Defense",
    moves: ["e4", "e6"],
    fen: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    whiteWinRate: 51.7,
    blackWinRate: 32.4,
    drawRate: 15.9,
    popularity: 65,
    difficulty: "Intermediate",
    description: "A solid defense creating a strong pawn chain.",
    variations: [
      {
        id: 41,
        name: "French Winawer",
        moves: ["e4", "e6", "d4", "d5", "Nc3", "Bb4"],
        fen: "rnbqk1nr/ppp2ppp/4p3/3p4/1b1PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 2 4",
        whiteWinRate: 50.8,
        blackWinRate: 33.2,
        drawRate: 16.0,
        description: "Sharp tactical play with early bishop pin."
      },
      {
        id: 42,
        name: "French Classical",
        moves: ["e4", "e6", "d4", "d5", "Nc3", "Nf6"],
        fen: "rnbqkb1r/ppp2ppp/4pn2/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 2 4",
        whiteWinRate: 52.1,
        blackWinRate: 31.9,
        drawRate: 16.0,
        description: "Classical development with knight to f6."
      }
    ]
  },
  {
    id: 5,
    name: "Ruy Lopez",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"],
    fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    whiteWinRate: 53.9,
    blackWinRate: 30.8,
    drawRate: 15.3,
    popularity: 78,
    difficulty: "Intermediate",
    description: "One of the oldest chess openings, named after a Spanish priest.",
    variations: [
      {
        id: 51,
        name: "Ruy Lopez Berlin",
        moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "Nf6"],
        fen: "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        whiteWinRate: 52.8,
        blackWinRate: 31.2,
        drawRate: 16.0,
        description: "The Berlin Defense - a solid equalizing system."
      },
      {
        id: 52,
        name: "Ruy Lopez Morphy",
        moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6"],
        fen: "r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
        whiteWinRate: 54.2,
        blackWinRate: 30.1,
        drawRate: 15.7,
        description: "The main line with a6 attacking the bishop."
      }
    ]
  },
  {
    id: 6,
    name: "King's Indian Defense",
    moves: ["d4", "Nf6", "c4", "g6"],
    fen: "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
    whiteWinRate: 49.3,
    blackWinRate: 34.2,
    drawRate: 16.5,
    popularity: 71,
    difficulty: "Advanced",
    description: "A hypermodern defense allowing White central control initially."
  },
  {
    id: 7,
    name: "English Opening",
    moves: ["c4"],
    fen: "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3 0 1",
    whiteWinRate: 52.1,
    blackWinRate: 32.6,
    drawRate: 15.3,
    popularity: 58,
    difficulty: "Intermediate",
    description: "A flexible opening controlling the center from the flank."
  },
  {
    id: 8,
    name: "Caro-Kann Defense",
    moves: ["e4", "c6"],
    fen: "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    whiteWinRate: 50.8,
    blackWinRate: 33.1,
    drawRate: 16.1,
    popularity: 62,
    difficulty: "Beginner",
    description: "A solid defense similar to the French but more flexible."
  }
];

export default function OpeningsPage() {
  const [selectedOpening, setSelectedOpening] = useState<number | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    side: "All", // All, White, Black
    difficulty: "All",
    minWinRate: 0
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredOpenings = chessOpenings.filter(opening => {
    const sideMatch = filters.side === "All" || 
      (filters.side === "White" && opening.whiteWinRate > opening.blackWinRate) ||
      (filters.side === "Black" && opening.blackWinRate > opening.whiteWinRate);
    
    const difficultyMatch = filters.difficulty === "All" || opening.difficulty === filters.difficulty;
    
    const winRateMatch = Math.max(opening.whiteWinRate, opening.blackWinRate) >= filters.minWinRate;
    
    return sideMatch && difficultyMatch && winRateMatch;
  });

  const currentOpening = selectedOpening ? chessOpenings.find(o => o.id === selectedOpening) : null;
  const currentVariation = selectedVariation && currentOpening ? 
    currentOpening.variations?.find(v => v.id === selectedVariation) : null;

  // Reset variation when opening changes
  const handleOpeningSelect = (openingId: number) => {
    setSelectedOpening(openingId);
    setSelectedVariation(null);
  };

  const handleBackToOpenings = () => {
    setSelectedOpening(null);
    setSelectedVariation(null);
  };

  const handleBackToVariations = () => {
    setSelectedVariation(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {selectedVariation && currentVariation && currentOpening ? (
        // Chess Board View - Level 3
        <div className="flex h-screen bg-background">
          {/* Left Panel - Variation Info */}
          <div className="w-80 bg-card shadow-lg flex flex-col border-r border-border">
            <div className="p-4 border-b border-border">
              <button
                onClick={handleBackToVariations}
                className="flex items-center text-muted-foreground hover:text-foreground mb-4"
              >
                <ChevronLeft size={20} />
                <span className="ml-1">Back to Variations</span>
              </button>
              <h1 className="text-xl font-bold text-foreground">{currentVariation.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">{currentOpening.name}</p>
              <p className="text-sm text-muted-foreground mt-2">{currentVariation.description}</p>
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-muted p-3 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Statistics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>White Win Rate:</span>
                    <span className="font-medium text-green-600">{currentVariation.whiteWinRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Black Win Rate:</span>
                    <span className="font-medium text-red-600">{currentVariation.blackWinRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Draw Rate:</span>
                    <span className="font-medium text-gray-600">{currentVariation.drawRate}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Variation Moves</h3>
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
            <ChessBoard 
              position={currentVariation.fen}
              puzzle={{
                id: currentVariation.id,
                elo: 1200,
                type: "Opening Variation",
                difficulty: currentOpening.difficulty,
                fen: currentVariation.fen,
                solution: currentVariation.moves,
                computerResponse: [],
                playerColor: "white",
                completed: false
              }}
            />
          </div>
        </div>
      ) : selectedOpening && currentOpening ? (
        // Variations Grid View - Level 2
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <button
                onClick={handleBackToOpenings}
                className="flex items-center text-muted-foreground hover:text-foreground mb-4"
              >
                <ChevronLeft size={20} />
                <span className="ml-1">Back to Openings</span>
              </button>
              <h1 className="text-3xl font-bold text-foreground">{currentOpening.name} Variations</h1>
              <p className="text-muted-foreground mt-2">{currentOpening.description}</p>
              <div className="mt-4 flex space-x-4 text-sm">
                <span className="bg-green-100 px-3 py-1 rounded-full text-green-800">
                  White: {currentOpening.whiteWinRate}%
                </span>
                <span className="bg-red-100 px-3 py-1 rounded-full text-red-800">
                  Black: {currentOpening.blackWinRate}%
                </span>
                <span className="bg-blue-100 px-3 py-1 rounded-full text-blue-800">
                  Popularity: {currentOpening.popularity}%
                </span>
              </div>
            </div>

            {/* Variations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(currentOpening.variations || []).map((variation) => (
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
                      <BookOpen size={20} className="text-primary" />
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4">{variation.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">White Win Rate:</span>
                        <div className="flex items-center">
                          <TrendingUp size={14} className="text-green-500 mr-1" />
                          <span className="font-medium text-green-600">{variation.whiteWinRate}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Black Win Rate:</span>
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

            {(currentOpening.variations || []).length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="text-lg font-semibold mb-2">No variations available</h3>
                  <p>Variations for this opening will be added soon.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Openings Grid View - Level 1
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
                  <ChevronLeft size={20} />
                  <span className="ml-1">Back to Home</span>
                </Link>
                <h1 className="text-3xl font-bold text-foreground">Chess Openings</h1>
                <p className="text-muted-foreground mt-2">Learn and practice popular chess openings</p>
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
                      <option value="White">White Advantage</option>
                      <option value="Black">Black Advantage</option>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Win Rate (%)</label>
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

            {/* Openings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredOpenings.map((opening) => (
                <div
                  key={opening.id}
                  onClick={() => handleOpeningSelect(opening.id)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Chess Position Preview at Top */}
                  <div className="bg-muted p-4">
                    <ChessBoardPreview fen={opening.fen} />
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{opening.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          opening.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                          opening.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {opening.difficulty}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          {opening.variations?.length || 0} variations
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{opening.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">White Win Rate:</span>
                        <div className="flex items-center">
                          <TrendingUp size={14} className="text-green-500 mr-1" />
                          <span className="font-medium text-green-600">{opening.whiteWinRate}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Black Win Rate:</span>
                        <div className="flex items-center">
                          <TrendingUp size={14} className="text-red-500 mr-1" />
                          <span className="font-medium text-red-600">{opening.blackWinRate}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Popularity:</span>
                        <span className="font-medium text-blue-600">{opening.popularity}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-xs text-gray-500">
                        <strong>Moves:</strong> {opening.moves.slice(0, 3).join(", ")}
                        {opening.moves.length > 3 && "..."}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredOpenings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold mb-2">No openings found</h3>
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