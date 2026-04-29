export type RoutineGroupId =
  | "belly-abs"
  | "arms"
  | "legs"
  | "full-body"
  | "cardio"
  | "flexibility"
  | "stress-relief"
  | "period-light";

export interface RoutineGroup {
  id: RoutineGroupId;
  name: string;
  tagline: string;
  icon: string;
  color: "primary" | "accent" | "purple" | "blue";
  durationMinutes: number;
  totalDays: number;
}

export interface DayExercise {
  name: string;
  repsOrTime: string;
  notes?: string;
}

export interface RoutineDay {
  day: number;
  title: string;
  exercises: DayExercise[];
  tip?: string;
}

export const ROUTINE_GROUPS: RoutineGroup[] = [
  { id: "belly-abs", name: "Belly & Abs", tagline: "Core strength & toning", icon: "🔥", color: "primary", durationMinutes: 28, totalDays: 30 },
  { id: "arms", name: "Arms", tagline: "Biceps, triceps & shoulders", icon: "💪", color: "primary", durationMinutes: 22, totalDays: 30 },
  { id: "legs", name: "Legs", tagline: "Glutes, quads & calves", icon: "🦵", color: "accent", durationMinutes: 28, totalDays: 30 },
  { id: "full-body", name: "Full Body", tagline: "Head-to-toe workout", icon: "✨", color: "accent", durationMinutes: 32, totalDays: 30 },
  { id: "cardio", name: "Cardio", tagline: "Heart-pumping energy", icon: "❤️", color: "primary", durationMinutes: 24, totalDays: 30 },
  { id: "flexibility", name: "Flexibility", tagline: "Stretch & mobility", icon: "🧘", color: "blue", durationMinutes: 18, totalDays: 30 },
  { id: "stress-relief", name: "Stress Relief", tagline: "Calm mind & body", icon: "🌿", color: "accent", durationMinutes: 16, totalDays: 30 },
  { id: "period-light", name: "Period-Friendly", tagline: "Gentle routines for cycle days", icon: "🌸", color: "purple", durationMinutes: 10, totalDays: 30 },
];

