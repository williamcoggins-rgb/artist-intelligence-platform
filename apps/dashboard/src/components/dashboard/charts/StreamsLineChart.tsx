"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  date: string;
  streams: number;
  views?: number;
  listeners?: number;
}

export default function StreamsLineChart({ data }: { data: DataPoint[] }) {
  const hasViews = data.some((d) => d.views !== undefined);
  const hasListeners = data.some((d) => d.listeners !== undefined);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
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
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
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
        <Line type="monotone" dataKey="streams" stroke="#FFE600" strokeWidth={2} dot={false} name="Streams" />
        {hasViews && (
          <Line type="monotone" dataKey="views" stroke="#FF0000" strokeWidth={1.5} dot={false} name="Views" />
        )}
        {hasListeners && (
          <Line type="monotone" dataKey="listeners" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} dot={false} name="Listeners" />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
