"use client";

import Link from "next/link";
import { ChevronLeft, Swords, Shield, Zap, Target, TrendingUp, Crown, BookOpen, Crosshair } from "lucide-react";

const categories = [
  {
    icon: "⚔️",
    title: "Tactical Patterns",
    subtitle: "Forks, Pins & Skewers",
    description: "Master the art of tactical combinations. Learn how to spot forks, pins, skewers, and discovered attacks that win material.",
    color: "#ef4444",
    items: ["Knight Fork", "Bishop Pin", "Rook Skewer", "Discovered Attack", "Double Check"],
    difficulty: "Beginner",
  },
  {
    icon: "♟",
    title: "Pawn Structure",
    subtitle: "Chains, Islands & Majorities",
    description: "Understand how pawn structure shapes the entire game. Learn to exploit isolated pawns, passed pawns, and pawn majorities.",
    color: "#f59e0b",
    items: ["Isolated Pawn", "Passed Pawn", "Pawn Chain", "Doubled Pawns", "Backward Pawn"],
    difficulty: "Intermediate",
  },
  {
    icon: "🏰",
    title: "Piece Coordination",
    subtitle: "Active Pieces & Outposts",
    description: "Discover the power of harmoniously coordinated pieces. Control key squares, activate rooks, and establish knight outposts.",
    color: "#06b6d4",
    items: ["Knight Outpost", "Rook on 7th", "Bishop Pair", "Piece Activity", "Rook Coordination"],
    difficulty: "Intermediate",
  },
  {
    icon: "🛡",
    title: "King Safety",
    subtitle: "Attack & Defense",
    description: "Learn to evaluate king safety, launch kingside attacks, and build impenetrable defensive fortresses to protect your king.",
    color: "#10b981",
    items: ["Castled King Defense", "Pawn Storm Attack", "Piece Sacrifice Attack", "Fortress Defense", "Open File Danger"],
    difficulty: "Advanced",
  },
  {
    icon: "🎯",
    title: "Positional Strategy",
    subtitle: "Long-term Planning",
    description: "Go beyond tactics. Understand weak squares, good and bad bishops, prophylaxis, and long-term positional maneuvering.",
    color: "#8b5cf6",
    items: ["Weak Square Complex", "Good vs Bad Bishop", "Prophylaxis", "Zugzwang", "Minority Attack"],
    difficulty: "Advanced",
  },
  {
    icon: "⚡",
    title: "Combinations",
    subtitle: "Sacrifices & Attacks",
    description: "Learn spectacular sacrificial attacks and multi-move combinations. Find the moves that change the course of the game.",
    color: "#f97316",
    items: ["Greek Gift Sacrifice", "Back Rank Mate Threat", "Exchange Sacrifice", "Clearance Sacrifice", "Deflection"],
    difficulty: "Advanced",
  },
];

function DiffBadge({ level }: { level: string }) {
  const style: React.CSSProperties =
    level === "Beginner"
      ? { background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }
      : level === "Intermediate"
      ? { background: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)" }
      : { background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" };
  return (
    <span style={{ ...style, padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700 }}>
      {level}
    </span>
  );
}

export default function MiddleGamePage() {
  return (
    <div style={{ background: "#080d18", minHeight: "100vh", paddingBottom: "60px" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">

        {/* Back link */}
        <Link href="/" className="inline-flex items-center text-sm mb-10 transition-colors"
          style={{ color: "rgba(245,158,11,0.7)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#f59e0b")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,158,11,0.7)")}>
          <ChevronLeft size={18} />
          <span className="ml-1">Back to Home</span>
        </Link>

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(245,158,11,0.2) 100%)", border: "2px solid rgba(139,92,246,0.5)", boxShadow: "0 0 40px rgba(139,92,246,0.2)" }}>
            <Swords size={44} style={{ color: "#a78bfa" }} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-cinzel mb-4"
            style={{ color: "#f0e6c8", textShadow: "0 0 40px rgba(245,158,11,0.2)" }}>
            Practice <span style={{ color: "#a78bfa" }}>Middle Game</span>
          </h1>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "rgba(226,232,240,0.65)" }}>
            The middlegame is where battles are won and lost. Choose a category to master critical concepts —
            from sharp tactical patterns to deep strategic planning.
          </p>

          {/* Divider */}
          <div className="mt-8 mx-auto" style={{ height: "1px", maxWidth: "300px", background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)" }} />
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <div key={i}
              className="rounded-xl p-6 transition-all duration-200 cursor-default"
              style={{
                background: "linear-gradient(180deg, #0f1629 0%, #111d3a 100%)",
                border: `1px solid ${cat.color}33`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = cat.color + "80";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 30px ${cat.color}20`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = cat.color + "33";
                (e.currentTarget as HTMLDivElement).style.transform = "none";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}>
              {/* Card header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-11 h-11 rounded-lg text-2xl"
                    style={{ background: cat.color + "18", border: `1px solid ${cat.color}30` }}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-bold font-cinzel text-sm" style={{ color: "#f0e6c8" }}>{cat.title}</h3>
                    <p className="text-xs" style={{ color: cat.color + "cc" }}>{cat.subtitle}</p>
                  </div>
                </div>
                <DiffBadge level={cat.difficulty} />
              </div>

              {/* Description */}
              <p className="text-xs mb-4 leading-relaxed" style={{ color: "rgba(226,232,240,0.6)" }}>
                {cat.description}
              </p>

              {/* Topics */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {cat.items.map((item, j) => (
                  <span key={j} className="text-xs px-2 py-0.5 rounded"
                    style={{ background: cat.color + "12", color: cat.color + "cc", border: `1px solid ${cat.color}25` }}>
                    {item}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-4" style={{ borderTop: `1px solid ${cat.color}20` }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: cat.color + "99" }}>
                    Interactive lessons coming soon
                  </span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: cat.color + "20", border: `1px solid ${cat.color}40` }}>
                    <span style={{ color: cat.color, fontSize: "12px" }}>→</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center p-8 rounded-2xl"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(245,158,11,0.05) 100%)", border: "1px solid rgba(139,92,246,0.2)" }}>
          <div className="text-3xl mb-3">⚔️</div>
          <h2 className="text-xl font-bold font-cinzel mb-2" style={{ color: "#f0e6c8" }}>
            Sharpen Your Middlegame
          </h2>
          <p className="text-sm mb-5" style={{ color: "rgba(226,232,240,0.55)", maxWidth: "500px", margin: "0 auto 20px" }}>
            While full interactive practice is coming soon, start sharpening your tactical vision by solving puzzles.
          </p>
          <Link href="/puzzles"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm font-cinzel transition-all"
            style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)", color: "#080d18", boxShadow: "0 0 20px rgba(245,158,11,0.3)" }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 30px rgba(245,158,11,0.5)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 20px rgba(245,158,11,0.3)")}>
            <Zap size={16} />
            Practice Puzzles
          </Link>
        </div>
      </div>
    </div>
  );
}