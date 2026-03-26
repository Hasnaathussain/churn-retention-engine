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

const axisStyle = {
  fontSize: 11,
  stroke: "var(--text-soft)",
};

const tooltipStyle = {
  background: "var(--tooltip-bg)",
  border: "1px solid var(--tooltip-border)",
  borderRadius: "16px",
  color: "var(--text-primary)",
  boxShadow: "var(--shadow-soft)",
};

export function RevenueTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="h-[280px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 8, top: 6, bottom: 0 }}>
          <defs>
            <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-primary)" stopOpacity={0.32} />
              <stop offset="95%" stopColor="var(--chart-primary)" stopOpacity={0.04} />
            </linearGradient>
            <linearGradient id="pressureGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-secondary)" stopOpacity={0.28} />
              <stop offset="95%" stopColor="var(--chart-secondary)" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--grid-line)" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} {...axisStyle} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`}
            {...axisStyle}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Area
            type="monotone"
            dataKey="mrr"
            stroke="var(--chart-primary)"
            strokeWidth={2.2}
            fill="url(#mrrGradient)"
          />
          <Area
            type="monotone"
            dataKey="churnPressure"
            stroke="var(--chart-secondary)"
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
            innerRadius={58}
            outerRadius={90}
            paddingAngle={4}
          >
            {data.map((segment) => (
              <Cell key={segment.label} fill={segment.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AccountTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="h-[220px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 8, top: 6, bottom: 0 }}>
          <defs>
            <linearGradient id="accountTrendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-primary)" stopOpacity={0.24} />
              <stop offset="95%" stopColor="var(--chart-primary)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--grid-line)" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} {...axisStyle} />
          <YAxis tickLine={false} axisLine={false} {...axisStyle} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area
            type="monotone"
            dataKey="churnPressure"
            stroke="var(--chart-primary)"
            strokeWidth={2.2}
            fill="url(#accountTrendGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
