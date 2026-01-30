import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Tenant from "@/app/models/Tenant";
import Room from "@/app/models/Room";

// GET all tenants
export async function GET() {
  try {
    await dbConnect();
    const tenants = await Tenant.find().sort({ uid: 1 }).lean();
    return NextResponse.json(tenants);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch tenants";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST create a new tenant
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    // Auto-generate uid
    const last = await Tenant.findOne().sort({ uid: -1 }).select("uid").lean();
    const uid = last && typeof last.uid === "number" ? last.uid + 1 : 1;

    const tenant = await Tenant.create({ ...body, uid });

    // Mark room as occupied
    if (body.room) {
      await Room.findOneAndUpdate(
        { roomNumber: body.room },
        { status: "Occupied", tenant: tenant._id }
      );
    }

    return NextResponse.json(tenant, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create tenant";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
