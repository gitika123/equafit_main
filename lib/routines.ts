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
  { id: "belly-abs", name: "Belly & Abs", tagline: "Core strength & toning", icon: "🔥", color: "primary", durationMinutes: 15, totalDays: 30 },
  { id: "arms", name: "Arms", tagline: "Biceps, triceps & shoulders", icon: "💪", color: "primary", durationMinutes: 12, totalDays: 30 },
  { id: "legs", name: "Legs", tagline: "Glutes, quads & calves", icon: "🦵", color: "accent", durationMinutes: 18, totalDays: 30 },
  { id: "full-body", name: "Full Body", tagline: "Head-to-toe workout", icon: "✨", color: "accent", durationMinutes: 20, totalDays: 30 },
  { id: "cardio", name: "Cardio", tagline: "Heart-pumping energy", icon: "❤️", color: "primary", durationMinutes: 15, totalDays: 30 },
  { id: "flexibility", name: "Flexibility", tagline: "Stretch & mobility", icon: "🧘", color: "blue", durationMinutes: 10, totalDays: 30 },
  { id: "stress-relief", name: "Stress Relief", tagline: "Calm mind & body", icon: "🌿", color: "accent", durationMinutes: 10, totalDays: 30 },
  { id: "period-light", name: "Period-Friendly", tagline: "Gentle routines for cycle days", icon: "🌸", color: "purple", durationMinutes: 8, totalDays: 30 },
];

function generateRoutineDays(
  groupId: RoutineGroupId,
  count: number,
  exerciseTemplates: { name: string; reps: string }[][]
): RoutineDay[] {
  const days: RoutineDay[] = [];
  for (let d = 1; d <= count; d++) {
    const templateIndex = (d - 1) % exerciseTemplates.length;
    const template = exerciseTemplates[templateIndex];
    days.push({
      day: d,
      title: `Day ${d}`,
      exercises: template.map((e) => ({ name: e.name, repsOrTime: e.reps })),
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
  ],
  [
    { name: "Leg raises", reps: "12" },
    { name: "Russian twist", reps: "15 each side" },
    { name: "Plank to side", reps: "8 each side" },
    { name: "Reverse crunches", reps: "12" },
  ],
  [
    { name: "Crunches", reps: "15" },
    { name: "Side plank", reps: "20 sec each" },
    { name: "Flutter kicks", reps: "20" },
    { name: "Bird dog", reps: "10 each side" },
  ],
];

const ARMS_TEMPLATES: { name: string; reps: string }[][] = [
  [
    { name: "Arm circles", reps: "15 each direction" },
    { name: "Push-ups (or knee)", reps: "10" },
    { name: "Tricep dips", reps: "12" },
    { name: "Bicep curls (imaginary weight)", reps: "12 each" },
  ],
  [
    { name: "Shoulder taps", reps: "20" },
    { name: "Diamond push-ups", reps: "8" },
    { name: "Wall push-ups", reps: "15" },
    { name: "Arm pulses", reps: "30 sec" },
  ],
];

const LEGS_TEMPLATES: { name: string; reps: string }[][] = [
  [
    { name: "Squats", reps: "15" },
    { name: "Lunges", reps: "10 each leg" },
    { name: "Glute bridges", reps: "15" },
    { name: "Calf raises", reps: "20" },
  ],
  [
    { name: "Sumo squats", reps: "12" },
    { name: "Side lunges", reps: "10 each" },
    { name: "Single-leg deadlift", reps: "8 each" },
    { name: "Jump squats (or step)", reps: "10" },
  ],
];

const FULL_BODY_TEMPLATES: { name: string; reps: string }[][] = [
  [
    { name: "Jumping jacks", reps: "30 sec" },
    { name: "Squats", reps: "12" },
    { name: "Push-ups", reps: "8" },
    { name: "Plank", reps: "30 sec" },
    { name: "Lunges", reps: "8 each" },
  ],
];

const CARDIO_TEMPLATES: { name: string; reps: string }[][] = [
  [
    { name: "High knees", reps: "30 sec" },
    { name: "Butt kicks", reps: "30 sec" },
    { name: "Jumping jacks", reps: "45 sec" },
    { name: "Rest", reps: "15 sec" },
  ],
  [
    { name: "March in place", reps: "1 min" },
    { name: "Side shuffles", reps: "30 sec each" },
    { name: "Skaters", reps: "20" },
    { name: "Cool-down walk", reps: "1 min" },
  ],
];

const FLEXIBILITY_TEMPLATES: { name: string; reps: string }[][] = [
  [
    { name: "Neck rolls", reps: "5 each way" },
    { name: "Arm across chest", reps: "20 sec each" },
    { name: "Standing quad stretch", reps: "20 sec each" },
    { name: "Hamstring stretch", reps: "20 sec each" },
    { name: "Hip circles", reps: "8 each way" },
  ],
];

const STRESS_RELIEF_TEMPLATES: { name: string; reps: string }[][] = [
  [
    { name: "Deep breathing", reps: "1 min" },
    { name: "Shoulder rolls", reps: "10 each way" },
    { name: "Cat-cow stretch", reps: "8" },
    { name: "Child's pose", reps: "45 sec" },
    { name: "Seated twist", reps: "20 sec each" },
  ],
];

const PERIOD_LIGHT_TEMPLATES: { name: string; reps: string }[][] = [
  [
    { name: "Gentle breathing", reps: "1 min" },
    { name: "Neck & shoulder stretch", reps: "30 sec each" },
    { name: "Seated forward fold", reps: "30 sec" },
    { name: "Legs up the wall", reps: "2 min" },
  ],
  [
    { name: "Cat-cow", reps: "6" },
    { name: "Hip circles", reps: "8 each" },
    { name: "Butterfly stretch", reps: "45 sec" },
    { name: "Rest", reps: "1 min" },
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

/** Returns a YouTube search URL for exercise form tutorials */
export function getExerciseTutorialUrl(exerciseName: string): string {
  const query = encodeURIComponent(`${exerciseName} exercise form tutorial`);
  return `https://www.youtube.com/results?search_query=${query}`;
}
