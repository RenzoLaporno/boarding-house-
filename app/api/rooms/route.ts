import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Room from "@/app/models/Room";

export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();

  const [occupied, available] = await Promise.all([
    Room.countDocuments({ status: "Occupied" }),
    Room.countDocuments({ status: "Available" }),
  ]);

  return NextResponse.json({ occupied, available });
}
