"use client";

import { useState } from "react";
import { ChevronLeft, Filter, TrendingUp } from "lucide-react";
import Link from "next/link";
import OpeningBoard from "../components/OpeningBoard";
import ChessBoardPreview from "../components/ChessBoardPreview";
import trapsData from "../../data/traps.json";

function DifficultyBadge({ level }: { level: string }) {
  return (
    <span className="px-2 py-0.5 rounded text-xs font-medium border bg-muted text-muted-foreground">
      {level}
    </span>
  );
}

const panelCls = "w-72 bg-card border-r flex flex-col overflow-y-auto";
const statBoxCls = "rounded-md bg-muted/50 border p-3 space-y-2";
const backLinkBase = "flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4";

export default function TrapsPage() {
  const [selectedTrap, setSelectedTrap] = useState<number | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null);
  const [playerSide, setPlayerSide] = useState<"white" | "black">("white");
  const [filters, setFilters] = useState({ side: "All", difficulty: "All", minWinRate: 0 });
  const [showFilters, setShowFilters] = useState(false);

  const filteredTraps = trapsData.filter(trap => {
    const sideMatch = filters.side === "All" ||
      (filters.side === "White" && trap.whiteWinRate > trap.blackWinRate) ||
      (filters.side === "Black" && trap.blackWinRate > trap.whiteWinRate);
    const difficultyMatch = filters.difficulty === "All" || trap.difficulty === filters.difficulty;
    const winRateMatch = Math.max(trap.whiteWinRate, trap.blackWinRate) >= filters.minWinRate;
    return sideMatch && difficultyMatch && winRateMatch;
  });

  const currentTrap = selectedTrap ? trapsData.find(o => o.id === selectedTrap) : null;
  const currentVariation = selectedVariation && currentTrap
    ? currentTrap.variations?.find(v => v.id === selectedVariation)
    : null;

  const handleTrapSelect = (id: number) => { setSelectedTrap(id); setSelectedVariation(null); };
  const handleBackToTraps = () => { setSelectedTrap(null); setSelectedVariation(null); };
  const handleBackToVariations = () => setSelectedVariation(null);

  const BackBtn = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button onClick={onClick} className={backLinkBase}>
      <ChevronLeft size={16} /><span className="ml-0.5">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      {selectedVariation && currentVariation && currentTrap ? (
        <div className="flex h-screen bg-background">
          <div className={panelCls}>
            <div className="p-4 space-y-4">
              <div className="pb-4 border-b">
                <BackBtn label="Back to Traps" onClick={handleBackToVariations} />
                <h1 className="text-base font-medium text-foreground mb-0.5">{currentVariation.name}</h1>
                <p className="text-xs text-muted-foreground mb-1">{currentTrap.name}</p>
                <p className="text-xs text-muted-foreground">{currentVariation.description}</p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Play As</h3>
                <div className="flex gap-2">
                  {(["white", "black"] as const).map(side => (
                    <button key={side} onClick={() => setPlayerSide(side)}
                      className={`flex-1 py-2 rounded-md text-xs font-medium border transition-colors ${
                        playerSide === side
                          ? "bg-foreground text-background border-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >{side === "white" ? "White" : "Black"}</button>
                  ))}
                </div>
              </div>
              <div className={statBoxCls}>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Success Rate</h3>
                {[
                  { label: "White Success", value: `${currentVariation.whiteWinRate}%` },
                  { label: "Black Success", value: `${currentVariation.blackWinRate}%` },
                  { label: "Draw Rate",     value: `${currentVariation.drawRate}%` },
                ].map(s => (
                  <div key={s.label} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-medium text-foreground">{s.value}</span>
                  </div>
                ))}
              </div>
              <div className={statBoxCls}>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Trap Sequence</h3>
                <div className="text-xs text-foreground leading-relaxed">
                  {currentVariation.moves.map((move, i) => (
                    <span key={i} className="mr-1">{Math.floor(i / 2) + 1}{i % 2 === 0 ? "." : "..."} {move}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-8">
            <OpeningBoard
              openingLine={{ id: currentVariation.id, name: currentVariation.name, moves: currentVariation.moves, fen: currentVariation.fen, whiteWinRate: currentVariation.whiteWinRate, blackWinRate: currentVariation.blackWinRate, drawRate: currentVariation.drawRate, description: currentVariation.description, difficulty: currentTrap.difficulty }}
              playerSide={playerSide}
            />
          </div>
        </div>

      ) : selectedTrap && currentTrap ? (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <BackBtn label="Back to Opening Traps" onClick={handleBackToTraps} />
              <h1 className="text-2xl font-medium text-foreground tracking-tight mb-1">{currentTrap.name}</h1>
              <p className="text-sm text-muted-foreground mb-4">{currentTrap.description}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  `White: ${currentTrap.whiteWinRate}%`,
                  `Black: ${currentTrap.blackWinRate}%`,
                  `Popularity: ${currentTrap.popularity}%`,
                ].map(label => (
                  <span key={label} className="px-2.5 py-1 rounded-full font-medium border bg-muted text-muted-foreground">{label}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(currentTrap.variations || []).map((variation) => (
                <div key={variation.id} onClick={() => setSelectedVariation(variation.id)} className="card cursor-pointer overflow-hidden">
                  <div className="bg-muted/50 p-3 border-b">
                    <ChessBoardPreview fen={variation.fen} />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-foreground mb-2">{variation.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{variation.description}</p>
                    <div className="space-y-1 text-xs">
                      {[["White Success", `${variation.whiteWinRate}%`], ["Black Success", `${variation.blackWinRate}%`]].map(([l, v]) => (
                        <div key={l} className="flex justify-between">
                          <span className="text-muted-foreground">{l}</span>
                          <span className="font-medium flex items-center gap-1 text-foreground"><TrendingUp size={10} />{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 text-xs text-muted-foreground border-t">
                      <strong className="text-foreground">Key Moves:</strong> {variation.moves.slice(-3).join(", ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {(currentTrap.variations || []).length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-base font-medium text-foreground mb-1">No trap variations available</h3>
                <p className="text-sm text-muted-foreground">Trap variations will be added soon.</p>
              </div>
            )}
          </div>
        </div>

      ) : (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-8">
              <div>
                <Link href="/" className={backLinkBase}><ChevronLeft size={16} /><span className="ml-0.5">Home</span></Link>
                <h1 className="text-2xl font-medium text-foreground tracking-tight">Opening Traps</h1>
                <p className="text-sm text-muted-foreground mt-1">Learn deadly opening traps to catch your opponents off-guard</p>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium border transition-colors ${
                  showFilters
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card text-foreground hover:bg-muted"
                }`}
              >
                <Filter size={14} />Filters
              </button>
            </div>

            {showFilters && (
              <div className="mb-8 p-4 rounded-lg bg-card border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Side</label>
                    <select value={filters.side} onChange={e => setFilters(p => ({ ...p, side: e.target.value }))} className="input-base">
                      <option value="All">All Sides</option><option value="White">White Traps</option><option value="Black">Black Traps</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Difficulty</label>
                    <select value={filters.difficulty} onChange={e => setFilters(p => ({ ...p, difficulty: e.target.value }))} className="input-base">
                      <option value="All">All Difficulties</option><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Min Success Rate (%)</label>
                    <input type="number" min="0" max="100" value={filters.minWinRate} onChange={e => setFilters(p => ({ ...p, minWinRate: parseInt(e.target.value) || 0 }))} className="input-base" />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTraps.map((trap) => (
                <div key={trap.id} onClick={() => handleTrapSelect(trap.id)} className="card cursor-pointer overflow-hidden">
                  <div className="bg-muted/50 p-3 border-b">
                    <ChessBoardPreview fen={trap.fen} />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-foreground mb-2">{trap.name}</h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <DifficultyBadge level={trap.difficulty} />
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border">
                        {trap.variations?.length || 0} traps
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{trap.description}</p>
                    <div className="space-y-1 text-xs">
                      {[["White Success", `${trap.whiteWinRate}%`], ["Black Success", `${trap.blackWinRate}%`], ["Popularity", `${trap.popularity}%`]].map(([l, v]) => (
                        <div key={l} className="flex justify-between">
                          <span className="text-muted-foreground">{l}</span>
                          <span className="font-medium text-foreground">{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 text-xs text-muted-foreground border-t">
                      <strong className="text-foreground">Setup:</strong> {trap.moves.slice(0, 3).join(", ")}{trap.moves.length > 3 && "..."}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTraps.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-base font-medium text-foreground mb-1">No traps found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters to see more results.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
