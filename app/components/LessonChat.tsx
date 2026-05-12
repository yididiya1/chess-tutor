"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bot } from "lucide-react";
import type { Lesson } from "../types/openings";

interface ChatBubble {
  id: string;
  text: string;
}

interface LessonChatProps {
  lesson: Lesson;
  currentMoveIndex: number;
  totalMoves: number;
  isComplete: boolean;
  /** Optional name shown above the chat bubbles. Defaults to "Tutor". */
  tutorName?: string;
  /** Milliseconds between staggered bubbles within the same step. */
  bubbleStaggerMs?: number;
}

/**
 * Streams pre-written lesson messages into a chat panel as the user
 * progresses through an opening sequence.
 *
 * The component owns a `bubbles` list and appends to it whenever a new
 * phase becomes "current": intro → perMove[0..N-1] → outro. Each phase's
 * messages are staggered with a small delay so it reads as a typed
 * conversation rather than a wall of text.
 */
export default function LessonChat({
  lesson,
  currentMoveIndex,
  totalMoves,
  isComplete,
  tutorName = "Tutor",
  bubbleStaggerMs = 550,
}: LessonChatProps) {
  const [bubbles, setBubbles] = useState<ChatBubble[]>([]);
  // Tracks which phase keys we've already emitted so we don't double-add
  // when React re-renders or strict-mode runs effects twice.
  const emittedRef = useRef<Set<string>>(new Set());
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const totalCount = lesson.perMove?.length ?? 0;

  // Reset everything when the lesson object changes (different opening/variation)
  useEffect(() => {
    setBubbles([]);
    emittedRef.current = new Set();
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, [lesson]);

  // Clean up timers on unmount
  useEffect(
    () => () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    },
    []
  );

  const appendStaggered = (phaseKey: string, messages: string[]) => {
    if (!messages || messages.length === 0) return;
    if (emittedRef.current.has(phaseKey)) return;
    emittedRef.current.add(phaseKey);

    messages.forEach((text, i) => {
      const id = setTimeout(() => {
        setBubbles(prev => [
          ...prev,
          { id: `${phaseKey}-${i}`, text },
        ]);
      }, i * bubbleStaggerMs);
      timersRef.current.push(id);
    });
  };

  // Intro: emit on first mount
  useEffect(() => {
    if (lesson.intro && lesson.intro.length > 0) {
      appendStaggered("intro", lesson.intro);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson]);

  // Per-move: emit each step's messages as currentMoveIndex advances
  useEffect(() => {
    // currentMoveIndex points at the *next* move to play. Each time it
    // increases, that means moves[currentMoveIndex - 1] just happened.
    // We emit the messages for the step that *just played*.
    if (currentMoveIndex <= 0) return;
    const stepIdx = currentMoveIndex - 1;
    const step = lesson.perMove?.[stepIdx];
    if (!step) return;
    appendStaggered(`move-${stepIdx}`, step.messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMoveIndex, lesson]);

  // Outro: emit when complete
  useEffect(() => {
    if (!isComplete) return;
    if (lesson.outro && lesson.outro.length > 0) {
      appendStaggered("outro", lesson.outro);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete, lesson]);

  // Auto-scroll to the newest bubble
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [bubbles]);

  const progressPct = useMemo(() => {
    if (totalMoves <= 0) return 0;
    return Math.min(100, (currentMoveIndex / totalMoves) * 100);
  }, [currentMoveIndex, totalMoves]);

  return (
    <div className="panel flex flex-col h-[520px] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center">
            <Bot size={14} className="text-background" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-foreground">{tutorName}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Opening lesson
            </p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">
          {Math.min(currentMoveIndex, totalCount)} / {totalCount}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-muted">
        <div
          className={`h-1 transition-all duration-500 ${
            isComplete ? "bg-success" : "bg-primary"
          }`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Bubbles */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-2.5"
      >
        {bubbles.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">
            Lesson starting…
          </p>
        ) : (
          bubbles.map(b => (
            <div
              key={b.id}
              className="bg-muted text-foreground rounded-lg rounded-tl-sm px-3 py-2 text-sm leading-relaxed max-w-[90%]"
            >
              {b.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
