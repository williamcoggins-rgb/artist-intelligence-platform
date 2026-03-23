"use client";

import { useEffect, useRef, useState } from "react";

interface CityData {
  city: string;
  count: number;
}

// Well-known city coordinates for map display
const CITY_COORDS: Record<string, [number, number]> = {
  "new york": [40.7128, -74.006],
  "los angeles": [34.0522, -118.2437],
  chicago: [41.8781, -87.6298],
  houston: [29.7604, -95.3698],
  atlanta: [33.749, -84.388],
  miami: [25.7617, -80.1918],
  dallas: [32.7767, -96.797],
  philadelphia: [39.9526, -75.1652],
  detroit: [42.3314, -83.0458],
  memphis: [35.1495, -90.049],
  "washington dc": [38.9072, -77.0369],
  washington: [38.9072, -77.0369],
  "san francisco": [37.7749, -122.4194],
  seattle: [47.6062, -122.3321],
  denver: [39.7392, -104.9903],
  boston: [42.3601, -71.0589],
  phoenix: [33.4484, -112.074],
  "san antonio": [29.4241, -98.4936],
  "san diego": [32.7157, -117.1611],
  austin: [30.2672, -97.7431],
  charlotte: [35.2271, -80.8431],
  nashville: [36.1627, -86.7816],
  "new orleans": [29.9511, -90.0715],
  portland: [45.5152, -122.6784],
  minneapolis: [44.9778, -93.265],
  london: [51.5074, -0.1278],
  toronto: [43.6532, -79.3832],
  paris: [48.8566, 2.3522],
  tokyo: [35.6762, 139.6503],
  lagos: [6.5244, 3.3792],
};

function getCityCoords(
  cityName: string
): [number, number] | null {
  const lower = cityName.toLowerCase();
  return CITY_COORDS[lower] || null;
}

export function FanMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const mapInstance = useRef<unknown>(null);

  useEffect(() => {
    fetch("/api/fan-map")
      .then((res) => res.json())
      .then((data) => {
        setCities(data.cities || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || !mapRef.current || mapInstance.current) return;

    // Dynamically load Leaflet CSS + JS
    const linkEl = document.createElement("link");
    linkEl.rel = "stylesheet";
    linkEl.href =
      "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(linkEl);

    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (window as any).L;

      if (!L || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [39.8283, -98.5795] as unknown as Record<string, unknown>,
        zoom: 4,
        scrollWheelZoom: false,
      } as Record<string, unknown>);

      mapInstance.current = map;

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      const maxCount = Math.max(...cities.map((c) => c.count), 1);

      cities.forEach((city) => {
        const coords = getCityCoords(city.city);
        if (!coords) return;

        const radius = Math.max(6, Math.min(25, (city.count / maxCount) * 25));

        L.circleMarker(coords, {
          radius,
          fillColor: "#4c6ef5",
          color: "#748ffc",
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.6,
        })
          .addTo(map)
          .bindPopup(
            `<strong>${city.city}</strong><br/>${city.count} fan${city.count !== 1 ? "s" : ""}`
          );
      });
    };
    document.head.appendChild(script);

    return () => {
      if (mapInstance.current) {
        (
          mapInstance.current as { remove: () => void }
        ).remove();
        mapInstance.current = null;
      }
    };
  }, [loading, cities]);

  if (loading) {
    return (
      <div className="w-full h-[500px] bg-gray-900 rounded-xl flex items-center justify-center">
        <p className="text-gray-400">Loading fan map...</p>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-800"
    />
  );
}
