import { supabase } from "@/lib/supabase";

const STORAGE_KEYS = {
  user: "equafit_user",
  profile: "equafit_profile",
  onboardingDone: "equafit_onboarding_done",
  completedDays: "equafit_completed_days",
  periodLog: "equafit_period_log",
  reminders: "equafit_reminders",
  weightLog: "equafit_weight_log",
  runLog: "equafit_run_log",
} as const;

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface UserProfile {
  heightCm: number;
  weightKg: number;
  age: number;
  gender: "male" | "female" | "other";
  goals: string[];
  periodTrackingEnabled: boolean;
}

export interface CompletedDay {
  groupId: string;
  day: number;
  date: string;
  feeling?: "great" | "good" | "okay" | "tired";
}

export interface PeriodEntry {
  startDate: string;
  endDate: string;
  notes?: string;
  flow?: "light" | "medium" | "heavy";
  symptoms?: string[];
}

export interface WeightEntry {
  date: string;
  weightKg: number;
}

/** Logged run / jog (manual entry — complements routine workouts). */
export interface RunLogEntry {
  id: string;
  date: string; // ISO date (calendar day of the run)
  durationMin: number;
  distanceKm?: number;
  notes?: string;
}

function newRunId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export interface ReminderSettings {
  enabled: boolean;
  time: string;
  messages: string[];
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  return raw ? JSON.parse(raw) : null;
}

function scopedKey(key: string): string {
  if (typeof window === "undefined") return key;
  const user = getStoredUser();
  return user ? `${key}__${user.id}` : key;
}

function getCurrentUserId(): string | null {
  return getStoredUser()?.id ?? null;
}

function saveScopedJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(scopedKey(key), JSON.stringify(value));
}

export function setStoredUser(user: StoredUser | null): void {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEYS.user);
}

export function isOnboardingDone(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(scopedKey(STORAGE_KEYS.onboardingDone)) === "true";
}

export function setOnboardingDone(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(scopedKey(STORAGE_KEYS.onboardingDone), "true");
  const userId = getCurrentUserId();
  if (supabase && userId) {
    void supabase.from("profiles").update({ onboarding_completed: true }).eq("user_id", userId);
  }
}

export function getProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(scopedKey(STORAGE_KEYS.profile));
  return raw ? JSON.parse(raw) : null;
}

export async function setProfile(profile: UserProfile): Promise<{ error?: string }> {
  if (typeof window === "undefined") return {};
  saveScopedJson(STORAGE_KEYS.profile, profile);
  const userId = getCurrentUserId();
  if (!supabase || !userId) return {};
  const onboardingCompleted = isOnboardingDone();
  const { error } = await supabase.from("profiles").upsert({
    user_id: userId,
    height_cm: profile.heightCm,
    weight_kg: profile.weightKg,
    age: profile.age,
    gender: profile.gender,
    goals: profile.goals,
    period_tracking_enabled: profile.periodTrackingEnabled,
    onboarding_completed: onboardingCompleted,
  });
  return { error: error?.message };
}

export function getCompletedDays(): CompletedDay[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(scopedKey(STORAGE_KEYS.completedDays));
  return raw ? JSON.parse(raw) : [];
}

export function setCompletedDayFeeling(
  groupId: string,
  day: number,
  date: string,
  feeling: NonNullable<CompletedDay["feeling"]>
): void {
  const list = getCompletedDays();
  const idx = list.findIndex((d) => d.groupId === groupId && d.day === day && d.date === date);
  if (idx < 0) return;
  list[idx] = { ...list[idx], feeling };
  saveScopedJson(STORAGE_KEYS.completedDays, list);
  const userId = getCurrentUserId();
  if (supabase && userId) {
    void supabase.from("completed_days").upsert({
      user_id: userId,
      group_id: groupId,
      day,
      date,
      feeling,
    });
  }
}

export function addCompletedDay(day: CompletedDay): void {
  const list = getCompletedDays();
  const exists = list.some((d) => d.groupId === day.groupId && d.day === day.day && d.date === day.date);
  if (!exists) {
    list.push(day);
    saveScopedJson(STORAGE_KEYS.completedDays, list);
    const userId = getCurrentUserId();
    if (supabase && userId) {
      void supabase.from("completed_days").upsert({
        user_id: userId,
        group_id: day.groupId,
        day: day.day,
        date: day.date,
        feeling: day.feeling ?? null,
      });
    }
  }
}

export function getPeriodLog(): PeriodEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(scopedKey(STORAGE_KEYS.periodLog));
  return raw ? JSON.parse(raw) : [];
}

export function addPeriodEntry(entry: PeriodEntry): void {
  const list = getPeriodLog();
  list.push(entry);
  list.sort((a, b) => a.startDate.localeCompare(b.startDate));
  saveScopedJson(STORAGE_KEYS.periodLog, list);
  const userId = getCurrentUserId();
  if (!supabase || !userId) return;
  void supabase.from("period_entries").insert({
    user_id: userId,
    start_date: entry.startDate,
    end_date: entry.endDate,
    notes: entry.notes ?? null,
    flow: entry.flow ?? null,
    symptoms: entry.symptoms ?? [],
  });
}

