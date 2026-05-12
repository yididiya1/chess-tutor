'use client'

import { signIn, signOut, useSession } from "next-auth/react"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="px-4 py-2 bg-muted rounded-lg animate-pulse text-muted-foreground">
        Loading…
      </div>
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-foreground">
          Welcome, {session.user?.name || session.user?.email}!
        </div>
        <button
          onClick={() => signOut()}
          className="btn-outline"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="btn-primary"
    >
      Sign In with Google
    </button>
  )
} 