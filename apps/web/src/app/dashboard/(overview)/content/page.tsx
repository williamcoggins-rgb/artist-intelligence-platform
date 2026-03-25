"use client";

import { youtubeVideos, YOUTUBE_CHANNEL, totalYouTubeViews } from "@/lib/dashboard/artist-data";

export default function ContentPage() {
  const siteVideos = youtubeVideos.filter((v) => v.usedOnSite);
  const sortedByViews = [...youtubeVideos].sort((a, b) => b.views - a.views);

  return (
    <div className="space-y-8">
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#0A0A0A] border border-white/5 p-5">
          <p className="font-body text-xs tracking-[0.2em] uppercase text-white/30">Total Videos</p>
          <p className="headline text-2xl text-white mt-2">{YOUTUBE_CHANNEL.totalVideos}</p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/5 p-5">
          <p className="font-body text-xs tracking-[0.2em] uppercase text-white/30">Total Views</p>
          <p className="headline text-2xl text-white mt-2">{totalYouTubeViews.toLocaleString()}</p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/5 p-5">
          <p className="font-body text-xs tracking-[0.2em] uppercase text-white/30">Used on Site</p>
          <p className="headline text-2xl text-brand-400 mt-2">{siteVideos.length}</p>
        </div>
      </div>

      {/* Site Background Videos */}
      <div className="bg-[#0A0A0A] border border-white/5 p-6">
        <h2 className="headline text-lg text-white mb-2">Videos Used on Site</h2>
        <p className="font-body text-xs text-white/30 mb-6">
          These videos serve as background visuals across the artist website
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {siteVideos.map((video) => (
            <div key={video.id} className="border border-white/5 overflow-hidden group">
              <div className="relative aspect-video bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <span className="font-body text-[10px] tracking-[0.2em] uppercase text-brand-400">
                    {video.siteUsage}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="headline text-sm text-white">{video.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-body text-xs text-white/30">{video.views.toLocaleString()} views</span>
                  <span className="font-body text-xs text-white/20">{video.publishedAgo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Video Catalog */}
      <div className="bg-[#0A0A0A] border border-white/5 p-6">
        <h2 className="headline text-lg text-white mb-2">Full Video Catalog</h2>
        <p className="font-body text-xs text-white/30 mb-6">
          All {YOUTUBE_CHANNEL.totalVideos} videos from {YOUTUBE_CHANNEL.handle} — sorted by views
        </p>
        <div className="overflow-x-auto">
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase w-8">#</th>
                <th className="text-left py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase">Title</th>
                <th className="text-right py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase">Views</th>
                <th className="text-right py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase">Published</th>
                <th className="text-center py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase">On Site</th>
              </tr>
            </thead>
            <tbody>
              {sortedByViews.map((video, i) => (
                <tr key={video.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-3 px-3 text-white/20">{i + 1}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-9 bg-white/5 overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://img.youtube.com/vi/${video.id}/default.jpg`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-white font-medium">{video.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right text-white/60">{video.views.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right text-white/30">{video.publishedAgo}</td>
                  <td className="py-3 px-3 text-center">
                    {video.usedOnSite ? (
                      <span className="px-2 py-0.5 bg-brand-400/10 text-brand-400 text-xs">
                        {video.siteUsage}
                      </span>
                    ) : (
                      <span className="text-white/15">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Content Performance */}
      <div className="bg-[#0A0A0A] border border-white/5 p-6">
        <h2 className="headline text-lg text-white mb-2">Content Performance</h2>
        <p className="font-body text-xs text-white/30 mb-6">Views distribution across catalog</p>
        <div className="space-y-2">
          {sortedByViews.slice(0, 8).map((video) => {
            const maxViews = sortedByViews[0].views;
            const pct = (video.views / maxViews) * 100;
            return (
              <div key={video.id} className="flex items-center gap-4">
                <span className="font-body text-xs text-white/60 w-40 truncate">{video.title}</span>
                <div className="flex-1 h-6 bg-white/5 relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-brand-400/20"
                    style={{ width: `${pct}%` }}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 font-body text-xs text-white/40">
                    {video.views.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
