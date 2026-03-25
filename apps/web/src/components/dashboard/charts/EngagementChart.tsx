"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  date: string;
  engagement: number;
  followers?: number;
}

export default function EngagementChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="date"
          stroke="rgba(255,255,255,0.2)"
          fontSize={11}
          fontFamily="Space Grotesk"
          tickFormatter={(v) => {
            const d = new Date(v);
            return `${d.getMonth() + 1}/${d.getDate()}`;
          }}
          interval={13}
        />
        <YAxis
          stroke="rgba(255,255,255,0.2)"
          fontSize={11}
          fontFamily="Space Grotesk"
          domain={[0, "auto"]}
          tickFormatter={(v) => `${v}%`}
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
          formatter={(value) => [`${value}%`, "Engagement Rate"]}
        />
        <Area
          type="monotone"
          dataKey="engagement"
          stroke="#FFE600"
          fill="#FFE600"
          fillOpacity={0.1}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
