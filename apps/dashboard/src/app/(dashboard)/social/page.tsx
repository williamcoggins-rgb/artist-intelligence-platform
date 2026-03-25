"use client";

import EngagementChart from "@/components/dashboard/charts/EngagementChart";
import CityBarChart from "@/components/dashboard/charts/CityBarChart";
import {
  instagramProfile,
  socialMetrics,
  YOUTUBE_CHANNEL,
  totalYouTubeViews,
  topContent,
  socialCityEngagement,
  timeline,
} from "@/lib/dashboard/artist-data";

export default function SocialPage() {
  const topAdCity = socialCityEngagement.find((c) => c.adRecommendation);

  return (
    <div className="space-y-8">
      {/* Platform Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Instagram */}
        <div className="bg-[#0A0A0A] border border-white/5 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#FCAF45] via-[#E1306C] to-[#833AB4]" />
            <span className="font-body text-xs tracking-[0.15em] uppercase text-white/30">Instagram</span>
          </div>
          <p className="headline text-2xl text-white">{instagramProfile.followers.toLocaleString()}</p>
          <p className="font-body text-xs text-white/30 mt-1">followers</p>
          <div className="flex gap-4 mt-4 pt-4 border-t border-white/5">
            <div>
              <p className="font-body text-xs text-white/50">{instagramProfile.posts} posts</p>
            </div>
            <div>
              <p className="font-body text-xs text-brand-400">{instagramProfile.engagementRate}% eng.</p>
            </div>
          </div>
        </div>

        {/* YouTube */}
        <div className="bg-[#0A0A0A] border border-white/5 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF0000]" />
            <span className="font-body text-xs tracking-[0.15em] uppercase text-white/30">YouTube</span>
          </div>
          <p className="headline text-2xl text-white">{YOUTUBE_CHANNEL.subscribers.toLocaleString()}</p>
          <p className="font-body text-xs text-white/30 mt-1">subscribers</p>
          <div className="flex gap-4 mt-4 pt-4 border-t border-white/5">
            <div>
              <p className="font-body text-xs text-white/50">{totalYouTubeViews.toLocaleString()} views</p>
            </div>
            <div>
              <p className="font-body text-xs text-white/50">{YOUTUBE_CHANNEL.totalVideos} videos</p>
            </div>
          </div>
        </div>

        {/* TikTok */}
        <div className="bg-[#0A0A0A] border border-white/5 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="font-body text-xs tracking-[0.15em] uppercase text-white/30">TikTok</span>
          </div>
          <p className="headline text-2xl text-white/30">---</p>
          <p className="font-body text-xs text-white/15 mt-1">not connected</p>
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="font-body text-xs text-white/20">Connect TikTok to track growth</p>
          </div>
        </div>
      </div>

      {/* Ad Spend Recommendation */}
      {topAdCity && (
        <div className="bg-brand-400/5 border border-brand-400/20 p-6">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-400 mt-1.5 shrink-0" />
            <div>
              <h3 className="headline text-sm text-brand-400">Ad Spend Recommendation</h3>
              <p className="font-body text-sm text-white/50 mt-2">
                Focus ad spend on <strong className="text-white">{topAdCity.city}</strong> — highest
                engagement ({topAdCity.engagement}%) with strong fan growth. Consider allocating 40%
                of social ad budget to the {topAdCity.city} metro area.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Platform Growth Trends */}
      <div className="bg-[#0A0A0A] border border-white/5 p-6">
        <h2 className="headline text-lg text-white mb-2">Engagement Rate — Last 90 Days</h2>
        <p className="font-body text-xs text-white/30 mb-6">Instagram engagement across all content</p>
        <EngagementChart data={timeline} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Top Content */}
        <div className="bg-[#0A0A0A] border border-white/5 p-6">
          <h2 className="headline text-lg text-white mb-6">Top Performing Content</h2>
          <div className="space-y-3">
            {topContent.map((piece, i) => (
              <div key={piece.id} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5">
                <span className="font-body text-xs text-white/20 w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-white truncate">{piece.title}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="font-body text-xs text-white/30">{piece.platform}</span>
                    <span className="font-body text-xs text-white/20">{piece.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-body text-sm text-brand-400 font-semibold">{piece.engagement}%</p>
                  <p className="font-body text-xs text-white/30">{piece.reach.toLocaleString()} reach</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* City Engagement */}
        <div className="bg-[#0A0A0A] border border-white/5 p-6">
          <h2 className="headline text-lg text-white mb-6">City Engagement Breakdown</h2>
          <CityBarChart data={socialCityEngagement} dataKey="engagement" height={350} />
        </div>
      </div>
    </div>
  );
}
