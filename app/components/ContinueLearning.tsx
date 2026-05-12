'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Play, BookOpen, Target } from 'lucide-react'
import ChessBoardPreview from './ChessBoardPreview'
import puzzlesData from '@/data/puzzles.json'
import openingsData from '@/data/openings.json'
import trapsData from '@/data/traps.json'

interface Puzzle {
  fen: string
  moves: string
  rating: number
  type: string
}

interface Opening {
  id: number
  name: string
  moves: string[]
  fen: string
  difficulty: string
  description: string
}

interface Trap {
  id: number
  name: string
  moves: string[]
  fen: string
  difficulty: string
  description: string
}

export default function ContinueLearning() {
  const [randomPuzzle, setRandomPuzzle] = useState<Puzzle | null>(null)
  const [randomContent, setRandomContent] = useState<Opening | Trap | null>(null)
  const [contentType, setContentType] = useState<'opening' | 'trap'>('opening')

  useEffect(() => {
    const puzzle = puzzlesData[Math.floor(Math.random() * puzzlesData.length)]
    setRandomPuzzle(puzzle)

    const isOpening = Math.random() > 0.5
    setContentType(isOpening ? 'opening' : 'trap')

    if (isOpening) {
      setRandomContent(openingsData[Math.floor(Math.random() * openingsData.length)])
    } else {
      setRandomContent(trapsData[Math.floor(Math.random() * trapsData.length)])
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Continue Puzzle */}
      <div>
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-muted border flex items-center justify-center">
            <Target className="w-4 h-4 text-foreground" />
          </div>
          <h3 className="text-sm font-medium text-foreground">Continue Puzzle</h3>
        </div>

        {randomPuzzle && (
          <div className="space-y-3">
            <ChessBoardPreview fen={randomPuzzle.fen} size={245} />

            <div className="space-y-2">
              <div className="flex gap-1.5">
                <span className="px-2 py-0.5 bg-muted text-muted-foreground border rounded text-xs font-medium">
                  Rating: {randomPuzzle.rating}
                </span>
                <span className="px-2 py-0.5 bg-muted text-muted-foreground border rounded text-xs font-medium">
                  {randomPuzzle.type.split(' ')[0]}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">Find the best move for the position</p>

              <Link href="/puzzles" className="btn-primary text-xs w-fit">
                <Play className="w-3 h-3" />
                Solve Puzzle
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="divider" />

      {/* Continue Learning */}
      <div>
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-muted border flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-foreground" />
          </div>
          <h3 className="text-sm font-medium text-foreground">Continue Learning</h3>
        </div>

        {randomContent && (
          <div className="space-y-3">
            <ChessBoardPreview fen={randomContent.fen} size={245} />

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">{randomContent.name}</h4>

              <div className="flex gap-1.5">
                <span className="px-2 py-0.5 rounded text-xs font-medium border bg-muted text-muted-foreground">
                  {contentType === 'opening' ? 'Opening' : 'Trap'}
                </span>
                <span className="px-2 py-0.5 bg-muted text-muted-foreground border rounded text-xs font-medium">
                  {randomContent.difficulty || 'Intermediate'}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                {randomContent.description || `Learn this ${contentType} to improve your game`}
              </p>
              

              <Link
                href={contentType === 'opening' ? '/openings' : '/traps'}
                className="btn-primary text-xs w-fit"
              >
                <BookOpen className="w-3 h-3" />
                Learn {contentType === 'opening' ? 'Opening' : 'Trap'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
