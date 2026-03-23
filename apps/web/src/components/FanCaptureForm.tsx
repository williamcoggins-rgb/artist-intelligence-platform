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

    // Try to get location alongside the form submission
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
        placeholder="Email address"
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
        required
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number (optional)"
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full px-4 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium disabled:opacity-50"
      >
        {status === "loading" ? "Joining..." : "Put My City on the Map"}
      </button>
      {status === "success" && (
        <p className="text-green-400 text-sm text-center">{message}</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-sm text-center">{message}</p>
      )}
    </form>
  );
}
