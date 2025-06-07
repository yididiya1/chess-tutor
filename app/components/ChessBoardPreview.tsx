"use client";

import { Chessboard } from "react-chessboard";
import { useEffect, useState } from "react";

interface ChessBoardPreviewProps {
  fen: string;
  size?: number;
}

export default function ChessBoardPreview({ fen, size }: ChessBoardPreviewProps) {
  const [boardWidth, setBoardWidth] = useState(size || 250);

  useEffect(() => {
    const updateBoardWidth = () => {
      if (size) {
        setBoardWidth(size);
      } else {
        // Make it responsive based on container width
        const containerWidth = Math.min(window.innerWidth - 100, 300);
        setBoardWidth(containerWidth);
      }
    };

    updateBoardWidth();
    window.addEventListener('resize', updateBoardWidth);
    return () => window.removeEventListener('resize', updateBoardWidth);
  }, [size]);

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-sm">
        <Chessboard
          position={fen}
          boardWidth={boardWidth}
          arePiecesDraggable={false}
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          customDarkSquareStyle={{ backgroundColor: "#779952" }}
          customLightSquareStyle={{ backgroundColor: "#edeed1" }}
        />
      </div>
    </div>
  );
} 