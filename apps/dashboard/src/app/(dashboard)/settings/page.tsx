"use client";

import { useState } from "react";

const dataSources = [
  { name: "Spotify", color: "#1DB954", envKey: "SPOTIFY_CLIENT_ID", hasApi: true },
  { name: "YouTube", color: "#FF0000", envKey: "YOUTUBE_API_KEY", hasApi: true },
  { name: "Instagram", color: "#E1306C", envKey: "INSTAGRAM_ACCESS_TOKEN", hasApi: true },
  { name: "Apple Music", color: "#FC3C44", envKey: "APPLE_MUSIC_TOKEN", hasApi: true },
  { name: "SoundCloud", color: "#FF5500", envKey: "SOUNDCLOUD_CLIENT_ID", hasApi: true },
  { name: "TikTok", color: "#FFFFFF", envKey: "", hasApi: false },
];

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* API Connections */}
      <div className="bg-[#0A0A0A] border border-white/5 p-6 space-y-4">
        <h2 className="headline text-lg text-white">API Connections</h2>
        <p className="font-body text-xs text-white/30">
          Status of external data source connections. Set API keys as environment variables.
        </p>
        {dataSources.map((source) => (
          <div key={source.name} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: source.color, opacity: 0.6 }} />
              <div>
                <p className="font-body text-sm text-white">{source.name}</p>
                {source.envKey && (
                  <p className="font-body text-[10px] text-white/20 mt-0.5">{source.envKey}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {source.hasApi ? (
                <span className="font-body text-xs px-2 py-0.5 bg-white/5 text-white/30">
                  API route ready
                </span>
              ) : (
                <span className="font-body text-xs text-white/15">
                  Not available
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Site Configuration */}
      <div className="bg-[#0A0A0A] border border-white/5 p-6 space-y-4">
        <h2 className="headline text-lg text-white">Site Configuration</h2>
        <div className="space-y-3">
          <div>
            <label className="block font-body text-xs tracking-[0.15em] uppercase text-white/30 mb-2">
              Artist Name
            </label>
            <input
              type="text"
              defaultValue="Que"
              className="w-full px-4 py-3 bg-transparent border border-white/10 text-white font-body text-sm focus:outline-none focus:border-brand-400 transition-colors"
            />
          </div>
          <div>
            <label className="block font-body text-xs tracking-[0.15em] uppercase text-white/30 mb-2">
              Label
            </label>
            <input
              type="text"
              defaultValue="Mosart Records"
              className="w-full px-4 py-3 bg-transparent border border-white/10 text-white font-body text-sm focus:outline-none focus:border-brand-400 transition-colors"
            />
          </div>
          <div>
            <label className="block font-body text-xs tracking-[0.15em] uppercase text-white/30 mb-2">
              Distributor
            </label>
            <input
              type="text"
              defaultValue="UnitedMasters"
              className="w-full px-4 py-3 bg-transparent border border-white/10 text-white font-body text-sm focus:outline-none focus:border-brand-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Dashboard Preferences */}
      <div className="bg-[#0A0A0A] border border-white/5 p-6 space-y-4">
        <h2 className="headline text-lg text-white">Preferences</h2>
        {[
          { label: "Weekly performance digest", defaultOn: true },
          { label: "Fan milestone alerts (every 100 fans)", defaultOn: true },
          { label: "Viral content detection", defaultOn: false },
          { label: "Auto-sync data every 6 hours", defaultOn: true },
        ].map((item) => (
          <label key={item.label} className="flex items-center justify-between py-2 cursor-pointer group">
            <span className="font-body text-sm text-white/50 group-hover:text-white/70 transition-colors">
              {item.label}
            </span>
            <div className="relative">
              <input
                type="checkbox"
                defaultChecked={item.defaultOn}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-white/10 peer-checked:bg-brand-400/30 rounded-full transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white/30 peer-checked:bg-brand-400 peer-checked:translate-x-4 rounded-full transition-all" />
            </div>
          </label>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-brand-400 text-black font-body text-sm tracking-[0.2em] uppercase font-semibold hover:bg-white transition-colors"
        >
          Save Settings
        </button>
        {saved && (
          <span className="font-body text-sm text-green-400">Settings saved</span>
        )}
      </div>
    </div>
  );
}
