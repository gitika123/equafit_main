"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getStoredUser,
  setStoredUser,
  isOnboardingDone,
  getProfile,
  setProfile,
  setOnboardingDone as setOnboardingDoneStorage,
  syncUserDataFromCloud,
  type StoredUser,
  type UserProfile,
} from "@/lib/user-store";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

function logSyncIssues(errors: string[]) {
  if (errors.length) console.warn("[EquaFit] Cloud sync:", errors.join("; "));
}

type AuthState = {
  user: StoredUser | null;
  profile: UserProfile | null;
  onboardingDone: boolean;
  isLoading: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error?: string; needsEmailConfirmation?: boolean }>;
  logout: () => Promise<void>;
  setProfileData: (
    profile: UserProfile,
    opts?: { completeOnboarding?: boolean }
  ) => Promise<{ error?: string }>;
  setOnboardingDone: () => void;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    onboardingDone: false,
    isLoading: true,
  });

  function refresh() {
    setState({
      user: getStoredUser(),
      profile: getProfile(),
      onboardingDone: isOnboardingDone(),
      isLoading: false,
    });
  }

  useEffect(() => {
    async function init() {
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        const sessionUser = data.session?.user;
        if (sessionUser) {
          setStoredUser({
            id: sessionUser.id,
            email: sessionUser.email ?? "",
            name:
              (sessionUser.user_metadata?.name as string | undefined) ??
              (sessionUser.email?.split("@")[0] ?? "User"),
            createdAt: sessionUser.created_at ?? new Date().toISOString(),
          });
          logSyncIssues((await syncUserDataFromCloud()).errors);
        }
        supabase.auth.onAuthStateChange((_event, session) => {
          void (async () => {
          const u = session?.user;
          if (u) {
            setStoredUser({
              id: u.id,
              email: u.email ?? "",
              name:
                (u.user_metadata?.name as string | undefined) ??
                (u.email?.split("@")[0] ?? "User"),
              createdAt: u.created_at ?? new Date().toISOString(),
            });
            logSyncIssues((await syncUserDataFromCloud()).errors);
          } else {
            setStoredUser(null);
          }
          refresh();
          })();
        });
      }
      refresh();
    }
    void init();
  }, []);

  async function login(email: string, password: string) {
    if (!isSupabaseConfigured || !supabase) {
      return { error: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return { error: error?.message ?? "Login failed." };
    }
    setStoredUser({
      id: data.user.id,
      email: data.user.email ?? email,
      name: (data.user.user_metadata?.name as string | undefined) ?? email.split("@")[0],
      createdAt: data.user.created_at ?? new Date().toISOString(),
    });
    logSyncIssues((await syncUserDataFromCloud()).errors);
    refresh();
    return {};
  }

  async function signup(email: string, password: string, name: string) {
    if (!isSupabaseConfigured || !supabase) {
      return { error: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: name || email.split("@")[0] } },
    });
    if (error) return { error: error.message };
    if (!data.user) return { error: "Signup failed." };

    if (!data.session) {
      // No JWT yet (e.g. "Confirm email" enabled). RLS policies require auth.uid(); DB writes would fail.
      return { needsEmailConfirmation: true };
    }

    setStoredUser({
      id: data.user.id,
      email: data.user.email ?? email,
      name: ((data.user.user_metadata?.name as string | undefined) ?? name) || email.split("@")[0],
      createdAt: data.user.created_at ?? new Date().toISOString(),
    });
    logSyncIssues((await syncUserDataFromCloud()).errors);
    refresh();
    return {};
  }

  async function logout() {
    if (supabase) await supabase.auth.signOut();
    setStoredUser(null);
    refresh();
  }

  async function setProfileData(profile: UserProfile, opts?: { completeOnboarding?: boolean }) {
    const { error } = await setProfile(profile, opts);
    refresh();
    return { error };
  }

  function setOnboardingDoneFlag() {
    setOnboardingDoneStorage();
    refresh();
  }

  const value: AuthContextValue = {
    ...state,
    login,
    signup,
    logout,
    setProfileData,
    setOnboardingDone: setOnboardingDoneFlag,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
