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

const formatPeso = (value: number) => `₱${(value / 1000).toFixed(0)}k`;

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const avgRevenue = data.length > 0 ? Math.round(totalRevenue / data.length) : 0;
  return (
    <div className="animate-fade-in stagger-4 group rounded-2xl border border-[var(--card-border)] bg-white p-6 transition-shadow duration-300 hover:shadow-lg hover:shadow-slate-200/50">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">Monthly Revenue</h3>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            Last 6 months in Philippine Peso
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--muted)]">Avg / month</p>
          <p className="text-sm font-bold text-slate-800">
            ₱{avgRevenue.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="mt-4 h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={36}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={formatPeso}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(59,130,246,0.06)", radius: 8 }}
              formatter={(value) => [
                `₱${Number(value).toLocaleString()}`,
                "Revenue",
              ]}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                fontSize: "13px",
                padding: "8px 14px",
              }}
            />
            <Bar
              dataKey="revenue"
              fill="url(#barGradient)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
