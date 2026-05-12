"use client";

import { useEffect, useState } from "react";

interface EvaluationBarProps {
  evaluation: number; // in centipawns
  className?: string;
}

export default function EvaluationBar({ evaluation, className = "" }: EvaluationBarProps) {
  const [displayEval, setDisplayEval] = useState(0);

  useEffect(() => {
    // Smooth transition for evaluation changes
    const timer = setTimeout(() => {
      setDisplayEval(evaluation);
    }, 100);
    return () => clearTimeout(timer);
  }, [evaluation]);

  // Convert centipawns to a reasonable scale
  // Clamp evaluation between -1000 and +1000 centipawns for display
  const clampedEval = Math.max(-1000, Math.min(1000, displayEval));
  
  // Convert to percentage for white advantage (0-100, where 50 is equal)
  // Positive evaluation = more white (top), Negative evaluation = more black (bottom)
  const whitePercentage = 50 + (clampedEval / 1000) * 50;
  const blackPercentage = 100 - whitePercentage;
  
  // Format evaluation for display
  const formatEvaluation = (eval_cp: number): string => {
    if (Math.abs(eval_cp) >= 1000) {
      // Show as mate if evaluation is too high
      return eval_cp > 0 ? "M" : "-M";
    }
    
    const pawns = eval_cp / 100;
    if (Math.abs(pawns) < 0.1) return "0.0";
    return pawns >= 0 ? `+${pawns.toFixed(1)}` : pawns.toFixed(1);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="text-xs font-mono font-medium mb-1 text-foreground">
        {formatEvaluation(displayEval)}
      </div>

      <div
        className="relative overflow-hidden rounded-md border bg-muted"
        style={{
          width: 28,
          height: 384,
        }}
      >
        {/* White advantage (top, light) */}
        <div
          className="absolute top-0 left-0 w-full transition-all duration-300 ease-out"
          style={{ height: `${whitePercentage}%`, background: '#ede9dd' }}
        />
        {/* Black advantage (bottom, dark) */}
        <div
          className="absolute bottom-0 left-0 w-full transition-all duration-300 ease-out"
          style={{ height: `${blackPercentage}%`, background: '#3a3a3a' }}
        />
        {/* Centre line */}
        <div className="absolute top-1/2 left-0 w-full bg-foreground/40" style={{ height: 1, transform: 'translateY(-0.5px)' }} />
      </div>

      <div className="text-xs mt-1 text-muted-foreground">
        {displayEval >= 0 ? 'White' : 'Black'}
      </div>
    </div>
  );
} 