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
    // Get a random puzzle
    const puzzle = puzzlesData[Math.floor(Math.random() * puzzlesData.length)]
    setRandomPuzzle(puzzle)

    // Randomly choose between opening and trap
    const isOpening = Math.random() > 0.5
    setContentType(isOpening ? 'opening' : 'trap')
    
    if (isOpening) {
      const opening = openingsData[Math.floor(Math.random() * openingsData.length)]
      setRandomContent(opening)
    } else {
      const trap = trapsData[Math.floor(Math.random() * trapsData.length)]
      setRandomContent(trap)
    }
  }, [])

  return (
    <div className="space-y-6 p-0">
      {/* <h2 className="text-2xl font-bold text-white mb-6">Continue Learning</h2> */}
      
      {/* Continue Puzzle */}
      <div className="rounded-lg overflow-hidden items-start">
        <div className="p-0">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Continue Puzzle</h3>
          </div>
          
          {randomPuzzle && (
            <div className="space-y-6">
              <div className="flex justify-start items-start ">
                <ChessBoardPreview fen={randomPuzzle.fen} size={300} />
              </div>
              
              <div className="text-start space-y-2">
                <div className="flex justify-start space-x-2">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm border border-purple-500/30">
                    Rating: {randomPuzzle.rating}
                  </span>
                  <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-sm border border-gray-500/30">
                    {randomPuzzle.type.split(' ')[0]}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm mb-4">
                  Find the best move for the position
                </p>
                
                <Link
                  href="/puzzles"
                  className="inline-flex items-center space-x-2 mt-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  <Play className="w-4 h-4" />
                  <span>Solve Puzzle</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-[1px] my-4 w-full bg-gray-700/50 rounded-md"></div>

      {/* Continue Learning */}
      <div className="rounded-lg  overflow-hidden">
        <div className="p-0">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
              <BookOpen className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Continue Learning</h3>
          </div>
          
          {randomContent && (
            <div className="space-y-6">
              <div className="flex justify-start">
                <ChessBoardPreview fen={randomContent.fen} size={300} />
              </div>
              
              <div className="text-start space-y-2">
                <h4 className="text-lg font-semibold text-white">
                  {randomContent.name}
                </h4>
                
                <div className="flex justify-start space-x-2">
                  <span className={`px-2 py-1 rounded text-sm border ${
                    contentType === 'opening' 
                      ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                      : 'bg-red-500/20 text-red-300 border-red-500/30'
                  }`}>
                    {contentType === 'opening' ? 'Opening' : 'Trap'}
                  </span>
                  <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-sm border border-gray-500/30">
                    {randomContent.difficulty || 'Intermediate'}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm">
                  {randomContent.description || `Learn this ${contentType} to improve your game`}
                </p>
                
                <Link
                  href={contentType === 'opening' ? '/openings' : '/traps'}
                  className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Learn {contentType === 'opening' ? 'Opening' : 'Trap'}</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 