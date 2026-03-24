"use client";

import { useState, FormEvent } from "react";

export function FanCaptureForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");

    let lat: number | null = null;
    let lng: number | null = null;

    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          maximumAge: 300000,
        });
      });
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
    } catch {
      // Location not available — proceed without it
    }

    try {
      const res = await fetch("/api/fan-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone: phone || undefined,
          lat,
          lng,
          source: "fan_map",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You're in!");
        setEmail("");
        setPhone("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="EMAIL ADDRESS"
        className="w-full px-6 py-4 bg-transparent border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-brand-400 font-body text-sm tracking-[0.15em] uppercase transition-colors"
        required
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="PHONE (OPTIONAL)"
        className="w-full px-6 py-4 bg-transparent border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-brand-400 font-body text-sm tracking-[0.15em] uppercase transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full px-8 py-4 bg-brand-400 text-black font-body text-sm tracking-[0.2em] uppercase font-bold hover:bg-white transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Joining..." : "Put My City on the Map"}
      </button>
      {status === "success" && (
        <p className="font-body text-sm text-brand-400 text-center tracking-wider uppercase">{message}</p>
      )}
      {status === "error" && (
        <p className="font-body text-sm text-red-400 text-center">{message}</p>
      )}
    </form>
  );
}
