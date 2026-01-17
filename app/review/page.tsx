import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";

export default function ReviewPage() {
  return (
    <div className="min-h-screen chess-bg-pattern" style={{ background: "#080d18" }}>
      <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="flex items-center text-sm mb-10 transition-colors w-fit"
            style={{ color: "rgba(245,158,11,0.7)" }}
          >
            <ChevronLeft size={18} />
            <span className="ml-1">Back to Home</span>
          </Link>

          <div className="text-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)" }}
            >
              <FileText size={40} style={{ color: "#8b5cf6" }} />
            </div>
            <h1 className="text-4xl font-cinzel font-bold mb-4" style={{ color: "#f0e6c8" }}>Game Review</h1>
            <p className="text-base font-rajdhani mb-8" style={{ color: "rgba(226,232,240,0.5)" }}>
              Review and analyze your completed games
            </p>
            <div
              className="p-8 rounded-xl"
              style={{
                background: "linear-gradient(135deg, #0a0f1e 0%, #0d1426 100%)",
                border: "1px solid rgba(139,92,246,0.2)",
              }}
            >
              <h2 className="text-2xl font-cinzel font-semibold mb-3" style={{ color: "#8b5cf6" }}>Coming Soon</h2>
              <p className="font-rajdhani" style={{ color: "rgba(226,232,240,0.45)" }}>
                Upload and review your games, get computer analysis, and identify areas for improvement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 