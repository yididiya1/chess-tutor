import Link from "next/link";
import { Puzzle, BookOpen, Swords, Crown, Users, BarChart3, FileText, Target } from "lucide-react";

const practiceCards = [
  {
    title: "Do Puzzle",
    description: "Solve tactical puzzles to improve your pattern recognition",
    icon: Puzzle,
    href: "/puzzles",
    color: "bg-blue-500"
  },
  {
    title: "Learning Opening",
    description: "Master chess openings with interactive lessons",
    icon: BookOpen,
    href: "/openings",
    color: "bg-green-500"
  },
  {
    title: "Opening Traps",
    description: "Learn deadly opening traps to catch your opponents",
    icon: Target,
    href: "/traps",
    color: "bg-red-500"
  },
  {
    title: "Practice Middle Game",
    description: "Improve your middle game strategy and tactics",
    icon: Swords,
    href: "/middlegame",
    color: "bg-purple-500"
  },
  {
    title: "Practice End Game",
    description: "Master endgame techniques and positions",
    icon: Crown,
    href: "/endgame",
    color: "bg-yellow-500"
  },
  {
    title: "Puzzle Challenge with Friend",
    description: "Compete with friends in puzzle solving challenges",
    icon: Users,
    href: "/challenge",
    color: "bg-red-500"
  },
  {
    title: "Analysis Board",
    description: "Analyze positions and explore variations",
    icon: BarChart3,
    href: "/analysis",
    color: "bg-indigo-500"
  },
  {
    title: "Game Review",
    description: "Review and analyze your completed games",
    icon: FileText,
    href: "/review",
    color: "bg-teal-500"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{
          backgroundImage: "url('/chess_bg.jpg')"
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 bg-black/70 backdrop-blur-[2px] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl text-white font-bold mb-4">Chess Tutor</h1>
            <p className="text-xl text-gray-200">Improve your chess skills with interactive practice</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {practiceCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <Link
                  key={index}
                  href={card.href}
                  className="group block bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-700/50 hover:bg-gray-800/90 hover:border-gray-600/70"
                >
                  <div className="p-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${card.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors">
                      {card.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
