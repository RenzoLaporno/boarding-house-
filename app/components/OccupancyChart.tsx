"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#3b82f6", "#e2e8f0"];

interface OccupancyChartProps {
  occupied: number;
  available: number;
}

export default function OccupancyChart({ occupied, available }: OccupancyChartProps) {
  const data = [
    { name: "Occupied", value: occupied },
    { name: "Available", value: available },
  ];
  const total = occupied + available;
  const occupancyPct = Math.round((data[0].value / total) * 100);

  return (
    <div className="animate-fade-in stagger-3 group rounded-2xl border border-[var(--card-border)] bg-white p-6 transition-shadow duration-300 hover:shadow-lg hover:shadow-slate-200/50">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">Room Occupancy</h3>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            Current room status overview
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          {total} Total Rooms
        </span>
      </div>

      <div className="mt-4 h-[220px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                fontSize: "13px",
                padding: "8px 14px",
              }}
              formatter={(value, name) => [
                `${Number(value)} rooms`,
                String(name),
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-extrabold text-slate-800">
            {occupancyPct}%
          </span>
          <span className="text-xs text-[var(--muted)]">Occupied</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 flex justify-center gap-6">
        {data.map((entry, i) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: COLORS[i] }}
            />
            <span className="text-sm text-slate-600">
              {entry.name}{" "}
              <span className="font-semibold text-slate-800">
                {entry.value}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
