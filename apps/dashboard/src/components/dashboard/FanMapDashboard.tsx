"use client";

import { useEffect, useState } from "react";
import { CityFanData } from "@/lib/dashboard/artist-data";

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
      <div className="w-full h-[calc(100vh-16rem)] bg-[#0A0A0A] border border-white/5 flex items-center justify-center">
        <p className="font-body text-sm text-white/20">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(
          [
            { key: "all", label: "All Fans" },
            { key: "recent", label: "Recent (30 days)" },
            { key: "merch", label: "Merch Buyers" },
          ] as const
        ).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 font-body text-xs tracking-[0.15em] uppercase transition-colors ${
              filter === f.key
                ? "bg-brand-400 text-black"
                : "bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="w-full h-[calc(100vh-18rem)] overflow-hidden border border-white/5">
        {MapComponent && <MapComponent cities={cities} filter={filter} />}
      </div>
    </div>
  );
}
