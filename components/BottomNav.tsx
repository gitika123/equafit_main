"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

/* ── SVG Icons ── */
function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}
function RoutinesIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M9 7h6M9 11h6M9 15h4" />
    </svg>
  );
}
function ProgressIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20h18M5 20V12m4 8V8m4 12V5m4 15v-7" />
    </svg>
  );
}
function CycleIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}
function BellIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}
function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
function FuelIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3C10 3 8.5 5 8.5 8c0 3 1.5 5.5 3.5 6.5 2-1 3.5-3.5 3.5-6.5C15.5 5 14 3 12 3Z" />
      <path d="M12 14.5V21" />
    </svg>
  );
}
function VibeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

const navItems = [
  { href: "/",          label: "Home",     Icon: HomeIcon },
  { href: "/routines",  label: "Routines", Icon: RoutinesIcon },
  { href: "/progress",  label: "Progress", Icon: ProgressIcon },
  { href: "/diet-fuel", label: "Fuel",     Icon: FuelIcon },
  { href: "/vibesync",  label: "Vibe",     Icon: VibeIcon },
  { href: "/period",    label: "Cycle",    Icon: CycleIcon },
  { href: "/reminders", label: "Remind",   Icon: BellIcon },
  { href: "/profile",   label: "Profile",  Icon: ProfileIcon },
];

interface BottomNavProps {
  showSidebar: boolean;
  showBottomNav: boolean;
}

export function BottomNav({ showBottomNav }: BottomNavProps) {
  const pathname = usePathname();
  const { profile } = useAuth();
  const showCycle = profile?.gender !== "male";
  const visibleNavItems = showCycle
    ? navItems
    : navItems.filter((item) => item.href !== "/period");

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      {/* ── Desktop left sidebar ── */}
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 22, stiffness: 260 }}
        className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 bg-white border-r border-slate-100 z-50"
        style={{ boxShadow: "2px 0 16px rgba(0,0,0,0.04)" }}
      >
        {/* Logo */}
        <div className="px-4 py-6 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-fitness shadow-primary flex items-center justify-center text-lg flex-shrink-0">
              ⚡
            </div>
            <div>
              <p className="font-black text-dark text-base leading-tight">EquaFit</p>
              <p className="text-xs text-muted font-medium">Wellness · CS 161</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {visibleNavItems.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  active ? "text-primary" : "text-slate-500 hover:text-dark hover:bg-slate-50"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-primary/10"
                    transition={{ type: "spring", damping: 26, stiffness: 400 }}
                  />
                )}
                <span className="relative">
                  <Icon active={active} />
                </span>
                <span className={`relative font-semibold text-sm ${active ? "text-primary" : ""}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-50">
          <p className="text-xs text-muted font-medium">Team 4 · Spring 2026</p>
        </div>
      </motion.aside>

      {/* ── Mobile bottom nav ── */}
      {showBottomNav && (
        <motion.nav
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 22, stiffness: 260, delay: 0.1 }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-pb"
        >
          <div className="nav-glass border-t border-white/60" style={{ boxShadow: "0 -4px 24px rgba(0,0,0,0.06)" }}>
            <div
              className="flex items-center h-16 px-1 gap-0.5 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {visibleNavItems.map(({ href, label, Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex flex-col items-center justify-center min-w-[3.35rem] flex-shrink-0 py-1.5 px-0.5 relative"
                  >
                    {active && (
                      <motion.div
                        layoutId="mobile-nav-pill"
                        className="absolute inset-0 rounded-2xl bg-primary/10 mx-0.5"
                        transition={{ type: "spring", damping: 26, stiffness: 400 }}
                      />
                    )}
                    <span className={`relative transition-colors duration-200 ${active ? "text-primary" : "text-slate-600"}`}>
                      <Icon active={active} />
                    </span>
                    <span className={`relative text-xs font-semibold mt-0.5 tracking-wide transition-colors duration-200 ${active ? "text-primary" : "text-slate-600"}`}>
                      {label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </>
  );
}
