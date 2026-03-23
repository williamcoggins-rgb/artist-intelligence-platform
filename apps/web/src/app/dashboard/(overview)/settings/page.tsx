"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-1">Configure your dashboard and data connections</p>
      </div>

      {/* Data Sources */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Data Sources</h2>
        {[
          { name: "Spotify", status: "Not connected", color: "text-gray-500" },
          { name: "YouTube", status: "Not connected", color: "text-gray-500" },
          { name: "Instagram", status: "Not connected", color: "text-gray-500" },
          { name: "Apple Music", status: "Not connected", color: "text-gray-500" },
          { name: "SoundCloud", status: "Not connected", color: "text-gray-500" },
          { name: "TikTok", status: "Not connected", color: "text-gray-500" },
        ].map((source) => (
          <div key={source.name} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
            <div>
              <p className="text-white font-medium">{source.name}</p>
              <p className={`text-xs ${source.color}`}>{source.status}</p>
            </div>
            <button className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg border border-gray-700 transition-colors">
              Connect
            </button>
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        {[
          { label: "Weekly performance digest", defaultOn: true },
          { label: "Fan milestone alerts (every 100 fans)", defaultOn: true },
          { label: "Viral content detection", defaultOn: false },
        ].map((item) => (
          <label key={item.label} className="flex items-center justify-between py-2">
            <span className="text-gray-300 text-sm">{item.label}</span>
            <input
              type="checkbox"
              defaultChecked={item.defaultOn}
              className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
            />
          </label>
        ))}
      </div>

      {/* Password */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Security</h2>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Dashboard Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-600 mt-2">
            Set via DASHBOARD_PASSWORD environment variable. Default: artist2026
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
        >
          Save Settings
        </button>
        {saved && <span className="text-green-400 text-sm">Settings saved!</span>}
      </div>
    </div>
  );
}
