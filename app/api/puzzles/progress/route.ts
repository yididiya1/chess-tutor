import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const progressSchema = z.object({
  puzzleId: z.string(),
  solved: z.boolean(),
  timeSpent: z.number().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { puzzleId, solved, timeSpent } = progressSchema.parse(body)

    // Upsert user puzzle progress
    const userPuzzle = await prisma.userPuzzle.upsert({
      where: {
        userId_puzzleId: {
          userId: session.user.id,
          puzzleId,
        },
      },
      update: {
        solved,
        attempts: { increment: 1 },
        timeSpent: timeSpent ? { increment: timeSpent } : undefined,
        lastAttempt: new Date(),
      },
      create: {
        userId: session.user.id,
        puzzleId,
        solved,
        attempts: 1,
        timeSpent: timeSpent || 0,
      },
    })

    // Update user stats if puzzle was solved for the first time
    if (solved) {
      await prisma.userStats.upsert({
        where: { userId: session.user.id },
        update: {
          totalPuzzlesSolved: { increment: 1 },
          totalTimeSpent: timeSpent ? { increment: timeSpent } : undefined,
          lastActiveDate: new Date(),
        },
        create: {
          userId: session.user.id,
          totalPuzzlesSolved: 1,
          totalTimeSpent: timeSpent || 0,
          lastActiveDate: new Date(),
        },
      })
    }

    return NextResponse.json({ success: true, userPuzzle })
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
      // Get progress for specific puzzle
      const progress = await prisma.userPuzzle.findUnique({
        where: {
          userId_puzzleId: {
            userId: session.user.id,
            puzzleId,
          },
        },
      })
      return NextResponse.json({ progress })
    } else {
      // Get all puzzle progress for user
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