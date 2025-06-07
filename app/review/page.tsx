import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";

export default function ReviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ChevronLeft size={20} />
          <span className="ml-1">Back to Home</span>
        </Link>
        
        <div className="text-center">
          <div className="bg-teal-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText size={48} className="text-teal-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Game Review</h1>
          <p className="text-xl text-gray-600 mb-8">
            Review and analyze your completed games
          </p>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Coming Soon!</h2>
            <p className="text-gray-600">
              This section will allow you to upload and review your games, 
              get computer analysis, and identify areas for improvement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 