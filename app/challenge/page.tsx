import Link from "next/link";
import { ChevronLeft, Users } from "lucide-react";

export default function ChallengePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 w-fit">
          <ChevronLeft size={16} /><span className="ml-0.5">Home</span>
        </Link>
        <div className="text-center">
          <div className="w-16 h-16 rounded-lg bg-muted border flex items-center justify-center mx-auto mb-5">
            <Users size={28} className="text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-medium text-foreground tracking-tight mb-2">Puzzle Challenge</h1>
          <p className="text-sm text-muted-foreground mb-8">Compete with friends in puzzle solving challenges</p>
          <div className="panel p-8">
            <span className="badge-soon mb-3 mx-auto">Coming Soon</span>
            <p className="text-sm text-muted-foreground mt-3">
              Challenge friends to puzzle-solving competitions, track scores, and compete in real-time puzzle battles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
