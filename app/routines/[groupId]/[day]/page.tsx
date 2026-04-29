"use client";

import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getGroupById, getRoutineDays, getExerciseTutorialUrl, exerciseTimerSeconds } from "@/lib/routines";
import { getExerciseImageUrl } from "@/lib/exercise-images";
import { getDefaultVibe, spotifyEmbedSrc, spotifyOpenUrl } from "@/lib/vibesync-playlists";
import { addCompletedDay } from "@/lib/user-store";

const GRADIENTS: Record<string, { from: string; to: string }> = {
  primary: { from: "#d84315", to: "#FF8A65" },
  accent: { from: "#00897B", to: "#00BCD4" },
  purple: { from: "#7C3AED", to: "#A855F7" },
  blue: { from: "#0EA5E9", to: "#6366F1" },
};

function formatTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function RoutineDayPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  const dayNum = Number(params.day);
  const group = getGroupById(groupId);
  const days = group ? getRoutineDays(group.id) : [];
  const dayData = days.find((d) => d.day === dayNum);
  const [completed, setCompleted] = useState(false);
  const [timerIdx, setTimerIdx] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);

  const workoutPlaylist = getDefaultVibe();

  const closeTimer = useCallback(() => {
    setRunning(false);
    setTimerIdx(null);
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  function openTimer(i: number) {
    if (!dayData) return;
    const sec = exerciseTimerSeconds(dayData.exercises[i].repsOrTime);
    setTimerIdx(i);
    setSecondsLeft(sec);
    setRunning(false);
  }

  function startTimer() {
    if (secondsLeft <= 0 && timerIdx != null && dayData) {
      setSecondsLeft(exerciseTimerSeconds(dayData.exercises[timerIdx].repsOrTime));
    }
    setRunning(true);
  }

  function resetTimer() {
    if (timerIdx == null || !dayData) return;
    setRunning(false);
    setSecondsLeft(exerciseTimerSeconds(dayData.exercises[timerIdx].repsOrTime));
  }

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
  const activeExercise = timerIdx != null ? dayData.exercises[timerIdx] : null;

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
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href={`/routines/${groupId}`}
            className="flex items-center gap-1.5 text-muted font-semibold text-sm hover:text-primary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Days
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-muted font-semibold text-sm hover:text-primary">
            <span className="text-lg leading-none" aria-hidden>
              ⌂
            </span>
            Home
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link replace href={`/routines/${groupId}`} className="text-muted text-sm font-semibold">
            All days
          </Link>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-5 mb-5"
        style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
      >
        <div className="absolute -top-4 -right-4 w-28 h-28 rounded-full bg-white/10" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">{group.icon}</div>
          <div>
            <p className="text-white/95 text-xs font-semibold uppercase tracking-widest">
              Day {dayNum} of {group.totalDays}
            </p>
            <h1 className="text-white font-black text-xl leading-tight">{group.name}</h1>
            <p className="text-white/90 text-sm">
              ~{group.durationMinutes} min · {dayData.exercises.length} exercises · tap an exercise for a timer
            </p>
          </div>
        </div>
        <div className="mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white/70 rounded-full" style={{ width: `${(dayNum / group.totalDays) * 100}%` }} />
        </div>
      </motion.div>

      <div className="md:grid md:grid-cols-[1fr_320px] md:gap-8 md:items-start">
        <div>
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

          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            className="space-y-3 mb-6"
          >
            {dayData.exercises.map((ex, i) => (
              <motion.li
                key={`${ex.name}-${i}`}
                variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.35 } } }}
              >
                <button
                  type="button"
                  onClick={() => openTimer(i)}
                  className="w-full text-left card p-4 flex items-start gap-4 transition-all hover:ring-2 hover:ring-primary/30 hover:shadow-md active:scale-[0.99]"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
                  >
                    {i + 1}
                  </div>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getExerciseImageUrl(ex.name)}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-dark">{ex.name}</p>
                    <p className="text-sm text-muted mt-0.5">{ex.repsOrTime}</p>
                    {ex.notes && <p className="text-xs text-slate-400 mt-1 italic">{ex.notes}</p>}
                    <p className="text-xs font-semibold text-primary mt-2">Tap for timer · suggested {exerciseTimerSeconds(ex.repsOrTime)}s</p>
                    <a
                      href={getExerciseTutorialUrl(ex.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-primary hover:underline"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.1 2.8 12 2.8 12 2.8s-4.1 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.2v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.5 21.6 12 21.6 12 21.6s4.1 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z" />
                      </svg>
                      Watch tutorial
                    </a>
                  </div>
                </button>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="card p-4 mb-24 md:mb-6 border border-slate-100"
          >
            <button
              type="button"
              onClick={() => setMusicOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-3 text-left"
            >
              <div>
                <p className="font-black text-dark">Workout music</p>
                <p className="text-xs text-muted mt-0.5">Spotify embed — play continues while this tab stays open</p>
              </div>
              <span className="text-sm font-bold text-primary shrink-0">{musicOpen ? "Hide ▲" : "Show ▼"}</span>
            </button>
            {musicOpen && (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-muted leading-relaxed">
                  Tap <strong className="text-dark">play</strong> inside the player once (browsers block autoplay until you do). Keep this tab active for audio during your sets. For music in the{" "}
                  <strong className="text-dark">Spotify app</strong> so it runs when you lock your phone, use{" "}
                  <strong className="text-dark">Open in Spotify</strong> below.
                </p>
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-black/5">
                  <iframe
                    title="Workout playlist"
                    src={spotifyEmbedSrc(workoutPlaylist.spotifyPlaylistId)}
                    width="100%"
                    height={232}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="w-full"
                  />
                </div>
                <a
                  href={spotifyOpenUrl(workoutPlaylist.spotifyPlaylistId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#1DB954] text-white text-sm font-bold hover:brightness-110"
                >
                  Open in Spotify app / web ↗
                </a>
              </div>
            )}
          </motion.div>
        </div>

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
              <p className="text-sm text-muted">min (plan)</p>
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
      </div>

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

      <AnimatePresence>
        {timerIdx != null && activeExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/50"
            role="dialog"
            aria-modal
            aria-labelledby="timer-title"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100"
            >
              <p id="timer-title" className="text-xs font-bold text-muted uppercase tracking-widest mb-1">
                Exercise {timerIdx + 1}
              </p>
              <h2 className="text-xl font-black text-dark leading-tight mb-1">{activeExercise.name}</h2>
              <p className="text-sm text-muted mb-4">{activeExercise.repsOrTime}</p>
              <div className="relative w-full max-h-40 rounded-xl overflow-hidden mb-4 border border-slate-100 bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getExerciseImageUrl(activeExercise.name)}
                  alt=""
                  className="w-full h-36 object-cover object-center"
                  loading="lazy"
                />
              </div>
              <div
                className="rounded-2xl p-8 text-center mb-4"
                style={{ background: `linear-gradient(135deg, ${g.from}18, ${g.to}12)` }}
              >
                <p className="text-5xl font-black tabular-nums" style={{ color: g.from }}>
                  {formatTime(secondsLeft)}
                </p>
                {!running && secondsLeft === 0 && (
                  <p className="text-sm font-semibold text-emerald-600 mt-2">Time&apos;s up — nice set!</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {!running ? (
                  <button
                    type="button"
                    onClick={startTimer}
                    className="flex-1 min-w-[120px] py-3 rounded-xl font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
                  >
                    {secondsLeft === 0 ? "Again" : "Start"}
                  </button>
                ) : (
                  <button type="button" onClick={() => setRunning(false)} className="flex-1 py-3 rounded-xl font-bold border-2 border-slate-200">
                    Pause
                  </button>
                )}
                <button type="button" onClick={resetTimer} className="flex-1 py-3 rounded-xl font-bold border-2 border-slate-200">
                  Reset
                </button>
                <button type="button" onClick={closeTimer} className="w-full py-3 rounded-xl font-bold text-muted border border-slate-200">
                  Close
                </button>
              </div>
              <a
                href={getExerciseTutorialUrl(activeExercise.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-center text-sm font-bold text-primary"
              >
                Open form tutorial →
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
