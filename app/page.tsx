"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { getCompletedDays, getProfile } from "@/lib/user-store";
import { getRandomReminder } from "@/lib/reminders";
import { ROUTINE_GROUPS, getGroupById } from "@/lib/routines";
import { useEffect, useState } from "react";
import { DietFuelPreview } from "@/components/home/DietFuelPreview";
import { VibeSyncPreview } from "@/components/home/VibeSyncPreview";

type ResumeTarget = { groupId: string; groupName: string; icon: string; nextDay: number } | null;

const GRADIENTS: Record<string, string> = {
  primary: "from-[#d84315] to-[#FF8A65]",
  accent:  "from-[#00897B] to-[#00BCD4]",
  purple:  "from-[#7C3AED] to-[#A855F7]",
  blue:    "from-[#0EA5E9] to-[#6366F1]",
};

const GRADIENT_BG: Record<string, string> = {
  primary: "linear-gradient(135deg,#d84315,#FF8A65)",
  accent:  "linear-gradient(135deg,#00897B,#00BCD4)",
  purple:  "linear-gradient(135deg,#7C3AED,#A855F7)",
  blue:    "linear-gradient(135deg,#0EA5E9,#6366F1)",
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
function getFormattedDate() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export default function HomePage() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [daysActive, setDaysActive] = useState(0);
  const [calories, setCalories] = useState(0);
  const [motivation, setMotivation] = useState("");
  const [profile, setProfile] = useState<ReturnType<typeof getProfile>>(null);
  const [recommendedGroups, setRecommendedGroups] = useState(ROUTINE_GROUPS);
  const [resumeTarget, setResumeTarget] = useState<ResumeTarget>(null);

  useEffect(() => {
    setMotivation(getRandomReminder());
    const completed = getCompletedDays();
    setTotalSessions(completed.length);
    setCalories(completed.length * 280);

    const byDate = new Set(completed.map((d) => d.date));
    setDaysActive(byDate.size);

    let streak = 0;
    const today = new Date().toISOString().slice(0, 10);
    const sorted = Array.from(byDate).sort().reverse();
    for (const d of sorted) {
      const diff = Math.floor((new Date(today).getTime() - new Date(d).getTime()) / 86400000);
      if (diff === streak) streak++;
      else break;
    }
    setStreak(streak);

    const p = getProfile();
    setProfile(p);
    if (p?.goals?.length) {
      const goalIds = new Set(p.goals);
      setRecommendedGroups(
        [...ROUTINE_GROUPS].sort((a, b) => (goalIds.has(b.id) ? 1 : 0) - (goalIds.has(a.id) ? 1 : 0))
      );
    }

    let best: { groupId: string; nextDay: number } | null = null;
    for (const group of ROUTINE_GROUPS) {
      const maxDay = completed.filter((d) => d.groupId === group.id).reduce((m, d) => Math.max(m, d.day), 0);
      const nextDay = maxDay + 1;
      if (nextDay <= group.totalDays && (!best || nextDay < best.nextDay)) best = { groupId: group.id, nextDay };
    }
    if (best) {
      const g = getGroupById(best.groupId);
      if (g) setResumeTarget({ groupId: best.groupId, groupName: g.name, icon: g.icon, nextDay: best.nextDay });
    }
  }, []);

  const firstName = user?.name?.split(" ")[0] || "there";

  const stats = [
    { icon: "🔥", value: streak,         label: "Day streak",     sub: streak > 0 ? "Keep it up!" : "Start today", cls: "from-orange-50 to-red-50 border-orange-100", val: "text-primary" },
    { icon: "💪", value: totalSessions,   label: "Sessions done",  sub: "All time",   cls: "from-white to-slate-50 border-slate-100",  val: "text-dark" },
    { icon: "⚡", value: `${(calories/1000).toFixed(1)}k`, label: "kcal burned", sub: "Estimated", cls: "from-amber-50 to-yellow-50 border-amber-100", val: "text-amber-600" },
    { icon: "📅", value: daysActive,      label: "Days active",    sub: "All time",   cls: "from-teal-50 to-cyan-50 border-teal-100",  val: "text-accent" },
  ];

  return (
    <main className="w-full px-4 sm:px-6 lg:px-10 pt-6 pb-28 md:pb-10 min-h-screen">

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-8"
      >
        <div>
          <p className="text-muted text-sm font-medium tracking-wide">{getFormattedDate()}</p>
          <h1 className="text-3xl font-black text-dark mt-0.5 leading-tight">
            {getGreeting()}, {firstName}! 👋
          </h1>
          <p className="text-muted text-sm mt-2 italic max-w-lg">&ldquo;{motivation}&rdquo;</p>
        </div>
        <Link
          href="/routines"
          className="hidden md:inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm bg-gradient-fitness shadow-primary hover:shadow-primary-lg transition-shadow"
        >
          Start workout
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </Link>
      </motion.div>

      {/* ── 4 Stat cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className={`card p-5 md:p-6 bg-gradient-to-br border ${s.cls}`}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-xs font-semibold text-muted bg-white/80 px-2.5 py-1 rounded-full">{s.sub}</span>
            </div>
            <p className={`text-4xl font-black leading-none ${s.val}`}>{s.value}</p>
            <p className="text-sm text-muted font-medium mt-2">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Main 2-col layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-6 lg:gap-8">

        {/* ── Left: routine grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-xl font-black text-dark">
                {profile?.goals?.length ? "Recommended for you" : "Your routines"}
              </h2>
              <p className="text-sm text-muted mt-0.5">30-day programs · pick your focus</p>
            </div>
            <Link href="/routines" className="text-sm font-bold text-primary hover:underline underline-offset-2 whitespace-nowrap">
              All routines →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {recommendedGroups.map((group) => (
              <motion.div
                key={group.id}
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.18 }}
              >
                <Link
                  href={`/routines/${group.id}`}
                  className={`block p-5 rounded-2xl bg-gradient-to-br ${GRADIENTS[group.color] ?? GRADIENTS.primary} relative overflow-hidden group`}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/4" />
                  <span className="text-3xl mb-3 block relative">{group.icon}</span>
                  <p className="font-bold text-white text-sm relative">{group.name}</p>
                  <p className="text-white/90 text-xs mt-1 relative">{group.durationMinutes} min · 30 days</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Right: resume + quick actions ── */}
        <div className="space-y-4">

          {/* Resume or Start CTA */}
          {resumeTarget ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="card overflow-hidden">
                <div className="h-1.5 bg-gradient-fitness" />
                <div className="p-5">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Continue</p>
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-primary"
                      style={{ background: GRADIENT_BG[ROUTINE_GROUPS.find(g=>g.id===resumeTarget.groupId)?.color ?? "primary"] ?? GRADIENT_BG.primary }}
                    >
                      {resumeTarget.icon}
                    </div>
                    <div>
                      <p className="font-black text-dark text-base">{resumeTarget.groupName}</p>
                      <p className="text-sm text-muted">Day {resumeTarget.nextDay} of 30</p>
                    </div>
                  </div>
                  <Link
                    href={`/routines/${resumeTarget.groupId}/${resumeTarget.nextDay}`}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-fitness text-white font-bold text-sm shadow-primary"
                  >
                    Resume Day {resumeTarget.nextDay}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Link href="/routines" className="card p-5 block group hover:shadow-card-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-fitness flex items-center justify-center text-2xl shadow-primary mb-4">🚀</div>
                <p className="font-bold text-dark text-base">Start your first routine</p>
                <p className="text-sm text-muted mt-1 leading-relaxed">Pick a goal and begin your 30-day fitness journey</p>
                <p className="text-sm font-bold text-primary mt-3 group-hover:underline underline-offset-2">Browse routines →</p>
              </Link>
            </motion.div>
          )}

          {/* Progress mini-card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
            <Link href="/progress" className="card p-5 block group hover:shadow-card-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <p className="font-bold text-dark">Progress overview</p>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500 group-hover:text-primary transition-colors" aria-hidden><path d="M9 18l6-6-6-6" /></svg>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-primary/8">
                  <p className="text-2xl font-black text-primary">{streak}</p>
                  <p className="text-xs text-muted mt-0.5">streak</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <p className="text-2xl font-black text-dark">{totalSessions}</p>
                  <p className="text-xs text-muted mt-0.5">sessions</p>
                </div>
                <div className="p-2 rounded-xl bg-accent/8">
                  <p className="text-2xl font-black text-accent">{daysActive}</p>
                  <p className="text-xs text-muted mt-0.5">days</p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Quick links */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 gap-3">
            <Link href="/period" className="card p-4 block group hover:shadow-card-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-xl mb-3">🌸</div>
              <p className="font-bold text-dark text-sm">Cycle</p>
              <p className="text-xs text-muted mt-0.5">Track & adapt</p>
            </Link>
            <Link href="/reminders" className="card p-4 block group hover:shadow-card-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl mb-3">🔔</div>
              <p className="font-bold text-dark text-sm">Reminders</p>
              <p className="text-xs text-muted mt-0.5">Stay on track</p>
            </Link>
          </motion.div>

        </div>
      </div>

      <DietFuelPreview />
      <VibeSyncPreview />
    </main>
  );
}
