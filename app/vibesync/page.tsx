"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import {
  VIBE_PLAYLISTS,
  getDefaultVibe,
  spotifyEmbedSrc,
  spotifyOpenUrl,
  type VibePlaylist,
} from "@/lib/vibesync-playlists";

function VibeCard({
  vibe,
  selected,
  onSelect,
}: {
  vibe: VibePlaylist;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      layout
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
      className={`text-left w-full rounded-2xl border-2 transition-all p-4 md:p-5 ${
        selected
          ? "border-violet-500 bg-violet-50/90 shadow-md ring-2 ring-violet-200"
          : "border-slate-100 bg-white hover:border-violet-200 hover:bg-violet-50/40"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl shrink-0" aria-hidden>
          {vibe.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-black text-dark leading-tight">{vibe.label}</p>
            {vibe.isDefault && (
              <span className="text-xs font-bold uppercase tracking-wider text-violet-900 bg-violet-100 px-2 py-0.5 rounded-full">
                Recommended
              </span>
            )}
          </div>
          <p className="text-sm text-muted mt-1">{vibe.tagline}</p>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed border-l-2 border-violet-200 pl-2.5">
            {vibe.energyNote}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

export default function VibeSyncPage() {
  const defaultVibe = useMemo(() => getDefaultVibe(), []);
  const [active, setActive] = useState<VibePlaylist>(defaultVibe);

  const embedSrc = spotifyEmbedSrc(active.spotifyPlaylistId);
  const openUrl = spotifyOpenUrl(active.spotifyPlaylistId);

  const moods = useMemo(
    () => VIBE_PLAYLISTS.filter((v) => !v.isDefault),
    []
  );

  return (
    <main className="w-full px-4 sm:px-6 lg:px-10 pt-6 pb-28 md:pb-10 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-muted font-semibold text-sm mb-4 hover:text-primary"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Home
        </Link>

        <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-purple text-white">
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-fuchsia-500/30 -translate-x-1/4 translate-y-1/4" />
          <div className="relative z-10">
            <p className="text-white text-xs font-bold uppercase tracking-widest mb-2 drop-shadow-sm">Music</p>
            <h1 className="text-3xl md:text-4xl font-black leading-tight">VibeSync</h1>
            <p className="text-white text-sm md:text-base mt-2 max-w-2xl leading-relaxed drop-shadow-sm">
              High-energy playlists matched to your mood — perfect for pilates, strength, or cardio. Pick the{" "}
              <strong className="text-white">default</strong> if you&apos;re undecided; every list is built to motivate and keep the pace up.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Default playlist — always visible first */}
      <section className="mb-8">
        <h2 className="text-lg font-black text-dark mb-1">Start here</h2>
        <p className="text-sm text-muted mb-4">When you&apos;re not sure which vibe fits, use this playlist — it&apos;s loud, driving, and workout-ready.</p>
        <VibeCard
          vibe={defaultVibe}
          selected={active.id === defaultVibe.id}
          onSelect={() => setActive(defaultVibe)}
        />
      </section>

      {/* Mood grid */}
      <section className="mb-6">
        <h2 className="text-lg font-black text-dark mb-1">Match your mood</h2>
        <p className="text-sm text-muted mb-4">Same high-energy bar — different flavors. Tap one to load the player below.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {moods.map((vibe, i) => (
            <motion.div
              key={vibe.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <VibeCard
                vibe={vibe}
                selected={active.id === vibe.id}
                onSelect={() => setActive(vibe)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Player */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-600">Now playing</p>
            <p className="font-black text-dark text-lg">
              {active.emoji} {active.label}
            </p>
            <p className="text-sm text-muted">{active.tagline}</p>
          </div>
          <a
            href={openUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1DB954] text-white text-sm font-bold hover:brightness-110 transition-all shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            Open in Spotify
          </a>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl overflow-hidden border border-slate-200 bg-black shadow-lg"
          >
            <iframe
              title={`Spotify playlist: ${active.label}`}
              src={embedSrc}
              width="100%"
              height="380"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="w-full min-h-[380px]"
            />
          </motion.div>
        </AnimatePresence>

        <p className="text-xs text-muted mt-3 leading-relaxed max-w-2xl">
          Playback uses Spotify&apos;s embed. Log in to Spotify in your browser (or app) for full tracks. Playlists are editorial picks — swap IDs in{" "}
          <code className="text-violet-700 bg-violet-50 px-1 rounded">lib/vibesync-playlists.ts</code> for your team&apos;s favorites.
        </p>
      </section>
    </main>
  );
}
