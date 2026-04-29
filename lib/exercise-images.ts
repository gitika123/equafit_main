/**
 * Still images for exercises (alternative to opening a video tutorial).
 * Uses specific Wikimedia Commons / Unsplash URLs where we have a good match,
 * else a stable hash into a small fitness photo pool.
 */

const POOL = [
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9b54e?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1594882645126-14020914d58d?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&h=400&fit=crop&q=80",
];

/** Keyword → image (form reference photos, not branded assets). */
const BY_KEYWORD: { keys: string[]; url: string }[] = [
  {
    keys: ["plank", "bear plank", "forearm plank", "side plank", "plank to", "plank rocks", "plank shoulder"],
    url: "https://images.unsplash.com/photo-1566241142559-9e9e772b13b6?w=600&h=400&fit=crop&q=80",
  },
  {
    keys: ["crunch", "bicycle", "russian twist", "oblique", "reverse crunch", "toe touch", "dead bug", "hollow"],
    url: "https://images.unsplash.com/photo-1576678920774-702dc0f8f1c0?w=600&h=400&fit=crop&q=80",
  },
  {
    keys: ["mountain climber", "burpee", "jumping jack", "high knees", "skater"],
    url: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600&h=400&fit=crop&q=80",
  },
  {
    keys: ["push-up", "push up", "inchworm", "tricep dip", "arm circle", "wall angel", "snow angel"],
    url: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&h=400&fit=crop&q=80",
  },
  {
    keys: ["squat", "lunge", "glute", "bridge", "calf", "wall sit", "leg raise", "step-up"],
    url: "https://images.unsplash.com/photo-1434608519344-49f77edb0cc0?w=600&h=400&fit=crop&q=80",
  },
  {
    keys: ["stretch", "hamstring", "quad stretch", "hip flexor", "pigeon", "child's pose", "cat-cow", "thread the needle", "figure four"],
    url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop&q=80",
  },
  {
    keys: ["bird dog", "deadlift", "row", "superman", "good morning"],
    url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=400&fit=crop&q=80",
  },
  {
    keys: ["breathing", "meditat", "neck roll", "shoulder roll", "gentle"],
    url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop&q=80",
  },
];

function hashName(name: string): number {
  const n = name.toLowerCase();
  let h = 2166136261;
  for (let i = 0; i < n.length; i++) {
    h ^= n.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function getExerciseImageUrl(exerciseName: string): string {
  const lower = exerciseName.toLowerCase();
  for (const { keys, url } of BY_KEYWORD) {
    if (keys.some((k) => lower.includes(k))) return url;
  }
  return POOL[hashName(exerciseName) % POOL.length];
}
