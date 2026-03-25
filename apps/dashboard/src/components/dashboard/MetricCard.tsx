interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
}

export default function MetricCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon,
}: MetricCardProps) {
  const changeColor =
    changeType === "positive"
      ? "text-green-400"
      : changeType === "negative"
      ? "text-red-400"
      : "text-white/40";

  return (
    <div className="p-6 bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-start justify-between">
        <p className="font-body text-xs tracking-[0.2em] uppercase text-white/40">
          {label}
        </p>
        {icon && <span className="text-brand-400/60">{icon}</span>}
      </div>
      <p className="headline text-3xl text-white mt-3">{value}</p>
      {change && (
        <p className={`font-body text-xs mt-2 ${changeColor}`}>{change}</p>
      )}
    </div>
  );
}
