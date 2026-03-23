"use client";

import { useState, useEffect, useCallback } from "react";

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}

interface GeofenceCheck {
  eventLat: number;
  eventLng: number;
  radiusKm: number;
}

export function useGeofence() {
  const [location, setLocation] = useState<GeolocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation not supported",
        loading: false,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (err) => {
        setLocation((prev) => ({
          ...prev,
          error: err.message,
          loading: false,
        }));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  const isInsideGeofence = useCallback(
    (fence: GeofenceCheck): boolean | null => {
      if (location.lat == null || location.lng == null) return null;

      const R = 6371;
      const dLat = ((fence.eventLat - location.lat) * Math.PI) / 180;
      const dLng = ((fence.eventLng - location.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((location.lat * Math.PI) / 180) *
          Math.cos((fence.eventLat * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return d <= fence.radiusKm;
    },
    [location.lat, location.lng]
  );

  const reportLocation = useCallback(
    async (email: string) => {
      if (location.lat == null || location.lng == null) return;

      await fetch("/api/fan-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          lat: location.lat,
          lng: location.lng,
          source: "geofence",
        }),
      });
    },
    [location.lat, location.lng]
  );

  return {
    lat: location.lat,
    lng: location.lng,
    error: location.error,
    loading: location.loading,
    isInsideGeofence,
    reportLocation,
  };
}
