'use client'

import { useState } from 'react'
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, LogOut, ChevronDown, Sword, BookOpen, Zap, Shield, Crown, Sun, Moon } from "lucide-react"
import { useTheme } from "../contexts/ThemeContext"

export default function Navbar() {
  const { data: session, status } = useSession()
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const navigationItems = [
    { name: 'Puzzles',    href: '/puzzles',    icon: Zap },
    { name: 'Openings',   href: '/openings',   icon: BookOpen },
    { name: 'Traps',      href: '/traps',      icon: Sword },
    { name: 'Middlegame', href: '/middlegame', icon: Shield },
    { name: 'Endgame',    href: '/endgame',    icon: Crown },
  ]

  const userName  = session?.user?.name || session?.user?.email?.split('@')[0] || 'Player'
  const userImage = session?.user?.image

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <span className="text-background font-medium text-base select-none">♔</span>
            </div>
            <span className="text-base font-medium text-foreground tracking-tight hidden sm:block">
              Chess Tutor
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 ml-8">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Section */}
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border hover:bg-muted transition-colors duration-150"
                >
                  <div className="w-6 h-6 relative rounded-full overflow-hidden">
                    {userImage ? (
                      <Image src={userImage} alt="avatar" width={24} height={24} className="rounded-full" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center font-medium text-xs text-background">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-foreground">{userName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-popover border py-1 z-50">
                    <div className="px-4 py-2.5 text-xs text-muted-foreground border-b">
                      {session.user?.email}
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-muted transition-colors duration-150"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => signIn('google')} className="btn-primary text-sm">
                Sign In
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 space-y-1 border-t">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
