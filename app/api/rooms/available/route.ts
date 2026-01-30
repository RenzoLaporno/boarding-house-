import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Room from "@/app/models/Room";

export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();
  const rooms = await Room.find({ status: "Available" })
    .select("roomNumber")
    .sort({ roomNumber: 1 })
    .lean();
  return NextResponse.json(rooms.map((r) => r.roomNumber));
}
