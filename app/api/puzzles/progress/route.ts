import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const progressSchema = z.object({
  puzzleId: z.string(),
  solved: z.boolean(),
  timeSpent: z.number().optional(),
  mistakes: z.number().int().min(0).optional(),
  puzzleRating: z.number().int().optional(),
})

const K_FACTOR = 24
const STARTING_RATING = 1200

interface RatingOutcome {
  previous: number
  new: number
  delta: number
  speedBonus: number
}

function computeRatingChange(args: {
  userRating: number
  puzzleRating: number
  solved: boolean
  mistakes: number
  timeSpent: number
}): RatingOutcome {
  const { userRating, puzzleRating, solved, mistakes, timeSpent } = args

  const expectedScore =
    1 / (1 + Math.pow(10, (puzzleRating - userRating) / 400))
  const mistakePenalty = Math.min(0.15 * mistakes, 0.6)
  const actualScore = solved ? Math.max(0, 1 - mistakePenalty) : 0

  let delta = Math.round(K_FACTOR * (actualScore - expectedScore))

  let speedBonus = 0
  if (solved && mistakes === 0 && timeSpent > 0 && timeSpent < 30) {
    speedBonus = Math.round((30 - timeSpent) / 3)
    delta += speedBonus
  }

  return {
    previous: userRating,
    new: userRating + delta,
    delta,
    speedBonus,
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { puzzleId, solved, timeSpent, mistakes, puzzleRating } =
      progressSchema.parse(body)

    // Upsert raw puzzle progress
    const userPuzzle = await prisma.userPuzzle.upsert({
      where: { userId_puzzleId: { userId, puzzleId } },
      update: {
        solved,
        attempts: { increment: 1 },
        timeSpent: timeSpent ? { increment: timeSpent } : undefined,
        lastAttempt: new Date(),
      },
      create: {
        userId,
        puzzleId,
        solved,
        attempts: 1,
        timeSpent: timeSpent || 0,
      },
    })

    // If we don't have enough info to compute rating, just record progress.
    const hasRatingInputs =
      typeof mistakes === 'number' && typeof puzzleRating === 'number'

    if (!hasRatingInputs) {
      // Legacy path: still bump totalPuzzlesSolved & totalTimeSpent on solve
      if (solved) {
        await prisma.userStats.upsert({
          where: { userId },
          update: {
            totalPuzzlesSolved: { increment: 1 },
            totalTimeSpent: timeSpent ? { increment: timeSpent } : undefined,
            lastActiveDate: new Date(),
          },
          create: {
            userId,
            totalPuzzlesSolved: 1,
            totalTimeSpent: timeSpent || 0,
            lastActiveDate: new Date(),
          },
        })
      }
      return NextResponse.json({ success: true, userPuzzle, rating: null, streak: null })
    }

    // Load (or seed) current stats so we can compute rating + streak
    const existingStats = await prisma.userStats.findUnique({ where: { userId } })
    const currentRating = existingStats?.puzzleRating ?? STARTING_RATING
    const currentStreak = existingStats?.currentStreak ?? 0
    const currentBestStreak = existingStats?.bestStreak ?? 0

    const ratingOutcome = computeRatingChange({
      userRating: currentRating,
      puzzleRating,
      solved,
      mistakes,
      timeSpent: timeSpent ?? 0,
    })

    const newStreak = solved ? currentStreak + 1 : 0
    const newBestStreak = Math.max(currentBestStreak, newStreak)

    const updatedStats = await prisma.userStats.upsert({
      where: { userId },
      update: {
        puzzleRating: ratingOutcome.new,
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        totalPuzzlesSolved: solved ? { increment: 1 } : undefined,
        totalTimeSpent: timeSpent ? { increment: timeSpent } : undefined,
        lastActiveDate: new Date(),
      },
      create: {
        userId,
        puzzleRating: ratingOutcome.new,
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        totalPuzzlesSolved: solved ? 1 : 0,
        totalTimeSpent: timeSpent || 0,
        lastActiveDate: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      userPuzzle,
      rating: ratingOutcome,
      streak: {
        current: updatedStats.currentStreak,
        best: updatedStats.bestStreak,
        broken: !solved,
      },
    })
  } catch (error) {
    console.error('Error updating puzzle progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const puzzleId = searchParams.get('puzzleId')

    if (puzzleId) {
      const progress = await prisma.userPuzzle.findUnique({
        where: {
          userId_puzzleId: { userId: session.user.id, puzzleId },
        },
      })
      return NextResponse.json({ progress })
    } else {
      const allProgress = await prisma.userPuzzle.findMany({
        where: { userId: session.user.id },
        orderBy: { lastAttempt: 'desc' },
      })
      return NextResponse.json({ progress: allProgress })
    }
  } catch (error) {
    console.error('Error fetching puzzle progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
