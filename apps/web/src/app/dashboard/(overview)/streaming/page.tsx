"use client";

import StreamsLineChart from "@/components/dashboard/charts/StreamsLineChart";
import CityBarChart from "@/components/dashboard/charts/CityBarChart";
import {
  spotifyProfile,
  spotifyTracks,
  totalSpotifyStreams,
  YOUTUBE_CHANNEL,
  youtubeVideos,
  totalYouTubeViews,
  streamingCities,
  timeline,
} from "@/lib/dashboard/artist-data";

export default function StreamingPage() {
  return (
    <div className="space-y-8">
      {/* Spotify Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 rounded-full bg-[#1DB954]" />
          <h2 className="headline text-xl text-white">Spotify</h2>
          <span className="font-body text-xs text-white/20 ml-2">
            {spotifyProfile.monthlyListeners} monthly listeners
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-[#0A0A0A] border border-white/5 p-5">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-white/30">Monthly Listeners</p>
            <p className="headline text-2xl text-white mt-2">{spotifyProfile.monthlyListeners.toLocaleString()}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 p-5">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-white/30">Total Streams</p>
            <p className="headline text-2xl text-white mt-2">{totalSpotifyStreams.toLocaleString()}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 p-5">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-white/30">Followers</p>
            <p className="headline text-2xl text-white mt-2">{spotifyProfile.followers.toLocaleString()}</p>
          </div>
        </div>

        {/* Spotify Tracks Table */}
        <div className="bg-[#0A0A0A] border border-white/5 p-6">
          <h3 className="headline text-lg text-white mb-4">Top Tracks</h3>
          <div className="overflow-x-auto">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase w-8">#</th>
                  <th className="text-left py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase">Track</th>
                  <th className="text-right py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase">Streams</th>
                  <th className="text-right py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase">Listeners</th>
                  <th className="text-right py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase">Playlists</th>
                </tr>
              </thead>
              <tbody>
                {spotifyTracks.map((track, i) => (
                  <tr key={track.title} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-3 px-3 text-white/20">{i + 1}</td>
                    <td className="py-3 px-3 text-white font-medium">{track.title}</td>
                    <td className="py-3 px-3 text-right text-white/60">{track.streams.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right text-white/60">{track.listeners.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 bg-[#1DB954]/10 text-[#1DB954] text-xs">
                        {track.playlists}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* YouTube Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 rounded-full bg-[#FF0000]" />
          <h2 className="headline text-xl text-white">YouTube</h2>
          <span className="font-body text-xs text-white/20 ml-2">
            {YOUTUBE_CHANNEL.handle} &middot; {YOUTUBE_CHANNEL.subscribers.toLocaleString()} subscribers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-[#0A0A0A] border border-white/5 p-5">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-white/30">Total Views</p>
            <p className="headline text-2xl text-white mt-2">{totalYouTubeViews.toLocaleString()}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 p-5">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-white/30">Subscribers</p>
            <p className="headline text-2xl text-white mt-2">{YOUTUBE_CHANNEL.subscribers.toLocaleString()}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 p-5">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-white/30">Videos</p>
            <p className="headline text-2xl text-white mt-2">{YOUTUBE_CHANNEL.totalVideos}</p>
          </div>
        </div>

        {/* YouTube Top Videos Table */}
        <div className="bg-[#0A0A0A] border border-white/5 p-6">
          <h3 className="headline text-lg text-white mb-4">Top Videos by Views</h3>
          <div className="overflow-x-auto">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase w-8">#</th>
                  <th className="text-left py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase">Video</th>
                  <th className="text-right py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase">Views</th>
                  <th className="text-right py-3 px-3 text-white/30 font-normal text-xs tracking-[0.15em] uppercase">Published</th>
                </tr>
              </thead>
              <tbody>
                {[...youtubeVideos]
                  .sort((a, b) => b.views - a.views)
                  .map((video, i) => (
                    <tr key={video.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 px-3 text-white/20">{i + 1}</td>
                      <td className="py-3 px-3 text-white font-medium">{video.title}</td>
                      <td className="py-3 px-3 text-right text-white/60">{video.views.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right text-white/30">{video.publishedAgo}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Streams Over Time */}
      <div className="bg-[#0A0A0A] border border-white/5 p-6">
        <h2 className="headline text-lg text-white mb-2">Streams Over Time</h2>
        <p className="font-body text-xs text-white/30 mb-6">Last 90 days</p>
        <StreamsLineChart data={timeline} />
      </div>

      {/* City Breakdown */}
      <div className="bg-[#0A0A0A] border border-white/5 p-6">
        <h2 className="headline text-lg text-white mb-6">Top Streaming Cities</h2>
        <CityBarChart data={streamingCities} dataKey="streams" height={400} />
      </div>

      {/* Apple Music & SoundCloud Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-[#0A0A0A] border border-white/5 p-8 text-center">
          <div className="w-3 h-3 rounded-full bg-[#FC3C44] mx-auto mb-4" />
          <h3 className="headline text-lg text-white mb-2">Apple Music</h3>
          <p className="font-body text-xs text-white/30">
            Connect Apple Music API to see streaming data.
          </p>
          <p className="font-body text-xs text-white/15 mt-2">
            Estimated: 1,840 streams
          </p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/5 p-8 text-center">
          <div className="w-3 h-3 rounded-full bg-[#FF5500] mx-auto mb-4" />
          <h3 className="headline text-lg text-white mb-2">SoundCloud</h3>
          <p className="font-body text-xs text-white/30">
            Connect SoundCloud API to see play data.
          </p>
          <p className="font-body text-xs text-white/15 mt-2">
            Estimated: 3,200 plays
          </p>
        </div>
      </div>
    </div>
  );
}
