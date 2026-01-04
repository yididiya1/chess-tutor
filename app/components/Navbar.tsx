'use client'

import { useState } from 'react'
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, LogOut, ChevronDown, Sword, BookOpen, Zap, Shield, Crown } from "lucide-react"

export default function Navbar() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const navigationItems = [
    { name: 'Puzzles',   href: '/puzzles',    icon: Zap },
    { name: 'Openings',  href: '/openings',   icon: BookOpen },
    { name: 'Traps',     href: '/traps',       icon: Sword },
    { name: 'Middlegame',href: '/middlegame',  icon: Shield },
    { name: 'Endgame',   href: '/endgame',     icon: Crown },
  ]

  const userName   = session?.user?.name || session?.user?.email?.split('@')[0] || 'Player'
  const userImage  = session?.user?.image

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'linear-gradient(180deg, rgba(8,13,24,0.98) 0%, rgba(8,13,24,0.92) 100%)',
        borderBottom: '1px solid rgba(245,158,11,0.2)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.6), 0 1px 0 rgba(245,158,11,0.15)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* ── Logo ─────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              style={{
                background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                boxShadow: '0 0 14px rgba(245,158,11,0.4)',
              }}
            >
              <span className="text-[#080d18] font-bold text-xl select-none">♔</span>
            </div>
            <span
              className="text-xl font-cinzel font-bold tracking-wider hidden sm:block"
              style={{ color: '#f59e0b', textShadow: '0 0 18px rgba(245,158,11,0.35)' }}
            >
              Chess Tutor
            </span>
          </Link>

          {/* ── Desktop Nav Links ─────────────────────── */}
          <div className="hidden md:flex items-center gap-1 ml-8">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold font-rajdhani tracking-wide transition-all duration-200 group"
                  style={{ color: 'rgba(226,232,240,0.75)' }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = '#f59e0b'
                    el.style.background = 'rgba(245,158,11,0.08)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = 'rgba(226,232,240,0.75)'
                    el.style.background = 'transparent'
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* ── User Section ─────────────────────────── */}
          <div className="flex items-center gap-3">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full animate-pulse" style={{ background: 'rgba(245,158,11,0.2)' }} />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all duration-200"
                  style={{ border: '1px solid rgba(245,158,11,0.25)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.5)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.25)' }}
                >
                  <div className="w-7 h-7 relative rounded-full overflow-hidden ring-1 ring-[rgba(245,158,11,0.4)]">
                    {userImage ? (
                      <Image src={userImage} alt="avatar" width={28} height={28} className="rounded-full" />
                    ) : (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', color: '#080d18' }}
                      >
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-semibold font-rajdhani" style={{ color: '#e2e8f0' }}>
                    {userName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-xl py-1 z-50"
                    style={{
                      background: 'linear-gradient(180deg, #0f1629 0%, #0a1020 100%)',
                      border: '1px solid rgba(245,158,11,0.25)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
                    }}
                  >
                    <div className="px-4 py-2.5 text-xs font-rajdhani" style={{ color: 'rgba(226,232,240,0.5)', borderBottom: '1px solid rgba(245,158,11,0.1)' }}>
                      {session.user?.email}
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center w-full px-4 py-2.5 text-sm font-semibold font-rajdhani transition-all duration-200"
                      style={{ color: 'rgba(226,232,240,0.7)' }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.color = '#ef4444'
                        el.style.background = 'rgba(239,68,68,0.08)'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.color = 'rgba(226,232,240,0.7)'
                        el.style.background = 'transparent'
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="btn-gold text-sm font-cinzel"
              >
                Sign In
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 rounded-md transition-colors"
              style={{ color: '#f59e0b' }}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ───────────────────────────── */}
        {isMenuOpen && (
          <div
            className="md:hidden py-3 space-y-1"
            style={{ borderTop: '1px solid rgba(245,158,11,0.12)' }}
          >
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold font-rajdhani transition-all duration-200"
                  style={{ color: 'rgba(226,232,240,0.75)' }}
                  onClick={() => setIsMenuOpen(false)}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = '#f59e0b'
                    el.style.background = 'rgba(245,158,11,0.08)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = 'rgba(226,232,240,0.75)'
                    el.style.background = 'transparent'
                  }}
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