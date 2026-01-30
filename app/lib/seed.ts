import dbConnect from "./mongodb";
import Tenant from "../models/Tenant";
import Room from "../models/Room";
import Payment from "../models/Payment";

const tenantData = [
  { name: "Juan dela Cruz", gender: "Male" as const, room: "101", contact: "0917-123-4567", status: "Active" as const, moveIn: new Date("2025-06-15") },
  { name: "Maria Santos", gender: "Female" as const, room: "102", contact: "0918-234-5678", status: "Active" as const, moveIn: new Date("2025-07-01") },
  { name: "Jose Rizal", gender: "Male" as const, room: "103", contact: "0919-345-6789", status: "Overdue" as const, moveIn: new Date("2025-05-20") },
  { name: "Ana Reyes", gender: "Female" as const, room: "201", contact: "0920-456-7890", status: "Active" as const, moveIn: new Date("2025-08-10") },
  { name: "Pedro Garcia", gender: "Male" as const, room: "202", contact: "0921-567-8901", status: "Pending" as const, moveIn: new Date("2026-01-25") },
  { name: "Rosa Mendoza", gender: "Female" as const, room: "203", contact: "0922-678-9012", status: "Active" as const, moveIn: new Date("2025-09-05") },
  { name: "Carlo Aquino", gender: "Male" as const, room: "301", contact: "0923-789-0123", status: "Active" as const, moveIn: new Date("2025-10-12") },
  { name: "Lea Salonga", gender: "Female" as const, room: "302", contact: "0924-890-1234", status: "Overdue" as const, moveIn: new Date("2025-04-18") },
  { name: "Marco Tan", gender: "Male" as const, room: "303", contact: "0925-901-2345", status: "Active" as const, moveIn: new Date("2025-11-22") },
  { name: "Sofia Cruz", gender: "Female" as const, room: "104", contact: "0926-012-3456", status: "Pending" as const, moveIn: new Date("2026-01-30") },
];

// Rooms: 101-110, 201-210, 301-310 (30 total)
// 24 occupied, 6 available
const occupiedRooms = new Set(
  tenantData.map((t) => t.room)
);
// Add more occupied rooms to reach 24
const extraOccupied = [
  "105", "106", "107", "108", "109", "110",
  "204", "205", "206", "207", "208",
  "304", "305", "306",
];
extraOccupied.forEach((r) => occupiedRooms.add(r));

const monthlyRates: Record<string, number> = {};
const floors = [1, 2, 3];
const allRooms: { roomNumber: string; floor: number }[] = [];

for (const floor of floors) {
  for (let i = 1; i <= 10; i++) {
    const roomNumber = `${floor}0${i > 9 ? i : i}`.replace(
      /0(\d{2})/,
      "$1"
    );
    const num = `${floor}${String(i).padStart(2, "0")}`;
    allRooms.push({ roomNumber: num, floor });
    // Rates: floor 1 = 1800, floor 2 = 2000, floor 3 = 2200
    monthlyRates[num] = 1600 + floor * 200;
  }
}

