"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TrendPoint = {
  month: string;
  mrr: number;
  churnPressure: number;
};

type RiskPoint = {
  label: string;
  value: number;
  color: string;
};

export function RevenueTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="h-[260px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
          <defs>
            <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5b8fe8" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#5b8fe8" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="pressureGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f28b82" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f28b82" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="month" stroke="#8f9ab7" tickLine={false} axisLine={false} fontSize={11} />
          <YAxis
            stroke="#8f9ab7"
            tickLine={false}
            axisLine={false}
            fontSize={11}
            tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`}
          />
          <Tooltip
            contentStyle={{
              background: "#0a1120",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              color: "#f5f2ea",
            }}
          />
          <Area type="monotone" dataKey="mrr" stroke="#5b8fe8" strokeWidth={2} fill="url(#mrrGradient)" />
          <Area
            type="monotone"
            dataKey="churnPressure"
            stroke="#f28b82"
            strokeWidth={2}
            fill="url(#pressureGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RiskDistributionChart({ data }: { data: RiskPoint[] }) {
  return (
    <div className="h-[240px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={56}
            outerRadius={88}
            paddingAngle={4}
          >
            {data.map((segment) => (
              <Cell key={segment.label} fill={segment.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#0a1120",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              color: "#f5f2ea",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
