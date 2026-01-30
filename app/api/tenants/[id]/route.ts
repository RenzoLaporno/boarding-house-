import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Tenant from "@/app/models/Tenant";
import Room from "@/app/models/Room";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const tenant = await Tenant.findByIdAndDelete(id).lean();

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Free up the room
    if (tenant.room) {
      await Room.findOneAndUpdate(
        { roomNumber: tenant.room },
        { status: "Available", tenant: null }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete tenant";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
