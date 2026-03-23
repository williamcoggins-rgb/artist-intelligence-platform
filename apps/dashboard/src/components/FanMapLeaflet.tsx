"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CityFanData } from "@/lib/mock-data";

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
      return "#22c55e";
    case "Medium":
      return "#3b82f6";
    default:
      return "#6b7280";
  }
}

function getOpacity(count: number, maxCount: number): number {
  return Math.max(0.3, (count / maxCount) * 0.8);
}

export default function FanMapLeaflet({ cities, filter }: Props) {
  const maxCount = Math.max(...cities.map((c) => getCount(c, filter)));

  return (
    <MapContainer
      center={[37.0, -95.7]}
      zoom={4}
      style={{ width: "100%", height: "100%" }}
      className="bg-gray-950"
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
              fillOpacity: getOpacity(count, maxCount),
              weight: 2,
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
                    <span
                      className={`font-semibold ${
                        city.engagement === "High"
                          ? "text-green-600"
                          : city.engagement === "Medium"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {city.engagement}
                    </span>
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
