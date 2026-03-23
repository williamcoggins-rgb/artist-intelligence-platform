"use client";

import { useEffect, useState } from "react";
import { CityFanData } from "@/lib/dashboard/mock-data";

interface FanMapProps {
  cities: CityFanData[];
}

type FilterMode = "all" | "recent" | "merch";

export default function FanMapDashboard({ cities }: FanMapProps) {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{ cities: CityFanData[]; filter: FilterMode }> | null>(null);

  useEffect(() => {
    setMounted(true);
    import("./FanMapLeaflet").then((mod) => {
      setMapComponent(() => mod.default);
    });
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[calc(100vh-12rem)] bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(
          [
            { key: "all", label: "All Fans" },
            { key: "recent", label: "Recent Fans (30 days)" },
            { key: "merch", label: "Merch Buyers" },
          ] as const
        ).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.key
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="w-full h-[calc(100vh-14rem)] rounded-xl overflow-hidden border border-gray-800">
        {MapComponent && <MapComponent cities={cities} filter={filter} />}
      </div>
    </div>
  );
}
