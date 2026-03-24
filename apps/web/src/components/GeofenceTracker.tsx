"use client";

import { useEffect, useRef } from "react";

/**
 * Silent component that captures visitor geolocation on every page load
 * and sends it to /api/fan-capture. Does not render anything visible.
 * Location is only captured if the user has previously granted permission.
 */
export function GeofenceTracker() {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    if (!navigator.geolocation) return;

    // Check if we already have a stored anonymous session
    const sessionKey = "geo_tracked";
    const lastTracked = sessionStorage.getItem(sessionKey);
    if (lastTracked) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (sent.current) return;
        sent.current = true;

        const { latitude, longitude } = position.coords;

        try {
          await fetch("/api/fan-location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: latitude,
              lng: longitude,
              source: "page_visit",
            }),
          });
          sessionStorage.setItem(sessionKey, Date.now().toString());
        } catch (error) {
          console.warn("[GeofenceTracker] Location capture failed:", error);
        }
      },
      () => {
        // User denied or geolocation unavailable — do nothing
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  return null;
}
