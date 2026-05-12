import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";

export default function ReviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 w-fit">
          <ChevronLeft size={16} /><span className="ml-0.5">Home</span>
        </Link>
        <div className="text-center">
          <div className="w-16 h-16 rounded-lg bg-muted border flex items-center justify-center mx-auto mb-5">
            <FileText size={28} className="text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-medium text-foreground tracking-tight mb-2">Game Review</h1>
          <p className="text-sm text-muted-foreground mb-8">Review and analyze your completed games</p>
          <div className="panel p-8">
            <span className="badge-soon mb-3 mx-auto">Coming Soon</span>
            <p className="text-sm text-muted-foreground mt-3">
              Upload and review your games, get computer analysis, and identify areas for improvement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
