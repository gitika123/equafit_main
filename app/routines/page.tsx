"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ROUTINE_GROUPS } from "@/lib/routines";
import { getCompletedDays } from "@/lib/user-store";

const GRADIENTS: Record<string, { from: string; to: string; shadow: string }> = {
  primary: { from: "#d84315", to: "#FF8A65", shadow: "rgba(216,67,21,0.28)" },
  accent:  { from: "#00897B", to: "#00BCD4", shadow: "rgba(0,137,123,0.2)" },
  purple:  { from: "#7C3AED", to: "#A855F7", shadow: "rgba(124,58,237,0.25)" },
  blue:    { from: "#0EA5E9", to: "#6366F1", shadow: "rgba(14,165,233,0.2)" },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function RoutinesPage() {
  const [completed, setCompleted] = useState<ReturnType<typeof getCompletedDays>>([]);

  useEffect(() => {
    setCompleted(getCompletedDays());
  }, []);

  const totalSessions = completed.length;

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 pt-5 pb-28">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-5"
      >
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-black text-dark">Routines</h1>
            <p className="text-muted text-sm mt-0.5">30-day programs · Pick your focus</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-primary">{totalSessions}</p>
            <p className="text-xs text-muted font-medium">total sessions</p>
          </div>
        </div>
      </motion.header>

      {/* Routine list */}
      <motion.ul
        initial="hidden"
        animate="show"
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3"
      >
        {ROUTINE_GROUPS.map((group) => {
          const done = completed.filter((d) => d.groupId === group.id).length;
          const pct = group.totalDays ? Math.round((done / group.totalDays) * 100) : 0;
          const g = GRADIENTS[group.color] ?? GRADIENTS.primary;
          const isStarted = done > 0;

          return (
            <motion.li key={group.id} variants={item}>
              <Link
                href={`/routines/${group.id}`}
                className="flex items-center gap-4 p-4 card shadow-card active:scale-[0.98] transition-transform"
              >
                {/* Icon badge */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${g.from}, ${g.to})`,
                    boxShadow: `0 6px 20px ${g.shadow}`,
                  }}
                >
                  {group.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h2 className="font-bold text-dark text-base">{group.name}</h2>
                    {isStarted && (
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
                      >
                        {pct}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted truncate mb-2">{group.tagline} · {group.durationMinutes} min/day</p>

                  {/* Progress bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${g.from}, ${g.to})` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-muted whitespace-nowrap">
                      {done}/{group.totalDays}
                    </span>
                  </div>
                </div>

                {/* Chevron */}
                <svg
                  width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className="text-slate-300 flex-shrink-0"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>
    </main>
  );
}
