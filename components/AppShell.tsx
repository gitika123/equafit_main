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
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const timer = window.setInterval(() => {
      const settings = getReminderSettings();
      if (!settings.enabled) return;
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const today = now.toISOString().slice(0, 10);
      const key = `equafit_last_reminder_date__${user.id}`;
      const lastSent = localStorage.getItem(key);
      if (`${hh}:${mm}` === settings.time && lastSent !== today) {
        new Notification("EquaFit reminder", { body: getRandomReminder() });
        localStorage.setItem(key, today);
      }
    }, 30_000);

    return () => window.clearInterval(timer);
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
