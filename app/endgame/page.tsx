"use client";

import Link from "next/link";
import { ChevronLeft, Zap } from "lucide-react";

const categories = [
  { icon: "♔", title: "King & Pawn Endings", subtitle: "The Foundation of Endgame",   description: "Master the most fundamental endgame — king activity, opposition, key squares, and pawn promotion techniques.",                                              items: ["Opposition", "Key Squares", "Pawn Breakthrough", "Triangulation", "Zugzwang"],                       difficulty: "Beginner"     },
  { icon: "♜", title: "Rook Endings",         subtitle: "The Most Common Endgame",     description: "Rook endings are the most frequent in practice. Learn Lucena and Philidor positions, active rooks, and pawn promotion races.",                               items: ["Lucena Position", "Philidor Defense", "Rook Behind Passer", "Cutoff Technique", "Seventh Rank Power"], difficulty: "Intermediate" },
  { icon: "♗", title: "Bishop Endings",       subtitle: "Colors & Diagonals",          description: "Understand same-colored and opposite-colored bishop endings. Learn when to convert and when to hold the draw.",                                              items: ["Same-Color Bishops", "Opposite-Color Bishops", "Bishop vs Pawns", "Converting Advantage", "Drawing Fortress"], difficulty: "Intermediate" },
  { icon: "♞", title: "Knight Endings",       subtitle: "The Most Tricky Pieces",      description: "Knights are treacherous in endgames. Master how to use their unique movement to outmaneuver opponents.",                                                     items: ["Knight vs Pawn", "Knight Outpost", "Knight Triangulation", "Wrong Rook Pawn", "Knight Fortress"],      difficulty: "Intermediate" },
  { icon: "♛", title: "Queen Endings",        subtitle: "Power & Precision",           description: "Queen vs pawn races, queen vs rook battles, and the delicate art of avoiding stalemate while converting a win.",                                             items: ["Queen vs Pawn", "Queen vs Rook", "Stalemate Traps", "Pawn Race", "Perpetual Check Defense"],           difficulty: "Advanced"     },
  { icon: "♚", title: "Basic Checkmates",     subtitle: "Essential Mating Patterns",   description: "Every player must know the fundamental checkmate patterns. Master king + queen, king + rook, two bishops, and more.",                                       items: ["K+Q Checkmate", "K+R Checkmate", "Two Bishops", "Bishop + Knight", "Back Rank Mate"],                   difficulty: "Beginner"     },
];

function DiffBadge({ level }: { level: string }) {
  return <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-muted text-muted-foreground">{level}</span>;
}

export default function EndGamePage() {
  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ChevronLeft size={16} /><span className="ml-0.5">Home</span>
        </Link>
        <div className="mb-10">
          <h1 className="text-2xl font-medium text-foreground tracking-tight mb-1">Practice Endgame</h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Endgames separate good players from great ones. Learn essential techniques — from fundamental king and pawn
            endings to sophisticated rook battles and checkmate patterns.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md flex items-center justify-center text-xl border bg-muted text-foreground">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-foreground">{cat.title}</h3>
                    <p className="text-xs text-muted-foreground">{cat.subtitle}</p>
                  </div>
                </div>
                <DiffBadge level={cat.difficulty} />
              </div>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{cat.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {cat.items.map((item, j) => (
                  <span key={j} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground border">{item}</span>
                ))}
              </div>
              <div className="pt-3 border-t flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Interactive lessons coming soon</span>
                <span className="text-muted-foreground/60 text-sm">→</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 p-6 rounded-lg bg-card border text-center">
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            The best way to improve your endgame is to understand the positions. Practice tactical puzzles to sharpen your calculation.
          </p>
          <Link href="/puzzles" className="btn-primary inline-flex"><Zap size={14} />Practice Puzzles</Link>
        </div>
      </div>
    </div>
  );
}
