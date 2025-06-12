import { prisma } from './prisma'

export interface PuzzleProgress {
  puzzleId: string
  solved: boolean
  attempts: number
  timeSpent: number
  lastAttempt: Date
}

export interface OpeningProgress {
  openingId: string
  learned: boolean
  confidence: number
  timesPlayed: number
  lastReviewed: Date
}

interface UserStatsUpdate {
  totalPuzzlesSolved?: { increment: number }
  totalOpeningsLearned?: { increment: number }
  currentStreak?: number
  bestStreak?: number
  averageRating?: number
  totalTimeSpent?: { increment: number }
}

export class UserProgressTracker {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  // Puzzle progress methods
  async updatePuzzleProgress(puzzleId: string, solved: boolean, timeSpent: number = 0) {
    const userPuzzle = await prisma.userPuzzle.upsert({
      where: {
        userId_puzzleId: {
          userId: this.userId,
          puzzleId,
        },
      },
      update: {
        solved,
        attempts: { increment: 1 },
        timeSpent: { increment: timeSpent },
        lastAttempt: new Date(),
      },
      create: {
        userId: this.userId,
        puzzleId,
        solved,
        attempts: 1,
        timeSpent,
      },
    })

    // Update stats if solved for the first time
    if (solved && userPuzzle.attempts === 1) {
      await this.updateUserStats({
        totalPuzzlesSolved: { increment: 1 },
        totalTimeSpent: { increment: timeSpent },
      })
    }

    return userPuzzle
  }

  async getPuzzleProgress(puzzleId: string): Promise<PuzzleProgress | null> {
    const progress = await prisma.userPuzzle.findUnique({
      where: {
        userId_puzzleId: {
          userId: this.userId,
          puzzleId,
        },
      },
    })

    return progress ? {
      puzzleId: progress.puzzleId,
      solved: progress.solved,
      attempts: progress.attempts,
      timeSpent: progress.timeSpent,
      lastAttempt: progress.lastAttempt,
    } : null
  }

  // Opening progress methods
  async updateOpeningProgress(openingId: string, learned?: boolean, confidence?: number) {
    const userOpening = await prisma.userOpening.upsert({
      where: {
        userId_openingId: {
          userId: this.userId,
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
        userId: this.userId,
        openingId,
        learned: learned ?? false,
        confidence: confidence ?? 1,
        timesPlayed: 1,
      },
    })

    // Update stats if learned for the first time
    if (learned && !userOpening.learned) {
      await this.updateUserStats({
        totalOpeningsLearned: { increment: 1 },
      })
    }

    return userOpening
  }

  async getOpeningProgress(openingId: string): Promise<OpeningProgress | null> {
    const progress = await prisma.userOpening.findUnique({
      where: {
        userId_openingId: {
          userId: this.userId,
          openingId,
        },
      },
    })

    return progress ? {
      openingId: progress.openingId,
      learned: progress.learned,
      confidence: progress.confidence,
      timesPlayed: progress.timesPlayed,
      lastReviewed: progress.lastReviewed,
    } : null
  }

  // Stats methods
  async getUserStats() {
    return await prisma.userStats.findUnique({
      where: { userId: this.userId },
    })
  }

  private async updateUserStats(data: UserStatsUpdate) {
    // Separate update and create data since they have different structures
    const updateData = {
      ...data,
      lastActiveDate: new Date(),
    }
    
    const createData = {
      userId: this.userId,
      lastActiveDate: new Date(),
      totalPuzzlesSolved: data.totalPuzzlesSolved?.increment || 0,
      totalOpeningsLearned: data.totalOpeningsLearned?.increment || 0,
      currentStreak: data.currentStreak || 0,
      bestStreak: data.bestStreak || 0,
      averageRating: data.averageRating || 0,
      totalTimeSpent: data.totalTimeSpent?.increment || 0,
    }

    await prisma.userStats.upsert({
      where: { userId: this.userId },
      update: updateData,
      create: createData,
    })
  }

  // Get dashboard data
  async getDashboardData() {
    const [stats, recentPuzzles, recentOpenings] = await Promise.all([
      this.getUserStats(),
      prisma.userPuzzle.findMany({
        where: { userId: this.userId },
        orderBy: { lastAttempt: 'desc' },
        take: 5,
      }),
      prisma.userOpening.findMany({
        where: { userId: this.userId },
        orderBy: { lastReviewed: 'desc' },
        take: 5,
      }),
    ])

    return {
      stats: stats || {
        totalPuzzlesSolved: 0,
        totalOpeningsLearned: 0,
        currentStreak: 0,
        bestStreak: 0,
        averageRating: 0,
        totalTimeSpent: 0,
      },
      recentPuzzles,
      recentOpenings,
    }
  }
} 