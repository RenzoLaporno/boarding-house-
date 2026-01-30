import {
  Users,
  DoorOpen,
  TrendingUp,
  Banknote,
  ArrowRight,
} from "lucide-react";
import StatsCard from "./components/StatsCard";
import OccupancyChart from "./components/OccupancyChart";
import RevenueChart from "./components/RevenueChart";
import TenantsTable from "./components/TenantsTable";
import AddTenantModal from "./components/AddTenantModal";
import dbConnect from "./lib/mongodb";
import Tenant from "./models/Tenant";
import Room from "./models/Room";
import Payment from "./models/Payment";
import { IRoom } from "./models/Room";

export const dynamic = "force-dynamic";

export default async function Home() {
  await dbConnect();

  const [totalTenants, totalRooms, availableRooms, revenueAgg, tenantDocs, revenueByMonth, availableRoomDocs] =
    await Promise.all([
      Tenant.countDocuments(),
      Room.countDocuments(),
      Room.countDocuments({ status: "Available" }),
      Payment.aggregate([
        { $match: { month: "Jan", year: 2026 } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Tenant.find().sort({ uid: 1 }).limit(10).lean(),
      Payment.aggregate([
        {
          $group: {
            _id: { month: "$month", year: "$year" },
            revenue: { $sum: "$amount" },
          },
        },
      ]),
      Room.find({ status: "Available" }).select("roomNumber").sort({ roomNumber: 1 }).lean<IRoom[]>(),
    ]);

  const availableRoomNumbers = availableRoomDocs.map((r) => r.roomNumber);

  const monthlyRevenue = revenueAgg[0]?.total ?? 0;
  const occupied = totalRooms - availableRooms;
  const occupancyRate =
    totalRooms > 0 ? Math.round((occupied / totalRooms) * 100) : 0;

  // Build revenue chart data in chronological order
  const monthOrder = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
  const revenueData = monthOrder
    .map((m) => {
      const entry = revenueByMonth.find(
        (r: { _id: { month: string }; revenue: number }) => r._id.month === m
      );
      return { month: m, revenue: entry?.revenue ?? 0 };
    })
    .filter((d) => d.revenue > 0);

  // Map tenant documents to table rows
  const tenantRows = tenantDocs.map((t) => ({
    name: t.name,
    room: t.room,
    status: t.status,
    contact: t.contact,
    moveIn: t.moveIn ? new Date(t.moveIn).toISOString() : "",
  }));

  const stats = [
    {
      label: "Total Tenants",
      value: String(totalTenants),
      change: 8,
      icon: Users,
      iconBg: "#eff6ff",
      iconColor: "#3b82f6",
      gradient: "linear-gradient(135deg, #3b82f6, #6366f1)",
    },
    {
      label: "Available Rooms",
      value: String(availableRooms),
      change: -14,
      icon: DoorOpen,
      iconBg: "#f0fdf4",
      iconColor: "#22c55e",
      gradient: "linear-gradient(135deg, #22c55e, #14b8a6)",
    },
    {
      label: "Occupancy Rate",
      value: `${occupancyRate}%`,
      change: 5,
      icon: TrendingUp,
      iconBg: "#fefce8",
      iconColor: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b, #f97316)",
    },
    {
      label: "Monthly Revenue",
      value: `₱${monthlyRevenue.toLocaleString()}`,
      change: 12,
      icon: Banknote,
      iconBg: "#faf5ff",
      iconColor: "#a855f7",
      gradient: "linear-gradient(135deg, #a855f7, #ec4899)",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="animate-fade-in relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-blue-600/20">
        {/* Decorative shapes */}
        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 right-20 h-24 w-24 rounded-full bg-white/10 blur-xl" />

        <div className="relative">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">
              Welcome to Transcent Dashboard
            </h2>
            <p className="mt-1 text-sm text-blue-100">
              Manage your boarding house tenants, rooms, and payments all in one
              place.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <AddTenantModal availableRooms={availableRoomNumbers} />
              <button className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20">
                View Reports
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className={`animate-fade-in stagger-${i + 1}`}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <OccupancyChart occupied={occupied} available={availableRooms} />
        <RevenueChart data={revenueData} />
      </div>

      {/* Tenants Table */}
      <TenantsTable tenants={tenantRows} />
    </div>
  );
}
