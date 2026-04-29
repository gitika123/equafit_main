"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getCurrentDietFuelWeek, getISOWeekNumber } from "@/lib/diet-fuel-guide";

export function DietFuelPreview() {
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => {
    setToday(new Date());
  }, []);

  if (!today) {
    return null;
  }

  const week = getCurrentDietFuelWeek(today);
  const iso = getISOWeekNumber(today);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="mt-10 mb-4"
    >
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl font-black text-dark">Diet Fuel Guide</h2>
          <p className="text-sm text-muted mt-1">
            Weekly tips + 3 easy recipes · Week {iso}
          </p>
        </div>
        <Link
          href="/diet-fuel"
          className="text-sm font-bold text-emerald-600 hover:underline underline-offset-2 whitespace-nowrap"
        >
          Full guide →
        </Link>
      </div>

      <Link href="/diet-fuel" className="block group">
        <div className="card p-5 md:p-6 overflow-hidden relative border-emerald-100 bg-gradient-to-br from-emerald-50/90 to-white hover:shadow-card-md transition-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-emerald-200/30 -translate-y-1/2 translate-x-1/3" />
          <div className="relative flex flex-col sm:flex-row sm:items-start gap-4">
            <span className="text-4xl shrink-0" aria-hidden>
              {week.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-800 mb-1">This week</p>
              <p className="font-black text-dark text-lg leading-tight">{week.title}</p>
              <p className="text-sm text-muted mt-1">{week.subtitle}</p>
              <p className="text-sm text-dark/90 mt-3 leading-relaxed line-clamp-3 sm:line-clamp-none">
                <span className="font-semibold text-emerald-800">Recipes: </span>
                {Array.from(new Set(week.recipes.map((r) => r.cuisine))).join(" · ")} — start with{" "}
                <span className="font-medium text-dark">{week.recipes[0]?.name}</span>.
              </p>
              <p className="text-sm font-bold text-emerald-600 mt-3 group-hover:underline underline-offset-2">
                Open full guide & recipes →
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.section>
  );
}
