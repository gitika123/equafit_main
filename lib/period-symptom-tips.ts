/** Non-medical movement ideas when logging cycle symptoms — links to period-friendly routine. */
export const SYMPTOM_MOVEMENT: Record<
  string,
  { headline: string; moves: string[] }
> = {
  Cramps: {
    headline: "Gentle heat + easy hips",
    moves: [
      "Try the Period-Friendly routine — cat-cow, butterfly, and walking often feel better than hard ab work.",
      "Light walking 10–15 min can reduce cramping for many people.",
      "Avoid max-effort planks or heavy jumping until you feel better.",
    ],
  },
  Bloating: {
    headline: "Low compression, slow breath",
    moves: [
      "Favor stretching, walking, and the Period-Friendly flow over tight waistbands or intense core bracing.",
      "Deep belly breathing (box breathing) between moves.",
    ],
  },
  Headache: {
    headline: "Keep intensity low",
    moves: [
      "Skip inverted poses and very high heart-rate bursts; choose Stress Relief or Period-Friendly instead.",
      "Short walks + neck/shoulder mobility only if it feels good.",
    ],
  },
  "Mood swings": {
    headline: "Rhythm without pressure",
    moves: [
      "Predictable, repetitive movement (walking, light dance, gentle yoga) can help — Stress Relief playlist + routine.",
    ],
  },
  Fatigue: {
    headline: "Shorter sets, more rest",
    moves: [
      "Cut volume roughly in half: Period-Friendly or the easiest day of Flexibility.",
      "Stop any move that feels dizzy — hydrate and rest.",
    ],
  },
  "Back pain": {
    headline: "Hinge carefully",
    moves: [
      "Cat-cow, bird dog, and glute bridges from Period-Friendly are usually safer than deep squats with load.",
      "Avoid aggressive toe-touches if back pain spikes.",
    ],
  },
  "Tender breasts": {
    headline: "Low impact only",
    moves: [
      "Skip burpees / jumping jacks if uncomfortable; walking + upper-back opening stretches instead.",
    ],
  },
  Nausea: {
    headline: "Minimal bouncing",
    moves: [
      "Breathing drills + seated stretches only until nausea settles — avoid high-impact cardio.",
    ],
  },
};

export function getSymptomMovementTips(symptoms: string[]): { symptom: string; headline: string; moves: string[] }[] {
  const seen = new Set<string>();
  const out: { symptom: string; headline: string; moves: string[] }[] = [];
  for (const s of symptoms) {
    const tip = SYMPTOM_MOVEMENT[s];
    if (tip && !seen.has(s)) {
      seen.add(s);
      out.push({ symptom: s, headline: tip.headline, moves: tip.moves });
    }
  }
  return out;
}
