interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

export default function MetricCard({ label, value, change, changeType = "neutral" }: MetricCardProps) {
  const changeColor =
    changeType === "positive"
      ? "text-green-400"
      : changeType === "negative"
      ? "text-red-400"
      : "text-gray-400";

  return (
    <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {change && (
        <p className={`text-xs mt-2 ${changeColor}`}>{change}</p>
      )}
    </div>
  );
}
