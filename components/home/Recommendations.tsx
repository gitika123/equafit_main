"use client";

type Props = { mood: number; stress: number; energy: number };

export function Recommendations({ mood, stress, energy }: Props) {
  const routine = getRoutineSuggestion(energy, stress);
  const snack = getSnackSuggestion(energy, mood);

  return (
    <section className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
      <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
        Recommended for you
      </h2>
      <ul className="space-y-2 text-dark">
        <li className="flex items-center gap-2">
          <span className="text-[rgb(41,98,255)] font-medium">Routine:</span>
          {routine}
        </li>
        <li className="flex items-center gap-2">
          <span className="text-[rgb(41,98,255)] font-medium">Snack:</span>
          {snack}
        </li>
      </ul>
    </section>
  );
}

function getRoutineSuggestion(energy: number, stress: number): string {
  if (energy <= 3) return "10-min gentle stretch";
  if (stress >= 7) return "10-min stress relief breathing & stretch";
  if (energy >= 7) return "15-min energy boost routine";
  return "10-min dorm-friendly strength";
}

function getSnackSuggestion(energy: number, _mood: number): string {
  if (energy <= 3) return "Banana or handful of nuts";
  return "Apple slices or yogurt";
}
