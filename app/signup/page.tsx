"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { signup } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email"); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters"); return; }
    const result = await signup(email.trim(), password, name.trim() || email.split("@")[0]);
    if (result.error) { setError(result.error); return; }
    router.push("/onboarding");
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #0F172A 0%, #134E4A 50%, #00897B 100%)" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
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
            className="w-20 h-20 rounded-3xl bg-gradient-accent shadow-accent mx-auto mb-4 flex items-center justify-center"
          >
            <span className="text-4xl">🌱</span>
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tight">Join EquaFit</h1>
          <p className="text-white/90 text-sm mt-2 font-medium">One account. All your goals.</p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="glass rounded-3xl p-6 shadow-card-lg">
            <h2 className="text-xl font-black text-dark mb-5">Create your account ✨</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="input-base"
                />
              </div>
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
                <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-1.5">Password (min 4 chars)</label>
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
                className="w-full py-4 rounded-2xl font-black text-white text-base bg-gradient-accent shadow-accent mt-2"
              >
                Create account →
              </motion.button>
            </form>
          </div>

          <p className="text-center text-white/90 text-sm mt-5 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-white font-bold underline underline-offset-2 decoration-2">
              Log in
            </Link>
          </p>
        </motion.div>

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
