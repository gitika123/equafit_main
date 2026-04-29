"use client";

type Props = {
  mood: number;
  stress: number;
  energy: number;
  onMoodChange: (v: number) => void;
  onStressChange: (v: number) => void;
  onEnergyChange: (v: number) => void;
};

const labels = (key: string) => {
  const low = key === "energy" ? "Low" : key === "stress" ? "Calm" : "Down";
  const high = key === "energy" ? "High" : key === "stress" ? "Stressed" : "Great";
  return { low, high };
};

export function DailyCheckIn({
  mood,
  stress,
  energy,
  onMoodChange,
  onStressChange,
  onEnergyChange,
}: Props) {
  return (
    <section className="mb-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
      <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">
        Quick check-in
      </h2>
      <div className="space-y-4">
        <Slider
          label="Mood"
          value={mood}
          onChange={onMoodChange}
          lowLabel={labels("mood").low}
          highLabel={labels("mood").high}
        />
        <Slider
          label="Stress"
          value={stress}
          onChange={onStressChange}
          lowLabel={labels("stress").low}
          highLabel={labels("stress").high}
        />
        <Slider
          label="Energy"
          value={energy}
          onChange={onEnergyChange}
          lowLabel={labels("energy").low}
          highLabel={labels("energy").high}
        />
      </div>
    </section>
  );
}

function Slider({
  label,
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  lowLabel: string;
  highLabel: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-dark">{label}</span>
        <span className="text-muted text-xs">
          {lowLabel} ← → {highLabel}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none bg-gray-200 accent-[rgb(41,98,255)]"
      />
    </div>
  );
}
