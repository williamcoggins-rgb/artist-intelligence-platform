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
  listeners: number;
}

export default function StreamsLineChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="date"
          stroke="#6b7280"
          fontSize={12}
          tickFormatter={(v) => {
            const d = new Date(v);
            return `${d.getMonth() + 1}/${d.getDate()}`;
          }}
          interval={13}
        />
        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
        <Tooltip
          contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 8 }}
          labelStyle={{ color: "#9ca3af" }}
          formatter={(value) => [Number(value).toLocaleString(), ""]}
        />
        <Line type="monotone" dataKey="streams" stroke="#3b82f6" strokeWidth={2} dot={false} name="Streams" />
        <Line type="monotone" dataKey="listeners" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Listeners" />
      </LineChart>
    </ResponsiveContainer>
  );
}
