"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/dashboard-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError("Invalid password");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient treatment */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-400/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-400/20 to-transparent" />
      </div>

      {/* Noise texture */}
      <div className="absolute inset-0 z-0 noise-bg pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* QUE Wordmark */}
        <div className="text-center mb-12">
          <h1 className="headline text-hero text-brand-400 leading-none">
            QUE
          </h1>
          <p className="font-body text-[10px] tracking-[0.4em] uppercase text-white/30 mt-4">
            Intelligence Hub
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block font-body text-xs tracking-[0.2em] uppercase text-white/40 mb-3"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-transparent border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-brand-400 font-body text-sm tracking-[0.1em] transition-colors"
              placeholder="Enter dashboard password"
              autoFocus
            />
          </div>

          {error && (
            <p className="font-body text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-4 bg-brand-400 text-black font-body text-sm tracking-[0.2em] uppercase font-semibold hover:bg-white disabled:bg-white/10 disabled:text-white/20 transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-white/15 text-center mt-12">
          Artist &amp; Manager Access Only
        </p>
      </div>
    </div>
  );
}
