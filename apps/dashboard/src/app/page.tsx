export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
          <p className="text-sm text-gray-400 mb-1">Total Streams</p>
          <p className="text-2xl font-bold">—</p>
        </div>
        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
          <p className="text-sm text-gray-400 mb-1">Fan Subscribers</p>
          <p className="text-2xl font-bold">—</p>
        </div>
        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
          <p className="text-sm text-gray-400 mb-1">Top City</p>
          <p className="text-2xl font-bold">—</p>
        </div>
        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
          <p className="text-sm text-gray-400 mb-1">Engagement Rate</p>
          <p className="text-2xl font-bold">—</p>
        </div>
      </div>
      <div className="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-800">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-500">
          Connect data sources to see activity here.
        </p>
      </div>
    </div>
  );
}
