import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const openingProgressSchema = z.object({
  openingId: z.string(),
  learned: z.boolean().optional(),
  confidence: z.number().min(1).max(5).optional(),
})

export async function POST(request: NextRequest) {
  try {
    // For now, we'll use a hardcoded user ID until auth is fully working
    const userId = "temp-user-id"
    
    const body = await request.json()
    const { openingId, learned, confidence } = openingProgressSchema.parse(body)

    // Upsert user opening progress
    const userOpening = await prisma.userOpening.upsert({
      where: {
        userId_openingId: {
          userId,
          openingId,
        },
      },
      update: {
        learned: learned ?? undefined,
        confidence: confidence ?? undefined,
        timesPlayed: { increment: 1 },
        lastReviewed: new Date(),
      },
      create: {
        userId,
        openingId,
        learned: learned ?? false,
        confidence: confidence ?? 1,
        timesPlayed: 1,
      },
    })

    // Update user stats if opening was learned for the first time
    if (learned) {
      await prisma.userStats.upsert({
        where: { userId },
        update: {
          totalOpeningsLearned: { increment: 1 },
          lastActiveDate: new Date(),
        },
        create: {
          userId,
          totalOpeningsLearned: 1,
          lastActiveDate: new Date(),
        },
      })
    }

    return NextResponse.json({ success: true, userOpening })
  } catch (error) {
    console.error('Error updating opening progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // For now, we'll use a hardcoded user ID until auth is fully working
    const userId = "temp-user-id"

    const { searchParams } = new URL(request.url)
    const openingId = searchParams.get('openingId')

    if (openingId) {
      // Get progress for specific opening
      const progress = await prisma.userOpening.findUnique({
        where: {
          userId_openingId: {
            userId,
            openingId,
          },
        },
      })
      return NextResponse.json({ progress })
    } else {
      // Get all opening progress for user
      const allProgress = await prisma.userOpening.findMany({
        where: { userId },
        orderBy: { lastReviewed: 'desc' },
      })
      return NextResponse.json({ progress: allProgress })
    }
  } catch (error) {
    console.error('Error fetching opening progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 