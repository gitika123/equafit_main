"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  CUISINE_BADGE_CLASS,
  DIET_FUEL_WEEKS,
  getCurrentDietFuelWeek,
  getISOWeekNumber,
  type DietFuelWeek,
} from "@/lib/diet-fuel-guide";

function WeekCard({
  week,
  highlight,
}: {
  week: DietFuelWeek;
  highlight: boolean;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card overflow-hidden ${highlight ? "ring-2 ring-primary/40 shadow-card-md" : ""}`}
    >
      {highlight && (
        <div className="h-1 bg-gradient-emerald" />
      )}
      <div className="p-5 md:p-6">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl" aria-hidden>
            {week.icon}
          </span>
          <div>
            {highlight && (
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-800 mb-1">This week</p>
            )}
            <h2 className="text-lg font-black text-dark leading-tight">{week.title}</h2>
            <p className="text-sm text-muted mt-0.5">{week.subtitle}</p>
          </div>
        </div>
        <p className="text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 mb-4">
          {week.budgetNote}
        </p>
        <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">Tips</p>
        <ul className="space-y-2 mb-5">
          {week.tips.map((t, i) => (
            <li key={i} className="text-sm text-dark leading-relaxed pl-3 border-l-2 border-emerald-200">
              {t}
            </li>
          ))}
        </ul>
        <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">Shopping ideas</p>
        <div className="flex flex-wrap gap-2">
          {week.shoppingIdeas.map((s) => (
            <span
              key={s}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700"
            >
              {s}
            </span>
          ))}
        </div>

        {week.recipes?.length ? (
          <>
            <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3 mt-6">
              Easy recipes (dorm / shared kitchen)
            </p>
            <ul className="space-y-4">
              {week.recipes.map((r) => (
                <li
                  key={r.name}
                  className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${CUISINE_BADGE_CLASS[r.cuisine]}`}
                    >
                      {r.cuisine}
                    </span>
                    <span className="text-xs font-semibold text-muted">{r.minutes} min</span>
                    <span className="text-xs text-muted">· {r.feeds}</span>
                  </div>
                  <p className="font-bold text-dark text-sm mb-2">{r.name}</p>
                  {r.whyItWorks && (
                    <p className="text-xs text-emerald-800/90 mb-2 leading-relaxed">{r.whyItWorks}</p>
                  )}
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Usually on hand</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {r.pantryStaples.map((p) => (
                      <span key={p} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white text-slate-600 border border-slate-100">
                        {p}
                      </span>
                    ))}
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-dark leading-relaxed">
                    {r.steps.map((step, si) => (
                      <li key={si}>{step}</li>
                    ))}
                  </ol>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </motion.article>
  );
}

export default function DietFuelPage() {
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => {
    setToday(new Date());
  }, []);

  if (!today) {
    return null;
  }

  const isoWeek = getISOWeekNumber(today);
  const current = getCurrentDietFuelWeek(today);
  const currentIndex = DIET_FUEL_WEEKS.findIndex((w) => w.id === current.id);

  return (
    <main className="w-full px-4 sm:px-6 lg:px-10 pt-6 pb-28 md:pb-10 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-muted font-semibold text-sm mb-4 hover:text-primary"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Home
        </Link>
        <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-emerald text-white">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-black/10 -translate-x-1/4 translate-y-1/4" />
          <div className="relative z-10">
            <p className="text-white text-xs font-bold uppercase tracking-widest mb-2 drop-shadow-sm">Nutrition</p>
            <h1 className="text-3xl md:text-4xl font-black leading-tight">Diet Fuel Guide</h1>
            <p className="text-white text-sm md:text-base mt-2 max-w-xl leading-relaxed drop-shadow-sm">
              Budget-friendly ideas plus quick recipes using real dorm staples — Indian, Chinese, Thai, Mediterranean, Mexican, and
              simple global go-tos so more backgrounds feel at home.
            </p>
            <p className="text-white/90 text-xs mt-4 font-medium">
              Calendar week {isoWeek} · Theme &quot;{current.title}&quot;
            </p>
          </div>
        </div>
      </motion.div>

      <p className="text-sm text-muted mb-4 max-w-2xl">
        Eight themes cycle through the year (by ISO week), so you see a new focus weekly for two months before it repeats. Each week
        includes three doable recipes with cuisine tags — they&apos;re student shortcuts, not restaurant-perfect, but honest about swaps
        (halal, veg, no fancy gear).
      </p>

      <div className="grid gap-5 md:grid-cols-2 mb-6">
        {DIET_FUEL_WEEKS.map((week, i) => (
          <WeekCard key={week.id} week={week} highlight={i === currentIndex} />
        ))}
      </div>

      <p className="text-xs text-muted text-center max-w-lg mx-auto leading-relaxed">
        Tips and recipes are general wellness ideas, not medical advice. Labels like &quot;Thai-style&quot; mean pantry-friendly flavor
        profiles — adapt for allergies, halal/kosher/veg needs, and what&apos;s affordable where you live.
      </p>
    </main>
  );
}
