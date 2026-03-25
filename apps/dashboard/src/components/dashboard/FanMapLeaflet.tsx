"use client";

import { useEffect } from "react";
import { CityFanData } from "@/lib/dashboard/artist-data";

// Lazily require react-leaflet to avoid SSR issues — this file is
// only ever loaded via next/dynamic with ssr:false, so window is
// guaranteed to exist when this module executes.
const { MapContainer, TileLayer, CircleMarker, Popup } = require("react-leaflet") as typeof import("react-leaflet");

type FilterMode = "all" | "recent" | "merch";

interface Props {
  cities: CityFanData[];
  filter: FilterMode;
}

function getCount(city: CityFanData, filter: FilterMode): number {
  switch (filter) {
    case "recent":
      return city.recentFans;
    case "merch":
      return city.merchBuyers;
    default:
      return city.fanCount;
  }
}

function getRadius(count: number, maxCount: number): number {
  return Math.max(8, (count / maxCount) * 40);
}

function getColor(engagement: string): string {
  switch (engagement) {
    case "High":
      return "#FFE600";
    case "Medium":
      return "#FFE600";
    default:
      return "rgba(255,255,255,0.3)";
  }
}

function getOpacity(count: number, maxCount: number, engagement: string): number {
  const base = Math.max(0.3, (count / maxCount) * 0.8);
  return engagement === "High" ? base : base * 0.6;
}

export default function FanMapLeaflet({ cities, filter }: Props) {
  // Load Leaflet CSS at runtime in the browser
  useEffect(() => {
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
  }, []);

  const maxCount = Math.max(...cities.map((c) => getCount(c, filter)));

  return (
    <MapContainer
      center={[37.0, -95.7]}
      zoom={4}
      style={{ width: "100%", height: "100%" }}
      className="bg-black"
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {cities.map((city) => {
        const count = getCount(city, filter);
        if (count === 0) return null;
        return (
          <CircleMarker
            key={city.city}
            center={[city.lat, city.lng]}
            radius={getRadius(count, maxCount)}
            pathOptions={{
              color: getColor(city.engagement),
              fillColor: getColor(city.engagement),
              fillOpacity: getOpacity(count, maxCount, city.engagement),
              weight: 1,
            }}
          >
            <Popup>
              <div className="text-gray-900 min-w-[160px]">
                <p className="font-bold text-base">{city.city}</p>
                <div className="mt-2 space-y-1 text-sm">
                  <p>
                    <span className="text-gray-500">Fans:</span>{" "}
                    <span className="font-semibold">{count.toLocaleString()}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Top Song:</span>{" "}
                    <span className="font-semibold">{city.topSong}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Engagement:</span>{" "}
                    <span className="font-semibold">{city.engagement}</span>
                  </p>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
