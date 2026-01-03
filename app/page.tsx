'use client'
import Link from "next/link";
import UserDashboard from "./components/UserDashboard";
import ContinueLearning from "./components/ContinueLearning";
import { Lock, Clock, Zap, BookOpen, Swords, Shield, Crown, Users, BarChart2, FileText, type LucideIcon } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   Feature cards — set comingSoon: true to gate a feature
───────────────────────────────────────────────────────────────── */


const practiceCards: {
  title: string;
  description: string;
  Icon: LucideIcon;
  href: string;
  accent: string;
  comingSoon: boolean;
}[] = [
  { title: "Do Puzzle",           description: "Solve tactical puzzles to sharpen your pattern recognition",    Icon: Zap,      href: "/puzzles",    accent: "#f59e0b", comingSoon: false },
  { title: "Learning Opening",    description: "Master chess openings with interactive step-by-step lessons",  Icon: BookOpen, href: "/openings",   accent: "#06b6d4", comingSoon: false },
  { title: "Opening Traps",       description: "Learn deadly opening traps to catch your opponents off guard", Icon: Swords,   href: "/traps",      accent: "#ef4444", comingSoon: false },
  { title: "Practice Middle Game",description: "Improve your middlegame strategy and tactical thinking",       Icon: Shield,   href: "/middlegame", accent: "#10b981", comingSoon: false },
  { title: "Practice End Game",   description: "Master endgame techniques and convert winning positions",      Icon: Crown,    href: "/endgame",    accent: "#f59e0b", comingSoon: false },
  { title: "Puzzle Challenge",    description: "Compete with friends in a puzzle solving battle",              Icon: Users,    href: "/challenge",  accent: "#8b5cf6", comingSoon: true  },
  { title: "Analysis Board",      description: "Analyze positions and explore variations with AI",             Icon: BarChart2,href: "/analysis",   accent: "#06b6d4", comingSoon: true  },
  { title: "Game Review",         description: "Review and analyze your completed games",                      Icon: FileText, href: "/review",     accent: "#8b5cf6", comingSoon: true  },
];

export default function Home() {
  return (
    <div className="min-h-screen chess-bg-pattern">
      <div className="relative z-10 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto">

          {/* ── Page Header ─────────────────────────────────────── */}
          <div className="text-center mb-10">
            <h1
              className="text-3xl sm:text-4xl font-cinzel font-bold mb-2 animate-glow-pulse"
              style={{ color: '#f59e0b' }}
            >
              ♔ Chess Tutor
            </h1>
            <p className="text-sm font-rajdhani tracking-widest uppercase" style={{ color: 'rgba(226,232,240,0.4)' }}>
              Master the board. One move at a time.
            </p>
          </div>

          {/* ── Three-column layout ─────────────────────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

            {/* Left — User Dashboard */}
            <div className="xl:col-span-3">
              <UserDashboard />
            </div>

            {/* Center — Practice Cards Grid */}
            <div className="xl:col-span-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                {practiceCards.map((card, index) => {
                  const inner = (
                    <div className="p-5 h-full flex flex-col gap-3">
                      {/* Top row: icon + coming-soon badge */}
                      <div className="flex items-start justify-between">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: card.comingSoon
                              ? 'rgba(139,92,246,0.12)'
                              : `${card.accent}12`,
                            border: `1px solid ${card.comingSoon ? 'rgba(139,92,246,0.3)' : card.accent + '30'}`,
                          }}
                        >
                          <card.Icon
                            size={24}
                            style={{
                              color: card.comingSoon ? 'rgba(139,92,246,0.45)' : card.accent,
                              filter: card.comingSoon ? undefined : `drop-shadow(0 0 5px ${card.accent}80)`,
                            }}
                          />
                        </div>
                        {card.comingSoon && (
                          <span className="badge-coming-soon flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            Soon
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        className="font-cinzel font-semibold text-sm leading-tight transition-colors duration-300"
                        style={{ color: card.comingSoon ? 'rgba(226,232,240,0.35)' : '#e2e8f0' }}
                      >
                        {card.title}
                      </h3>

                      {/* Description */}
                      <p
                        className="text-sm font-rajdhani leading-relaxed flex-1"
                        style={{ color: card.comingSoon ? 'rgba(226,232,240,0.2)' : 'rgba(226,232,240,0.5)' }}
                      >
                        {card.description}
                      </p>

                      {/* CTA */}
                      {card.comingSoon ? (
                        <div className="flex items-center gap-1.5 mt-auto">
                          <Lock className="w-3 h-3" style={{ color: 'rgba(139,92,246,0.5)' }} />
                          <span className="text-xs font-rajdhani" style={{ color: 'rgba(139,92,246,0.5)' }}>
                            Coming Soon
                          </span>
                        </div>
                      ) : (
                        <div
                          className="mt-auto text-xs font-cinzel font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ color: card.accent }}
                        >
                          Play Now →
                        </div>
                      )}
                    </div>
                  );

                  if (card.comingSoon) {
                    return (
                      <div
                        key={index}
                        className="rounded-xl cursor-not-allowed select-none"
                        style={{
                          background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1426 100%)',
                          border: '1px solid rgba(139,92,246,0.12)',
                          opacity: 0.7,
                        }}
                      >
                        {inner}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={index}
                      href={card.href}
                      className="game-card group block"
                      style={{ borderColor: `${card.accent}22` }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = `${card.accent}55`
                        el.style.boxShadow = `0 0 20px ${card.accent}18, 0 8px 32px rgba(0,0,0,0.4)`
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = `${card.accent}22`
                        el.style.boxShadow = ''
                      }}
                    >
                      {inner}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right — Continue Learning */}
            <div
              className="xl:col-span-3 rounded-xl p-5"
              style={{
                background: 'linear-gradient(180deg, #0f1629 0%, #0a1020 100%)',
                border: '1px solid rgba(245,158,11,0.15)',
              }}
            >
              <ContinueLearning />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
