import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Payment from "@/app/models/Payment";

export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();

  const pipeline = [
    {
      $group: {
        _id: { month: "$month", year: "$year" },
        revenue: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1 as const, "_id.month": 1 as const } },
  ];

  const raw = await Payment.aggregate(pipeline);

  // Sort by chronological order
  const monthOrder = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
  const data = monthOrder
    .map((m) => {
      const entry = raw.find((r) => r._id.month === m);
      return { month: m, revenue: entry?.revenue ?? 0 };
    })
    .filter((d) => d.revenue > 0);

  return NextResponse.json(data);
}
