export function DailyMotivation() {
  const message = "You've got this! Small steps today lead to better habits.";
  const suggestion = "Take a 5-minute walk between classes.";

  return (
    <section className="mb-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
      <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-2">
        Daily motivation
      </h2>
      <p className="text-dark mb-2">{message}</p>
      <p className="text-sm text-[rgb(41,98,255)] font-medium">{suggestion}</p>
    </section>
  );
}
