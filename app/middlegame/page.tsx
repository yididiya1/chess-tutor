"use client";

import Link from "next/link";
import { ChevronLeft, Zap } from "lucide-react";

const categories = [
  { icon: "⚔",  title: "Tactical Patterns",   subtitle: "Forks, Pins & Skewers",       description: "Master the art of tactical combinations. Learn how to spot forks, pins, skewers, and discovered attacks that win material.",                               items: ["Knight Fork", "Bishop Pin", "Rook Skewer", "Discovered Attack", "Double Check"],              difficulty: "Beginner"     },
  { icon: "♟",  title: "Pawn Structure",       subtitle: "Chains, Islands & Majorities", description: "Understand how pawn structure shapes the entire game. Learn to exploit isolated pawns, passed pawns, and pawn majorities.",                              items: ["Isolated Pawn", "Passed Pawn", "Pawn Chain", "Doubled Pawns", "Backward Pawn"],               difficulty: "Intermediate" },
  { icon: "♜",  title: "Piece Coordination",   subtitle: "Active Pieces & Outposts",     description: "Discover the power of harmoniously coordinated pieces. Control key squares, activate rooks, and establish knight outposts.",                            items: ["Knight Outpost", "Rook on 7th", "Bishop Pair", "Piece Activity", "Rook Coordination"],       difficulty: "Intermediate" },
  { icon: "♚",  title: "King Safety",          subtitle: "Attack & Defense",             description: "Learn to evaluate king safety, launch kingside attacks, and build impenetrable defensive fortresses to protect your king.",                              items: ["Castled King Defense", "Pawn Storm Attack", "Piece Sacrifice Attack", "Fortress Defense", "Open File Danger"], difficulty: "Advanced" },
  { icon: "○",  title: "Positional Strategy",  subtitle: "Long-term Planning",           description: "Go beyond tactics. Understand weak squares, good and bad bishops, prophylaxis, and long-term positional maneuvering.",                                  items: ["Weak Square Complex", "Good vs Bad Bishop", "Prophylaxis", "Zugzwang", "Minority Attack"],    difficulty: "Advanced"     },
  { icon: "△",  title: "Combinations",         subtitle: "Sacrifices & Attacks",         description: "Learn spectacular sacrificial attacks and multi-move combinations. Find the moves that change the course of the game.",                                  items: ["Greek Gift Sacrifice", "Back Rank Mate Threat", "Exchange Sacrifice", "Clearance Sacrifice", "Deflection"], difficulty: "Advanced" },
];

function DiffBadge({ level }: { level: string }) {
  return <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-muted text-muted-foreground">{level}</span>;
}

export default function MiddleGamePage() {
  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ChevronLeft size={16} /><span className="ml-0.5">Home</span>
        </Link>
        <div className="mb-10">
          <h1 className="text-2xl font-medium text-foreground tracking-tight mb-1">Practice Middlegame</h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            The middlegame is where battles are won and lost. Choose a category to master critical concepts —
            from sharp tactical patterns to deep strategic planning.
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
            While full interactive practice is coming soon, sharpen your tactical vision by solving puzzles.
          </p>
          <Link href="/puzzles" className="btn-primary inline-flex"><Zap size={14} />Practice Puzzles</Link>
        </div>
      </div>
    </div>
  );
}
