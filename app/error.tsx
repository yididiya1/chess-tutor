'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="panel max-w-xl w-full p-6">
        <h2 className="text-lg font-medium text-foreground mb-2">Something went wrong</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {error.message || 'An unexpected error occurred.'}
        </p>
        {error.stack && (
          <pre className="text-xs font-mono p-3 rounded bg-muted text-muted-foreground border overflow-x-auto whitespace-pre-wrap mb-4">
            {error.stack}
          </pre>
        )}
        <button onClick={reset} className="btn-primary text-sm">
          Try again
        </button>
      </div>
    </div>
  )
}
