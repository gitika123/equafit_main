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

type AuthState = {
  user: StoredUser | null;
  profile: UserProfile | null;
  onboardingDone: boolean;
  isLoading: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  setProfileData: (profile: UserProfile) => void;
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
          await syncUserDataFromCloud();
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
            await syncUserDataFromCloud();
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
    await syncUserDataFromCloud();
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
    setStoredUser({
      id: data.user.id,
      email: data.user.email ?? email,
      name: ((data.user.user_metadata?.name as string | undefined) ?? name) || email.split("@")[0],
      createdAt: data.user.created_at ?? new Date().toISOString(),
    });
    await syncUserDataFromCloud();
    refresh();
    return {};
  }

  async function logout() {
    if (supabase) await supabase.auth.signOut();
    setStoredUser(null);
    refresh();
  }

  function setProfileData(profile: UserProfile) {
    setProfile(profile);
    refresh();
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
