"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Array<{ city: string } & Record<string, any>>;
  dataKey: string;
  color?: string;
  height?: number;
}

export default function CityBarChart({ data, dataKey, color = "#FFE600", height = 300 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
        <XAxis
          type="number"
          stroke="rgba(255,255,255,0.2)"
          fontSize={11}
          fontFamily="Space Grotesk"
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
        />
        <YAxis
          type="category"
          dataKey="city"
          stroke="rgba(255,255,255,0.2)"
          fontSize={11}
          fontFamily="Space Grotesk"
          width={100}
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
          formatter={(value) => [Number(value).toLocaleString(), dataKey]}
        />
        <Bar dataKey={dataKey} fill={color} radius={[0, 2, 2, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
