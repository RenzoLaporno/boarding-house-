import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string;
  change: number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  gradient: string;
}

export default function StatsCard({
  label,
  value,
  change,
  icon: Icon,
  iconBg,
  iconColor,
  gradient,
}: StatsCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50">
      {/* Gradient accent strip */}
      <div
        className="absolute inset-x-0 top-0 h-1 transition-all duration-300 group-hover:h-1.5"
        style={{ background: gradient }}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-800">
            {value}
          </p>
        </div>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="h-6 w-6" style={{ color: iconColor }} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
            isPositive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {isPositive ? "+" : ""}
          {change}%
        </div>
        <span className="text-xs text-[var(--muted)]">vs last month</span>
      </div>
    </div>
  );
}
