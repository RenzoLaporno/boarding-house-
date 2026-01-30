import { MoreHorizontal } from "lucide-react";

export interface TenantRow {
  name: string;
  room: string;
  status: string;
  contact: string;
  moveIn: string;
}

interface TenantsTableProps {
  tenants: TenantRow[];
}

const statusConfig: Record<string, { dot: string; bg: string; text: string }> = {
  Active: { dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  Pending: { dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
  Overdue: { dot: "bg-red-500", bg: "bg-red-50", text: "text-red-600" },
};

const avatarColors = [
  "from-blue-500 to-indigo-500",
  "from-pink-500 to-rose-500",
  "from-emerald-500 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-violet-500 to-purple-500",
  "from-cyan-400 to-blue-500",
  "from-rose-400 to-pink-500",
  "from-teal-400 to-emerald-500",
  "from-indigo-400 to-violet-500",
  "from-orange-400 to-amber-500",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function TenantsTable({ tenants }: TenantsTableProps) {
  return (
    <div className="animate-fade-in stagger-5 rounded-2xl border border-[var(--card-border)] bg-white transition-shadow duration-300 hover:shadow-lg hover:shadow-slate-200/50">
      <div className="flex items-center justify-between border-b border-[var(--card-border)] px-6 py-5">
        <div>
          <h3 className="font-semibold text-slate-800">Recent Tenants</h3>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            Overview of all boarding house tenants
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {tenants.length} tenants
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--card-border)] text-left">
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tenant
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Room
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Contact
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Move-in Date
              </th>
              <th className="px-6 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant, i) => {
              const status = statusConfig[tenant.status] ?? statusConfig.Active;
              return (
                <tr
                  key={`${tenant.room}-${i}`}
                  className="group border-b border-[var(--card-border)] last:border-0 transition-colors hover:bg-slate-50/80"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarColors[i]} text-xs font-bold text-white shadow-sm`}
                      >
                        {getInitials(tenant.name)}
                      </div>
                      <span className="font-medium text-slate-800">
                        {tenant.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      Room {tenant.room}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.bg} ${status.text}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                      />
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-mono text-xs text-slate-500">
                    {tenant.contact}
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">
                    {new Date(tenant.moveIn).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-3.5">
                    <button className="rounded-lg p-1.5 text-slate-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-500">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
