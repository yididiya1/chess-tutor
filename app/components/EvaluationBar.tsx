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
    <div className={`flex flex-col ${className}`}>
      {/* Evaluation value display */}
      <div className="text-center text-sm font-mono font-bold text-gray-800 mb-1">
        {formatEvaluation(displayEval)}
      </div>
      
      {/* Evaluation bar */}
      <div className="relative w-8 h-96 bg-gray-300 border border-gray-400 overflow-hidden">
        {/* White advantage area (top) - grows when evaluation is positive */}
        <div 
          className="absolute top-0 left-0 w-full bg-white transition-all duration-300 ease-out"
          style={{ height: `${whitePercentage}%` }}
        />
        
        {/* Black advantage area (bottom) - grows when evaluation is negative */}
        <div 
          className="absolute bottom-0 left-0 w-full bg-gray-900 transition-all duration-300 ease-out"
          style={{ height: `${blackPercentage}%` }}
        />
        
        {/* Center line for equal position */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-600 transform -translate-y-0.5" />
        
        {/* Evaluation markers */}
        <div className="absolute inset-0 flex flex-col justify-between py-2">
          <div className="text-xs font-bold text-gray-700 text-center">+</div>
          <div className="text-xs font-bold text-white text-center">-</div>
        </div>
      </div>
      
      {/* Side to move indicator */}
      <div className="text-center text-xs text-gray-600 mt-1">
        {displayEval >= 0 ? "White" : "Black"}
      </div>
    </div>
  );
} 