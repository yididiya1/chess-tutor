"use client";

import { useState } from "react";
import { ChevronLeft, Filter, TrendingUp, BookOpen } from "lucide-react";
import Link from "next/link";
import OpeningBoard from "../components/OpeningBoard";
import ChessBoardPreview from "../components/ChessBoardPreview";
import openingsRaw from "../../data/openings.json";
import type { Opening } from "../types/openings";

const openingsData = openingsRaw as Opening[];

function DifficultyBadge({ level }: { level: string }) {
  return (
    <span className="px-2 py-0.5 rounded text-xs font-medium border bg-muted text-muted-foreground">
      {level}
    </span>
  );
}

const panelCls = "w-72 bg-card border-r flex flex-col overflow-y-auto";
const sectionCls = "pb-4 border-b";
const statBoxCls = "rounded-md bg-muted/50 border p-3 space-y-2";
const backLinkBase = "flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4";

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
  const currentVariation = selectedVariation && currentOpening
    ? currentOpening.variations?.find(v => v.id === selectedVariation)
    : null;

  const handleOpeningSelect = (id: number) => { setSelectedOpening(id); setSelectedVariation(null); };
  const handleBackToOpenings = () => { setSelectedOpening(null); setSelectedVariation(null); };
  const handleBackToVariations = () => setSelectedVariation(null);

  const BackBtn = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button onClick={onClick} className={backLinkBase}>
      <ChevronLeft size={16} /><span className="ml-0.5">{label}</span>
    </button>
  );

  const SideToggle = () => (
    <div>
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Play As</h3>
      <div className="flex gap-2">
        {(["white", "black"] as const).map(side => (
          <button
            key={side}
            onClick={() => setPlayerSide(side)}
            className={`flex-1 py-2 rounded-md text-xs font-medium border transition-colors ${
              playerSide === side
                ? "bg-foreground text-background border-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {side === "white" ? "White" : "Black"}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {selectedVariation && currentVariation && currentOpening ? (
        <div className="flex h-screen bg-background">
          <div className={panelCls}>
            <div className="p-4 space-y-4">
              <div className={sectionCls}>
                <BackBtn label="Back to Variations" onClick={handleBackToVariations} />
                <h1 className="text-base font-medium text-foreground mb-0.5">{currentVariation.name}</h1>
                <p className="text-xs text-muted-foreground mb-1">{currentOpening.name}</p>
                <p className="text-xs text-muted-foreground">{currentVariation.description}</p>
              </div>
              <SideToggle />
              <div className={statBoxCls}>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Statistics</h3>
                {[
                  { label: "White Win Rate", value: `${currentVariation.whiteWinRate}%` },
                  { label: "Black Win Rate", value: `${currentVariation.blackWinRate}%` },
                  { label: "Draw Rate",      value: `${currentVariation.drawRate}%` },
                ].map(s => (
                  <div key={s.label} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-medium text-foreground">{s.value}</span>
                  </div>
                ))}
              </div>
              <div className={statBoxCls}>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Moves</h3>
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
              openingLine={{
                id: currentVariation.id,
                name: currentVariation.name,
                moves: currentVariation.moves,
                fen: currentVariation.fen,
                whiteWinRate: currentVariation.whiteWinRate,
                blackWinRate: currentVariation.blackWinRate,
                drawRate: currentVariation.drawRate,
                description: currentVariation.description,
                difficulty: currentOpening.difficulty,
                lesson: currentVariation.lesson ?? currentOpening.lesson,
              }}
              playerSide={playerSide}
            />
          </div>
        </div>

      ) : selectedOpening && currentOpening ? (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <BackBtn label="Back to Openings" onClick={handleBackToOpenings} />
              <h1 className="text-2xl font-medium text-foreground tracking-tight mb-1">{currentOpening.name}</h1>
              <p className="text-sm text-muted-foreground mb-4">{currentOpening.description}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  `White: ${currentOpening.whiteWinRate}%`,
                  `Black: ${currentOpening.blackWinRate}%`,
                  `Popularity: ${currentOpening.popularity}%`,
                ].map(label => (
                  <span key={label} className="px-2.5 py-1 rounded-full font-medium border bg-muted text-muted-foreground">{label}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(currentOpening.variations || []).map((variation) => (
                <div key={variation.id} onClick={() => setSelectedVariation(variation.id)} className="card cursor-pointer overflow-hidden">
                  <div className="bg-muted/50 p-3 border-b">
                    <ChessBoardPreview fen={variation.fen} />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-sm font-medium text-foreground">{variation.name}</h3>
                      <BookOpen size={13} className="text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{variation.description}</p>
                    <div className="space-y-1 text-xs">
                      {[["White Win", `${variation.whiteWinRate}%`], ["Black Win", `${variation.blackWinRate}%`]].map(([l, v]) => (
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
            {(currentOpening.variations || []).length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-base font-medium text-foreground mb-1">No variations available</h3>
                <p className="text-sm text-muted-foreground">Variations for this opening will be added soon.</p>
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
                <h1 className="text-2xl font-medium text-foreground tracking-tight">Chess Openings</h1>
                <p className="text-sm text-muted-foreground mt-1">Learn and practice popular chess openings</p>
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
                      <option value="All">All Sides</option><option value="White">White Advantage</option><option value="Black">Black Advantage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Difficulty</label>
                    <select value={filters.difficulty} onChange={e => setFilters(p => ({ ...p, difficulty: e.target.value }))} className="input-base">
                      <option value="All">All Difficulties</option><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Min Win Rate (%)</label>
                    <input type="number" min="0" max="100" value={filters.minWinRate} onChange={e => setFilters(p => ({ ...p, minWinRate: parseInt(e.target.value) || 0 }))} className="input-base" />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredOpenings.map((opening) => (
                <div key={opening.id} onClick={() => handleOpeningSelect(opening.id)} className="card cursor-pointer overflow-hidden">
                  <div className="bg-muted/50 p-3 border-b">
                    <ChessBoardPreview fen={opening.fen} />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-foreground mb-2">{opening.name}</h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <DifficultyBadge level={opening.difficulty} />
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border">
                        {opening.variations?.length || 0} vars
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{opening.description}</p>
                    <div className="space-y-1 text-xs">
                      {[["White Win", `${opening.whiteWinRate}%`], ["Black Win", `${opening.blackWinRate}%`], ["Popularity", `${opening.popularity}%`]].map(([l, v]) => (
                        <div key={l} className="flex justify-between">
                          <span className="text-muted-foreground">{l}</span>
                          <span className="font-medium text-foreground">{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 text-xs text-muted-foreground border-t">
                      <strong className="text-foreground">Moves:</strong> {opening.moves.slice(0, 3).join(", ")}{opening.moves.length > 3 && "..."}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredOpenings.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-base font-medium text-foreground mb-1">No openings found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters to see more results.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
