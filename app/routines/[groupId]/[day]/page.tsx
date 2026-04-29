"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { getGroupById, getRoutineDays, getExerciseTutorialUrl } from "@/lib/routines";
import { addCompletedDay } from "@/lib/user-store";

const GRADIENTS: Record<string, { from: string; to: string }> = {
  primary: { from: "#d84315", to: "#FF8A65" },
  accent:  { from: "#00897B", to: "#00BCD4" },
  purple:  { from: "#7C3AED", to: "#A855F7" },
  blue:    { from: "#0EA5E9", to: "#6366F1" },
};

export default function RoutineDayPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  const dayNum = Number(params.day);
  const group = getGroupById(groupId);
  const days = group ? getRoutineDays(group.id) : [];
  const dayData = days.find((d) => d.day === dayNum);
  const [completed, setCompleted] = useState(false);

  if (!group || !dayData) {
    return (
      <main className="w-full px-4 sm:px-6 lg:px-8 pt-8">
        <div className="card p-8 text-center">
          <p className="text-4xl mb-3">🤔</p>
          <p className="text-dark font-semibold mb-1">Day not found</p>
          <p className="text-muted text-sm mb-4">This day doesn&apos;t exist in the routine.</p>
          <Link href="/routines" className="text-primary font-semibold text-sm">
            ← Back to routines
          </Link>
        </div>
      </main>
    );
  }

  const g = GRADIENTS[group.color] ?? GRADIENTS.primary;

  function handleComplete() {
    addCompletedDay({
      groupId,
      day: dayNum,
      date: new Date().toISOString().slice(0, 10),
    });
    setCompleted(true);
    router.push(`/complete?groupId=${groupId}&day=${dayNum}`);
  }

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 pt-5 pb-32">
      {/* Top nav */}
      <div className="flex items-center justify-between mb-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-muted font-semibold text-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </button>
        <div className="flex items-center gap-3">
          <Link replace href={`/routines/${groupId}`} className="text-muted text-sm font-semibold">
            All days
          </Link>
          <Link href="/" className="text-muted text-sm font-semibold">
            Home
          </Link>
        </div>
      </div>

      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-5 mb-5"
        style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
      >
        <div className="absolute -top-4 -right-4 w-28 h-28 rounded-full bg-white/10" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
            {group.icon}
          </div>
          <div>
            <p className="text-white/95 text-xs font-semibold uppercase tracking-widest">Day {dayNum} of {group.totalDays}</p>
            <h1 className="text-white font-black text-xl leading-tight">{group.name}</h1>
            <p className="text-white/90 text-sm">{group.durationMinutes} min · {dayData.exercises.length} exercises</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/70 rounded-full"
            style={{ width: `${(dayNum / group.totalDays) * 100}%` }}
          />
        </div>
      </motion.div>

      {/* ── Desktop 2-col layout wrapper ── */}
      <div className="md:grid md:grid-cols-[1fr_320px] md:gap-8 md:items-start">
      <div>

      {/* Tip */}
      {dayData.tip && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100 mb-4"
        >
          <span className="text-lg">💡</span>
          <p className="text-sm text-amber-800 font-medium leading-relaxed">{dayData.tip}</p>
        </motion.div>
      )}

      {/* Exercise list */}
      <motion.ul
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        className="space-y-3 mb-6"
      >
        {dayData.exercises.map((ex, i) => (
          <motion.li
            key={i}
            variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.35 } } }}
          >
            <div className="card p-4 flex items-start gap-4">
              {/* Number badge */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
              >
                {i + 1}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-dark">{ex.name}</p>
                <p className="text-sm text-muted mt-0.5">{ex.repsOrTime}</p>
                {ex.notes && (
                  <p className="text-xs text-slate-400 mt-1 italic">{ex.notes}</p>
                )}
                <a
                  href={getExerciseTutorialUrl(ex.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-primary"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.1 2.8 12 2.8 12 2.8s-4.1 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.2v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.5 21.6 12 21.6 12 21.6s4.1 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z" />
                  </svg>
                  Watch tutorial
                </a>
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ul>

      </div>{/* end exercise list col */}

      {/* ── Right sidebar col (desktop only) ── */}
      <div className="hidden md:block space-y-4 sticky top-6">
        {dayData.tip && (
          <div className="card p-4">
            <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">Coach tip 💡</p>
            <p className="text-sm text-dark leading-relaxed">{dayData.tip}</p>
          </div>
        )}
        <div className="card p-4">
          <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3">Today&apos;s workout</p>
          <p className="text-2xl font-black text-dark">{dayData.exercises.length}</p>
          <p className="text-sm text-muted">exercises</p>
          <div className="mt-3 pt-3 border-t border-slate-50">
            <p className="text-2xl font-black text-dark">{group.durationMinutes}</p>
            <p className="text-sm text-muted">minutes</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleComplete}
          disabled={completed}
          className="w-full py-4 rounded-2xl font-black text-lg text-white shadow-primary-lg disabled:opacity-60 transition-all"
          style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
        >
          {completed ? "✓ Done!" : "Mark complete 🎉"}
        </motion.button>
      </div>

      </div>{/* end 2-col wrapper */}

      {/* Complete button — fixed at bottom (mobile only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 nav-glass border-t border-white/60">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleComplete}
          disabled={completed}
          className="w-full py-4 rounded-2xl font-black text-lg text-white shadow-primary-lg disabled:opacity-60 transition-all"
          style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
        >
          {completed ? "✓ Marked complete!" : "I did it! Mark complete 🎉"}
        </motion.button>
      </div>
    </main>
  );
}
