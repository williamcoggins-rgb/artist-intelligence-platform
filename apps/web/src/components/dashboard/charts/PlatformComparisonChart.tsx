"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface PlatformData {
  platform: string;
  value: number;
  metric: string;
  color: string;
}

export default function PlatformComparisonChart({ data }: { data: PlatformData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="platform"
          stroke="rgba(255,255,255,0.2)"
          fontSize={11}
          fontFamily="Space Grotesk"
        />
        <YAxis
          stroke="rgba(255,255,255,0.2)"
          fontSize={11}
          fontFamily="Space Grotesk"
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0A0A0A",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 0,
            fontFamily: "Space Grotesk",
            fontSize: 12,
          }}
          labelStyle={{ color: "rgba(255,255,255,0.4)" }}
          formatter={(value) => [Number(value).toLocaleString(), ""]}
        />
        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
