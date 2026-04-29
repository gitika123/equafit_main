"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getGroupById } from "@/lib/routines";
import { setCompletedDayFeeling } from "@/lib/user-store";

function isValidDay(dayStr: string, totalDays: number) {
  const n = Number(dayStr);
  return Number.isInteger(n) && n >= 1 && n <= totalDays;
}

const FEELINGS = [
  { id: "great", label: "Great!", emoji: "🔥" },
  { id: "good", label: "Good", emoji: "💪" },
  { id: "okay", label: "Okay", emoji: "👍" },
  { id: "tired", label: "Tired but done", emoji: "😅" },
] as const;

function CompleteContent() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId") || "";
  const day = searchParams.get("day") || "";
  const group = getGroupById(groupId);
  const nextDay = Number(day) + 1;
  const hasNextDay = group ? nextDay <= group.totalDays : false;
  const [feeling, setFeeling] = useState<string | null>(null);
  const [feelingError, setFeelingError] = useState("");

  const totalDays = group?.totalDays ?? 0;
  const dayNum = Number(day);
  const canLogFeeling =
    Boolean(groupId) &&
    Boolean(day) &&
    !Number.isNaN(dayNum) &&
    group != null &&
    isValidDay(day, totalDays);

  function handleFeeling(f: string) {
    setFeelingError("");
    if (!canLogFeeling) {
      setFeelingError("Workout info is missing or invalid — use Mark complete from your routine day again.");
      return;
    }
    setFeeling(f);
    const today = new Date().toISOString().slice(0, 10);
    setCompletedDayFeeling(groupId, dayNum, today, f as "great" | "good" | "okay" | "tired");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 pb-24">
      <div className="w-full max-w-sm flex items-center justify-between mb-8">
        <Link href="/" className="text-muted text-sm font-semibold hover:text-primary">
          ← Home
        </Link>
        <Link
          replace
          href={groupId ? `/routines/${groupId}` : "/routines"}
          className="text-muted text-sm font-semibold hover:text-primary"
        >
          All days
        </Link>
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="text-center mb-8"
      >
        <motion.span
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: 2, duration: 0.4 }}
          className="text-7xl block mb-4"
        >
          🎉
        </motion.span>
        <h1 className="text-3xl font-black text-dark">Good work!</h1>
        <p className="text-muted mt-2 font-medium">
          You crushed Day {day}
          {group ? ` of ${group.name}` : ""}.
        </p>
      </motion.div>

      {!feeling ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <p className="text-center text-dark font-medium mb-4">How are you feeling?</p>
          {feelingError ? (
            <p className="text-center text-sm text-red-600 font-semibold mb-3" role="alert">
              {feelingError}
            </p>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            {FEELINGS.map((f) => (
              <motion.button
                key={f.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFeeling(f.id)}
                className="py-4 rounded-xl bg-white border-2 border-slate-300 font-medium text-dark hover:border-primary hover:bg-primary/5"
              >
                <span className="text-2xl block mb-1">{f.emoji}</span>
                {f.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-sm text-center space-y-6"
        >
          <p className="text-muted font-medium">
            Awesome. Rest up—tomorrow&apos;s routine is already waiting for you. Same time, same
            energy? 💪
          </p>
          <p className="text-lg font-semibold text-primary">
            See you tomorrow. You got this!
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-primary/15 text-primary font-semibold"
            >
              Home
            </Link>
            <Link
              href={
                hasNextDay
                  ? `/routines/${groupId}/${nextDay}`
                  : groupId
                  ? `/routines/${groupId}`
                  : "/routines"
              }
              className="px-6 py-3 rounded-xl bg-gradient-fitness text-white font-semibold"
            >
              {hasNextDay ? `Day ${nextDay} →` : "All days"}
            </Link>
          </div>
        </motion.div>
      )}
    </main>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CompleteContent />
    </Suspense>
  );
}