export function getReminderSettings(): ReminderSettings {
  if (typeof window === "undefined")
    return { enabled: false, time: "09:00", messages: [] };
  const raw = localStorage.getItem(scopedKey(STORAGE_KEYS.reminders));
  if (!raw) return { enabled: false, time: "09:00", messages: [] };
  return JSON.parse(raw);
}

export function setReminderSettings(settings: ReminderSettings): void {
  if (typeof window === "undefined") return;
  saveScopedJson(STORAGE_KEYS.reminders, settings);
  const userId = getCurrentUserId();
  if (!supabase || !userId) return;
  void supabase.from("reminder_settings").upsert({
    user_id: userId,
    enabled: settings.enabled,
    time: settings.time,
    messages: settings.messages,
  });
}

export function getWeightLog(): WeightEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(scopedKey(STORAGE_KEYS.weightLog));
  return raw ? JSON.parse(raw) : [];
}

export function addWeightEntry(entry: WeightEntry): void {
  const list = getWeightLog();
  const idx = list.findIndex((e) => e.date === entry.date);
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);
  list.sort((a, b) => a.date.localeCompare(b.date));
  saveScopedJson(STORAGE_KEYS.weightLog, list);
}

export function getRunLog(): RunLogEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(scopedKey(STORAGE_KEYS.runLog));
  return raw ? JSON.parse(raw) : [];
}

export function addRunEntry(entry: Omit<RunLogEntry, "id"> & { id?: string }): RunLogEntry {
  const list = getRunLog();
  const id = entry.id ?? newRunId();
  const row: RunLogEntry = {
    id,
    date: entry.date,
    durationMin: entry.durationMin,
    distanceKm: entry.distanceKm,
    notes: entry.notes,
  };
  list.push(row);
  list.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  saveScopedJson(STORAGE_KEYS.runLog, list);
  const userId = getCurrentUserId();
  if (supabase && userId) {
    void supabase.from("run_logs").upsert({
      id,
      user_id: userId,
      run_date: row.date,
      distance_km: row.distanceKm ?? null,
      duration_min: row.durationMin,
      notes: row.notes ?? null,
    });
  }
  return row;
}

export function removeRunEntry(id: string): void {
  const list = getRunLog().filter((r) => r.id !== id);
  saveScopedJson(STORAGE_KEYS.runLog, list);
  const userId = getCurrentUserId();
  if (supabase && userId) {
    void supabase.from("run_logs").delete().eq("id", id).eq("user_id", userId);
  }
}

/** Practical kg bounds for logging (health UI, not medical limits). */
export const WEIGHT_LOG_KG_MIN = 35;
export const WEIGHT_LOG_KG_MAX = 220;

export function validateWeightKg(kg: number): { ok: true } | { ok: false; message: string } {
  if (Number.isNaN(kg) || kg <= 0) return { ok: false, message: "Enter a positive weight." };
  if (kg < WEIGHT_LOG_KG_MIN) return { ok: false, message: `Weight must be at least ${WEIGHT_LOG_KG_MIN} kg.` };
  if (kg > WEIGHT_LOG_KG_MAX) return { ok: false, message: `Weight must be at most ${WEIGHT_LOG_KG_MAX} kg.` };
  return { ok: true };
}

/**
 * Import runs from CSV (e.g. Apple Health / Google Fit export edited to columns).
 * Expected columns: date (YYYY-MM-DD), duration_min; optional: distance_km, notes
 * Header row optional: date,duration_min,distance_km
 */
export function importRunsFromWearableCsv(text: string): { added: number; error?: string } {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return { added: 0, error: "No rows found." };

  let start = 0;
  const first = lines[0].toLowerCase();
  if (first.includes("date") && first.includes("duration")) start = 1;

  let added = 0;
  for (let i = start; i < lines.length; i++) {
    const parts = lines[i].split(",").map((p) => p.trim().replace(/^"|"$/g, ""));
    if (parts.length < 2) continue;
    const date = parts[0];
    const durationMin = parseInt(parts[1], 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(durationMin) || durationMin < 1 || durationMin > 24 * 60) {
      return { added, error: `Invalid row ${i + 1}: use YYYY-MM-DD and minutes 1–1440.` };
    }
    const distanceKm = parts[2] ? parseFloat(parts[2]) : NaN;
    const notes = parts[3] || undefined;
    addRunEntry({
      date,
      durationMin,
      distanceKm: !Number.isNaN(distanceKm) && distanceKm > 0 ? distanceKm : undefined,
      notes: notes || "Imported",
    });
    added++;
  }
  return { added };
}

