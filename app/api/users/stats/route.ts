import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import puzzlesData from '@/data/puzzles.json'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get user stats
    const stats = await prisma.userStats.findUnique({
      where: { userId },
    })

    // Get recent puzzle activity
    const recentPuzzles = await prisma.userPuzzle.findMany({
      where: { userId },
      orderBy: { lastAttempt: 'desc' },
      take: 10,
    })

    // Enhance recent puzzles with FEN data from puzzles.json
    const recentPuzzlesWithFen = recentPuzzles.map(userPuzzle => {
      // Find the puzzle data by matching the FEN (which is used as puzzleId)
      const puzzleData = puzzlesData.find(puzzle => puzzle.fen === userPuzzle.puzzleId)
      
      return {
        ...userPuzzle,
        fen: puzzleData?.fen || null, // Include FEN for chess board preview
        rating: puzzleData?.rating || null,
        type: puzzleData?.type || null,
      }
    })

    // Get opening progress summary
    const openingsLearned = await prisma.userOpening.count({
      where: { 
        userId,
        learned: true 
      },
    })

    const puzzlesSolved = await prisma.userPuzzle.count({
      where: { 
        userId,
        solved: true 
      },
    })

    return NextResponse.json({
      stats: stats || {
        totalPuzzlesSolved: 0,
        totalOpeningsLearned: 0,
        currentStreak: 0,
        bestStreak: 0,
        averageRating: 0,
        totalTimeSpent: 0,
      },
      summary: {
        puzzlesSolved,
        openingsLearned,
        recentActivity: recentPuzzles.length,
      },
      recentPuzzles: recentPuzzlesWithFen,
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 