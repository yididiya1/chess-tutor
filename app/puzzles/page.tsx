"use client";

import { useState } from "react";
import { ChevronLeft, Filter, Zap, Swords, BookOpen, Shield, Crown, Layers } from "lucide-react";
import Link from "next/link";
import ChessBoard from "../components/ChessBoard";
import puzzlesData from "../../data/puzzles.json";

const panelStyle: React.CSSProperties = {
  background: "linear-gradient(180deg, #0f1629 0%, #0a1120 100%)",
  borderRight: "1px solid rgba(245,158,11,0.25)",
};

const filterPanelStyle: React.CSSProperties = {
  background: "rgba(245,158,11,0.04)",
  borderBottom: "1px solid rgba(245,158,11,0.15)",
};

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(245,158,11,0.25)",
  borderRadius: "6px",
  color: "#e2e8f0",
  padding: "4px 8px",
  fontSize: "13px",
  width: "100%",
  outline: "none",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  padding: "6px 8px",
  cursor: "pointer",
};

export default function PuzzlesPage() {
  const [puzzles] = useState(puzzlesData);
  const [selectedPuzzleIndex, setSelectedPuzzleIndex] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    rating: { min: 800, max: 2000 },
  });
  const [selectedType, setSelectedType] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filteredPuzzles = puzzles.filter(puzzle => {
    const ratingMatch = puzzle.rating >= filters.rating.min && puzzle.rating <= filters.rating.max;
    const typeMatch = selectedType === "All" || puzzle.type.includes(selectedType.toLowerCase());
    return ratingMatch && typeMatch;
  });

  const currentPuzzle = selectedPuzzleIndex !== null ? filteredPuzzles[selectedPuzzleIndex] : null;

  return (
    <div className="flex h-screen" style={{ background: "#080d18" }}>
      {/* Left Panel */}
      <div className="w-80 flex flex-col" style={panelStyle}>
        {/* Header */}
        <div className="p-4" style={{ borderBottom: "1px solid rgba(245,158,11,0.2)" }}>
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="flex items-center text-sm transition-colors"
              style={{ color: "rgba(245,158,11,0.7)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f59e0b")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,158,11,0.7)")}
            >
              <ChevronLeft size={18} />
              <span className="ml-1">Back to Home</span>
            </Link>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-1 rounded-md text-xs font-semibold transition-all"
              style={{
                background: showFilters ? "rgba(245,158,11,0.2)" : "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.4)",
                color: "#f59e0b",
              }}
            >
              <Filter size={13} />
              <span className="ml-1">Filters</span>
            </button>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={18} style={{ color: "#f59e0b" }} />
            <h1 className="text-lg font-bold font-cinzel" style={{ color: "#f0e6c8" }}>Chess Puzzles</h1>
          </div>
          <p className="text-xs" style={{ color: "rgba(245,158,11,0.6)" }}>{filteredPuzzles.length} puzzles available</p>
        </div>

        {/* Puzzle Type Selector — always visible */}
        <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(245,158,11,0.15)" }}>
          <p className="text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: "rgba(245,158,11,0.55)" }}>Puzzle Type</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "All",        Icon: Layers,   color: "#f59e0b" },
              { label: "Crushing",   Icon: Swords,   color: "#ef4444" },
              { label: "Advantage",  Icon: Zap,      color: "#f59e0b" },
              { label: "Opening",    Icon: BookOpen, color: "#06b6d4" },
              { label: "Middlegame", Icon: Shield,   color: "#10b981" },
              { label: "Endgame",    Icon: Crown,    color: "#a78bfa" },
            ].map(({ label, Icon, color }) => {
              const active = selectedType === label;
              return (
                <button
                  key={label}
                  onClick={() => setSelectedType(label)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-rajdhani transition-all duration-200"
                  style={{
                    background: active ? `${color}25` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${active ? color + "70" : "rgba(245,158,11,0.15)"}`,
                    color: active ? color : "rgba(226,232,240,0.5)",
                    boxShadow: active ? `0 0 8px ${color}30` : "none",
                  }}
                >
                  <Icon size={11} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="p-4 space-y-3" style={filterPanelStyle}>
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "rgba(245,158,11,0.8)" }}>Rating Range</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.rating.min}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    rating: { ...prev.rating, min: parseInt(e.target.value) || 800 }
                  }))}
                  style={inputStyle}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.rating.max}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    rating: { ...prev.rating, max: parseInt(e.target.value) || 2000 }
                  }))}
                  style={inputStyle}
                />
              </div>
            </div>

          </div>
        )}

        {/* Puzzle Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-4 gap-2">
            {filteredPuzzles.map((puzzle, index) => (
              <button
                key={index}
                onClick={() => setSelectedPuzzleIndex(index)}
                title={`Puzzle ${index + 1} - ${puzzle.type} - Rating: ${puzzle.rating}`}
                style={{
                  aspectRatio: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 600,
                  borderRadius: "6px",
                  border: selectedPuzzleIndex === index
                    ? "2px solid #f59e0b"
                    : "1px solid rgba(245,158,11,0.2)",
                  background: selectedPuzzleIndex === index
                    ? "rgba(245,158,11,0.25)"
                    : "rgba(255,255,255,0.04)",
                  color: selectedPuzzleIndex === index ? "#f59e0b" : "rgba(226,232,240,0.7)",
                  transition: "all 0.15s",
                  boxShadow: selectedPuzzleIndex === index ? "0 0 8px rgba(245,158,11,0.3)" : "none",
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  if (selectedPuzzleIndex !== index) {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(245,158,11,0.1)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#f59e0b";
                  }
                }}
                onMouseLeave={e => {
                  if (selectedPuzzleIndex !== index) {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLButtonElement).style.color = "rgba(226,232,240,0.7)";
                  }
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-16 pt-2 overflow-auto">
        {selectedPuzzleIndex !== null && currentPuzzle ? (
          <div className="w-full">
            <p className="text-xs font-cinzel uppercase tracking-widest mb-2" style={{ color: "rgba(245,158,11,0.5)" }}>
              Puzzle #{selectedPuzzleIndex + 1}
            </p>
            <ChessBoard
              key={selectedPuzzleIndex}
              position={currentPuzzle.fen}
              puzzle={currentPuzzle}
            />
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-6" style={{ filter: "drop-shadow(0 0 20px rgba(245,158,11,0.4))" }}>♟</div>
            <h2 className="text-2xl font-bold font-cinzel mb-3" style={{ color: "#f0e6c8" }}>Select a Puzzle</h2>
            <p className="text-sm" style={{ color: "rgba(245,158,11,0.6)" }}>
              Choose a puzzle from the left panel to start practicing
            </p>
          </div>
        )}
      </div>
    </div>
  );
}