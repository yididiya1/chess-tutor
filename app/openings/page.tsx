"use client";

import { useState } from "react";
import { ChevronLeft, Filter, TrendingUp, BookOpen } from "lucide-react";
import Link from "next/link";
import OpeningBoard from "../components/OpeningBoard";
import ChessBoardPreview from "../components/ChessBoardPreview";
import openingsData from "../../data/openings.json";

const darkPage: React.CSSProperties = { background: "#080d18", minHeight: "100vh" };
const darkFlex: React.CSSProperties = { background: "#080d18", height: "100vh", display: "flex" };

const leftPanel: React.CSSProperties = {
  width: "320px",
  background: "linear-gradient(180deg, #0f1629 0%, #0a1120 100%)",
  borderRight: "1px solid rgba(245,158,11,0.25)",
  display: "flex",
  flexDirection: "column",
};

const muted: React.CSSProperties = {
  background: "rgba(245,158,11,0.05)",
  border: "1px solid rgba(245,158,11,0.15)",
  borderRadius: "8px",
  padding: "12px",
};

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(245,158,11,0.25)",
  borderRadius: "6px",
  color: "#e2e8f0",
  padding: "6px 10px",
  fontSize: "13px",
  width: "100%",
  outline: "none",
};

function difficultyBadge(difficulty: string) {
  const styles: Record<string, React.CSSProperties> = {
    Beginner: { background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" },
    Intermediate: { background: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)" },
    Advanced: { background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" },
  };
  return styles[difficulty] || styles.Intermediate;
}

export default function OpeningsPage() {
  const [selectedOpening, setSelectedOpening] = useState<number | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null);
  const [playerSide, setPlayerSide] = useState<"white" | "black">("white");
  const [filters, setFilters] = useState({ side: "All", difficulty: "All", minWinRate: 0 });
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

  const handleOpeningSelect = (openingId: number) => { setSelectedOpening(openingId); setSelectedVariation(null); };
  const handleBackToOpenings = () => { setSelectedOpening(null); setSelectedVariation(null); };
  const handleBackToVariations = () => { setSelectedVariation(null); };

  const backLink = (label: string, onClick: () => void) => (
    <button onClick={onClick} className="flex items-center text-sm mb-4 transition-colors"
      style={{ color: "rgba(245,158,11,0.7)", background: "none", border: "none", cursor: "pointer" }}
      onMouseEnter={e => (e.currentTarget.style.color = "#f59e0b")}
      onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,158,11,0.7)")}>
      <ChevronLeft size={18} />
      <span className="ml-1">{label}</span>
    </button>
  );

  return (
    <div style={darkPage}>
      {selectedVariation && currentVariation && currentOpening ? (
        // Level 3 — Board View
        <div style={darkFlex}>
          <div style={leftPanel}>
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              <div style={{ borderBottom: "1px solid rgba(245,158,11,0.2)", paddingBottom: "16px" }}>
                {backLink("Back to Variations", handleBackToVariations)}
                <h1 className="text-lg font-bold font-cinzel mb-1" style={{ color: "#f0e6c8" }}>{currentVariation.name}</h1>
                <p className="text-xs mb-1" style={{ color: "rgba(245,158,11,0.6)" }}>{currentOpening.name}</p>
                <p className="text-xs" style={{ color: "rgba(226,232,240,0.55)" }}>{currentVariation.description}</p>
              </div>

              {/* Play As */}
              <div style={muted}>
                <h3 className="text-xs font-bold font-cinzel mb-2" style={{ color: "rgba(245,158,11,0.9)" }}>Play As</h3>
                <div className="flex space-x-2">
                  <button onClick={() => setPlayerSide("white")}
                    style={{
                      flex: 1, padding: "8px 4px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                      background: playerSide === "white" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.06)",
                      color: playerSide === "white" ? "#0a0a0a" : "rgba(226,232,240,0.6)",
                      border: playerSide === "white" ? "none" : "1px solid rgba(255,255,255,0.1)",
                      boxShadow: playerSide === "white" ? "0 0 10px rgba(255,255,255,0.2)" : "none",
                    }}>⚪ White</button>
                  <button onClick={() => setPlayerSide("black")}
                    style={{
                      flex: 1, padding: "8px 4px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                      background: playerSide === "black" ? "#1a1a2e" : "rgba(255,255,255,0.06)",
                      color: playerSide === "black" ? "#e2e8f0" : "rgba(226,232,240,0.6)",
                      border: playerSide === "black" ? "1px solid rgba(245,158,11,0.5)" : "1px solid rgba(255,255,255,0.1)",
                      boxShadow: playerSide === "black" ? "0 0 10px rgba(245,158,11,0.15)" : "none",
                    }}>⚫ Black</button>
                </div>
              </div>

              {/* Statistics */}
              <div style={muted}>
                <h3 className="text-xs font-bold font-cinzel mb-2" style={{ color: "rgba(245,158,11,0.9)" }}>Statistics</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span style={{ color: "rgba(226,232,240,0.6)" }}>White Win Rate:</span>
                    <span className="font-semibold" style={{ color: "#10b981" }}>{currentVariation.whiteWinRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "rgba(226,232,240,0.6)" }}>Black Win Rate:</span>
                    <span className="font-semibold" style={{ color: "#ef4444" }}>{currentVariation.blackWinRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "rgba(226,232,240,0.6)" }}>Draw Rate:</span>
                    <span className="font-semibold" style={{ color: "rgba(245,158,11,0.8)" }}>{currentVariation.drawRate}%</span>
                  </div>
                </div>
              </div>

              {/* Variation Moves */}
              <div style={muted}>
                <h3 className="text-xs font-bold font-cinzel mb-2" style={{ color: "rgba(245,158,11,0.9)" }}>Variation Moves</h3>
                <div className="text-xs leading-relaxed" style={{ color: "rgba(226,232,240,0.7)" }}>
                  {currentVariation.moves.map((move, index) => (
                    <span key={index} className="mr-1">
                      {Math.floor(index / 2) + 1}{index % 2 === 0 ? "." : "..."} {move}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
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
        // Level 2 — Variations Grid
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              {backLink("Back to Openings", handleBackToOpenings)}
              <h1 className="text-3xl font-bold font-cinzel mb-2" style={{ color: "#f0e6c8" }}>
                {currentOpening.name} <span style={{ color: "#f59e0b" }}>Variations</span>
              </h1>
              <p className="text-sm mb-4" style={{ color: "rgba(226,232,240,0.6)" }}>{currentOpening.description}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-full font-semibold"
                  style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
                  White: {currentOpening.whiteWinRate}%
                </span>
                <span className="px-3 py-1 rounded-full font-semibold"
                  style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}>
                  Black: {currentOpening.blackWinRate}%
                </span>
                <span className="px-3 py-1 rounded-full font-semibold"
                  style={{ background: "rgba(6,182,212,0.15)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)" }}>
                  Popularity: {currentOpening.popularity}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {(currentOpening.variations || []).map((variation) => (
                <div key={variation.id} onClick={() => setSelectedVariation(variation.id)}
                  className="rounded-xl cursor-pointer overflow-hidden transition-all duration-200"
                  style={{ background: "linear-gradient(180deg, #0f1629 0%, #111d3a 100%)", border: "1px solid rgba(245,158,11,0.2)" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(245,158,11,0.6)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 25px rgba(245,158,11,0.15)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(245,158,11,0.2)";
                    (e.currentTarget as HTMLDivElement).style.transform = "none";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}>
                  <div style={{ background: "#080d18", padding: "12px" }}>
                    <ChessBoardPreview fen={variation.fen} />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold font-cinzel" style={{ color: "#f0e6c8" }}>{variation.name}</h3>
                      <BookOpen size={14} style={{ color: "#f59e0b" }} />
                    </div>
                    <p className="text-xs mb-3" style={{ color: "rgba(226,232,240,0.55)" }}>{variation.description}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span style={{ color: "rgba(226,232,240,0.55)" }}>White Win:</span>
                        <span className="font-semibold flex items-center gap-1" style={{ color: "#10b981" }}>
                          <TrendingUp size={11} />{variation.whiteWinRate}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: "rgba(226,232,240,0.55)" }}>Black Win:</span>
                        <span className="font-semibold flex items-center gap-1" style={{ color: "#ef4444" }}>
                          <TrendingUp size={11} />{variation.blackWinRate}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 text-xs" style={{ borderTop: "1px solid rgba(245,158,11,0.1)", color: "rgba(245,158,11,0.55)" }}>
                      <strong>Key Moves:</strong> {variation.moves.slice(-3).join(", ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(currentOpening.variations || []).length === 0 && (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-lg font-cinzel font-semibold mb-2" style={{ color: "#f0e6c8" }}>No variations available</h3>
                <p style={{ color: "rgba(245,158,11,0.5)" }}>Variations for this opening will be added soon.</p>
              </div>
            )}
          </div>
        </div>

      ) : (
        // Level 1 — Openings Grid
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-8">
              <div>
                <Link href="/" className="flex items-center text-sm mb-4 transition-colors"
                  style={{ color: "rgba(245,158,11,0.7)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#f59e0b")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,158,11,0.7)")}>
                  <ChevronLeft size={18} />
                  <span className="ml-1">Back to Home</span>
                </Link>
                <h1 className="text-3xl font-bold font-cinzel" style={{ color: "#f0e6c8" }}>
                  Chess <span style={{ color: "#f59e0b" }}>Openings</span>
                </h1>
                <p className="text-sm mt-2" style={{ color: "rgba(226,232,240,0.55)" }}>Learn and practice popular chess openings</p>
              </div>
              <button onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: showFilters ? "rgba(245,158,11,0.2)" : "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.4)",
                  color: "#f59e0b",
                }}>
                <Filter size={14} />
                <span className="ml-2">Filters</span>
              </button>
            </div>

            {showFilters && (
              <div className="mb-8 p-4 rounded-xl" style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.2)" }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: "rgba(245,158,11,0.8)" }}>Side</label>
                    <select value={filters.side} onChange={e => setFilters(prev => ({ ...prev, side: e.target.value }))} style={inputStyle}>
                      <option value="All" style={{ background: "#0f1629" }}>All Sides</option>
                      <option value="White" style={{ background: "#0f1629" }}>White Advantage</option>
                      <option value="Black" style={{ background: "#0f1629" }}>Black Advantage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: "rgba(245,158,11,0.8)" }}>Difficulty</label>
                    <select value={filters.difficulty} onChange={e => setFilters(prev => ({ ...prev, difficulty: e.target.value }))} style={inputStyle}>
                      <option value="All" style={{ background: "#0f1629" }}>All Difficulties</option>
                      <option value="Beginner" style={{ background: "#0f1629" }}>Beginner</option>
                      <option value="Intermediate" style={{ background: "#0f1629" }}>Intermediate</option>
                      <option value="Advanced" style={{ background: "#0f1629" }}>Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: "rgba(245,158,11,0.8)" }}>Min Win Rate (%)</label>
                    <input type="number" min="0" max="100" value={filters.minWinRate}
                      onChange={e => setFilters(prev => ({ ...prev, minWinRate: parseInt(e.target.value) || 0 }))}
                      style={inputStyle} />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredOpenings.map((opening) => (
                <div key={opening.id} onClick={() => handleOpeningSelect(opening.id)}
                  className="rounded-xl cursor-pointer overflow-hidden transition-all duration-200"
                  style={{ background: "linear-gradient(180deg, #0f1629 0%, #111d3a 100%)", border: "1px solid rgba(245,158,11,0.2)" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(245,158,11,0.6)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 25px rgba(245,158,11,0.15)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(245,158,11,0.2)";
                    (e.currentTarget as HTMLDivElement).style.transform = "none";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}>
                  <div style={{ background: "#080d18", padding: "12px" }}>
                    <ChessBoardPreview fen={opening.fen} />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold font-cinzel mb-2" style={{ color: "#f0e6c8" }}>{opening.name}</h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold" style={difficultyBadge(opening.difficulty)}>
                        {opening.difficulty}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold"
                        style={{ background: "rgba(6,182,212,0.12)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.25)" }}>
                        {opening.variations?.length || 0} vars
                      </span>
                    </div>
                    <p className="text-xs mb-3 line-clamp-2" style={{ color: "rgba(226,232,240,0.55)" }}>{opening.description}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span style={{ color: "rgba(226,232,240,0.55)" }}>White Win:</span>
                        <span className="font-semibold" style={{ color: "#10b981" }}>{opening.whiteWinRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: "rgba(226,232,240,0.55)" }}>Black Win:</span>
                        <span className="font-semibold" style={{ color: "#ef4444" }}>{opening.blackWinRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: "rgba(226,232,240,0.55)" }}>Popularity:</span>
                        <span className="font-semibold" style={{ color: "#06b6d4" }}>{opening.popularity}%</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 text-xs" style={{ borderTop: "1px solid rgba(245,158,11,0.1)", color: "rgba(245,158,11,0.55)" }}>
                      <strong>Moves:</strong> {opening.moves.slice(0, 3).join(", ")}{opening.moves.length > 3 && "..."}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredOpenings.length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-cinzel font-semibold mb-2" style={{ color: "#f0e6c8" }}>No openings found</h3>
                <p style={{ color: "rgba(245,158,11,0.5)" }}>Try adjusting your filters to see more results.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
