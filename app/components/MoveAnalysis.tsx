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
    <div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1426 100%)',
        border: '1px solid rgba(245,158,11,0.15)',
      }}
    >
      <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(245,158,11,0.12)' }}>
        <h3 className="text-sm font-cinzel font-semibold uppercase tracking-widest flex items-center gap-2" style={{ color: 'rgba(245,158,11,0.7)' }}>
          Engine Analysis
          {isAnalyzing && (
            <>
              <div className="animate-spin rounded-full h-3 w-3" style={{ borderBottom: '2px solid #06b6d4', borderTop: '2px solid transparent', borderLeft: '2px solid transparent', borderRight: '2px solid transparent' }}></div>
              <span className="text-xs font-rajdhani font-normal" style={{ color: '#06b6d4' }}>Analyzing…</span>
            </>
          )}
        </h3>
      </div>

      <div className="p-4">
        {analysisLines.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🤔</div>
            <p className="text-sm font-rajdhani" style={{ color: 'rgba(226,232,240,0.4)' }}>No analysis available</p>
            <p className="text-xs font-rajdhani mt-1" style={{ color: 'rgba(226,232,240,0.25)' }}>Make a move to start analysis</p>
          </div>
        ) : (
          <div className="space-y-2">
            {analysisLines.map((line, index) => (
              <div
                key={index}
                className="p-3 rounded-lg"
                style={{
                  background: index === 0 ? 'rgba(6,182,212,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${index === 0 ? 'rgba(6,182,212,0.25)' : 'rgba(245,158,11,0.1)'}`,
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-cinzel font-semibold"
                      style={{
                        background: index === 0 ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.06)',
                        color: index === 0 ? '#06b6d4' : 'rgba(226,232,240,0.45)',
                      }}
                    >
                      #{index + 1}
                    </span>
                    <span className="font-bold font-mono text-base" style={{ color: '#f0e6c8' }}>{line.move}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-sm" style={{ color: line.evaluation >= 0 ? '#10b981' : '#ef4444' }}>
                      {formatEvaluation(line.evaluation)}
                    </span>
                    <span className="text-xs font-rajdhani" style={{ color: 'rgba(226,232,240,0.3)' }}>d{line.depth}</span>
                  </div>
                </div>
                {line.pv.length > 0 && (
                  <div className="text-xs font-mono" style={{ color: 'rgba(226,232,240,0.35)' }}>
                    {formatPrincipalVariation(line.pv)}{line.pv.length > 8 && '…'}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="text-xs font-rajdhani p-2 rounded" style={{ background: 'rgba(245,158,11,0.06)', color: 'rgba(226,232,240,0.35)', border: '1px solid rgba(245,158,11,0.1)' }}>
          Positive values favour White · Negative values favour Black
        </div>
      </div>
    </div>
  );
} 