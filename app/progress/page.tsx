"use client";

import { useEffect, useState, useRef, useCallback, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  getCompletedDays,
  getProfile,
  getWeightLog,
  addWeightEntry,
  getRunLog,
  addRunEntry,
  removeRunEntry,
  importRunsFromWearableCsv,
  validateWeightKg,
  WEIGHT_LOG_KG_MIN,
  WEIGHT_LOG_KG_MAX,
} from "@/lib/user-store";
import { validateOptionalDistanceKm } from "@/lib/user-validation";
import { estimateTotalKcal } from "@/lib/activity-stats";

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}
function msToDays(ms: number) {
  return Math.floor(ms / 86400000);
}

function AnimCount({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = Date.now();
    const duration = 800;
    function tick() {
      const p = Math.min(1, (Date.now() - start) / duration);
      setVal(Math.round(p * to));
      if (p < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to]);
  return <>{val}{suffix}</>;
}

export default function ProgressPage() {
  const [sessions, setSessions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [daysActive, setDaysActive] = useState(0);
  const [calories, setCalories] = useState(0);
  const [weekCounts, setWeekCounts] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [heatmap, setHeatmap] = useState<{ date: string; count: number }[]>([]);
  const [weights, setWeights] = useState<{ date: string; weightKg: number }[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [profile, setProfile] = useState<ReturnType<typeof getProfile>>(null);
  const weightInputRef = useRef<HTMLInputElement>(null);
  const [runs, setRuns] = useState<ReturnType<typeof getRunLog>>([]);
  const [runDate, setRunDate] = useState(() => formatDate(new Date()));
  const [runDuration, setRunDuration] = useState("");
  const [runDistance, setRunDistance] = useState("");
  const [runNotes, setRunNotes] = useState("");
  const [runLogError, setRunLogError] = useState("");
  const [importRunMessage, setImportRunMessage] = useState("");
  const [weightError, setWeightError] = useState("");
  const runImportRef = useRef<HTMLInputElement>(null);

  const refreshProgress = useCallback(() => {
    const completed = getCompletedDays();
    const runsList = getRunLog();
    setRuns(runsList);
    const p = getProfile();
    setProfile(p);
    setSessions(completed.length);
    setCalories(Math.round(estimateTotalKcal(completed.length, runsList)));

    const byDate = new Set([...completed.map((d) => d.date), ...runsList.map((r) => r.date)]);
    setDaysActive(byDate.size);

    let s = 0;
    const today = new Date().toISOString().slice(0, 10);
    const sorted = Array.from(byDate).sort().reverse();
    for (const d of sorted) {
      if (msToDays(new Date(today).getTime() - new Date(d).getTime()) === s) s++;
      else break;
    }
    setStreak(s);

    const wc = [0, 0, 0, 0, 0, 0, 0];
    const now = new Date();
    completed.forEach((d) => {
      const diff = msToDays(now.getTime() - new Date(d.date).getTime());
      if (diff >= 0 && diff < 7) wc[6 - diff]++;
    });
    runsList.forEach((r) => {
      const diff = msToDays(now.getTime() - new Date(r.date).getTime());
      if (diff >= 0 && diff < 7) wc[6 - diff]++;
    });
    setWeekCounts(wc);

    const hm: { date: string; count: number }[] = [];
    for (let i = 34; i >= 0; i--) {
      const dt = new Date(now);
      dt.setDate(dt.getDate() - i);
      const key = formatDate(dt);
      const sessionCount = completed.filter((c) => c.date === key).length;
      const runCount = runsList.filter((rr) => rr.date === key).length;
      hm.push({ date: key, count: sessionCount + runCount });
    }
    setHeatmap(hm);

    setWeights(getWeightLog());
  }, []);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  function logRun() {
    setRunLogError("");
    const min = parseInt(runDuration, 10);
    if (!runDuration.trim() || Number.isNaN(min) || min < 1 || min > 24 * 60) {
      setRunLogError("Enter minutes (1–1440) so we can log your run.");
      return;
    }
    const dist = parseFloat(runDistance);
    const distCheck = validateOptionalDistanceKm(Number.isNaN(dist) ? undefined : dist);
    if (!distCheck.ok) {
      setRunLogError(distCheck.message);
      return;
    }
    addRunEntry({
      date: runDate,
      durationMin: min,
      distanceKm: !Number.isNaN(dist) && dist > 0 ? dist : undefined,
      notes: runNotes.trim() || undefined,
    });
    setRunDuration("");
    setRunDistance("");
    setRunNotes("");
    setRunDate(formatDate(new Date()));
    refreshProgress();
  }

  function deleteRun(id: string) {
    removeRunEntry(id);
    refreshProgress();
  }

  function logWeight() {
    setWeightError("");
    const kg = parseFloat(newWeight);
    const v = validateWeightKg(kg);
    if (!v.ok) {
      setWeightError(v.message);
      return;
    }
    addWeightEntry({ date: formatDate(new Date()), weightKg: kg });
    setWeights(getWeightLog());
    setNewWeight("");
    weightInputRef.current?.blur();
  }

  function onImportRunsFile(e: ChangeEvent<HTMLInputElement>) {
    setImportRunMessage("");
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const { added, error } = importRunsFromWearableCsv(text);
      if (error) setImportRunMessage(error);
      else setImportRunMessage(`Imported ${added} run${added === 1 ? "" : "s"}.`);
      refreshProgress();
      if (runImportRef.current) runImportRef.current.value = "";
      setTimeout(() => setImportRunMessage(""), 5000);
    };
    reader.readAsText(file);
  }

  // BMI
  const heightCm = profile?.heightCm ?? 0;
  const latestWeight = weights.length ? weights[weights.length - 1].weightKg : profile?.weightKg ?? 0;
  const bmi = heightCm && latestWeight ? latestWeight / ((heightCm / 100) ** 2) : 0;
  const bmiLabel = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  const bmiColor = bmi < 18.5 ? "#0EA5E9" : bmi < 25 ? "#10B981" : bmi < 30 ? "#F59E0B" : "#EF4444";
  const bmiPct = Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100));

  // Weight SVG chart
  const WW = 420, WH = 120;
  const chartWeights = weights.slice(-10);
  let weightPath = "";
  if (chartWeights.length > 1) {
    const min = Math.min(...chartWeights.map((w) => w.weightKg)) - 2;
    const max = Math.max(...chartWeights.map((w) => w.weightKg)) + 2;
    weightPath = chartWeights.map((w, i) => {
      const x = (i / (chartWeights.length - 1)) * WW;
      const y = WH - ((w.weightKg - min) / (max - min)) * (WH - 20) - 10;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  }

  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
  const maxWeek = Math.max(...weekCounts, 1);

  const runWeekTotals = (() => {
    const now = new Date();
    let km = 0;
    let minutes = 0;
    runs.forEach((r) => {
      const diff = msToDays(now.getTime() - new Date(r.date).getTime());
      if (diff >= 0 && diff < 7) {
        minutes += r.durationMin;
        if (r.distanceKm != null) km += r.distanceKm;
      }
    });
    return { kmWeek: km, minWeek: minutes };
  })();

  const statsRow = [
    { icon: "🔥", value: streak,     label: "Day streak",   sub: "Any activity", cls: "from-orange-50 to-red-50 border-orange-100",     val: "text-primary" },
    { icon: "💪", value: sessions,   label: "Sessions done", sub: "Routines", cls: "from-white to-slate-50 border-slate-100",        val: "text-dark" },
    { icon: "🏃", value: runs.length, label: "Runs logged", sub: "Cardio", cls: "from-sky-50 to-indigo-50 border-sky-100", val: "text-sky-600" },
    { icon: "⚡", value: Math.round(calories), label: "kcal burned", sub: "Estimated", cls: "from-amber-50 to-yellow-50 border-amber-100", val: "text-amber-600" },
    { icon: "📅", value: daysActive, label: "Days active",   sub: "All time", cls: "from-teal-50 to-cyan-50 border-teal-100",       val: "text-accent" },
  ];

  return (
    <main className="w-full px-4 sm:px-6 lg:px-10 pt-6 pb-28 md:pb-10 min-h-screen">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-dark leading-tight">Progress</h1>
        <p className="text-muted text-sm mt-1">Track routines, runs, streaks, weight, and body metrics.</p>
      </motion.div>

      {/* ── 4 Stat cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5 mb-8">
        {statsRow.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`card p-5 md:p-6 bg-gradient-to-br border ${s.cls}`}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-xs font-semibold text-muted bg-white/80 px-2.5 py-1 rounded-full">{s.sub}</span>
            </div>
            <p className={`text-4xl font-black leading-none ${s.val}`}>
              <AnimCount to={typeof s.value === "number" ? s.value : 0} />
            </p>
            <p className="text-sm text-muted font-medium mt-2">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Main 2-col grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-6 lg:gap-8">

        {/* ── Left column ── */}
        <div className="space-y-6">

          {/* Sessions per week bar chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-black text-dark text-lg">Activity — last 7 days</h2>
                <p className="text-muted text-sm mt-0.5">Routine sessions + logged runs per day</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-primary">{weekCounts.reduce((a, b) => a + b, 0)}</p>
                <p className="text-xs text-muted">this week</p>
              </div>
            </div>
            <div className="flex items-end gap-2 h-32">
              {weekCounts.map((count, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs font-bold text-dark">{count > 0 ? count : ""}</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(4, (count / maxWeek) * 96)}px` }}
                    transition={{ delay: 0.3 + i * 0.05, type: "spring", stiffness: 200 }}
                    className={`w-full rounded-lg ${count > 0 ? "bg-gradient-fitness shadow-primary" : "bg-slate-100"}`}
                  />
                  <span className="text-xs text-muted">{dayLabels[i]}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity heatmap */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-black text-dark text-lg">Activity heatmap</h2>
                <p className="text-muted text-sm mt-0.5">Workouts + runs · last 35 days</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted">less</span>
                {[0, 1, 2, 3].map((v) => (
                  <div key={v} className="w-3 h-3 rounded-sm" style={{ background: v === 0 ? "#F1F5F9" : `rgba(216,67,21,${0.2 + v * 0.27})` }} />
                ))}
                <span className="text-xs text-muted">more</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {heatmap.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.count} activit${day.count === 1 ? "y" : "ies"}`}
                  className="aspect-square rounded-md cursor-default transition-transform hover:scale-110"
                  style={{ background: day.count === 0 ? "#F1F5F9" : `rgba(244,81,30,${Math.min(0.9, 0.25 + day.count * 0.3)})` }}
                />
              ))}
            </div>
            <div className="mt-3 flex justify-between text-xs text-muted">
              <span>{heatmap[0]?.date}</span>
              <span>{heatmap[heatmap.length - 1]?.date}</span>
            </div>
          </motion.div>

          {/* Run log */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }} className="card p-6 border border-sky-100 bg-gradient-to-br from-sky-50/80 to-white">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
              <div>
                <h2 className="font-black text-dark text-lg flex items-center gap-2">
                  <span>🏃</span> Run log
                </h2>
                <p className="text-muted text-sm mt-0.5">
                  Log outdoor or treadmill runs — distance is optional. Import a CSV from Apple Health / Google Fit (export then save as{" "}
                  <code className="text-xs bg-white/80 px-1 rounded">date,duration_min</code>) or add rows manually.
                </p>
              </div>
              <div className="flex gap-4 text-sm shrink-0">
                <div className="px-3 py-2 rounded-xl bg-white border border-sky-100">
                  <p className="text-xs text-muted font-semibold uppercase tracking-wide">This week</p>
                  <p className="font-black text-sky-700">{runWeekTotals.minWeek} min</p>
                  {runWeekTotals.kmWeek > 0 && (
                    <p className="text-xs text-sky-600 font-medium">{runWeekTotals.kmWeek.toFixed(1)} km</p>
                  )}
                </div>
              </div>
            </div>

            {runLogError ? (
              <p className="text-sm font-semibold text-red-600 mb-3" role="alert">
                {runLogError}
              </p>
            ) : null}

            {importRunMessage ? (
              <p className={`text-sm font-semibold mb-3 ${importRunMessage.startsWith("Imported") ? "text-emerald-700" : "text-red-600"}`} role="status">
                {importRunMessage}
              </p>
            ) : null}

            <div className="mb-5 flex flex-wrap items-center gap-2">
              <input ref={runImportRef} type="file" accept=".csv,.txt,text/csv" className="hidden" onChange={onImportRunsFile} />
              <button
                type="button"
                onClick={() => runImportRef.current?.click()}
                className="px-4 py-2 rounded-xl border-2 border-sky-200 bg-white text-sky-800 text-sm font-bold hover:bg-sky-50 transition-colors"
              >
                Import runs (CSV)
              </button>
              <span className="text-xs text-muted">One row per run: YYYY-MM-DD, minutes [, km]</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 mb-5">
              <label className="lg:col-span-2 flex flex-col gap-1 text-xs font-semibold text-muted">
                Date
                <input
                  type="date"
                  value={runDate}
                  onChange={(e) => setRunDate(e.target.value)}
                  className="input-base text-sm"
                />
              </label>
              <label className="lg:col-span-2 flex flex-col gap-1 text-xs font-semibold text-muted">
                Minutes
                <input
                  type="number"
                  min={1}
                  max={1440}
                  value={runDuration}
                  onChange={(e) => setRunDuration(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && logRun()}
                  placeholder="30"
                  className="input-base text-sm"
                />
              </label>
              <label className="lg:col-span-2 flex flex-col gap-1 text-xs font-semibold text-muted">
                Distance (km, optional)
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={runDistance}
                  onChange={(e) => setRunDistance(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && logRun()}
                  placeholder="5.2"
                  className="input-base text-sm"
                />
              </label>
              <label className="lg:col-span-4 flex flex-col gap-1 text-xs font-semibold text-muted">
                Notes (optional)
                <input
                  type="text"
                  value={runNotes}
                  onChange={(e) => setRunNotes(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && logRun()}
                  placeholder="Morning loop, felt strong"
                  className="input-base text-sm"
                />
              </label>
              <div className="lg:col-span-2 flex items-end">
                <button
                  type="button"
                  onClick={logRun}
                  className="w-full px-4 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 transition-colors"
                >
                  Log run
                </button>
              </div>
            </div>

            {runs.length > 0 ? (
              <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {runs.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-start justify-between gap-3 py-2.5 px-3 rounded-xl bg-white border border-slate-100 text-sm"
                  >
                    <div>
                      <p className="font-bold text-dark">
                        {r.date}
                        <span className="font-semibold text-sky-600 ml-2">
                          {r.durationMin} min
                          {r.distanceKm != null && r.distanceKm > 0 ? ` · ${r.distanceKm} km` : ""}
                        </span>
                      </p>
                      {r.notes && <p className="text-muted text-xs mt-0.5">{r.notes}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteRun(r.id)}
                      className="shrink-0 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors px-2 py-1"
                      aria-label="Remove run"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted text-center py-6 rounded-xl bg-white/60 border border-dashed border-slate-200">
                No runs yet — add one after your next jog.
              </p>
            )}
          </motion.div>

          {/* Calories burned */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-1">Estimated energy burned</p>
                <p className="text-5xl font-black text-amber-600">
                  <AnimCount to={calories} /> <span className="text-2xl">kcal</span>
                </p>
                <p className="text-sm text-amber-700/70 mt-2">
                  Sessions (~280 kcal each) plus runs (~10 kcal/min estimate). For motivation only — not medical advice.
                </p>
              </div>
              <span className="text-6xl opacity-25">⚡</span>
            </div>
          </motion.div>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-5">

          {/* Weight tracker */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="card p-6">
            <h2 className="font-black text-dark text-lg mb-1">Weight tracker</h2>
            <p className="text-muted text-sm mb-5">
              Log daily to see your trend ({WEIGHT_LOG_KG_MIN}–{WEIGHT_LOG_KG_MAX} kg).
            </p>

            {chartWeights.length > 1 ? (
              <div className="mb-5 overflow-hidden rounded-xl bg-slate-50">
                <svg width="100%" viewBox={`0 0 ${WW} ${WH}`} preserveAspectRatio="none" className="h-28">
                  <defs>
                    <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d84315" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#d84315" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`${weightPath} L${WW},${WH} L0,${WH} Z`}
                    fill="url(#wGrad)"
                  />
                  <path d={weightPath} fill="none" stroke="#d84315" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ) : (
              <div className="h-28 mb-5 rounded-xl bg-slate-50 flex items-center justify-center">
                <p className="text-sm text-muted">Log 2+ entries to see your chart</p>
              </div>
            )}

            {/* Last few entries */}
            {weights.length > 0 && (
              <div className="space-y-2 mb-5">
                {weights.slice(-4).reverse().map((w) => (
                  <div key={w.date} className="flex justify-between items-center text-sm py-1 border-b border-slate-100 last:border-0">
                    <span className="text-muted">{w.date}</span>
                    <span className="font-bold text-dark">{w.weightKg} kg</span>
                  </div>
                ))}
              </div>
            )}

            {weightError ? (
              <p className="text-sm font-semibold text-red-600 mb-3" role="alert">
                {weightError}
              </p>
            ) : null}

            {/* Log weight */}
            <div className="flex gap-2">
              <input
                ref={weightInputRef}
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && logWeight()}
                placeholder="e.g. 68.5 kg"
                className="flex-1 input-base text-sm"
              />
              <button
                onClick={logWeight}
                className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                Log
              </button>
            </div>
          </motion.div>

          {/* BMI */}
          {bmi > 0 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="card p-6">
              <h2 className="font-black text-dark text-lg mb-1">BMI</h2>
              <p className="text-muted text-sm mb-5">Body Mass Index</p>

              <div className="flex items-end gap-3 mb-5">
                <p className="text-5xl font-black leading-none" style={{ color: bmiColor }}>
                  {bmi.toFixed(1)}
                </p>
                <div className="mb-1">
                  <span className="pill text-xs font-bold px-3 py-1" style={{ background: bmiColor + "20", color: bmiColor }}>{bmiLabel}</span>
                </div>
              </div>

              {/* BMI bar */}
              <div className="relative h-3 rounded-full overflow-hidden mb-2" style={{ background: "linear-gradient(to right, #0EA5E9 0%, #10B981 30%, #F59E0B 60%, #EF4444 100%)" }}>
                <motion.div
                  initial={{ left: "0%" }}
                  animate={{ left: `${bmiPct}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-dark shadow-md"
                  style={{ borderColor: bmiColor }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-xs text-muted mb-0.5">Weight</p>
                  <p className="font-bold text-dark">{latestWeight} kg</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-xs text-muted mb-0.5">Height</p>
                  <p className="font-bold text-dark">{heightCm} cm</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Streak history */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="card p-6 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100">
            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Current streak</p>
            <p className="text-5xl font-black text-primary">
              <AnimCount to={streak} />
              <span className="text-2xl ml-1">🔥</span>
            </p>
            <p className="text-sm text-orange-700/70 mt-2">{streak > 0 ? `${streak} day${streak !== 1 ? "s" : ""} in a row — incredible!` : "Do a session today to start your streak!"}</p>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
