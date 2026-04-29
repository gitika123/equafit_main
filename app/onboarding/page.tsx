"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import type { UserProfile } from "@/lib/user-store";

const GOALS = [
  { id: "belly-abs",    label: "Belly & Abs",       icon: "🔥" },
  { id: "arms",         label: "Arms",               icon: "💪" },
  { id: "legs",         label: "Legs & Glutes",      icon: "🦵" },
  { id: "full-body",    label: "Full Body",           icon: "✨" },
  { id: "cardio",       label: "Cardio",              icon: "❤️" },
  { id: "flexibility",  label: "Flexibility",         icon: "🧘" },
  { id: "stress-relief",label: "Stress Relief",       icon: "🌿" },
  { id: "period-light", label: "Period-Friendly",     icon: "🌸" },
];

const STEPS = [
  { title: "About you",      subtitle: "We personalize routines based on this.", emoji: "👤" },
  { title: "Your goals",     subtitle: "Pick one or more — change anytime.",     emoji: "🎯" },
  { title: "Cycle tracking", subtitle: "Enable gentle routines during periods.", emoji: "🌸" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    heightCm: 165, weightKg: 60, age: 22, gender: "female",
    goals: [], periodTrackingEnabled: false,
  });
  const router = useRouter();
  const { setProfileData, setOnboardingDone } = useAuth();
  const isMale = profile.gender === "male";

  function next() {
    if (step < 3) { setStep(step + 1); return; }
    if (!profile.heightCm || !profile.weightKg || !profile.age || !profile.gender) return;
    setProfileData({
      heightCm: profile.heightCm,
      weightKg: profile.weightKg,
      age: profile.age,
      gender: profile.gender as "male" | "female" | "other",
      goals: profile.goals ?? [],
      periodTrackingEnabled: profile.periodTrackingEnabled ?? false,
    });
    setOnboardingDone();
    router.push("/");
  }

  function toggleGoal(id: string) {
    const goals = profile.goals ?? [];
    setProfile({ ...profile, goals: goals.includes(id) ? goals.filter((g) => g !== id) : [...goals, id] });
  }

  const current = STEPS[step - 1];

  return (
    <div className="min-h-screen bg-surface-2 flex flex-col">
      {/* Top progress bar */}
      <div className="flex gap-1.5 p-5 pt-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <motion.div
              initial={false}
              animate={{ width: step >= s ? "100%" : "0%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-fitness"
            />
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col px-5 pb-8">
        {/* Step header */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className="mb-6 mt-2"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-fitness shadow-primary flex items-center justify-center text-2xl mb-4">
              {current.emoji}
            </div>
            <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Step {step} of 3</p>
            <h1 className="text-2xl font-black text-dark">{current.title}</h1>
            <p className="text-muted text-sm mt-1">{current.subtitle}</p>
          </motion.div>
        </AnimatePresence>

        {/* Step content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 flex-1"
            >
              <div className="card p-4 space-y-4">
                {[
                  { label: "Height (cm)", key: "heightCm", min: 100, max: 250, value: profile.heightCm },
                  { label: "Weight (kg)", key: "weightKg", min: 30, max: 200, value: profile.weightKg },
                  { label: "Age",         key: "age",      min: 13, max: 100, value: profile.age },
                ].map(({ label, key, min, max, value }) => (
                  <div key={key}>
                    <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-1.5">{label}</label>
                    <input
                      type="number" min={min} max={max}
                      value={value ?? ""}
                      onChange={(e) => setProfile({ ...profile, [key]: Number(e.target.value) })}
                      className="input-base"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">Gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["female", "male", "other"] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() =>
                          setProfile({
                            ...profile,
                            gender: g,
                            // Enforce period tracking off for male profiles.
                            periodTrackingEnabled: g === "male" ? false : profile.periodTrackingEnabled,
                          })
                        }
                        className={`py-3 rounded-xl font-semibold text-sm capitalize transition-all ${
                          profile.gender === g
                            ? "bg-gradient-fitness text-white shadow-primary"
                            : "bg-slate-100 text-dark"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <div className="grid grid-cols-2 gap-3">
                {GOALS.map((g) => {
                  const active = profile.goals?.includes(g.id);
                  return (
                    <motion.button
                      key={g.id}
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => toggleGoal(g.id)}
                      className={`py-4 px-3 rounded-2xl text-left border-2 font-semibold transition-all ${
                        active
                          ? "border-primary bg-primary/8 text-primary"
                          : "border-transparent bg-white text-dark shadow-card"
                      }`}
                    >
                      <span className="text-xl block mb-1">{g.icon}</span>
                      <span className="text-sm">{g.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              {isMale ? (
                <div className="w-full p-6 rounded-3xl text-left border-2 border-slate-200 bg-slate-50">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">🚫</div>
                    <div className="flex-1">
                      <p className="font-bold text-lg text-dark">Cycle tracking not applicable</p>
                      <p className="text-sm text-muted mt-1 leading-relaxed">
                        This feature is disabled for male profiles. You can still use all workouts, progress, reminders, and diet guide features.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setProfile({ ...profile, periodTrackingEnabled: !profile.periodTrackingEnabled })}
                  className={`w-full p-6 rounded-3xl text-left border-2 transition-all ${
                    profile.periodTrackingEnabled
                      ? "border-rose-300 bg-rose-50"
                      : "border-transparent bg-white shadow-card"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                      profile.periodTrackingEnabled ? "bg-rose-100" : "bg-slate-100"
                    }`}>
                      🌸
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-lg ${profile.periodTrackingEnabled ? "text-rose-700" : "text-dark"}`}>
                        {profile.periodTrackingEnabled ? "Period tracking ON ✓" : "Enable period tracking"}
                      </p>
                      <p className="text-sm text-muted mt-1 leading-relaxed">
                        Track your cycle and get gentle, period-friendly routines automatically during high-fatigue days.
                      </p>
                    </div>
                  </div>
                </motion.button>
              )}

              <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                  🔒 All cycle data is stored locally on your device — never shared or uploaded.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={next}
          className="w-full mt-6 py-4 rounded-2xl font-black text-white text-base bg-gradient-fitness shadow-primary"
        >
          {step < 3 ? "Continue →" : "Get started! 🚀"}
        </motion.button>
      </div>
    </div>
  );
}
