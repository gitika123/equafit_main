/**
 * VibeSync — high-energy Spotify playlists for workouts.
 * IDs are chosen to load in Spotify’s embed (some older editorial lists 404 there now).
 * Swap `spotifyPlaylistId` for any public playlist from its share link.
 */

export type VibePlaylist = {
  id: string;
  label: string;
  tagline: string;
  emoji: string;
  /** Spotify playlist ID for embed + open links */
  spotifyPlaylistId: string;
  /** Short note on why this vibe helps training */
  energyNote: string;
  /** Shown as the “not sure?” default */
  isDefault?: boolean;
};

export const VIBE_PLAYLISTS: VibePlaylist[] = [
  {
    id: "default",
    label: "Default boost",
    tagline: "Not sure what to pick? Start here.",
    emoji: "⚡",
    spotifyPlaylistId: "37i9dQZF1DXdxcBWuJkbcy",
    energyNote: "Spotify’s long-running gym mix — pumping tracks across genres when you just want to move.",
    isDefault: true,
  },
  {
    id: "hype",
    label: "Max hype",
    tagline: "PRs, sprints, “one more rep.”",
    emoji: "🔥",
    spotifyPlaylistId: "37i9dQZF1DX32NsLKyzScr",
    energyNote: "Aggressive tempo and drops built for all-out effort.",
  },
  {
    id: "happy",
    label: "Happy rush",
    tagline: "Smiling through the burn",
    emoji: "✨",
    spotifyPlaylistId: "37i9dQZF1DX4sWSpwq3LiO",
    energyNote: "Bright, uplifting pop energy that still keeps your heart rate up.",
  },
  {
    id: "flow",
    label: "Flow & rhythm",
    tagline: "Pilates, core, steady cardio",
    emoji: "🌊",
    spotifyPlaylistId: "37i9dQZF1DXcF6B6QPhFDv",
    energyNote: "Steady running-style beats — great for controlled movement, core work, and longer sets.",
  },
  {
    id: "edm-pop",
    label: "EDM & sweat",
    tagline: "Four-on-the-floor fuel",
    emoji: "🎛️",
    spotifyPlaylistId: "37i9dQZF1DX4dyzvuaRJ0no",
    energyNote: "Spotify’s mint-leaning dance floor — driving electronic energy for intervals and circuits.",
  },
  {
    id: "throwback",
    label: "Throwback power",
    tagline: "Old favorites, full gas",
    emoji: "📼",
    spotifyPlaylistId: "37i9dQZF1DXaL0oUdaMtnP",
    energyNote: "Classic high-energy throwbacks — sing-along fuel that still pushes the pace.",
  },
  {
    id: "hip-hop",
    label: "Hip-hop drive",
    tagline: "Bounce, bars, big sets",
    emoji: "🎤",
    spotifyPlaylistId: "37i9dQZF1DX0XUsuxWHRQd",
    energyNote: "Today’s heavy-hitting rap hits — big bass and attitude for strength days (RapCaviar).",
  },
];

export function getDefaultVibe(): VibePlaylist {
  const d = VIBE_PLAYLISTS.find((v) => v.isDefault);
  return d ?? VIBE_PLAYLISTS[0];
}

export function getVibeById(id: string): VibePlaylist | undefined {
  return VIBE_PLAYLISTS.find((v) => v.id === id);
}

export function spotifyEmbedSrc(playlistId: string): string {
  return `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;
}

export function spotifyOpenUrl(playlistId: string): string {
  return `https://open.spotify.com/playlist/${playlistId}`;
}
