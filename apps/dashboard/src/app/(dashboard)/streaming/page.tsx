"use client";

import StreamsLineChart from "@/components/charts/StreamsLineChart";
import CityBarChart from "@/components/charts/CityBarChart";
import PlatformComparisonChart from "@/components/charts/PlatformComparisonChart";
import {
  streamingTimeline,
  topStreamingCities,
  songStreamData,
  platformComparison,
  totalStreams,
} from "@/lib/mock-data";

export default function StreamingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Streaming Analytics</h1>
        <p className="text-gray-500 mt-1">
          {totalStreams.toLocaleString()} total streams across all platforms
        </p>
      </div>

      {/* Streams over time */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold mb-4">Total Streams — Last 90 Days</h2>
        <StreamsLineChart data={streamingTimeline} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top cities */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Top 10 Cities by Spotify Streams</h2>
          <CityBarChart data={topStreamingCities} dataKey="streams" height={400} />
        </div>

        {/* Platform comparison */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Spotify vs YouTube</h2>
          <PlatformComparisonChart data={platformComparison} />
        </div>
      </div>

      {/* Song table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold mb-4">Song Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-3 text-gray-400 font-medium">Song</th>
                <th className="text-right py-3 px-3 text-gray-400 font-medium">Streams</th>
                <th className="text-right py-3 px-3 text-gray-400 font-medium">Listeners</th>
                <th className="text-right py-3 px-3 text-gray-400 font-medium">Playlist Placements</th>
              </tr>
            </thead>
            <tbody>
              {songStreamData.map((song, i) => (
                <tr key={song.title} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 text-xs w-5">{i + 1}</span>
                      <span className="text-white font-medium">{song.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right text-gray-300">{song.streams.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right text-gray-300">{song.listeners.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded text-xs font-medium">
                      {song.playlists}
                    </span>
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
