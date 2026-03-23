"use client";

import MetricCard from "@/components/MetricCard";
import CityBarChart from "@/components/charts/CityBarChart";
import {
  totalFanCount,
  fanCountLastWeek,
  totalStreams,
  cityFanData,
  recentFans,
  songStreamData,
} from "@/lib/mock-data";

export default function OverviewPage() {
  const fanGrowth = totalFanCount - fanCountLastWeek;
  const fanGrowthPct = ((fanGrowth / fanCountLastWeek) * 100).toFixed(1);
  const topCity = cityFanData[0];
  const avgEngagement = "5.2%";

  const top3Cities = cityFanData.slice(0, 3).map((c) => ({
    city: c.city,
    fanCount: c.fanCount,
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="flex gap-3">
          <button
            onClick={() => alert("Sync triggered — connect data sources to enable.")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Sync Data Now
          </button>
          <button
            onClick={() => alert("Export triggered — connect data sources to enable.")}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg border border-gray-700 transition-colors"
          >
            Export Fan List
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total Fans"
          value={totalFanCount.toLocaleString()}
          change={`+${fanGrowth} (${fanGrowthPct}%) this week`}
          changeType="positive"
        />
        <MetricCard
          label="Total Streams"
          value={totalStreams.toLocaleString()}
          change="+12.3% this month"
          changeType="positive"
        />
        <MetricCard
          label="Top City"
          value={topCity.city}
          change={`${topCity.fanCount} fans`}
          changeType="neutral"
        />
        <MetricCard
          label="Engagement Rate"
          value={avgEngagement}
          change="+0.8% from last week"
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Cities */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Top 3 Cities by Fan Count</h2>
          <CityBarChart data={top3Cities} dataKey="fanCount" height={200} />
        </div>

        {/* Spotify Streams */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Spotify Streaming Numbers</h2>
          <div className="space-y-3">
            {songStreamData.map((song) => (
              <div key={song.title} className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">{song.title}</span>
                <span className="text-white font-medium text-sm">{song.streams.toLocaleString()} streams</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Fan Sign-ups */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Fan Sign-ups</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-2 text-gray-400 font-medium">Email</th>
                <th className="text-left py-3 px-2 text-gray-400 font-medium">City</th>
                <th className="text-left py-3 px-2 text-gray-400 font-medium">Source</th>
                <th className="text-left py-3 px-2 text-gray-400 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentFans.map((fan) => (
                <tr key={fan.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-2.5 px-2 text-gray-300">{fan.email}</td>
                  <td className="py-2.5 px-2 text-gray-300">{fan.city}</td>
                  <td className="py-2.5 px-2">
                    <span className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400">{fan.source}</span>
                  </td>
                  <td className="py-2.5 px-2 text-gray-500">
                    {new Date(fan.capturedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
