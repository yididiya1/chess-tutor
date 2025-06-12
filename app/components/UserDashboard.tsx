'use client'

import { useState, useEffect } from 'react'
import { useUserProgress } from '@/hooks/useUserProgress'
import { Puzzle, BookOpen, Zap, TrendingUp, TrendingDown } from 'lucide-react'
import Image from 'next/image'

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
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  // Simulate percentage changes (in a real app, this would come from historical data)
  const getPercentageChange = (statName: string) => {
    const changes = {
      puzzles: { value: 12.5, isIncrease: true },
      openings: { value: 8.3, isIncrease: true },
      streak: { value: 5.2, isIncrease: false }
    }
    
    switch (statName) {
      case 'puzzles':
        return changes.puzzles
      case 'openings':
        return changes.openings
      case 'streak':
        return changes.streak
      default:
        return { value: 0, isIncrease: true }
    }
  }

  if (isLoading && !stats) {
    return (
      <div className="p-6 bg-[#1f1f1f] backdrop-blur-sm rounded-lg shadow-md border border-gray-700/50">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700/50 rounded w-1/3"></div>
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-700/50 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-[#1f1f1f] backdrop-blur-sm rounded-lg shadow-md border border-gray-700/50">
      <h2 className="text-xl font-bold text-white mb-6">Your Progress</h2>
      
      {/* Main Stats - Logo on Right with Percentage Change */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="bg-gray-800/60 backdrop-blur-sm p-4 rounded-lg border border-gray-600/30">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-3xl font-bold text-white mb-2">
                {stats?.totalPuzzlesSolved || 0}
              </p>
              <h3 className="text-lg font-light text-white mb-1">Puzzles Solved</h3>
              <div className="flex items-center space-x-1">
                {getPercentageChange('puzzles').isIncrease ? (
                  <TrendingUp className="w-3 h-3 text-green-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                )}
                <span className={`text-xs ${getPercentageChange('puzzles').isIncrease ? 'text-green-400' : 'text-red-400'}`}>
                  {getPercentageChange('puzzles').value}%   <span className="text-xs text-gray-400"> &nbsp; Since last month</span>
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                <Puzzle className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/60 backdrop-blur-sm p-4 rounded-lg border border-gray-600/30">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-3xl font-bold text-white mb-1">
                {stats?.totalOpeningsLearned || 0}
              </p>
              <h3 className="text-md font-light text-white mb-1">Openings Learned</h3>
              <div className="flex items-center space-x-1">
                {getPercentageChange('openings').isIncrease ? (
                  <TrendingUp className="w-3 h-3 text-green-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                )}
                <span className={`text-xs ${getPercentageChange('openings').isIncrease ? 'text-green-400' : 'text-red-400'}`}>
                  {getPercentageChange('openings').value}% <span className="text-xs text-gray-400"> &nbsp; Since last month</span>
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                <BookOpen className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/60 backdrop-blur-sm p-4 rounded-lg border border-gray-600/30">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-3xl font-bold text-white mb-1">
                {stats?.currentStreak || 0}
              </p>
              <h3 className="text-md font-light text-white mb-1">Current Streak</h3>
              <div className="flex items-center space-x-1">
                {getPercentageChange('streak').isIncrease ? (
                  <TrendingUp className="w-3 h-3 text-green-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                )}
                <span className={`text-xs ${getPercentageChange('streak').isIncrease ? 'text-green-400' : 'text-red-400'}`}>
                  {getPercentageChange('streak').value}% <span className="text-xs text-gray-400"> &nbsp; Since last month</span>
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats - Vertical Layout with Logo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-lg border border-gray-600/30 text-center">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
            {/* <Flame className="w-10 h-10 text-orange-400" /> */}
            <Image 
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD4UlEQVR4nO1YWWxMURj+KqWmaq2qrQwvZM65tQxRS2yh4oG0qCUeLI+eeLMkhIgHggiC8MCLRyKxBInlgXrwKCTmnDZqqSKolC6iv/yztffOvTO33JlOk/mSL5ncnHvP953z///55wA55JBDDt1BQD8t0aAljr6cimL0RSiBn1qClMBXJbDz4SLko6/g9XSUsHgTBZ7qACagL0AFsCnBQMTE9zoDNch2KIF7tgY4pCQ6tcQeZCtCAvOcxJuMCBwnIA/ZhPqJGKgkXroxEOXlrEpuJXCiB+JjIXUJ2QBtYJmS+NNTAzrC3b0qvn4a/Fri8z+Kp2hib+4V8a+mYLCWePGv4nWXiVZlIJjxlkFJ3Phf8bqrMr16H0Rhxgxwr5NKVH15P/q+rJi04drE8YyIVwFscSPo3ewCog2T6ceKEncmBH5rA0ZaxdcHMF1LtLkx0Lx8ZNhA2ERlibtwEriVNvGN5Rjk9rB6MyOfOtdPihtgfl063JWJkIGZaTGgJC66EVBn5FHrqrEm8TE2LShyY+KK5+JDAkvcVpTmyq7QsZJ35W1wQKpkbuHd9tSAFnjuRvy3pSMcxcfYXjWe6srzUuXCWs/EhwQWuxHPMZ5KfDwflqTMh5OeGdAC51OJ/7J4qGvxsVB6MyM/2TefeGaAT8lk4j8vHNIj8TE2V45MZqDBSwMtThN9mONLKJdxbvMTnSkm2mhv4E+NP1yxHBL5l2cGtES7U7nsqC5zXuUjo4geF0RMOIxpmu9YVtu8MyDwyTZ0FiUJnR1lRPd9EQPMY/altWVlqdMOfPTMgJJ4ZjdJ2+px9uK3TyS6XdglnvmogGhX4vjfayakP4m1wDm7STprbGJ/i5/oepFZfIz8fJP5nc6aSfY7IHHGSwNr7SbhJDSJZ3FXB9uLj3HfGHMir/PbGghJVHlmoKECPr6Ysk6SkMCHo0mbjFfM50VHdZld/H/jWw54CS1w0DoR9/kmA06h0503C03v/LBps5XEfniNFwEUcWXoPlFjhVkMPRiY2gCP6fbOhwqftQf6xP+1kQ5oie3W1TK1zW524FpRfHzbqnGJq29ga1rEO1Ukbo3jyXy4NLWBQ6Xx5H1raauVwGmkG8+D6K8k7praiQpfxAS3DBeHOYu/MDw8hsUnhI7EHf42MgG+09QCp0w7MWsAta6OhtO+0URXhxDd8xHd9UV+742UTw65hmB/a9xfyJj4hJywtBmNcwvDlaWjqix8SDH5Nz+zrroS+Mg3HOhNhG/nuMTanBNO5DqvJA5wZUOWXa9XK4mzSqBWCzRFu9j28EoL1HJ7wCes54dUDjnkgD6Lvx298WvZ7Gr5AAAAAElFTkSuQmCC" 
              alt="Fire streak icon" 
              width={50}
              height={50}
              
            />
          </div>
          <h3 className="text-md font-medium text-white mb-1">Best Streak</h3>
          <p className="text-xl font-bold text-white">
            {stats?.bestStreak || 0} days
          </p>
        </div>
        
        <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-lg border border-gray-600/30 text-center">
          <div className="w-10 h-10  rounded-lg flex items-center justify-center   mx-auto mb-3">
            <Image width={50} height={50} src="data:image/png;base64,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" alt="time-machine--v1"></Image>
          </div>
          <h3 className="text-md font-medium text-white mb-1">Time Spent</h3>
          <p className="text-xl font-bold text-white">
            {formatTime(stats?.totalTimeSpent || 0)}
          </p>
        </div>
      </div>
    </div>
  )
} 