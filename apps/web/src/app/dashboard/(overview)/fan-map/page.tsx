"use client";

import { useEffect, useState } from "react";
import FanMapDashboard from "@/components/dashboard/FanMapDashboard";
import { cityFanData as fallbackCities, type CityFanData } from "@/lib/dashboard/artist-data";

export default function FanMapPage() {
  const [cities, setCities] = useState<CityFanData[]>(fallbackCities);
  const [totalFans, setTotalFans] = useState(
    fallbackCities.reduce((s, c) => s + c.fanCount, 0)
  );
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetch("/api/fan-map")
      .then((r) => r.json())
      .then((data) => {
        if (data.cities && data.cities.length > 0) {
          setCities(
            data.cities.map((c: { city: string; lat: number; lng: number; fanCount: number }) => ({
              city: c.city,
              lat: c.lat,
              lng: c.lng,
              fanCount: c.fanCount,
              topSong: "MACABRE",
              engagement: c.fanCount > 30 ? "High" : c.fanCount > 10 ? "Medium" : "Low",
              recentFans: Math.round(c.fanCount * 0.2),
              merchBuyers: Math.round(c.fanCount * 0.05),
            }))
          );
          setTotalFans(data.cities.reduce((s: number, c: { fanCount: number }) => s + c.fanCount, 0));
          setIsLive(true);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-body text-sm text-white/40">
              {totalFans.toLocaleString()} fans across {cities.length} cities
            </span>
            {isLive && (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-green-400">Live</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <FanMapDashboard cities={cities} />

      {/* City Breakdown Table */}
      <div className="bg-[#0A0A0A] border border-white/5 p-6">
        <h2 className="headline text-lg text-white mb-6">City Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase">#</th>
                <th className="text-left py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase">City</th>
                <th className="text-right py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase">Fans</th>
                <th className="text-right py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase">Top Song</th>
                <th className="text-right py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase">Engagement</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city, i) => (
                <tr key={city.city} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-3 px-3 text-white/20">{i + 1}</td>
                  <td className="py-3 px-3 text-white font-medium">{city.city}</td>
                  <td className="py-3 px-3 text-right text-white/60">{city.fanCount.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right text-white/40">{city.topSong}</td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`px-2 py-0.5 text-xs ${
                        city.engagement === "High"
                          ? "bg-green-400/10 text-green-400"
                          : city.engagement === "Medium"
                          ? "bg-brand-400/10 text-brand-400"
                          : "bg-white/5 text-white/30"
                      }`}
                    >
                      {city.engagement}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Geofence Event Log */}
      <div className="bg-[#0A0A0A] border border-white/5 p-6">
        <h2 className="headline text-lg text-white mb-4">Geofence Event Log</h2>
        <p className="font-body text-xs text-white/30 mb-6">
          Location events from mobile visitors — captured via /api/fan-location and /api/geofence-event
        </p>
        <div className="py-8 text-center border border-dashed border-white/10">
          <p className="font-body text-sm text-white/30">
            Geofence events will appear here as mobile visitors interact with the site.
          </p>
          <p className="font-body text-xs text-white/15 mt-2">
            Data sourced from /api/geofence-event
          </p>
        </div>
      </div>
    </div>
  );
}
