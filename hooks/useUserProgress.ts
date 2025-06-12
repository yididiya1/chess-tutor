'use client'

import { useState, useCallback } from 'react'

interface PuzzleProgressData {
  puzzleId: string
  solved: boolean
  timeSpent?: number
}

interface OpeningProgressData {
  openingId: string
  learned?: boolean
  confidence?: number
}

export function useUserProgress() {
  const [isLoading, setIsLoading] = useState(false)

  const updatePuzzleProgress = useCallback(async (data: PuzzleProgressData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/puzzles/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update puzzle progress')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error updating puzzle progress:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateOpeningProgress = useCallback(async (data: OpeningProgressData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/openings/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update opening progress')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error updating opening progress:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getUserStats = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/users/stats')
      
      if (!response.ok) {
        throw new Error('Failed to fetch user stats')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching user stats:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getPuzzleProgress = useCallback(async (puzzleId: string) => {
    try {
      const response = await fetch(`/api/puzzles/progress?puzzleId=${puzzleId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch puzzle progress')
      }
      
      const data = await response.json()
      return data.progress
    } catch (error) {
      console.error('Error fetching puzzle progress:', error)
      return null
    }
  }, [])

  const getOpeningProgress = useCallback(async (openingId: string) => {
    try {
      const response = await fetch(`/api/openings/progress?openingId=${openingId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch opening progress')
      }
      
      const data = await response.json()
      return data.progress
    } catch (error) {
      console.error('Error fetching opening progress:', error)
      return null
    }
  }, [])

  return {
    updatePuzzleProgress,
    updateOpeningProgress,
    getUserStats,
    getPuzzleProgress,
    getOpeningProgress,
    isLoading,
  }
} 