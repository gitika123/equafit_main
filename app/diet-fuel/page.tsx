"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  CUISINE_BADGE_CLASS,
  DIET_FUEL_WEEKS,
  FUEL_CUISINE_ORDER,
  getCurrentDietFuelWeek,
  getISOWeekNumber,
  getRecipeHeroImage,
  groupRecipesByCuisine,
  type DietFuelCuisine,
  type DietFuelWeek,
  type DietFuelRecipe,
} from "@/lib/diet-fuel-guide";
import { SEVEN_DAY_MEAL_PLAN, mealImage } from "@/lib/diet-fuel-meal-plan";
import { HighlightedStep } from "@/components/HighlightedRecipeStep";

const CUISINE_VISUAL: Record<DietFuelCuisine, { emoji: string; blurb: string; gradient: string }> = {
  Indian: { emoji: "🍛", blurb: "Spices, dal, eggs, roti-friendly", gradient: "from-amber-100 to-orange-50" },
  Chinese: { emoji: "🥢", blurb: "Soy, rice, fast stir-fry wins", gradient: "from-red-50 to-rose-50" },
  Thai: { emoji: "🌶️", blurb: "Sour-sweet-salty without fancy imports", gradient: "from-emerald-50 to-teal-50" },
  Mediterranean: { emoji: "🫒", blurb: "Beans, lemon, yogurt, wraps", gradient: "from-sky-50 to-indigo-50" },
  Mexican: { emoji: "🌮", blurb: "Beans, salsa, tortillas on a budget", gradient: "from-lime-50 to-yellow-50" },
  "Global / dorm": { emoji: "🏠", blurb: "Microwave, oats, PB classics", gradient: "from-slate-100 to-white" },
};

function RecipeSteps({ recipe }: { recipe: DietFuelRecipe }) {
  return (
    <ol className="list-decimal list-inside space-y-1.5 text-xs text-dark leading-relaxed">
      {recipe.steps.map((step, si) => (
        <li key={si}>
          <HighlightedStep text={step} staples={recipe.pantryStaples} />
        </li>
      ))}
    </ol>
  );
}

