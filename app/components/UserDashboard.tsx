'use client'

import { useState, useEffect } from 'react'
import { useUserProgress } from '@/hooks/useUserProgress'
import { Puzzle, BookOpen, Zap, TrendingUp, TrendingDown } from 'lucide-react'

interface UserStats {
  totalPuzzlesSolved: number
  totalOpeningsLearned: number
  currentStreak: number
  bestStreak: number
  averageRating: number
  totalTimeSpent: number
}

export default function UserDashboard() {
  const { getUserStats, isLoading } = useUserProgress()
  const [stats, setStats] = useState<UserStats | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUserStats()
        setStats(data.stats)
      } catch (error) {
        console.error('Failed to fetch user stats:', error)
      }
    }
    fetchStats()
  }, [getUserStats])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const getPercentageChange = (statName: string) => {
    const changes: Record<string, { value: number; isIncrease: boolean }> = {
      puzzles:  { value: 12.5, isIncrease: true },
      openings: { value: 8.3,  isIncrease: true },
      streak:   { value: 5.2,  isIncrease: false },
    }
    return changes[statName] ?? { value: 0, isIncrease: true }
  }

  if (isLoading && !stats) {
    return (
      <div className="panel p-5 animate-pulse">
        <div className="h-4 rounded bg-muted w-1/2 mb-5" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-lg mb-3 bg-muted/50" />
        ))}
      </div>
    )
  }

  const mainStats = [
    { label: 'Puzzles Solved',   value: stats?.totalPuzzlesSolved   ?? 0, icon: Puzzle,   stat: 'puzzles'  },
    { label: 'Openings Learned', value: stats?.totalOpeningsLearned ?? 0, icon: BookOpen, stat: 'openings' },
    { label: 'Current Streak',   value: stats?.currentStreak        ?? 0, suffix: 'd', icon: Zap, stat: 'streak' },
  ]

  return (
    <div className="panel p-5">
      <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Your Progress</h2>

      <div className="flex flex-col gap-2.5 mb-4">
        {mainStats.map((s) => {
          const Icon = s.icon
          const change = getPercentageChange(s.stat)
          return (
            <div key={s.label} className="flex items-center justify-between p-3.5 rounded-lg bg-muted/50 border">
              <div>
                <p className="text-2xl font-medium leading-none mb-0.5 text-foreground">
                  {s.value}{s.suffix ?? ''}
                </p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {change.isIncrease
                    ? <TrendingUp className="w-3 h-3 text-success" />
                    : <TrendingDown className="w-3 h-3 text-destructive" />
                  }
                  <span className={`text-xs ${change.isIncrease ? 'text-success' : 'text-destructive'}`}>
                    {change.value}%
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-lg bg-background border flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          )
        })}
      </div>

      <div className="divider mb-4" />

      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-lg bg-muted/50 border text-center">
          <p className="text-xl font-medium text-foreground">{stats?.bestStreak ?? 0}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Best Streak</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50 border text-center">
          <p className="text-xl font-medium text-foreground">{formatTime(stats?.totalTimeSpent ?? 0)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Time Spent</p>
        </div>
      </div>
    </div>
  )
}
