"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getGroupById, getRoutineDays } from "@/lib/routines";
import { getCompletedDays } from "@/lib/user-store";

const GRADIENTS: Record<string, { from: string; to: string; shadow: string }> = {
  primary: { from: "#d84315", to: "#FF8A65", shadow: "rgba(216,67,21,0.28)" },
  accent:  { from: "#00897B", to: "#00BCD4", shadow: "rgba(0,137,123,0.2)" },
  purple:  { from: "#7C3AED", to: "#A855F7", shadow: "rgba(124,58,237,0.25)" },
  blue:    { from: "#0EA5E9", to: "#6366F1", shadow: "rgba(14,165,233,0.2)" },
};

export default function RoutineGroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  const group = getGroupById(groupId);
  const days = group ? getRoutineDays(group.id) : [];
  const completed = getCompletedDays();
  const completedSet = new Set(
    completed.filter((d) => d.groupId === groupId).map((d) => d.day)
  );
  const doneCount = completedSet.size;

  if (!group) {
    return (
      <main className="w-full px-4 sm:px-6 lg:px-8 pt-8">
        <div className="card p-8 text-center">
          <p className="text-4xl mb-3">🤔</p>
          <p className="text-dark font-semibold mb-4">Routine not found</p>
          <Link href="/routines" className="text-primary font-semibold text-sm">← Back to routines</Link>
        </div>
      </main>
    );
  }

  const g = GRADIENTS[group.color] ?? GRADIENTS.primary;
  const pct = Math.round((doneCount / group.totalDays) * 100);

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 pt-5 pb-28">
      {/* Back button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-muted font-semibold text-sm mb-4"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back
      </button>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-5 mb-5"
        style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})`, boxShadow: `0 12px 40px ${g.shadow}` }}
      >
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl">
            {group.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-white font-black text-2xl leading-tight">{group.name}</h1>
            <p className="text-white/90 text-sm mt-0.5">{group.tagline} · {group.durationMinutes} min/day</p>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1 h-2 bg-white/25 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-white/80 rounded-full"
                />
              </div>
              <span className="text-white text-xs font-bold whitespace-nowrap drop-shadow-sm">{doneCount}/{group.totalDays} days</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Instruction */}
      <p className="text-sm text-muted font-medium mb-4 px-1">
        Tap any day to start. Completed days are highlighted.
      </p>

      {/* Day grid */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.02 } } }}
        className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2"
      >
        {days.map((d) => {
          const isDone = completedSet.has(d.day);
          return (
            <motion.div
              key={d.day}
              variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1, transition: { duration: 0.25 } } }}
            >
              <Link
                href={`/routines/${groupId}/${d.day}`}
                className={`flex flex-col items-center justify-center aspect-square rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                  isDone
                    ? "text-white shadow-sm"
                    : "bg-white text-dark shadow-card border border-slate-100 hover:border-primary/30"
                }`}
                style={isDone ? { background: `linear-gradient(135deg, ${g.from}, ${g.to})` } : {}}
              >
                {isDone ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  d.day
                )}
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </main>
  );
}
