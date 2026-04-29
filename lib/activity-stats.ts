import type { CompletedDay, RunLogEntry } from "@/lib/user-store";

export const KCAL_PER_SESSION_ESTIMATE = 280;
/** Rough moderate cardio — educational estimate only */
export const KCAL_PER_RUN_MINUTE = 10;

export function estimateSessionsKcal(sessionCount: number): number {
  return sessionCount * KCAL_PER_SESSION_ESTIMATE;
}

export function estimateRunsKcal(runs: RunLogEntry[]): number {
  return runs.reduce((sum, r) => sum + r.durationMin * KCAL_PER_RUN_MINUTE, 0);
}

export function estimateTotalKcal(completedCount: number, runs: RunLogEntry[]): number {
  return estimateSessionsKcal(completedCount) + estimateRunsKcal(runs);
}

export function activityDates(completed: CompletedDay[], runs: RunLogEntry[]): Set<string> {
  return new Set([...completed.map((d) => d.date), ...runs.map((r) => r.date)]);
}

function msToDays(ms: number) {
  return Math.floor(ms / 86400000);
}

/** Consecutive calendar days of activity ending today (workouts + runs). */
export function computeCurrentStreak(dates: Set<string>): number {
  const today = new Date().toISOString().slice(0, 10);
  const sorted = Array.from(dates).sort().reverse();
  let s = 0;
  for (const d of sorted) {
    if (msToDays(new Date(today).getTime() - new Date(d).getTime()) === s) s++;
    else break;
  }
  return s;
}
