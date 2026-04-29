"use client";

import { Fragment } from "react";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Highlights pantry / ingredient phrases inside a cooking step (longest match first).
 */
export function HighlightedStep({ text, staples }: { text: string; staples: string[] }) {
  const sorted = [...staples].filter(Boolean).sort((a, b) => b.length - a.length);
  if (!sorted.length) return <>{text}</>;

  const pattern = sorted.map(escapeRegExp).join("|");
  if (!pattern) return <>{text}</>;

  const re = new RegExp(`(${pattern})`, "gi");
  const parts = text.split(re);

  return (
    <>
      {parts.map((part, i) => {
        const hit = sorted.some((s) => s.toLowerCase() === part.toLowerCase());
        if (hit) {
          return (
            <mark key={i} className="bg-amber-100 text-amber-950 font-semibold px-0.5 rounded">
              {part}
            </mark>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
