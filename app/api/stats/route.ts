import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Tenant from "@/app/models/Tenant";
import Room from "@/app/models/Room";
import Payment from "@/app/models/Payment";

export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();

  const [totalTenants, totalRooms, availableRooms, revenueAgg] =
    await Promise.all([
      Tenant.countDocuments(),
      Room.countDocuments(),
      Room.countDocuments({ status: "Available" }),
      Payment.aggregate([
        { $match: { month: "Jan", year: 2026 } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

  const monthlyRevenue = revenueAgg[0]?.total ?? 0;
  const occupancyRate =
    totalRooms > 0 ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100) : 0;

  return NextResponse.json({
    totalTenants,
    availableRooms,
    totalRooms,
    occupancyRate,
    monthlyRevenue,
  });
}
