"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getDefaultVibe } from "@/lib/vibesync-playlists";

export function VibeSyncPreview() {
  const v = getDefaultVibe();

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-10 mb-4"
    >
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl font-black text-dark">VibeSync</h2>
          <p className="text-sm text-muted mt-0.5">High-energy playlists for every workout mood</p>
        </div>
        <Link
          href="/vibesync"
          className="text-sm font-bold text-violet-600 hover:underline underline-offset-2 whitespace-nowrap"
        >
          Pick a vibe →
        </Link>
      </div>

      <Link href="/vibesync" className="block group">
        <div className="card p-5 md:p-6 overflow-hidden relative border-violet-100 bg-gradient-to-br from-violet-50/95 to-fuchsia-50/40 hover:shadow-card-md transition-shadow">
          <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-violet-300/25 -translate-y-1/2 translate-x-1/3" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-purple flex items-center justify-center text-3xl shadow-md shrink-0" aria-hidden>
              🎧
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-violet-900 mb-1">Default playlist</p>
              <p className="font-black text-dark text-lg leading-tight flex items-center gap-2">
                <span>{v.emoji}</span> {v.label}
              </p>
              <p className="text-sm text-muted mt-1">{v.tagline}</p>
              <p className="text-sm text-dark/90 mt-3 leading-relaxed line-clamp-2 sm:line-clamp-none">
                {v.energyNote}
              </p>
              <p className="text-sm font-bold text-violet-600 mt-3 group-hover:underline underline-offset-2">
                More moods & Spotify player →
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.section>
  );
}