export async function syncUserDataFromCloud(): Promise<void> {
  const userId = getCurrentUserId();
  if (typeof window === "undefined" || !supabase || !userId) return;

  const [profileRes, completedRes, periodRes, reminderRes, runsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("completed_days").select("*").eq("user_id", userId).order("date", { ascending: true }),
    supabase.from("period_entries").select("*").eq("user_id", userId).order("start_date", { ascending: true }),
    supabase.from("reminder_settings").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("run_logs").select("*").eq("user_id", userId).order("run_date", { ascending: false }),
  ]);

  if (profileRes.data) {
    const profile: UserProfile = {
      heightCm: Number(profileRes.data.height_cm ?? 165),
      weightKg: Number(profileRes.data.weight_kg ?? 60),
      age: Number(profileRes.data.age ?? 22),
      gender: (profileRes.data.gender as UserProfile["gender"]) ?? "female",
      goals: (profileRes.data.goals as string[] | null) ?? [],
      periodTrackingEnabled: Boolean(profileRes.data.period_tracking_enabled),
    };
    saveScopedJson(STORAGE_KEYS.profile, profile);
    const done = Boolean((profileRes.data as { onboarding_completed?: boolean }).onboarding_completed);
    if (done) localStorage.setItem(scopedKey(STORAGE_KEYS.onboardingDone), "true");
    else localStorage.removeItem(scopedKey(STORAGE_KEYS.onboardingDone));
  }

  if (completedRes.data) {
    const completed: CompletedDay[] = completedRes.data.map((r) => ({
      groupId: r.group_id as string,
      day: Number(r.day),
      date: r.date as string,
      feeling: (r.feeling as CompletedDay["feeling"] | null) ?? undefined,
    }));
    saveScopedJson(STORAGE_KEYS.completedDays, completed);
  }

  if (periodRes.data) {
    const periodLog: PeriodEntry[] = periodRes.data.map((r) => ({
      startDate: r.start_date as string,
      endDate: r.end_date as string,
      notes: (r.notes as string | null) ?? undefined,
      flow: (r.flow as PeriodEntry["flow"] | null) ?? undefined,
      symptoms: (r.symptoms as string[] | null) ?? undefined,
    }));
    saveScopedJson(STORAGE_KEYS.periodLog, periodLog);
  }

  if (reminderRes.data) {
    const reminders: ReminderSettings = {
      enabled: Boolean(reminderRes.data.enabled),
      time: (reminderRes.data.time as string) || "09:00",
      messages: (reminderRes.data.messages as string[] | null) ?? [],
    };
    saveScopedJson(STORAGE_KEYS.reminders, reminders);
  }

  if (!runsRes.error && runsRes.data) {
    const runs: RunLogEntry[] = runsRes.data.map((r) => ({
      id: r.id as string,
      date: r.run_date as string,
      durationMin: Number(r.duration_min),
      distanceKm: r.distance_km != null ? Number(r.distance_km) : undefined,
      notes: (r.notes as string | null) ?? undefined,
    }));
    runs.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
    saveScopedJson(STORAGE_KEYS.runLog, runs);
  }
}


export const STORAGE_KEYS_ARR = [
  STORAGE_KEYS.user,
  STORAGE_KEYS.profile,
  STORAGE_KEYS.onboardingDone,
  STORAGE_KEYS.completedDays,
  STORAGE_KEYS.periodLog,
  STORAGE_KEYS.reminders,
  STORAGE_KEYS.weightLog,
  STORAGE_KEYS.runLog,
] as const;

export type ExportedData = Record<string, string | null>;

export function getProgressStats(completed: CompletedDay[]) {
  const byDate = new Map<string, number>();
  completed.forEach((d) => {
    byDate.set(d.date, (byDate.get(d.date) || 0) + 1);
  });
  const sortedDates = Array.from(byDate.keys()).sort();
  let longestStreak = 0;
  let current = 0;
  let lastDate: string | null = null;
  for (const d of sortedDates) {
    const prev = lastDate ? new Date(lastDate).getTime() : 0;
    const curr = new Date(d).getTime();
    const diffDays = Math.round((curr - prev) / 86400000);
    if (diffDays === 1) current++;
    else current = 1;
    lastDate = d;
    longestStreak = Math.max(longestStreak, current);
  }
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const weeks: { label: string; count: number }[] = [];
  for (let i = 3; i >= 0; i--) {
    const end = new Date(now - i * oneWeek);
    const start = new Date(end.getTime() - oneWeek);
    const count = completed.filter((d) => {
      const t = new Date(d.date).getTime();
      return t >= start.getTime() && t < end.getTime();
    }).length;
    weeks.push({
      label: i === 0 ? "This week" : `Week -${i}`,
      count,
    });
  }
  return { longestStreak, weeks };
}

export function exportAllData(): ExportedData {
  if (typeof window === "undefined") return {};
  const out: ExportedData = {};
  STORAGE_KEYS_ARR.forEach((key) => {
    const actualKey = key === STORAGE_KEYS.user ? key : scopedKey(key);
    out[key] = localStorage.getItem(actualKey);
  });
  return out;
}

export function importAllData(data: ExportedData): void {
  if (typeof window === "undefined") return;
  STORAGE_KEYS_ARR.forEach((key) => {
    const v = data[key];
    const actualKey = key === STORAGE_KEYS.user ? key : scopedKey(key);
    if (v !== undefined && v !== null) localStorage.setItem(actualKey, v);
  });
}
