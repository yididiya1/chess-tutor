'use client'

import { useSession } from "next-auth/react"
import Image from "next/image"

export default function UserWelcome() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-muted border rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl text-muted-foreground">?</span>
        </div>
        <h1 className="text-3xl text-foreground font-medium mb-2 tracking-tight">Welcome to Chess Tutor</h1>
        <p className="text-lg text-muted-foreground">Please sign in to track your progress</p>
      </div>
    )
  }

  const userName = session.user?.name || session.user?.email?.split('@')[0] || 'Chess Player'
  const userImage = session.user?.image

  return (
    <div className="mb-12 flex justify-start space-x-6">
      <div className="w-20 h-20 mb-4 relative">
        {userImage ? (
          <Image
            src={userImage || '/images/deafult.png'}
            alt="User avatar"
            width={80}
            height={80}
            className="rounded-full border"
          />
        ) : (
          <div className="w-20 h-20 bg-muted border rounded-full flex items-center justify-center">
            <span className="text-2xl font-medium text-foreground">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-start items-start">
        <h1 className="text-3xl text-foreground font-medium mb-2 tracking-tight">
          Welcome back, {userName}!
        </h1>
        <p className="text-lg text-muted-foreground">Ready to improve your chess skills?</p>
      </div>
    </div>
  )
}