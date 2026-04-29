"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getReminderSettings, setReminderSettings } from "@/lib/user-store";
import { WITTY_REMINDERS, getRandomReminder } from "@/lib/reminders";
import type { ReminderSettings } from "@/lib/user-store";

export default function RemindersPage() {
  const [settings, setSettings] = useState<ReminderSettings>({ enabled: false, time: "09:00", messages: [] });
  const [preview, setPreview] = useState("");
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default"
  );

  useEffect(() => {
    setSettings(getReminderSettings());
    setPreview(getRandomReminder());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setReminderSettings(settings);
  }, [settings, hydrated]);

  function toggleEnabled() {
    setSettings((s) => ({ ...s, enabled: !s.enabled }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function shufflePreview() { setPreview(getRandomReminder()); }

  async function enableBrowserNotifications() {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotifPermission(permission);
  }

  return (
    <main className="w-full px-4 sm:px-6 lg:px-10 pt-6 pb-28 md:pb-10 min-h-screen">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-dark leading-tight">Reminders</h1>
          <p className="text-muted text-sm mt-1">Daily nudges to keep you moving and motivated.</p>
        </div>
        {saved && (
          <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
            ✓ Saved
          </motion.span>
        )}
      </motion.div>

      {/* ── Desktop 2-col ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6 lg:gap-8 items-start">

        {/* ── LEFT: settings ── */}
        <div className="space-y-5">

          {/* Toggle card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="card p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-colors ${settings.enabled ? "bg-amber-100" : "bg-slate-100"}`}>
                  🔔
                </div>
                <div>
                  <h2 className="font-black text-dark text-lg">Daily reminder</h2>
                  <p className="text-sm text-muted mt-0.5">Get a random motivational nudge each day</p>
                  {settings.enabled && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-primary font-semibold mt-1">
                      Active · Scheduled for {settings.time}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Toggle switch */}
              <button type="button" role="switch" aria-checked={settings.enabled} onClick={toggleEnabled}
                className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ${settings.enabled ? "bg-primary" : "bg-slate-200"}`}>
                <motion.span layout className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm"
                  style={{ left: settings.enabled ? "30px" : "4px" }} transition={{ type: "spring", stiffness: 300, damping: 25 }} />
              </button>
            </div>

            {/* Time picker */}
            {settings.enabled && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                className="mt-5 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-bold text-dark mb-0.5">Notification time</label>
                    <p className="text-xs text-muted">When should we send your daily nudge?</p>
                  </div>
                  <input type="time" value={settings.time}
                    onChange={(e) => setSettings((s) => ({ ...s, time: e.target.value }))}
                    className="input-base text-sm w-36 text-center font-bold" />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* How it works */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="card p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
            <h3 className="font-black text-dark mb-4">How reminders work</h3>
            {notifPermission !== "granted" && (
              <div className="mb-4 p-3 rounded-xl bg-white border border-amber-200">
                <p className="text-xs text-muted mb-2">
                  Browser notifications are currently blocked, so pop-up reminders cannot appear.
                </p>
                <button
                  type="button"
                  onClick={enableBrowserNotifications}
                  className="text-xs font-bold text-primary hover:underline underline-offset-2"
                >
                  Enable browser notifications
                </button>
              </div>
            )}
            <div className="space-y-3">
              {[
                { icon: "🎲", title: "Random each day", desc: "A different witty message every time — no repetition." },
                { icon: "⏰", title: "Pick your time", desc: "Set the exact time you want your daily nudge." },
                { icon: "😄", title: "Kept light & fun", desc: "We keep it playful. No guilt-tripping, ever." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="text-xl mt-0.5 flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-dark">{item.title}</p>
                    <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* All messages list */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="card p-6">
            <h3 className="font-black text-dark mb-1">All {WITTY_REMINDERS.length} reminder lines</h3>
            <p className="text-sm text-muted mb-4">Here&apos;s everything in the rotation.</p>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {WITTY_REMINDERS.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <span className="text-xs font-bold text-muted w-5 flex-shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-sm text-dark leading-snug">{msg}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT: preview ── */}
        <div className="lg:sticky lg:top-6 space-y-5">

          {/* Preview card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="card p-6 bg-gradient-to-br from-primary/10 to-orange-50 border-orange-100">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Preview · random each time</p>

            <div className="flex items-start gap-3 mb-5">
              <span className="text-3xl">💬</span>
              <p className="text-dark font-semibold text-lg leading-snug">&ldquo;{preview}&rdquo;</p>
            </div>

            <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={shufflePreview}
              className="w-full py-3 rounded-xl bg-white border border-orange-200 text-primary font-bold text-sm hover:bg-orange-50 transition-colors">
              🎲 Show another
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="card p-5">
            <p className="text-sm font-black text-dark mb-4">Reminder stats</p>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-primary/8">
                <p className="text-2xl font-black text-primary">{WITTY_REMINDERS.length}</p>
                <p className="text-xs text-muted mt-0.5">messages</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <p className="text-2xl font-black text-dark">{settings.enabled ? "On" : "Off"}</p>
                <p className="text-xs text-muted mt-0.5">status</p>
              </div>
            </div>
          </motion.div>

          {/* Enable CTA if off */}
          {!settings.enabled && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
              className="card p-5 border-2 border-dashed border-amber-200 bg-amber-50/50 text-center">
              <p className="text-3xl mb-2">🔕</p>
              <p className="font-bold text-dark text-sm mb-1">Reminders are off</p>
              <p className="text-xs text-muted mb-3">Toggle the switch on the left to enable daily nudges.</p>
              <button onClick={toggleEnabled}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                Enable reminders
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
