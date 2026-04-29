/** User profile (PRD: Feature 1) */
export type FitnessLevel = "beginner" | "intermediate" | "active";
export type Goal = "increase_energy" | "reduce_stress" | "build_strength" | "general_wellness";

export interface UserProfile {
  fitnessLevel: FitnessLevel;
  goals: Goal[];
  cycleAwareEnabled: boolean;
}

/** Daily check-in (PRD: Feature 2) */
export interface DailyCheckInData {
  mood: number; // 1-10
  stress: number;
  energy: number;
  date: string; // ISO date
}

/** Routine (PRD: Feature 4) */
export interface Routine {
  id: string;
  name: string;
  durationMinutes: number;
  intensity: "low" | "moderate" | "high";
  benefit: string; // e.g. "stress relief", "energy boost"
  equipmentNeeded: string[];
}