// Extra tenants (to fill the other occupied rooms that aren't in tenantData)
const extraTenants = [
  { name: "Luis Bautista", gender: "Male" as const, room: "105", contact: "0927-111-2222", status: "Active" as const, moveIn: new Date("2025-07-15") },
  { name: "Carmen Flores", gender: "Female" as const, room: "106", contact: "0928-222-3333", status: "Active" as const, moveIn: new Date("2025-06-20") },
  { name: "Ramon Torres", gender: "Male" as const, room: "107", contact: "0929-333-4444", status: "Active" as const, moveIn: new Date("2025-08-01") },
  { name: "Elena Villanueva", gender: "Female" as const, room: "108", contact: "0930-444-5555", status: "Active" as const, moveIn: new Date("2025-05-10") },
  { name: "Miguel Navarro", gender: "Male" as const, room: "109", contact: "0931-555-6666", status: "Active" as const, moveIn: new Date("2025-09-12") },
  { name: "Isabel Ramos", gender: "Female" as const, room: "110", contact: "0932-666-7777", status: "Active" as const, moveIn: new Date("2025-07-28") },
  { name: "Andres Lim", gender: "Male" as const, room: "204", contact: "0933-777-8888", status: "Active" as const, moveIn: new Date("2025-06-05") },
  { name: "Patricia Soriano", gender: "Female" as const, room: "205", contact: "0934-888-9999", status: "Active" as const, moveIn: new Date("2025-10-01") },
  { name: "Gabriel Mercado", gender: "Male" as const, room: "206", contact: "0935-999-0000", status: "Active" as const, moveIn: new Date("2025-08-18") },
  { name: "Teresa Aguilar", gender: "Female" as const, room: "207", contact: "0936-000-1111", status: "Active" as const, moveIn: new Date("2025-11-05") },
  { name: "Ricardo Fernandez", gender: "Male" as const, room: "208", contact: "0937-111-0000", status: "Active" as const, moveIn: new Date("2025-09-25") },
  { name: "Diana Castillo", gender: "Female" as const, room: "304", contact: "0938-222-1111", status: "Active" as const, moveIn: new Date("2025-10-15") },
  { name: "Ernesto Domingo", gender: "Male" as const, room: "305", contact: "0939-333-2222", status: "Active" as const, moveIn: new Date("2025-07-08") },
  { name: "Vivian Ocampo", gender: "Female" as const, room: "306", contact: "0940-444-3333", status: "Active" as const, moveIn: new Date("2025-08-22") },
];

const allTenants = [...tenantData, ...extraTenants];

// Payment months: Aug 2025 – Jan 2026
const paymentMonths = [
  { month: "Aug", year: 2025, monthNum: 7 },
  { month: "Sep", year: 2025, monthNum: 8 },
  { month: "Oct", year: 2025, monthNum: 9 },
  { month: "Nov", year: 2025, monthNum: 10 },
  { month: "Dec", year: 2025, monthNum: 11 },
  { month: "Jan", year: 2026, monthNum: 0 },
];

export async function seed() {
  await dbConnect();

  // Clear existing data
  await Promise.all([
    Tenant.deleteMany({}),
    Room.deleteMany({}),
    Payment.deleteMany({}),
  ]);

  // Create tenants
  const createdTenants = await Tenant.insertMany(
    allTenants.map((t, i) => ({
      uid: i + 1,
      type: "Regular",
      gender: t.gender,
      name: t.name,
      signature: "",
      dateApplied: t.moveIn,
      contractYears: 1,
      room: t.room,
      status: t.status,
      contact: t.contact,
      moveIn: t.moveIn,
    }))
  );

  // Build tenant lookup by room
  const tenantByRoom: Record<string, (typeof createdTenants)[0]> = {};
  for (const t of createdTenants) {
    tenantByRoom[t.room] = t;
  }

  // Create rooms
  await Room.insertMany(
    allRooms.map((r) => ({
      roomNumber: r.roomNumber,
      floor: r.floor,
      status: occupiedRooms.has(r.roomNumber) ? "Occupied" : "Available",
      tenant: tenantByRoom[r.roomNumber]?._id ?? null,
      monthlyRate: monthlyRates[r.roomNumber],
    }))
  );

  // Create payments – each occupied room pays each month
  const payments: {
    tenant: typeof createdTenants[0]["_id"];
    room: string;
    amount: number;
    month: string;
    year: number;
    paidAt: Date;
  }[] = [];

  for (const pm of paymentMonths) {
    for (const tenant of createdTenants) {
      // Skip pending tenants for months before their move-in
      if (tenant.status === "Pending" && pm.year === 2025) continue;
      // Overdue tenants skip Jan 2026
      if (
        tenant.status === "Overdue" &&
        pm.month === "Jan" &&
        pm.year === 2026
      )
        continue;

      const rate = monthlyRates[tenant.room] ?? 1800;
      payments.push({
        tenant: tenant._id,
        room: tenant.room,
        amount: rate,
        month: pm.month,
        year: pm.year,
        paidAt: new Date(pm.year, pm.monthNum, Math.floor(Math.random() * 5) + 1),
      });
    }
  }

  await Payment.insertMany(payments);

  return {
    tenants: createdTenants.length,
    rooms: allRooms.length,
    payments: payments.length,
  };
}
