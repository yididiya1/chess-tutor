import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AnalysisBoard from "../components/AnalysisBoard";

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground mr-6 transition-colors">
                <ChevronLeft size={20} />
                <span className="ml-1">Back to Home</span>
              </Link>
              <h1 className="text-2xl font-medium text-foreground tracking-tight">Chess Analysis Board</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-6">
        <AnalysisBoard />
      </div>
    </div>
  );
} 