"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { BottomNav } from "@/components/BottomNav";
import { getReminderSettings } from "@/lib/user-store";
import { getRandomReminder } from "@/lib/reminders";

const AUTH_PATHS = ["/login", "/signup"];
const ONBOARDING_PATH = "/onboarding";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, onboardingDone, isLoading } = useAuth();

  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (isLoading) return;
    if (!user && !isAuthPage) { router.replace("/login"); return; }
    if (user && !onboardingDone && pathname !== ONBOARDING_PATH) { router.replace(ONBOARDING_PATH); return; }
    if (user && onboardingDone && pathname === ONBOARDING_PATH) { router.replace("/"); return; }
  }, [user, onboardingDone, isLoading, isAuthPage, pathname, router]);

  useEffect(() => {
    if (!user || !onboardingDone) return;
    const userId = user.id;
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    function tryFireReminder() {
      const settings = getReminderSettings();
      if (!settings.enabled) return;
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      const key = `equafit_last_reminder_date__${userId}`;
      if (localStorage.getItem(key) === today) return;

      const parts = settings.time.split(":");
      const h = parseInt(parts[0] ?? "9", 10);
      const m = parseInt(parts[1] ?? "0", 10);
      if (Number.isNaN(h) || Number.isNaN(m)) return;

      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
      const graceMs = 12 * 60 * 1000;
      const end = new Date(start.getTime() + graceMs);
      const t = now.getTime();
      if (t < start.getTime() || t >= end.getTime()) return;

      try {
        new Notification("EquaFit reminder", { body: getRandomReminder() });
        localStorage.setItem(key, today);
      } catch {
        /* ignore */
      }
    }

    tryFireReminder();
    const timer = window.setInterval(tryFireReminder, 15_000);
    const onVis = () => {
      if (document.visibilityState === "visible") tryFireReminder();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [user, onboardingDone]);

  // Desktop sidebar: show on all app pages except auth/onboarding/complete
  const showSidebar = !!(user && onboardingDone && !isAuthPage && pathname !== ONBOARDING_PATH && !pathname.startsWith("/complete"));

  // Mobile bottom nav: hide on deep routine sub-pages (they have their own back nav)
  const showBottomNav = !!(showSidebar && !pathname.startsWith("/routines/"));

  return (
    <div className={showSidebar ? "md:pl-56" : ""}>
      {children}
      {showSidebar && <BottomNav showSidebar={showSidebar} showBottomNav={showBottomNav} />}
    </div>
  );
}