function RecipeCardInner({ recipe, weekHint }: { recipe: DietFuelRecipe; weekHint?: string }) {
  const img = getRecipeHeroImage(recipe);
  return (
    <>
      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 mb-3 border border-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>
      {weekHint && <p className="text-xs font-bold text-emerald-700 mb-1">{weekHint}</p>}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span
          className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${CUISINE_BADGE_CLASS[recipe.cuisine]}`}
        >
          {recipe.cuisine}
        </span>
        <span className="text-xs font-semibold text-muted">{recipe.minutes} min</span>
        <span className="text-xs text-muted">· {recipe.feeds}</span>
      </div>
      <p className="font-bold text-dark text-sm mb-2">{recipe.name}</p>
      {recipe.whyItWorks && <p className="text-xs text-emerald-800/90 mb-2 leading-relaxed">{recipe.whyItWorks}</p>}
      <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Usually on hand</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {recipe.pantryStaples.map((p) => (
          <span key={p} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white text-slate-600 border border-slate-100">
            {p}
          </span>
        ))}
      </div>
      <RecipeSteps recipe={recipe} />
    </>
  );
}

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
      {highlight && <div className="h-1 bg-gradient-emerald" />}
      <div className="p-5 md:p-6">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl shrink-0 rounded-2xl bg-emerald-50 w-14 h-14 flex items-center justify-center border border-emerald-100" aria-hidden>
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
            <span key={s} className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {s}
            </span>
          ))}
        </div>

        {week.recipes?.length ? (
          <>
            <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3 mt-6">Easy recipes</p>
            <ul className="space-y-4">
              {week.recipes.map((r) => (
                <li key={r.name} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <RecipeCardInner recipe={r} />
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
  const [view, setView] = useState<"themes" | "cuisine" | "week7">("themes");
  const [cuisineFocus, setCuisineFocus] = useState<DietFuelCuisine | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  const byCuisine = useMemo(() => groupRecipesByCuisine(), []);

  if (!today) {
    return null;
  }

  const isoWeek = getISOWeekNumber(today);
  const current = getCurrentDietFuelWeek(today);
  const currentIndex = DIET_FUEL_WEEKS.findIndex((w) => w.id === current.id);

  return (
    <main className="w-full px-4 sm:px-6 lg:px-10 pt-6 pb-28 md:pb-10 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
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
              Budget-friendly ideas plus quick recipes — switch between weekly themes and a visual browse by cuisine.
            </p>
            <p className="text-white/90 text-xs mt-4 font-medium">
              Calendar week {isoWeek} · Theme &quot;{current.title}&quot;
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-6 p-1 rounded-2xl bg-slate-100/80 border border-slate-200 w-fit max-w-full">
        <button
          type="button"
          onClick={() => setView("themes")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            view === "themes" ? "bg-white text-emerald-800 shadow-sm" : "text-muted hover:text-dark"
          }`}
        >
          Weekly themes
        </button>
        <button
          type="button"
          onClick={() => setView("cuisine")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            view === "cuisine" ? "bg-white text-emerald-800 shadow-sm" : "text-muted hover:text-dark"
          }`}
        >
          By cuisine
        </button>
        <button
          type="button"
          onClick={() => setView("week7")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            view === "week7" ? "bg-white text-emerald-800 shadow-sm" : "text-muted hover:text-dark"
          }`}
        >
          7-day meals
        </button>
      </div>

      {view === "themes" ? (
        <>
          <p className="text-sm text-muted mb-4 max-w-2xl">
            Eight themes rotate by calendar week. Each card has tips, shopping tags, and three recipes.
          </p>
          <div className="grid gap-5 md:grid-cols-2 mb-6">
            {DIET_FUEL_WEEKS.map((week, i) => (
              <WeekCard key={week.id} week={week} highlight={i === currentIndex} />
            ))}
          </div>
        </>
      ) : view === "cuisine" ? (
        <>
          <p className="text-sm text-muted mb-4 max-w-2xl">
            Tap a cuisine tile, then expand a recipe. Same content as the weekly cards — organized for quick scanning.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {FUEL_CUISINE_ORDER.map((c) => {
              const v = CUISINE_VISUAL[c];
              const count = byCuisine[c].length;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCuisineFocus(cuisineFocus === c ? null : c)}
                  className={`text-left rounded-2xl border-2 p-4 transition-all bg-gradient-to-br ${v.gradient} ${
                    cuisineFocus === c ? "border-emerald-500 ring-2 ring-emerald-200" : "border-slate-100 hover:border-emerald-200"
                  }`}
                >
                  <span className="text-3xl">{v.emoji}</span>
                  <p className="font-black text-dark text-sm mt-2">{c}</p>
                  <p className="text-xs text-muted mt-0.5 line-clamp-2">{v.blurb}</p>
                  <p className="text-xs font-bold text-emerald-700 mt-2">{count} recipes</p>
                </button>
              );
            })}
          </div>

          {cuisineFocus && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mb-6">
              <h2 className="text-lg font-black text-dark flex items-center gap-2">
                <span>{CUISINE_VISUAL[cuisineFocus].emoji}</span> {cuisineFocus} recipes
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {byCuisine[cuisineFocus].map((r) => (
                  <div key={`${r.weekId}-${r.name}`} className="card p-5 border border-slate-100">
                    <RecipeCardInner
                      recipe={r}
                      weekHint={`${r.weekIcon} Week theme: ${r.weekTitle}`}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <>
          <p className="text-sm text-muted mb-4 max-w-2xl">
            Seven sample days with breakfast, lunch, and dinner — each with a reference photo, pantry list, and cooking steps with ingredients highlighted.
          </p>
          <div className="space-y-10 mb-6">
            {SEVEN_DAY_MEAL_PLAN.map((day, idx) => (
              <motion.section
                key={day.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="card overflow-hidden border border-emerald-100"
              >
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3">
                  <h2 className="text-lg font-black text-white">Day {day.dayIndex} · {day.label}</h2>
                </div>
                <div className="p-5 md:p-6 space-y-6">
                  {(["Breakfast", "Lunch", "Dinner"] as const).map((label) => {
                    const slot = label.toLowerCase() as "breakfast" | "lunch" | "dinner";
                    const m = day[slot];
                    return (
                      <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 md:flex md:gap-5 md:items-start">
                        <div className="w-full md:w-48 shrink-0 aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 mb-3 md:mb-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={mealImage(m)} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-1">{label}</p>
                          <p className="font-black text-dark">{m.title}</p>
                          <p className="text-xs text-muted mt-1">
                            {m.cuisine} · {m.minutes} min
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2 mb-3">
                            {m.staples.map((s) => (
                              <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white border border-slate-100 text-slate-600">
                                {s}
                              </span>
                            ))}
                          </div>
                          <ol className="list-decimal list-inside space-y-1 text-xs text-dark">
                            {m.steps.map((step, si) => (
                              <li key={si}>
                                <HighlightedStep text={step} staples={m.staples} />
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            ))}
          </div>
        </>
      )}

      <p className="text-xs text-muted text-center max-w-lg mx-auto leading-relaxed">
        Tips and recipes are general wellness ideas, not medical advice. Adapt for allergies, halal/kosher/veg needs, and budget.
      </p>
    </main>
  );
}
