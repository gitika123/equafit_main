"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { isOnboardingDone } from "@/lib/user-store";
import { validateEmail, validateLoginPassword } from "@/lib/user-validation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const em = validateEmail(email);
    if (!em.ok) {
      setError(em.message);
      return;
    }
    const pw = validateLoginPassword(password);
    if (!pw.ok) {
      setError(pw.message);
      return;
    }
    const result = await login(email.trim(), password);
    if (result.error) { setError(result.error); return; }
    router.push(isOnboardingDone() ? "/" : "/onboarding");
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #0F172A 0%, #1E293B 40%, #b8320e 100%)" }}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-between px-6 py-12">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 14, stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 rounded-3xl bg-gradient-fitness shadow-primary-lg mx-auto mb-4 flex items-center justify-center"
          >
            <span className="text-4xl">⚡</span>
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tight">EquaFit</h1>
          <p className="text-white/90 text-sm mt-2 font-medium">Your body. Your routine. Your vibe.</p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="glass rounded-3xl p-6 shadow-card-lg">
            <h2 className="text-xl font-black text-dark mb-5">Welcome back 👋</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-base"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-base"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-800 font-semibold"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-2xl font-black text-white text-base bg-gradient-fitness shadow-primary mt-2"
              >
                Log in →
              </motion.button>
            </form>
          </div>

          <p className="text-center text-white/90 text-sm mt-5 font-medium">
            New here?{" "}
            <Link href="/signup" className="text-white font-bold underline underline-offset-2 decoration-2">
              Create account
            </Link>
          </p>
        </motion.div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-white/80 text-xs font-medium"
        >
          Built for students · CS 161 · Team 4
        </motion.p>
      </div>
    </div>
  );
}
