"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { ChevronLeft, Filter, SkipForward, ArrowRight, CheckCircle2, List, Flame, XCircle } from "lucide-react";
import Link from "next/link";
import ChessBoard from "../components/ChessBoard";
import type { PuzzleRatingOutcome, PuzzleStreakOutcome } from "@/hooks/useUserProgress";
import puzzlesData from "../../data/puzzles.json";

interface Puzzle {
  fen: string;
  moves: string;
  rating: number;
  type: string;
}

interface PuzzleProgressRow {
  puzzleId: string;
  solved: boolean;
  lastAttempt: string;
}

const allPuzzles = puzzlesData as Puzzle[];
const PUZZLE_TYPES = ["All", "Crushing", "Advantage", "Opening", "Middlegame", "Endgame"];

export default function PuzzlesPage() {
  const { data: session, status } = useSession();
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [lastAttemptedId, setLastAttemptedId] = useState<string | null>(null);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [currentFen, setCurrentFen] = useState<string | null>(null);
  const [filters, setFilters] = useState({ type: "All", minRating: 800, maxRating: 2400 });
  const [showFilters, setShowFilters] = useState(false);
  const [showBrowse, setShowBrowse] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [lastFailOutcome, setLastFailOutcome] = useState<{
    rating: PuzzleRatingOutcome | null;
    streak: PuzzleStreakOutcome | null;
  } | null>(null);

  // Fetch user progress on mount / when session resolves
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      setProgressLoaded(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/puzzles/progress");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        const rows: PuzzleProgressRow[] = data.progress ?? [];
        const solved = new Set<string>();
        let mostRecentUnsolved: { id: string; ts: number } | null = null;
        for (const r of rows) {
          if (r.solved) {
            solved.add(r.puzzleId);
          } else {
            const ts = new Date(r.lastAttempt).getTime();
            if (!mostRecentUnsolved || ts > mostRecentUnsolved.ts) {
              mostRecentUnsolved = { id: r.puzzleId, ts };
            }
          }
        }
        setSolvedIds(solved);
        setLastAttemptedId(mostRecentUnsolved?.id ?? null);
      } catch (err) {
        console.error("Failed to load puzzle progress", err);
      } finally {
        if (!cancelled) setProgressLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [session?.user, status]);

  // Fetch user puzzle rating + streak
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/users/stats");
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const s = data.stats ?? {};
        if (typeof s.puzzleRating === "number") setUserRating(s.puzzleRating);
        if (typeof s.currentStreak === "number") setCurrentStreak(s.currentStreak);
        if (typeof s.bestStreak === "number") setBestStreak(s.bestStreak);
      } catch (err) {
        console.error("Failed to load user stats", err);
      }
    })();
    return () => { cancelled = true; };
  }, [session?.user, status]);

  // Reset per-puzzle flags when the current puzzle changes
  useEffect(() => {
    setHasAttempted(false);
    setLastFailOutcome(null);
  }, [currentFen]);

  const filtered = useMemo(() => {
    return allPuzzles.filter(p => {
      const ratingOk = p.rating >= filters.minRating && p.rating <= filters.maxRating;
      const typeOk =
        filters.type === "All" ||
        p.type.toLowerCase().includes(filters.type.toLowerCase());
      return ratingOk && typeOk;
    });
  }, [filters]);

  // Choose initial puzzle (or recover when filter/solved set invalidates current)
  useEffect(() => {
    if (!progressLoaded) return;
    if (currentFen && filtered.some(p => p.fen === currentFen)) return;
    if (
      lastAttemptedId &&
      filtered.some(p => p.fen === lastAttemptedId) &&
      !solvedIds.has(lastAttemptedId)
    ) {
      setCurrentFen(lastAttemptedId);
      return;
    }
    const next = filtered.find(p => !solvedIds.has(p.fen));
    setCurrentFen(next?.fen ?? null);
  }, [progressLoaded, filtered, solvedIds, lastAttemptedId, currentFen]);

  const currentPuzzle = useMemo(
    () => (currentFen ? filtered.find(p => p.fen === currentFen) ?? null : null),
    [currentFen, filtered]
  );
  const currentIndex = currentPuzzle ? filtered.indexOf(currentPuzzle) : -1;
  const isCurrentSolved = currentPuzzle ? solvedIds.has(currentPuzzle.fen) : false;

  const totalCount = filtered.length;
  const solvedCount = filtered.filter(p => solvedIds.has(p.fen)).length;

  const goNext = useCallback(() => {
    if (currentIndex < 0) {
      const fallback = filtered.find(p => !solvedIds.has(p.fen));
      setCurrentFen(fallback?.fen ?? null);
      return;
    }
    for (let i = currentIndex + 1; i < filtered.length; i++) {
      if (!solvedIds.has(filtered[i].fen)) {
        setCurrentFen(filtered[i].fen);
        return;
      }
    }
    for (let i = 0; i < currentIndex; i++) {
      if (!solvedIds.has(filtered[i].fen)) {
        setCurrentFen(filtered[i].fen);
        return;
      }
    }
    setCurrentFen(null);
  }, [currentIndex, filtered, solvedIds]);

  const handleSolved = useCallback(() => {
    if (!currentPuzzle) return;
    setSolvedIds(prev => {
      if (prev.has(currentPuzzle.fen)) return prev;
      const next = new Set(prev);
      next.add(currentPuzzle.fen);
      return next;
    });
  }, [currentPuzzle]);

  const handleProgressUpdate = useCallback(
    (rating: PuzzleRatingOutcome | null, streak: PuzzleStreakOutcome | null) => {
      if (rating) setUserRating(rating.new);
      if (streak) {
        setCurrentStreak(streak.current);
        setBestStreak(streak.best);
      }
    },
    []
  );

  const handleGiveUp = useCallback(async () => {
    if (!currentPuzzle) return;
    if (!hasAttempted) {
      goNext();
      return;
    }
    if (!session?.user) {
      goNext();
      return;
    }
    try {
      const res = await fetch("/api/puzzles/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          puzzleId: currentPuzzle.fen,
          solved: false,
          mistakes: 0,
          puzzleRating: currentPuzzle.rating,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        handleProgressUpdate(data.rating ?? null, data.streak ?? null);
        setLastFailOutcome({ rating: data.rating ?? null, streak: data.streak ?? null });
      }
    } catch (err) {
      console.error("Failed to record give-up", err);
    } finally {
      goNext();
    }
  }, [currentPuzzle, hasAttempted, session?.user, goNext, handleProgressUpdate]);

  const resetFilters = () =>
    setFilters({ type: "All", minRating: 800, maxRating: 2400 });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={16} />
            <span className="ml-0.5">Home</span>
          </Link>
          <div className="flex items-center gap-3">
            {session && userRating !== null ? (
              <div className="flex items-stretch rounded-md border bg-card overflow-hidden">
                <div
                  className="px-3.5 py-2 flex flex-col items-start justify-center gap-0.5 min-w-[70px]"
                  title="Your puzzle rating"
                >
                  <span className="text-lg font-semibold text-foreground tabular-nums leading-none">
                    {userRating}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Rating
                  </span>
                </div>
                <div className="w-px bg-border" />
                <div
                  className="px-3.5 py-2 flex flex-col items-start justify-center gap-0.5 min-w-[70px]"
                  title={`Current streak${bestStreak > 0 ? ` · Best ${bestStreak}` : ''}`}
                >
                  <span className="text-lg font-semibold text-foreground tabular-nums leading-none flex items-center gap-1">
                    <Flame
                      size={14}
                      className={currentStreak > 0 ? 'text-success' : 'text-muted-foreground'}
                    />
                    {currentStreak}
                    {bestStreak > currentStreak && (
                      <span className="text-xs font-normal text-muted-foreground">/ {bestStreak}</span>
                    )}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Streak
                  </span>
                </div>
                <div className="w-px bg-border" />
                <div
                  className="px-3.5 py-2 flex flex-col items-start justify-center gap-0.5 min-w-[80px]"
                  title="Puzzles solved in current filter"
                >
                  <span className="text-lg font-semibold text-foreground tabular-nums leading-none">
                    {solvedCount}
                    <span className="text-sm font-normal text-muted-foreground"> / {totalCount}</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Solved
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-xs font-medium text-muted-foreground">
                <span className="text-foreground">{solvedCount}</span> / {totalCount} solved
              </span>
            )}
            <button
              onClick={() => setShowBrowse(!showBrowse)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                showBrowse
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
            >
              <List size={14} />
              Browse
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                showFilters
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
            >
              <Filter size={14} />
              Filters
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-foreground tracking-tight">
            Chess Puzzles
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {session
              ? "Picking up where you left off — solved puzzles are skipped automatically."
              : "Sign in to track which puzzles you've solved across sessions."}
          </p>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mb-6 p-4 rounded-lg bg-card border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Type
                </label>
                <select
                  value={filters.type}
                  onChange={e => setFilters(p => ({ ...p, type: e.target.value }))}
                  className="input-base"
                >
                  {PUZZLE_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Min Rating
                </label>
                <input
                  type="number"
                  min={0}
                  max={3000}
                  value={filters.minRating}
                  onChange={e =>
                    setFilters(p => ({
                      ...p,
                      minRating: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="input-base"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Max Rating
                </label>
                <input
                  type="number"
                  min={0}
                  max={3000}
                  value={filters.maxRating}
                  onChange={e =>
                    setFilters(p => ({
                      ...p,
                      maxRating: parseInt(e.target.value) || 3000,
                    }))
                  }
                  className="input-base"
                />
              </div>
            </div>
          </div>
        )}

        {/* Browse panel */}
        {showBrowse && (
          <div className="mb-6 p-4 rounded-lg bg-card border">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                All puzzles ({totalCount})
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  Solved
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-foreground" />
                  Current
                </span>
              </div>
            </div>
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No puzzles match the current filters.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {filtered.map((p, i) => {
                  const isSolved = solvedIds.has(p.fen);
                  const isCurrent = p.fen === currentFen;
                  return (
                    <button
                      key={p.fen}
                      onClick={() => {
                        setCurrentFen(p.fen);
                        setShowBrowse(false);
                      }}
                      title={`Puzzle ${i + 1} — ${p.type} — Rating: ${p.rating}`}
                      className={`flex items-center justify-between gap-2 px-2.5 py-2 rounded-md border text-left transition-colors ${
                        isCurrent
                          ? "bg-foreground text-background border-foreground"
                          : isSolved
                          ? "bg-muted text-muted-foreground hover:text-foreground"
                          : "bg-card text-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-medium">#{i + 1}</span>
                        <span className={`text-xs ${isCurrent ? "opacity-80" : "text-muted-foreground"}`}>
                          {p.rating}
                        </span>
                      </span>
                      {isSolved && !isCurrent && (
                        <CheckCircle2 size={12} className="text-success flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Body */}
        {!progressLoaded ? (
          <div className="panel p-12 text-center">
            <p className="text-sm text-muted-foreground">Loading…</p>
          </div>
        ) : totalCount === 0 ? (
          <div className="panel p-12 text-center">
            <h2 className="text-lg font-medium text-foreground mb-1">
              No puzzles match your filters
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Try widening the rating range or changing the type.
            </p>
            <button onClick={resetFilters} className="btn-outline">
              Reset filters
            </button>
          </div>
        ) : !currentPuzzle ? (
          <div className="panel p-12 text-center">
            <CheckCircle2 size={32} className="text-success mx-auto mb-3" />
            <h2 className="text-lg font-medium text-foreground mb-1">
              All puzzles solved
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              You&apos;ve solved every puzzle matching your filters. Try a wider range or come back later.
            </p>
            <button onClick={resetFilters} className="btn-outline">
              Reset filters
            </button>
          </div>
        ) : (
          <>
            {/* Puzzle subhead */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Puzzle {currentIndex + 1} of {totalCount}
                </span>
                {isCurrentSolved && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                    <CheckCircle2 size={12} />
                    Solved
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {hasAttempted && !isCurrentSolved ? (
                  <button
                    onClick={handleGiveUp}
                    className="btn-outline text-xs inline-flex border-destructive/40 text-destructive hover:bg-destructive/10"
                    title="Give up — costs rating and resets your streak"
                  >
                    <XCircle size={12} />
                    Give up
                  </button>
                ) : (
                  <button
                    onClick={goNext}
                    className="btn-outline text-xs inline-flex"
                    title="Skip to the next unsolved puzzle"
                  >
                    <SkipForward size={12} />
                    Skip
                  </button>
                )}
                {isCurrentSolved && (
                  <button
                    onClick={goNext}
                    className="btn-primary text-xs inline-flex"
                  >
                    Next puzzle
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>

            <ChessBoard
              key={currentPuzzle.fen}
              position={currentPuzzle.fen}
              puzzle={currentPuzzle}
              onSolved={handleSolved}
              onAttempt={() => setHasAttempted(true)}
              onProgressUpdate={handleProgressUpdate}
            />
          </>
        )}

        {/* Give-up outcome toast */}
        {lastFailOutcome?.rating && (
          <div className="mt-4 panel px-4 py-3 border-destructive/40 bg-destructive/5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <XCircle size={16} className="text-destructive" />
                <span className="text-sm text-foreground">Marked as failed.</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">
                  Rating <span className="text-foreground font-medium">{lastFailOutcome.rating.new}</span>
                  <span className="text-destructive font-medium ml-1">
                    {lastFailOutcome.rating.delta}
                  </span>
                </span>
                {lastFailOutcome.streak && (
                  <span className="text-muted-foreground">
                    Streak reset
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
