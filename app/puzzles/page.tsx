"use client";

import { useState } from "react";
import { ChevronLeft, Filter } from "lucide-react";
import Link from "next/link";
import ChessBoard from "../components/ChessBoard";
import puzzlesData from "../../data/puzzles.json";

export default function PuzzlesPage() {
  const [puzzles] = useState(puzzlesData);
  const [selectedPuzzleIndex, setSelectedPuzzleIndex] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    rating: { min: 800, max: 2000 },
    type: "All"
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredPuzzles = puzzles.filter(puzzle => {
    const ratingMatch = puzzle.rating >= filters.rating.min && puzzle.rating <= filters.rating.max;
    const typeMatch = filters.type === "All" || puzzle.type.includes(filters.type.toLowerCase());
    return ratingMatch && typeMatch;
  });

  const currentPuzzle = selectedPuzzleIndex !== null ? filteredPuzzles[selectedPuzzleIndex] : null;

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
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.rating.min}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      rating: { ...prev.rating, min: parseInt(e.target.value) || 800 } 
                    }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.rating.max}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      rating: { ...prev.rating, max: parseInt(e.target.value) || 2000 } 
                    }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
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
                  <option value="crushing">Crushing</option>
                  <option value="advantage">Advantage</option>
                  <option value="opening">Opening</option>
                  <option value="middlegame">Middlegame</option>
                  <option value="endgame">Endgame</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Puzzle Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-4 gap-3">
            {filteredPuzzles.map((puzzle, index) => (
              <button
                key={index}
                onClick={() => setSelectedPuzzleIndex(index)}
                className={`
                  aspect-square flex items-center justify-center text-sm font-medium rounded-md border-2 transition-all
                  ${selectedPuzzleIndex === index
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }
                `}
                title={`Puzzle ${index + 1} - ${puzzle.type} - Rating: ${puzzle.rating}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center w-full justify-center p-8 ">
        {selectedPuzzleIndex !== null && currentPuzzle ? (
          <div className="max-w-4xl min-w-4xl w-full">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Puzzle #{selectedPuzzleIndex + 1}</h2>
              <div className="flex justify-center space-x-4 text-sm text-gray-600 mb-2">
                <span className="bg-blue-100 px-2 py-1 rounded">{currentPuzzle.type}</span>
                <span className="bg-yellow-100 px-2 py-1 rounded">Rating: {currentPuzzle.rating}</span>
              </div>
            </div>
            <ChessBoard 
              key={selectedPuzzleIndex}
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