import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AnalysisBoard from "../components/AnalysisBoard";

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-6">
                <ChevronLeft size={20} />
                <span className="ml-1">Back to Home</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Chess Analysis Board</h1>
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