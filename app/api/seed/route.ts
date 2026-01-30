import { NextResponse } from "next/server";
import { seed } from "@/app/lib/seed";

export async function POST() {
  try {
    const result = await seed();
    return NextResponse.json({ ok: true, ...result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Seed failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
