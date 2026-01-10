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
      <div
        className="p-5 rounded-xl animate-pulse"
        style={{ background: 'linear-gradient(180deg,#0f1629 0%,#0a1020 100%)', border: '1px solid rgba(245,158,11,0.12)' }}
      >
        <div className="h-4 rounded w-1/2 mb-5" style={{ background: 'rgba(245,158,11,0.1)' }} />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-xl mb-3" style={{ background: 'rgba(245,158,11,0.06)' }} />
        ))}
      </div>
    )
  }

  const mainStats = [
    { label: 'Puzzles Solved',    value: stats?.totalPuzzlesSolved ?? 0, icon: Puzzle,   color: '#f59e0b', stat: 'puzzles'  },
    { label: 'Openings Learned',  value: stats?.totalOpeningsLearned ?? 0, icon: BookOpen, color: '#06b6d4', stat: 'openings' },
    { label: 'Current Streak',    value: stats?.currentStreak ?? 0, suffix: 'd', icon: Zap, color: '#10b981', stat: 'streak' },
  ]

  return (
    <div
      className="p-5 rounded-xl"
      style={{ background: 'linear-gradient(180deg,#0f1629 0%,#0a1020 100%)', border: '1px solid rgba(245,158,11,0.15)' }}
    >
      <h2
        className="text-sm font-cinzel font-bold mb-5 tracking-widest uppercase"
        style={{ color: '#f59e0b', textShadow: '0 0 12px rgba(245,158,11,0.3)' }}
      >
        Your Progress
      </h2>

      <div className="flex flex-col gap-3 mb-4">
        {mainStats.map((s) => {
          const Icon = s.icon
          const change = getPercentageChange(s.stat)
          return (
            <div
              key={s.label}
              className="flex items-center justify-between p-3.5 rounded-xl"
              style={{ background: `${s.color}09`, border: `1px solid ${s.color}22` }}
            >
              <div>
                <p className="text-2xl font-cinzel font-bold leading-none mb-0.5" style={{ color: s.color }}>
                  {s.value}{s.suffix ?? ''}
                </p>
                <p className="text-xs font-rajdhani font-semibold" style={{ color: 'rgba(226,232,240,0.5)' }}>
                  {s.label}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  {change.isIncrease
                    ? <TrendingUp className="w-3 h-3 text-emerald-400" />
                    : <TrendingDown className="w-3 h-3 text-red-400" />
                  }
                  <span className={`text-xs font-rajdhani ${change.isIncrease ? 'text-emerald-400' : 'text-red-400'}`}>
                    {change.value}%
                  </span>
                  <span className="text-xs font-rajdhani" style={{ color: 'rgba(226,232,240,0.28)' }}>vs last month</span>
                </div>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}
              >
                <Icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="divider-gold mb-4" />

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.14)' }}>
          <p className="text-xl font-cinzel font-bold" style={{ color: '#f59e0b' }}>{stats?.bestStreak ?? 0}</p>
          <p className="text-xs font-rajdhani mt-0.5" style={{ color: 'rgba(226,232,240,0.4)' }}>Best Streak</p>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.14)' }}>
          <p className="text-xl font-cinzel font-bold" style={{ color: '#06b6d4' }}>{formatTime(stats?.totalTimeSpent ?? 0)}</p>
          <p className="text-xs font-rajdhani mt-0.5" style={{ color: 'rgba(226,232,240,0.4)' }}>Time Spent</p>
        </div>
      </div>
    </div>
  )
}