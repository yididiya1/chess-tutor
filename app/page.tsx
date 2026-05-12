'use client'
import Link from "next/link";
import UserDashboard from "./components/UserDashboard";
import ContinueLearning from "./components/ContinueLearning";
import { Lock, Clock, Zap, BookOpen, Swords, Shield, Crown, Users, BarChart2, FileText, type LucideIcon } from "lucide-react";

const practiceCards: {
  title: string;
  description: string;
  Icon: LucideIcon;
  href: string;
  comingSoon: boolean;
}[] = [
  { title: "Puzzles",          description: "Solve tactical puzzles to sharpen your pattern recognition",    Icon: Zap,       href: "/puzzles",    comingSoon: false },
  { title: "Openings",         description: "Master chess openings with interactive step-by-step lessons",  Icon: BookOpen,  href: "/openings",   comingSoon: false },
  { title: "Opening Traps",    description: "Learn deadly opening traps to catch your opponents off guard", Icon: Swords,    href: "/traps",      comingSoon: false },
  { title: "Middlegame",       description: "Improve your middlegame strategy and tactical thinking",       Icon: Shield,    href: "/middlegame", comingSoon: false },
  { title: "Endgame",          description: "Master endgame techniques and convert winning positions",      Icon: Crown,     href: "/endgame",    comingSoon: false },
  { title: "Puzzle Challenge", description: "Compete with friends in a puzzle solving battle",              Icon: Users,     href: "/challenge",  comingSoon: true  },
  { title: "Analysis Board",   description: "Analyze positions and explore variations with AI",             Icon: BarChart2, href: "/analysis",   comingSoon: true  },
  { title: "Game Review",      description: "Review and analyze your completed games",                      Icon: FileText,  href: "/review",     comingSoon: true  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-foreground tracking-tight">Chess Tutor</h1>
          <p className="text-sm text-muted-foreground mt-1">Master the board. One move at a time.</p>
        </div>

        {/* Three-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

          {/* Left — User Dashboard */}
          <div className="xl:col-span-3">
            <UserDashboard />
          </div>

          {/* Center — Practice Cards Grid */}
          <div className="xl:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
              {practiceCards.map((card, index) => {
                const inner = (
                  <div className="p-4 h-full flex flex-col gap-2.5">
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-md bg-muted border flex items-center justify-center flex-shrink-0">
                        <card.Icon size={18} className="text-muted-foreground" />
                      </div>
                      {card.comingSoon && (
                        <span className="badge-soon flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          Soon
                        </span>
                      )}
                    </div>

                    <h3 className="font-medium text-sm text-foreground" style={{ opacity: card.comingSoon ? 0.5 : 1 }}>
                      {card.title}
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed flex-1" style={{ opacity: card.comingSoon ? 0.6 : 1 }}>
                      {card.description}
                    </p>

                    {card.comingSoon ? (
                      <div className="flex items-center gap-1.5 mt-auto">
                        <Lock className="w-3 h-3 text-muted-foreground/60" />
                        <span className="text-xs text-muted-foreground/60">Coming Soon</span>
                      </div>
                    ) : (
                      <div className="mt-auto text-xs font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Open →
                      </div>
                    )}
                  </div>
                );

                if (card.comingSoon) {
                  return (
                    <div key={index} className="rounded-lg bg-card border cursor-not-allowed select-none opacity-60">
                      {inner}
                    </div>
                  );
                }

                return (
                  <Link key={index} href={card.href} className="card group block">
                    {inner}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right — Continue Learning */}
          <div className="xl:col-span-3 panel p-5">
            <ContinueLearning />
          </div>
        </div>
      </div>
    </div>
  );
}
