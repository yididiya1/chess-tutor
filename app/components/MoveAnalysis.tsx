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
    <div className={`panel overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b">
        <h3 className="text-sm font-medium uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
          Engine Analysis
          {isAnalyzing && (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary border-t-transparent" />
              <span className="text-xs font-normal text-muted-foreground">Analyzing…</span>
            </>
          )}
        </h3>
      </div>

      <div className="p-4">
        {analysisLines.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No analysis available</p>
            <p className="text-xs mt-1 text-muted-foreground/70">Make a move to start analysis</p>
          </div>
        ) : (
          <div className="space-y-2">
            {analysisLines.map((line, index) => (
              <div
                key={index}
                className={`p-3 rounded-md border ${
                  index === 0 ? 'bg-muted border-foreground/20' : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${
                      index === 0 ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                    }`}>
                      #{index + 1}
                    </span>
                    <span className="font-medium font-mono text-base text-foreground">{line.move}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium font-mono text-sm ${
                      line.evaluation >= 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {formatEvaluation(line.evaluation)}
                    </span>
                    <span className="text-xs text-muted-foreground">d{line.depth}</span>
                  </div>
                </div>
                {line.pv.length > 0 && (
                  <div className="text-xs font-mono text-muted-foreground">
                    {formatPrincipalVariation(line.pv)}{line.pv.length > 8 && '…'}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="text-xs p-2 rounded bg-muted text-muted-foreground border">
          Positive values favour White · Negative values favour Black
        </div>
      </div>
    </div>
  );
} 