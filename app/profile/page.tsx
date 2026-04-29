"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import {
  getProfile,
  setProfile as saveProfile,
  exportAllData,
  importAllData,
  getCompletedDays,
  getPeriodLog,
  getProgressStats,
  type UserProfile,
  type ExportedData,
} from "@/lib/user-store";

/* ── BMI ring ── */
function BMIRing({ bmi }: { bmi: number }) {
  const R = 52;
  const circ = 2 * Math.PI * R;
  const pct = Math.min(1, Math.max(0, (bmi - 14) / 26));
  const dash = circ * pct;
  let color = "#22c55e"; let label = "Normal"; let bg = "bg-green-50"; let tc = "text-green-600";
  if (bmi < 18.5) { color = "#60a5fa"; label = "Underweight"; bg = "bg-blue-50"; tc = "text-blue-500"; }
  else if (bmi >= 25 && bmi < 30) { color = "#f97316"; label = "Overweight"; bg = "bg-orange-50"; tc = "text-orange-500"; }
  else if (bmi >= 30) { color = "#b91c1c"; label = "Obese"; bg = "bg-red-50"; tc = "text-red-800"; }
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
          <circle cx="64" cy="64" r={R} fill="none" stroke="#f3f4f6" strokeWidth="10" />
          <motion.circle cx="64" cy="64" r={R} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circ} initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - dash }} transition={{ duration: 1.2, ease: "easeOut" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-black ${tc}`}>{bmi.toFixed(1)}</span>
          <span className="text-xs text-muted">BMI</span>
        </div>
      </div>
      <span className={`text-sm font-bold px-3 py-1 rounded-full ${bg} ${tc}`}>{label}</span>
    </div>
  );
}

/* ── Achievements ── */
type AchievementCheck = (s: number, ls: number, p: number) => boolean;
const ACHIEVEMENTS: { id: string; icon: string; label: string; desc: string; check: AchievementCheck }[] = [
  { id: "first",   icon: "🚀", label: "First Step",    desc: "Complete 1 session",   check: (s) => s >= 1 },
  { id: "five",    icon: "⭐", label: "Getting Going",  desc: "Complete 5 sessions",  check: (s) => s >= 5 },
  { id: "ten",     icon: "🏅", label: "Double Digits",  desc: "Complete 10 sessions", check: (s) => s >= 10 },
  { id: "thirty",  icon: "🏆", label: "Dedicated",      desc: "Complete 30 sessions", check: (s) => s >= 30 },
  { id: "streak3", icon: "🔥", label: "On Fire",        desc: "3-day streak",         check: (_s, ls) => ls >= 3 },
  { id: "streak7", icon: "💪", label: "Week Warrior",   desc: "7-day streak",         check: (_s, ls) => ls >= 7 },
  { id: "cycle",   icon: "🌸", label: "Cycle Tracker",  desc: "Log your first period",  check: (_s, _ls, p) => p >= 1 },
  { id: "cycle5",  icon: "🌺", label: "Cycle Master",   desc: "Log 5 period entries",   check: (_s, _ls, p) => p >= 5 },
];

const GOAL_ICONS: Record<string, string> = {
  increase_energy: "⚡", reduce_stress: "🧘", build_strength: "💪", general_wellness: "🌿",
  weight_loss: "🎯", flexibility: "🤸", cardio: "❤️", "belly-abs": "🎯", arms: "💪",
  legs: "🦵", "full-body": "🏋️", "stress-relief": "🧘", "period-light": "🌸",
};
function goalLabel(g: string) {
  const m: Record<string, string> = {
    increase_energy: "Increase Energy", reduce_stress: "Reduce Stress", build_strength: "Build Strength",
    general_wellness: "General Wellness", weight_loss: "Weight Loss", flexibility: "Flexibility",
    cardio: "Cardio", "belly-abs": "Belly & Abs", arms: "Arms", legs: "Legs",
    "full-body": "Full Body", "stress-relief": "Stress Relief", "period-light": "Period-Friendly",
  };
  return m[g] ?? g.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ── Main page ── */
export default function ProfilePage() {
  const { user, logout, refresh } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [periodCount, setPeriodCount] = useState(0);
  const [importMessage, setImportMessage] = useState<"success" | "error" | null>(null);
  const [editingWeight, setEditingWeight] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [weightDraft, setWeightDraft] = useState("");
  const [profileDraft, setProfileDraft] = useState<{ heightCm: string; age: string; gender: UserProfile["gender"]; periodTrackingEnabled: boolean }>({
    heightCm: "",
    age: "",
    gender: "female",
    periodTrackingEnabled: false,
  });
  const [tab, setTab] = useState<"overview" | "achievements" | "data">("overview");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function hydrateFromStorage() {
    const p = getProfile();
    setProfile(p);
    const completed = getCompletedDays();
    setSessions(completed.length);
    const { longestStreak: ls } = getProgressStats(completed);
    setLongestStreak(ls);
    setPeriodCount(getPeriodLog().length);
  }

  useEffect(() => {
    hydrateFromStorage();
  }, []);

  const bmi = profile ? profile.weightKg / Math.pow(profile.heightCm / 100, 2) : null;
  const achievements = ACHIEVEMENTS.map((a) => ({ ...a, unlocked: a.check(sessions, longestStreak, periodCount) }));
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const initials = user?.name ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "?";

  function handleExport() {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `equafit-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
  }
  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    setImportMessage(null);
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importAllData(JSON.parse(reader.result as string) as ExportedData);
        setImportMessage("success");
        hydrateFromStorage();
        refresh();
        if (fileInputRef.current) fileInputRef.current.value = "";
        setTimeout(() => setImportMessage(null), 3000);
      } catch { setImportMessage("error"); }
    };
    reader.readAsText(file);
  }
  function handleSaveWeight() {
    const kg = parseFloat(weightDraft);
    if (!profile || isNaN(kg) || kg <= 0) return;
    const updated: UserProfile = { ...profile, weightKg: kg };
    saveProfile(updated);
    setProfile(updated);
    setEditingWeight(false);
    refresh();
  }
  function startProfileEdit() {
    if (!profile) return;
    setProfileDraft({
      heightCm: String(profile.heightCm),
      age: String(profile.age),
      gender: profile.gender,
      periodTrackingEnabled: profile.periodTrackingEnabled,
    });
    setEditingProfile(true);
  }
  function cancelProfileEdit() {
    setEditingProfile(false);
  }
  function saveProfileEdits() {
    if (!profile) return;
    const heightCm = Number(profileDraft.heightCm);
    const age = Number(profileDraft.age);
    if (!Number.isFinite(heightCm) || heightCm < 100 || heightCm > 250) return;
    if (!Number.isFinite(age) || age < 13 || age > 100) return;
    const updated: UserProfile = {
      ...profile,
      heightCm,
      age,
      gender: profileDraft.gender,
      periodTrackingEnabled: profileDraft.gender === "male" ? false : profileDraft.periodTrackingEnabled,
    };
    saveProfile(updated);
    setProfile(updated);
    setEditingProfile(false);
    refresh();
  }
  async function handleLogout() { await logout(); router.replace("/login"); }

  const TABS = [
    { id: "overview" as const, icon: "📊", label: "Overview" },
    { id: "achievements" as const, icon: "🏅", label: "Badges" },
    { id: "data" as const, icon: "💾", label: "Data" },
  ];

  return (
    <main className="w-full px-4 sm:px-6 lg:px-10 pt-6 pb-28 md:pb-10 min-h-screen">

      {/* ── Page header (mobile) ── */}
      <div className="mb-6 md:hidden">
        <h1 className="text-2xl font-black text-dark">Profile</h1>
      </div>

      {/* ── Desktop 2-col layout ── */}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[320px_1fr] gap-6 lg:gap-8 items-start">

        {/* ── LEFT: avatar panel (sticky on desktop) ── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:sticky md:top-6 space-y-4"
        >
          {/* Avatar card */}
          <div className="card p-6 text-center">
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 14 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-orange-400 to-accent flex items-center justify-center text-white text-3xl font-black shadow-primary-lg"
                >
                  {initials}
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.18, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-400 border-2 border-white flex items-center justify-center shadow"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </motion.div>
              </div>
            </div>

            <h2 className="text-xl font-black text-dark">{user?.name || "Your Profile"}</h2>
            <p className="text-muted text-sm mt-0.5">{user?.email}</p>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-2 mt-5">
              <div className="p-2.5 rounded-xl bg-primary/8">
                <p className="text-xl font-black text-primary">{sessions}</p>
                <p className="text-xs text-muted mt-0.5">sessions</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50">
                <p className="text-xl font-black text-dark">{longestStreak}</p>
                <p className="text-xs text-muted mt-0.5">best streak</p>
              </div>
              <div className="p-2.5 rounded-xl bg-accent/8">
                <p className="text-xl font-black text-accent">{unlockedCount}</p>
                <p className="text-xs text-muted mt-0.5">badges</p>
              </div>
            </div>
          </div>

          {/* BMI card */}
          {bmi !== null && (
            <div className="card p-6 flex flex-col items-center">
              <BMIRing bmi={bmi} />
              <div className="mt-4 grid grid-cols-2 gap-3 w-full text-center text-sm">
                <div className="p-2.5 rounded-xl bg-slate-50">
                  <p className="font-bold text-dark">{profile?.weightKg} kg</p>
                  <p className="text-xs text-muted">weight</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50">
                  <p className="font-bold text-dark">{profile?.heightCm} cm</p>
                  <p className="text-xs text-muted">height</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab nav (desktop: vertical list) */}
          <div className="card p-2 hidden md:block">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all mb-1 last:mb-0 ${
                  tab === t.id ? "bg-primary/10 text-primary" : "text-muted hover:bg-slate-50 hover:text-dark"
                }`}
              >
                <span className="text-base">{t.icon}</span>
                {t.label}
                {tab === t.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="hidden md:flex w-full items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-300 text-red-800 font-semibold text-sm hover:bg-red-50 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            Log out
          </button>
        </motion.div>

        {/* ── RIGHT: tab content ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Mobile tab bar */}
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1 mb-5 md:hidden">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${tab === t.id ? "bg-white text-dark shadow-sm" : "text-muted"}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* ── OVERVIEW ── */}
            {tab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <h2 className="text-xl font-black text-dark mb-5 hidden md:block">Overview</h2>
                <div className="space-y-5">

                  {/* Body stats */}
                  {profile && (
                    <div className="card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-black text-dark">Body stats</h3>
                        {!editingProfile && (
                          <button
                            type="button"
                            onClick={startProfileEdit}
                            className="text-xs font-bold text-primary hover:underline underline-offset-2"
                          >
                            Edit profile
                          </button>
                        )}
                      </div>
                      {editingProfile ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-1.5">Height (cm)</label>
                              <input
                                type="number"
                                min={100}
                                max={250}
                                value={profileDraft.heightCm}
                                onChange={(e) => setProfileDraft((d) => ({ ...d, heightCm: e.target.value }))}
                                className="input-base"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-1.5">Age</label>
                              <input
                                type="number"
                                min={13}
                                max={100}
                                value={profileDraft.age}
                                onChange={(e) => setProfileDraft((d) => ({ ...d, age: e.target.value }))}
                                className="input-base"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">Gender</label>
                            <div className="grid grid-cols-3 gap-2">
                              {(["female", "male", "other"] as const).map((g) => (
                                <button
                                  key={g}
                                  type="button"
                                  onClick={() =>
                                    setProfileDraft((d) => ({
                                      ...d,
                                      gender: g,
                                      periodTrackingEnabled: g === "male" ? false : d.periodTrackingEnabled,
                                    }))
                                  }
                                  className={`py-2.5 rounded-xl font-semibold text-sm capitalize transition-all ${
                                    profileDraft.gender === g ? "bg-gradient-fitness text-white shadow-primary" : "bg-slate-100 text-dark"
                                  }`}
                                >
                                  {g}
                                </button>
                              ))}
                            </div>
                          </div>
                          {profileDraft.gender !== "male" && (
                            <label className="flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-100">
                              <span className="text-sm font-semibold text-dark">Enable period tracking</span>
                              <input
                                type="checkbox"
                                checked={profileDraft.periodTrackingEnabled}
                                onChange={(e) => setProfileDraft((d) => ({ ...d, periodTrackingEnabled: e.target.checked }))}
                              />
                            </label>
                          )}
                          <div className="flex gap-2 justify-end">
                            <button type="button" onClick={cancelProfileEdit} className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-dark">
                              Cancel
                            </button>
                            <button type="button" onClick={saveProfileEdits} className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-fitness text-white">
                              Save changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-4 rounded-2xl bg-orange-50 text-center">
                            <p className="text-3xl font-black text-primary">{profile.heightCm}</p>
                            <p className="text-xs text-muted mt-1">cm height</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-blue-50 text-center">
                            {editingWeight ? (
                              <div className="flex flex-col gap-2">
                                <input autoFocus type="number" value={weightDraft}
                                  onChange={(e) => setWeightDraft(e.target.value)}
                                  onKeyDown={(e) => e.key === "Enter" && handleSaveWeight()}
                                  className="w-full text-center text-sm border border-blue-200 rounded-lg px-2 py-1.5" />
                                <button onClick={handleSaveWeight} className="text-xs text-blue-600 font-bold">Save ✓</button>
                              </div>
                            ) : (
                              <button onClick={() => { setEditingWeight(true); setWeightDraft(String(profile.weightKg)); }} className="w-full">
                                <p className="text-3xl font-black text-blue-600">{profile.weightKg}</p>
                                <p className="text-xs text-muted mt-1">kg ✏️</p>
                              </button>
                            )}
                          </div>
                          <div className="p-4 rounded-2xl bg-teal-50 text-center">
                            <p className="text-3xl font-black text-teal-600">{profile.age}</p>
                            <p className="text-xs text-muted mt-1">years old</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Goals */}
                  {profile?.goals && profile.goals.length > 0 && (
                    <div className="card p-6">
                      <h3 className="font-black text-dark mb-4">Your goals</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.goals.map((g) => (
                          <motion.span key={g} whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-dark text-sm font-medium">
                            <span>{GOAL_ICONS[g] ?? "🎯"}</span>{goalLabel(g)}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Activity summary */}
                  <div className="card p-6 bg-gradient-to-br from-primary/8 to-accent/8 border-primary/10">
                    <h3 className="font-black text-dark mb-4">Activity summary</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-4xl font-black text-primary">{sessions}</p>
                        <p className="text-sm text-muted mt-1">sessions</p>
                      </div>
                      <div>
                        <p className="text-4xl font-black text-dark">{longestStreak}</p>
                        <p className="text-sm text-muted mt-1">best streak 🔥</p>
                      </div>
                      <div>
                        <p className="text-4xl font-black text-accent">{periodCount}</p>
                        <p className="text-sm text-muted mt-1">cycles logged</p>
                      </div>
                    </div>
                  </div>

                  {/* Account info */}
                  <div className="card p-6">
                    <h3 className="font-black text-dark mb-4">Account</h3>
                    <div className="space-y-0">
                      {[
                        { label: "Name", val: user?.name || "—" },
                        { label: "Email", val: user?.email || "—" },
                        { label: "Gender", val: profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : "—" },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                          <span className="text-sm text-muted">{row.label}</span>
                          <span className="text-sm font-semibold text-dark">{row.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile logout */}
                  <button onClick={handleLogout}
                    className="md:hidden w-full py-3.5 rounded-xl border-2 border-red-300 text-red-800 font-semibold hover:bg-red-50 transition-colors">
                    Log out
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── ACHIEVEMENTS ── */}
            {tab === "achievements" && (
              <motion.div key="achievements" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div className="flex items-end justify-between mb-5 hidden md:flex">
                  <h2 className="text-xl font-black text-dark">Badges</h2>
                  <p className="text-sm text-muted">{unlockedCount} of {achievements.length} unlocked</p>
                </div>

                {/* Progress bar */}
                <div className="card p-5 mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-dark">{unlockedCount}/{achievements.length} badges earned</p>
                    <p className="text-sm font-bold text-primary">{Math.round((unlockedCount/achievements.length)*100)}%</p>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(unlockedCount/achievements.length)*100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {achievements.map((a, i) => (
                    <motion.div key={a.id} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={`p-5 rounded-2xl border-2 transition-all ${
                        a.unlocked ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-sm" : "bg-slate-50 border-slate-100"
                      }`}>
                      <div className="flex items-start justify-between mb-3">
                        <span className={`text-3xl ${!a.unlocked ? "grayscale opacity-30" : ""}`}>{a.icon}</span>
                        {a.unlocked && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            Unlocked
                          </motion.span>
                        )}
                      </div>
                      <p className={`font-bold text-sm ${a.unlocked ? "text-dark" : "text-slate-400"}`}>{a.label}</p>
                      <p className="text-xs text-muted mt-0.5">{a.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── DATA ── */}
            {tab === "data" && (
              <motion.div key="data" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <h2 className="text-xl font-black text-dark mb-5 hidden md:block">Data Management</h2>
                <div className="space-y-5">
                  <div className="card p-6">
                    <h3 className="font-black text-dark mb-1">Backup & restore</h3>
                    <p className="text-sm text-muted mb-5">Export a backup or restore your data on another device.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <motion.button whileTap={{ scale: 0.97 }} type="button" onClick={handleExport}
                        className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                        Export backup
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.97 }} type="button" onClick={() => fileInputRef.current?.click()}
                        className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-100 text-dark font-bold text-sm hover:bg-slate-200 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                        Import backup
                      </motion.button>
                    </div>
                    <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={handleImport} />
                    {importMessage === "success" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-green-600 mt-3 font-medium">✓ Data restored successfully.</motion.p>}
                    {importMessage === "error" && <p className="text-sm text-red-800 font-medium mt-3">Invalid file. Please use an EquaFit backup JSON.</p>}
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex gap-3">
                      <span className="text-xl mt-0.5">ℹ️</span>
                      <p className="text-sm text-muted leading-relaxed">
                        All your data is stored locally on this device. Exporting creates a JSON backup you can import on any device running EquaFit.
                      </p>
                    </div>
                  </div>

                  <button onClick={handleLogout}
                    className="md:hidden w-full py-3.5 rounded-xl border-2 border-red-300 text-red-800 font-semibold hover:bg-red-50 transition-colors">
                    Log out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
