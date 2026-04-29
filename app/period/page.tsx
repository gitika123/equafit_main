"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getPeriodLog, addPeriodEntry, getProfile, type PeriodEntry } from "@/lib/user-store";

const PHASES = [
  { id: "menstrual",  label: "Menstrual",  days: "Days 1–5",   icon: "🩸", color: "bg-rose-500",   light: "bg-rose-50",   border: "border-rose-200",   text: "text-rose-600",   tip: "Rest, warmth, and gentle movement. Your body is doing important work." },
  { id: "follicular", label: "Follicular", days: "Days 6–13",  icon: "🌱", color: "bg-violet-500", light: "bg-violet-50", border: "border-violet-200", text: "text-violet-600", tip: "Energy rising! Great time to try new workouts or increase intensity." },
  { id: "ovulation",  label: "Ovulation",  days: "Days 14–16", icon: "✨", color: "bg-amber-500",  light: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-600",  tip: "Peak strength and stamina. HIIT, strength training — you've got this." },
  { id: "luteal",     label: "Luteal",     days: "Days 17–28", icon: "🌙", color: "bg-teal-500",   light: "bg-teal-50",   border: "border-teal-200",   text: "text-teal-600",   tip: "Wind down gradually. Yoga, pilates, and easy cardio feel best now." },
];

const SYMPTOMS = ["Cramps", "Bloating", "Headache", "Mood swings", "Fatigue", "Back pain", "Tender breasts", "Nausea"];

function getCycleInfo(log: PeriodEntry[]) {
  if (!log.length) return null;
  const sorted = [...log].sort((a, b) => b.startDate.localeCompare(a.startDate));
  const lastStart = new Date(sorted[0].startDate);
  const today = new Date(); today.setHours(0, 0, 0, 0); lastStart.setHours(0, 0, 0, 0);
  const rawDay = Math.floor((today.getTime() - lastStart.getTime()) / 86400000) + 1;
  const CYCLE = 28;
  const dayOfCycle = rawDay > CYCLE ? ((rawDay - 1) % CYCLE) + 1 : Math.max(1, rawDay);
  let phaseId = "follicular";
  if (dayOfCycle <= 5) phaseId = "menstrual";
  else if (dayOfCycle <= 13) phaseId = "follicular";
  else if (dayOfCycle <= 16) phaseId = "ovulation";
  else phaseId = "luteal";
  const nextPeriodDate = new Date(lastStart.getTime() + CYCLE * 86400000);
  return { dayOfCycle, phaseId, daysUntilNext: CYCLE - dayOfCycle + 1, nextPeriodDate };
}

export default function PeriodPage() {
  const profile = getProfile();
  const isBlockedForProfile = profile?.gender === "male";
  const [log, setLog] = useState<PeriodEntry[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [flow, setFlow] = useState<"light" | "medium" | "heavy" | "">("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  useEffect(() => { setLog(getPeriodLog()); }, []);

  if (isBlockedForProfile) {
    return (
      <main className="w-full px-4 sm:px-6 lg:px-10 pt-6 pb-28 md:pb-10 min-h-screen">
        <div className="card p-8 text-center max-w-xl mx-auto mt-8">
          <p className="text-5xl mb-3">🚫</p>
          <h1 className="text-2xl font-black text-dark mb-2">Cycle Tracker not available</h1>
          <p className="text-sm text-muted mb-5">
            This feature is disabled for male profiles. You can continue using routines, progress tracking, reminders, and the diet guide.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-fitness text-white font-bold text-sm">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const cycleInfo = useMemo(() => getCycleInfo(log), [log]);
  const currentPhase = PHASES.find((p) => p.id === cycleInfo?.phaseId) ?? PHASES[1];
  const isOnPeriod = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return log.some((e) => today >= e.startDate && today <= (e.endDate || e.startDate));
  }, [log]);

  function toggleSymptom(s: string) {
    setSelectedSymptoms((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!startDate) return;
    addPeriodEntry({ startDate, endDate: endDate || startDate, notes: notes || undefined, flow: flow || undefined, symptoms: selectedSymptoms.length ? selectedSymptoms : undefined });
    setLog(getPeriodLog());
    setStartDate(""); setEndDate(""); setNotes(""); setFlow(""); setSelectedSymptoms([]);
  }

  return (
    <main className="w-full px-4 sm:px-6 lg:px-10 pt-6 pb-28 md:pb-10 min-h-screen">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-dark leading-tight">Cycle Tracker</h1>
          <p className="text-muted text-sm mt-1">Track your period, understand your phases, log symptoms.</p>
        </div>
      </motion.div>

      {/* ── Desktop 2-col ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6 lg:gap-8 items-start">

        {/* ── LEFT: phase info + strip ── */}
        <div className="space-y-5">

          {/* Current phase card */}
          <AnimatePresence mode="wait">
            {cycleInfo ? (
              <motion.div key="phase" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className={`card p-6 ${currentPhase.light} border-2 ${currentPhase.border}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${currentPhase.color} flex items-center justify-center text-3xl flex-shrink-0 shadow-sm`}>
                    {currentPhase.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className={`text-xl font-black ${currentPhase.text}`}>{currentPhase.label} Phase</h2>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full bg-white ${currentPhase.text}`}>
                        Day {cycleInfo.dayOfCycle} / 28
                      </span>
                    </div>
                    <p className="text-sm text-dark/70 leading-relaxed">{currentPhase.tip}</p>
                    <div className="mt-4 h-2.5 bg-white/60 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(cycleInfo.dayOfCycle / 28) * 100}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className={`h-full ${currentPhase.color} rounded-full`} />
                    </div>
                    <p className="text-sm mt-3">
                      Next period in{" "}
                      <span className={`font-bold ${currentPhase.text}`}>{cycleInfo.daysUntilNext} days</span>
                      {" "}· {cycleInfo.nextPeriodDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty-phase" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="card p-10 text-center bg-slate-50">
                <p className="text-5xl mb-3">📅</p>
                <p className="font-bold text-dark">No cycle data yet</p>
                <p className="text-sm text-muted mt-1">Log your first period using the form on the right to see phase tracking.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase strip */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-4 gap-3">
            {PHASES.map((phase) => {
              const isActive = cycleInfo?.phaseId === phase.id;
              return (
                <motion.div key={phase.id} whileHover={{ scale: 1.03 }}
                  className={`p-4 rounded-2xl text-center border-2 transition-all cursor-default ${
                    isActive ? `${phase.light} ${phase.border} shadow-sm` : "bg-white border-slate-100"
                  }`}>
                  <span className="text-2xl">{phase.icon}</span>
                  <p className={`text-xs font-bold mt-1.5 ${isActive ? phase.text : "text-muted"}`}>{phase.label}</p>
                  <p className="text-xs text-muted mt-0.5">{phase.days}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Period-friendly routine banner */}
          {isOnPeriod && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="card p-5 bg-gradient-to-br from-purple-50 to-rose-50 border-2 border-purple-200">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🌸</span>
                <div className="flex-1">
                  <p className="font-bold text-dark">You&apos;re on a period day</p>
                  <p className="text-sm text-muted mt-1">A gentle, period-friendly routine is ready for you.</p>
                  <Link href="/routines/period-light"
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2.5 rounded-xl bg-purple-500 text-white font-bold text-sm">
                    Open period-friendly routine
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* History */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h2 className="font-black text-dark text-lg mb-4">History</h2>
            {log.length === 0 ? (
              <div className="card p-10 text-center bg-slate-50">
                <p className="text-4xl mb-2">📋</p>
                <p className="text-sm text-muted">No entries yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...log].reverse().slice(0, 8).map((entry, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="card p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">🌸</span>
                          <p className="font-bold text-dark text-sm">
                            {entry.startDate}{entry.endDate && entry.endDate !== entry.startDate ? ` – ${entry.endDate}` : ""}
                          </p>
                          {entry.flow && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100 font-medium capitalize">
                              {entry.flow === "light" ? "💧" : entry.flow === "medium" ? "💧💧" : "💧💧💧"} {entry.flow}
                            </span>
                          )}
                        </div>
                        {entry.symptoms && entry.symptoms.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {entry.symptoms.map((s) => (
                              <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-500 border border-rose-100">{s}</span>
                            ))}
                          </div>
                        )}
                        {entry.notes && <p className="text-xs text-muted mt-1.5 italic">{entry.notes}</p>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* ── RIGHT: sticky log form ── */}
        <div className="lg:sticky lg:top-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-xl">🩸</div>
              <div>
                <h2 className="font-black text-dark">Log Period</h2>
                <p className="text-xs text-muted">Add or update an entry</p>
              </div>
            </div>

            <form onSubmit={handleAdd} className="space-y-5">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Start date *</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                    className="w-full input-base text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">End date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                    className="w-full input-base text-sm" />
                </div>
              </div>

              {/* Flow intensity */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-2">Flow intensity</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["light", "medium", "heavy"] as const).map((f) => (
                    <button key={f} type="button" onClick={() => setFlow(flow === f ? "" : f)}
                      className={`py-3 rounded-xl text-sm font-semibold capitalize border-2 transition-all ${
                        flow === f ? "bg-rose-50 border-rose-400 text-rose-700" : "bg-white border-slate-200 text-muted hover:border-slate-300"
                      }`}>
                      <span className="block text-base mb-0.5">{f === "light" ? "💧" : f === "medium" ? "💧💧" : "💧💧💧"}</span>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-2">Symptoms</label>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOMS.map((s) => (
                    <button key={s} type="button" onClick={() => toggleSymptom(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                        selectedSymptoms.includes(s) ? "bg-rose-50 border-rose-400 text-rose-700" : "bg-white border-slate-200 text-muted hover:border-slate-300"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Notes (optional)</label>
                <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. took ibuprofen, stressful week..."
                  className="w-full input-base text-sm" />
              </div>

              <button type="submit"
                className="w-full py-3.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-base transition-colors shadow-sm">
                Save entry
              </button>
            </form>
          </motion.div>

          {/* Cycle stats summary */}
          {log.length > 0 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
              className="card p-5 mt-4">
              <p className="text-sm font-black text-dark mb-3">Cycle stats</p>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-rose-50">
                  <p className="text-2xl font-black text-rose-500">{log.length}</p>
                  <p className="text-xs text-muted mt-0.5">entries logged</p>
                </div>
                <div className="p-3 rounded-xl bg-violet-50">
                  <p className="text-2xl font-black text-violet-500">{cycleInfo?.dayOfCycle ?? "—"}</p>
                  <p className="text-xs text-muted mt-0.5">day of cycle</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
