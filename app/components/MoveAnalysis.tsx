"use client";

interface AnalysisLine {
  move: string;
  evaluation: number;
  pv: string[]; // Principal variation (sequence of moves)
  depth: number;
}

interface MoveAnalysisProps {
  analysisLines: AnalysisLine[];
  isAnalyzing: boolean;
  className?: string;
}

export default function MoveAnalysis({ analysisLines, isAnalyzing, className = "" }: MoveAnalysisProps) {
  const formatEvaluation = (eval_cp: number): string => {
    if (Math.abs(eval_cp) >= 1000) {
      return eval_cp > 0 ? "M" : "-M";
    }
    
    const pawns = eval_cp / 100;
    if (Math.abs(pawns) < 0.1) return "0.0";
    return pawns >= 0 ? `+${pawns.toFixed(1)}` : pawns.toFixed(1);
  };

  const formatPrincipalVariation = (pv: string[]): string => {
    return pv.slice(0, 8).join(" "); // Show first 8 moves
  };

  return (
    <div className={`bg-white border border-gray-300 rounded-lg shadow-sm ${className}`}>
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          Engine Analysis
          {isAnalyzing && (
            <div className="ml-2 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-sm text-blue-600">Analyzing...</span>
            </div>
          )}
        </h3>
      </div>
      
      <div className="p-4">
        {analysisLines.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">🤔</div>
            <p>No analysis available</p>
            <p className="text-sm">Make a move to start analysis</p>
          </div>
        ) : (
          <div className="space-y-3">
            {analysisLines.map((line, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border ${index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      index === 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      #{index + 1}
                    </span>
                    <span className="font-bold text-lg font-mono">
                      {line.move}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold font-mono ${
                      line.evaluation >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatEvaluation(line.evaluation)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Depth {line.depth}
                    </span>
                  </div>
                </div>
                
                {line.pv.length > 0 && (
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Variation: </span>
                    <span className="font-mono">{formatPrincipalVariation(line.pv)}</span>
                    {line.pv.length > 8 && <span className="text-gray-500">...</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="px-4 pb-4">
        <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
          <strong>Tips:</strong> The best move is highlighted in blue. 
          Positive values favor White, negative values favor Black.
        </div>
      </div>
    </div>
  );
} 