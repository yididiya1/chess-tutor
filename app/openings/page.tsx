"use client";

import { useState } from "react";
import { ChevronLeft, Filter, TrendingUp, BookOpen } from "lucide-react";
import Link from "next/link";
import OpeningBoard from "../components/OpeningBoard";
import ChessBoardPreview from "../components/ChessBoardPreview";
import openingsData from "../../data/openings.json";

export default function OpeningsPage() {
  const [selectedOpening, setSelectedOpening] = useState<number | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null);
  const [playerSide, setPlayerSide] = useState<"white" | "black">("white");
  const [filters, setFilters] = useState({
    side: "All", // All, White, Black
    difficulty: "All",
    minWinRate: 0
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredOpenings = openingsData.filter(opening => {
    const sideMatch = filters.side === "All" || 
      (filters.side === "White" && opening.whiteWinRate > opening.blackWinRate) ||
      (filters.side === "Black" && opening.blackWinRate > opening.whiteWinRate);
    
    const difficultyMatch = filters.difficulty === "All" || opening.difficulty === filters.difficulty;
    
    const winRateMatch = Math.max(opening.whiteWinRate, opening.blackWinRate) >= filters.minWinRate;
    
    return sideMatch && difficultyMatch && winRateMatch;
  });

  const currentOpening = selectedOpening ? openingsData.find(o => o.id === selectedOpening) : null;
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
                difficulty: currentOpening.difficulty
              }}
              playerSide={playerSide}
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