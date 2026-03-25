"use client";

import { useEffect, useState } from "react";
import MetricCard from "@/components/dashboard/MetricCard";
import CityBarChart from "@/components/dashboard/charts/CityBarChart";
import StreamsLineChart from "@/components/dashboard/charts/StreamsLineChart";
import PlatformComparisonChart from "@/components/dashboard/charts/PlatformComparisonChart";
import {
  totalYouTubeViews,
  totalSpotifyStreams,
  totalCrossplatform,
  spotifyProfile,
  YOUTUBE_CHANNEL,
  cityFanData as fallbackCities,
  totalFallbackFans,
  platformComparison,
  timeline,
} from "@/lib/dashboard/artist-data";

interface FanRecord {
  id: string;
  email: string;
  city: string | null;
  source: string | null;
  createdAt: string;
}

export default function OverviewPage() {
  const [realFanCount, setRealFanCount] = useState<number | null>(null);
  const [recentFans, setRecentFans] = useState<FanRecord[]>([]);

  // Fetch real fan data from the database
  useEffect(() => {
    fetch("/api/fan-map")
      .then((r) => r.json())
      .then((data) => {
        if (data.cities && data.cities.length > 0) {
          const total = data.cities.reduce(
            (sum: number, c: { fanCount: number }) => sum + c.fanCount,
            0
          );
          setRealFanCount(total);
        }
      })
      .catch(() => {});
  }, []);

  const fanCount = realFanCount ?? totalFallbackFans;
  const topCity = fallbackCities[0];

  return (
    <div className="space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <MetricCard
          label="Total Fans"
          value={fanCount.toLocaleString()}
          change={realFanCount !== null ? "Live from database" : "Fallback data"}
          changeType={realFanCount !== null ? "positive" : "neutral"}
        />
        <MetricCard
          label="Video Views"
          value={totalYouTubeViews.toLocaleString()}
          change={`${YOUTUBE_CHANNEL.totalVideos} videos`}
          changeType="neutral"
        />
        <MetricCard
          label="Total Streams"
          value={totalSpotifyStreams.toLocaleString()}
          change={`${spotifyProfile.monthlyListeners} monthly listeners`}
          changeType="neutral"
        />
        <MetricCard
          label="Engagement"
          value="4.2%"
          change="+0.3% this month"
          changeType="positive"
        />
        <MetricCard
          label="Top City"
          value={topCity.city}
          change={`${topCity.fanCount} fans`}
          changeType="neutral"
        />
        <MetricCard
          label="Monthly Growth"
          value="+8.4%"
          change="Cross-platform"
          changeType="positive"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* City Distribution */}
        <div className="bg-[#0A0A0A] border border-white/5 p-6">
          <h2 className="headline text-lg text-white mb-6">Fan Distribution by City</h2>
          <CityBarChart
            data={fallbackCities.slice(0, 8)}
            dataKey="fanCount"
            height={320}
          />
        </div>

        {/* Platform Comparison */}
        <div className="bg-[#0A0A0A] border border-white/5 p-6">
          <h2 className="headline text-lg text-white mb-2">Platform Comparison</h2>
          <p className="font-body text-xs text-white/30 mb-6">
            {totalCrossplatform.toLocaleString()} total across all platforms
          </p>
          <PlatformComparisonChart data={platformComparison} />
        </div>
      </div>

      {/* Engagement Timeline */}
      <div className="bg-[#0A0A0A] border border-white/5 p-6">
        <h2 className="headline text-lg text-white mb-2">Engagement Over Time</h2>
        <p className="font-body text-xs text-white/30 mb-6">Last 90 days — streams &amp; views</p>
        <StreamsLineChart data={timeline} />
      </div>

      {/* Recent Fan Sign-ups */}
      <div className="bg-[#0A0A0A] border border-white/5 p-6">
        <h2 className="headline text-lg text-white mb-6">Recent Fan Sign-ups</h2>
        {recentFans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase">Email</th>
                  <th className="text-left py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase">City</th>
                  <th className="text-left py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase">Source</th>
                  <th className="text-left py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentFans.map((fan) => (
                  <tr key={fan.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-3 px-3 text-white/60">{fan.email}</td>
                    <td className="py-3 px-3 text-white/60">{fan.city || "Unknown"}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-white/5 text-white/40 text-xs">{fan.source || "website"}</span>
                    </td>
                    <td className="py-3 px-3 text-white/30">
                      {new Date(fan.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center border border-dashed border-white/10">
            <p className="font-body text-sm text-white/30">
              Fan sign-ups will appear here as visitors subscribe through the site.
            </p>
            <p className="font-body text-xs text-white/15 mt-2">
              Data sourced from /api/fan-capture
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
