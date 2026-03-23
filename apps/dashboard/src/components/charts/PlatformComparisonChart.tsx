"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PlatformData {
  platform: string;
  streams: number;
  listeners: number;
}

export default function PlatformComparisonChart({ data }: { data: PlatformData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="platform" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 8 }}
          labelStyle={{ color: "#9ca3af" }}
          formatter={(value) => [Number(value).toLocaleString(), ""]}
        />
        <Legend wrapperStyle={{ color: "#9ca3af" }} />
        <Bar dataKey="streams" fill="#1db954" radius={[4, 4, 0, 0]} name="Streams" />
        <Bar dataKey="listeners" fill="#ff0000" radius={[4, 4, 0, 0]} name="Listeners" />
      </BarChart>
    </ResponsiveContainer>
  );
}
