'use client'

import { useSession } from "next-auth/react"
import Image from "next/image"

export default function UserWelcome() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl text-gray-300">?</span>
        </div>
        <h1 className="text-3xl text-white font-bold mb-2">Welcome to Chess Tutor</h1>
        <p className="text-lg text-gray-300">Please sign in to track your progress</p>
      </div>
    )
  }

  const userName = session.user?.name || session.user?.email?.split('@')[0] || 'Chess Player'
  const userImage = session.user?.image

  return (
    <div className="text-center mb-12 flex justify-start space-x-6">
      <div className="w-20 h-20  mb-4 relative">
        {userImage ? (
          <Image
            src={userImage || '/images/deafult.png'}
            alt="User avatar"
            width={80}
            height={80}
            className="rounded-full border-2 border-blue-400"
          />
        ) : (
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-start items-start">
      <h1 className="text-3xl text-white font-bold mb-2">
        Welcome back, {userName}!
      </h1>
      <p className="text-lg text-gray-300">Ready to improve your chess skills?</p>
      </div>
      
    </div>
  )
} 