function daySeed(groupId: string, salt: number): number {
  const s = `${groupId}:${salt}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Deterministic shuffle so each day gets a different order without random reload drift. */
function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let x = seed >>> 0;
  const rnd = () => {
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return (x >>> 0) / 4294967296;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateRoutineDays(
  groupId: RoutineGroupId,
  count: number,
  exerciseTemplates: { name: string; reps: string }[][]
): RoutineDay[] {
  const days: RoutineDay[] = [];
  const nTemplates = exerciseTemplates.length;
  for (let d = 1; d <= count; d++) {
    const pick = daySeed(groupId, d * 7919 + 17) % nTemplates;
    const template = exerciseTemplates[pick];
    const shuffled = shuffleWithSeed(template, daySeed(groupId, d * 104729));
    days.push({
      day: d,
      title: `Day ${d}`,
      exercises: shuffled.map((e) => ({ name: e.name, repsOrTime: e.reps })),
      tip: d % 5 === 0 ? "Rest 30 sec between exercises. You're doing great!" : undefined,
    });
  }
  return days;
}

const BELLY_ABS_TEMPLATES: { name: string; reps: string }[][] = [
  [
    { name: "Bicycle crunches", reps: "12 each side" },
    { name: "Plank hold", reps: "30 sec" },
    { name: "Dead bug", reps: "10 each side" },
    { name: "Mountain climbers", reps: "20 total" },
    { name: "Heel taps", reps: "20" },
    { name: "Seated knee tucks", reps: "15" },
    { name: "Oblique crunch", reps: "12 each side" },
    { name: "Hollow hold", reps: "20 sec" },
    { name: "Slow bear plank", reps: "30 sec" },
    { name: "Standing side bend", reps: "10 each" },
    { name: "Breathing (360° belly)", reps: "1 min" },
  ],
  [
    { name: "Leg raises", reps: "12" },
    { name: "Russian twist", reps: "15 each side" },
    { name: "Plank to side", reps: "8 each side" },
    { name: "Reverse crunches", reps: "12" },
    { name: "Toe touches", reps: "15" },
    { name: "Side plank dips", reps: "8 each side" },
    { name: "Scissor kicks", reps: "20" },
    { name: "Bird dog", reps: "10 each side" },
    { name: "Dead bug slow", reps: "8 each side" },
    { name: "Forearm plank rocks", reps: "30 sec" },
    { name: "Cat-cow", reps: "10" },
  ],
  [
    { name: "Crunches", reps: "15" },
    { name: "Side plank", reps: "20 sec each" },
    { name: "Flutter kicks", reps: "20" },
    { name: "Bird dog", reps: "10 each side" },
    { name: "Plank shoulder taps", reps: "16" },
    { name: "Bicycle slow", reps: "10 each side" },
    { name: "Leg lowers", reps: "10" },
    { name: "Seated twist", reps: "12 each side" },
    { name: "Bridge march", reps: "12 each leg" },
    { name: "Windshield wipers", reps: "10 each side" },
    { name: "Child's pose", reps: "45 sec" },
  ],
];

const ARMS_TEMPLATES: { name: string; reps: string }[][] = [
  [
    { name: "Arm circles", reps: "15 each direction" },
    { name: "Push-ups (or knee)", reps: "10" },
    { name: "Tricep dips", reps: "12" },
    { name: "Bicep curls (imaginary weight)", reps: "12 each" },
    { name: "Plank up-downs", reps: "8" },
    { name: "Inchworm walk-out", reps: "6" },
    { name: "Reverse snow angels", reps: "12" },
    { name: "Wall angels", reps: "12" },
    { name: "Tricep kickbacks (no weight)", reps: "15 each" },
    { name: "Front raise pulses", reps: "30 sec" },
    { name: "Prayer pulse stretch", reps: "20 sec" },
  ],
  [
    { name: "Shoulder taps", reps: "20" },
    { name: "Diamond push-ups", reps: "8" },
    { name: "Wall push-ups", reps: "15" },
    { name: "Arm pulses", reps: "30 sec" },
    { name: "Pike push-ups (or incline)", reps: "8" },
    { name: "Bear crawl hold", reps: "20 sec" },
    { name: "Side plank reach", reps: "8 each" },
    { name: "Wrist circles", reps: "20 each way" },
    { name: "Overhead reach stretch", reps: "20 sec each" },
    { name: "Plank to downdog", reps: "8" },
    { name: "Shake arms out", reps: "30 sec" },
  ],
];

const LEGS_TEMPLATES: { name: string; reps: string }[][] = [
  [
    { name: "Squats", reps: "15" },
    { name: "Lunges", reps: "10 each leg" },
    { name: "Glute bridges", reps: "15" },
    { name: "Calf raises", reps: "20" },
    { name: "Wall sit", reps: "30 sec" },
    { name: "Step-ups (or low box)", reps: "10 each" },
    { name: "Donkey kicks", reps: "12 each" },
    { name: "Fire hydrants", reps: "12 each" },
    { name: "Romanian deadlift (bodyweight)", reps: "10" },
    { name: "Walking lunges", reps: "8 each leg" },
    { name: "Ankle circles", reps: "10 each way" },
  ],
  [
    { name: "Sumo squats", reps: "12" },
    { name: "Side lunges", reps: "10 each" },
    { name: "Single-leg deadlift", reps: "8 each" },
    { name: "Jump squats (or step)", reps: "10" },
    { name: "Curtsy lunges", reps: "10 each" },
    { name: "Single-leg glute bridge", reps: "8 each" },
    { name: "Calf raise hold", reps: "20 sec" },
    { name: "Quad stretch", reps: "20 sec each" },
    { name: "Hamstring scoops", reps: "10 each" },
    { name: "Clamshells", reps: "15 each side" },
    { name: "March in place", reps: "1 min" },
  ],
];

const FULL_BODY_TEMPLATES: { name: string; reps: string }[][] = [
  [
    { name: "Jumping jacks", reps: "30 sec" },
    { name: "Squats", reps: "12" },
    { name: "Push-ups", reps: "8" },
    { name: "Plank", reps: "30 sec" },
    { name: "Lunges", reps: "8 each" },
    { name: "High knees", reps: "30 sec" },
    { name: "Glute bridge", reps: "15" },
    { name: "Tricep dips", reps: "10" },
    { name: "Mountain climbers", reps: "20" },
    { name: "Bird dog", reps: "8 each" },
    { name: "Cool-down march", reps: "1 min" },
  ],
  [
    { name: "Burpees (or step-back)", reps: "6" },
    { name: "Squat pulses", reps: "20" },
    { name: "Inchworm", reps: "5" },
    { name: "Side plank", reps: "20 sec each" },
    { name: "Jump rope (or mimic)", reps: "45 sec" },
    { name: "Reverse lunge + knee drive", reps: "8 each" },
    { name: "Plank jacks", reps: "12" },
    { name: "Superman hold", reps: "20 sec" },
    { name: "Wall sit", reps: "30 sec" },
    { name: "Arm circles", reps: "30 sec" },
    { name: "Deep breaths", reps: "1 min" },
  ],
];

const CARDIO_TEMPLATES: { name: string; reps: string }[][] = [
  [
    { name: "High knees", reps: "30 sec" },
    { name: "Butt kicks", reps: "30 sec" },
    { name: "Jumping jacks", reps: "45 sec" },
    { name: "Rest", reps: "15 sec" },
    { name: "Star jumps", reps: "20" },
    { name: "Fast feet", reps: "20 sec" },
    { name: "Squat jumps (or regular)", reps: "10" },
    { name: "Shadow boxing", reps: "45 sec" },
    { name: "Lateral bounds", reps: "16" },
    { name: "Plank jacks", reps: "12" },
    { name: "Cool-down walk", reps: "1 min" },
  ],
  [
    { name: "March in place", reps: "1 min" },
    { name: "Side shuffles", reps: "30 sec each" },
    { name: "Skaters", reps: "20" },
    { name: "Cool-down walk", reps: "1 min" },
    { name: "Jump rope (or mimic)", reps: "1 min" },
    { name: "Mountain climbers", reps: "30 sec" },
    { name: "Bear crawl", reps: "30 sec" },
    { name: "Inchworm", reps: "5" },
    { name: "High plank hold", reps: "30 sec" },
    { name: "Butt kicks", reps: "30 sec" },
    { name: "Stretch calves", reps: "30 sec each" },
  ],
];

const FLEXIBILITY_TEMPLATES: { name: string; reps: string }[][] = [
  [
    { name: "Neck rolls", reps: "5 each way" },
    { name: "Arm across chest", reps: "20 sec each" },
    { name: "Standing quad stretch", reps: "20 sec each" },
    { name: "Hamstring stretch", reps: "20 sec each" },
    { name: "Hip circles", reps: "8 each way" },
    { name: "World's greatest stretch", reps: "4 each side" },
    { name: "Pigeon prep (figure-4)", reps: "30 sec each" },
    { name: "Cat-cow", reps: "10" },
    { name: "Child's pose", reps: "45 sec" },
    { name: "Spinal twist seated", reps: "20 sec each" },
    { name: "Forward fold", reps: "45 sec" },
  ],
  [
    { name: "Wrist flexor stretch", reps: "20 sec each" },
    { name: "Doorway chest stretch", reps: "20 sec each" },
    { name: "Side bend standing", reps: "10 each" },
    { name: "Hip flexor lunge stretch", reps: "30 sec each" },
    { name: "Butterfly stretch", reps: "45 sec" },
    { name: "Seated hamstring reach", reps: "30 sec each" },
    { name: "Ankle mobility circles", reps: "10 each" },
    { name: "Shoulder rolls", reps: "10 each way" },
    { name: "Downward dog walk", reps: "45 sec" },
    { name: "Supine twist", reps: "20 sec each" },
    { name: "Relax breathing", reps: "1 min" },
  ],
];

const STRESS_RELIEF_TEMPLATES: { name: string; reps: string }[][] = [
  [
    { name: "Deep breathing", reps: "1 min" },
    { name: "Shoulder rolls", reps: "10 each way" },
    { name: "Cat-cow stretch", reps: "8" },
    { name: "Child's pose", reps: "45 sec" },
    { name: "Seated twist", reps: "20 sec each" },
    { name: "Neck side stretch", reps: "20 sec each" },
    { name: "Gentle side bend", reps: "10 each" },
    { name: "Legs-up rest (hips on pillow)", reps: "1 min" },
    { name: "Jaw release massage", reps: "30 sec" },
    { name: "Box breathing", reps: "1 min" },
    { name: "Gratitude pause", reps: "30 sec" },
  ],
  [
    { name: "Body scan (still)", reps: "2 min" },
    { name: "Forward fold ragdoll", reps: "45 sec" },
    { name: "Hip circles standing", reps: "8 each way" },
    { name: "Wrist circles", reps: "20 each" },
    { name: "Ankle rolls", reps: "10 each" },
    { name: "Supported bridge", reps: "45 sec" },
    { name: "Easy twist supine", reps: "20 sec each" },
    { name: "Ear to shoulder stretch", reps: "15 sec each" },
    { name: "Shake out limbs", reps: "30 sec" },
    { name: "Slow walk in place", reps: "1 min" },
    { name: "Eyes closed breathing", reps: "1 min" },
  ],
];

const PERIOD_LIGHT_TEMPLATES: { name: string; reps: string }[][] = [
  [
    { name: "Gentle breathing", reps: "1 min" },
    { name: "Neck & shoulder stretch", reps: "30 sec each" },
    { name: "Seated forward fold", reps: "30 sec" },
    { name: "Legs up the wall", reps: "2 min" },
    { name: "Easy walk in place", reps: "1 min" },
  ],
  [
    { name: "Cat-cow", reps: "6" },
    { name: "Hip circles", reps: "8 each" },
    { name: "Butterfly stretch", reps: "45 sec" },
    { name: "Rest", reps: "1 min" },
    { name: "Side-lying clamshell", reps: "10 each" },
  ],
];

const TEMPLATES: Record<RoutineGroupId, { name: string; reps: string }[][]> = {
  "belly-abs": BELLY_ABS_TEMPLATES,
  arms: ARMS_TEMPLATES,
  legs: LEGS_TEMPLATES,
  "full-body": FULL_BODY_TEMPLATES,
  cardio: CARDIO_TEMPLATES,
  flexibility: FLEXIBILITY_TEMPLATES,
  "stress-relief": STRESS_RELIEF_TEMPLATES,
  "period-light": PERIOD_LIGHT_TEMPLATES,
};

export function getRoutineDays(groupId: RoutineGroupId): RoutineDay[] {
  const group = ROUTINE_GROUPS.find((g) => g.id === groupId);
  const count = group?.totalDays ?? 30;
  const templates = TEMPLATES[groupId] ?? FULL_BODY_TEMPLATES;
  return generateRoutineDays(groupId, count, templates);
}

export function getGroupById(id: string): RoutineGroup | undefined {
  return ROUTINE_GROUPS.find((g) => g.id === id);
}

/**
 * Suggested countdown for the in-app timer (seconds).
 * Parses "30 sec", "1 min", etc.; rep-based moves default to ~1 min.
 */
export function exerciseTimerSeconds(repsOrTime: string): number {
  const s = repsOrTime.toLowerCase();
  const minM = s.match(/(\d+(?:\.\d+)?)\s*min/);
  if (minM) return Math.min(15 * 60, Math.round(parseFloat(minM[1]) * 60));
  const secM = s.match(/(\d+)\s*sec/);
  if (secM) return Math.min(10 * 60, parseInt(secM[1], 10));
  if (s.includes("rest")) return 45;
  return 60;
}

/** Returns a YouTube search URL for exercise form tutorials */
export function getExerciseTutorialUrl(exerciseName: string): string {
  const query = encodeURIComponent(`${exerciseName} exercise form tutorial`);
  return `https://www.youtube.com/results?search_query=${query}`;
}
