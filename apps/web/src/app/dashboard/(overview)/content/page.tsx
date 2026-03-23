export default function ContentPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Content Calendar</h1>
        <p className="text-gray-500 mt-1">Plan and schedule content across platforms</p>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
        <div className="text-4xl mb-4">📅</div>
        <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Content calendar with scheduling, automated repurposing (YouTube → TikTok/Reels/Twitter),
          and AI-powered caption generation will be available in a future update.
        </p>
      </div>
    </div>
  );
}
