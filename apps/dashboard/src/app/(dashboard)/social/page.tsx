"use client";

import EngagementChart from "@/components/charts/EngagementChart";
import CityBarChart from "@/components/charts/CityBarChart";
import {
  socialTimeline,
  topContent,
  socialCityEngagement,
} from "@/lib/mock-data";

export default function SocialPage() {
  const topAdCity = socialCityEngagement.find((c) => c.adRecommendation);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Social Performance</h1>
        <p className="text-gray-500 mt-1">Engagement metrics across social platforms</p>
      </div>

      {/* Ad Spend Recommendation */}
      {topAdCity && (
        <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/10 rounded-xl border border-amber-700/30 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-semibold text-amber-300">Ad Spend Recommendation</h3>
              <p className="text-amber-200/80 text-sm mt-1">
                Focus ad spend on <strong>{topAdCity.city}</strong> — highest engagement ({topAdCity.engagement}%) + strong fan growth.
                Consider allocating 40% of social ad budget to {topAdCity.city} metro area.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Engagement over time */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold mb-4">Instagram Engagement Rate — Last 90 Days</h2>
        <EngagementChart data={socialTimeline} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Content */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Top Performing Content</h2>
          <div className="space-y-3">
            {topContent.map((piece, i) => (
              <div key={piece.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-600 text-xs font-bold w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{piece.title}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-gray-500">{piece.platform}</span>
                    <span className="text-xs text-gray-500">{piece.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 text-sm font-semibold">{piece.engagement}%</p>
                  <p className="text-gray-500 text-xs">{piece.reach.toLocaleString()} reach</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* City Engagement */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">City Engagement Breakdown</h2>
          <CityBarChart data={socialCityEngagement} dataKey="engagement" color="#f59e0b" height={350} />
        </div>
      </div>
    </div>
  );
}
