"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  Plus,
  X,
  Users,
  Trash2,
  Filter,
} from "lucide-react";

interface Tenant {
  _id: string;
  uid: number;
  name: string;
  gender: string;
  room: string;
  status: string;
  contact: string;
  moveIn: string;
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

function getFloor(room: string) {
  return room ? room.charAt(0) : "";
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [floorFilter, setFloorFilter] = useState("All");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Tenant | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    gender: "Male" as "Male" | "Female",
    room: "",
    contact: "",
    status: "Active" as "Active" | "Pending" | "Overdue",
    moveIn: new Date().toISOString().split("T")[0],
    type: "Regular",
    contractYears: 1,
  });

  const fetchData = useCallback(async () => {
    try {
      const [tenantsRes, roomsRes] = await Promise.all([
        fetch("/api/tenants"),
        fetch("/api/rooms/available"),
      ]);
      const tenantsData = await tenantsRes.json();
      if (Array.isArray(tenantsData)) setTenants(tenantsData);

      const roomsData = await roomsRes.json();
      if (Array.isArray(roomsData)) setAvailableRooms(roomsData);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Apply filters
  const filtered = tenants.filter((t) => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.room.includes(search)) {
      return false;
    }
    if (statusFilter !== "All" && t.status !== statusFilter) return false;
    if (floorFilter !== "All" && getFloor(t.room) !== floorFilter) return false;
    return true;
  });

  // Counts for filter badges
  const statusCounts = {
    All: tenants.length,
    Active: tenants.filter((t) => t.status === "Active").length,
    Pending: tenants.filter((t) => t.status === "Pending").length,
    Overdue: tenants.filter((t) => t.status === "Overdue").length,
  };

  async function handleAddTenant(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          moveIn: new Date(form.moveIn),
          dateApplied: new Date(),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to add tenant");
        return;
      }
      setModalOpen(false);
      setForm({
        name: "",
        gender: "Male",
        room: "",
        contact: "",
        status: "Active",
        moveIn: new Date().toISOString().split("T")[0],
        type: "Regular",
        contractYears: 1,
      });
      fetchData();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/tenants/${deleteTarget._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to delete tenant");
        return;
      }
      setDeleteTarget(null);
      fetchData();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tenants</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage all boarding house tenants
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          Add Tenant
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-[var(--card-border)] bg-white p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Floor filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Floors</option>
              <option value="1">Floor 1</option>
              <option value="2">Floor 2</option>
              <option value="3">Floor 3</option>
            </select>
          </div>
        </div>

        {/* Status filter pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {(["All", "Active", "Pending", "Overdue"] as const).map((s) => {
            const active = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? s === "All"
                      ? "bg-slate-800 text-white"
                      : s === "Active"
                        ? "bg-emerald-500 text-white"
                        : s === "Pending"
                          ? "bg-amber-500 text-white"
                          : "bg-red-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s}
                <span className="ml-1.5 opacity-80">
                  {statusCounts[s]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--card-border)] bg-white transition-shadow duration-300 hover:shadow-lg hover:shadow-slate-200/50">
        <div className="flex items-center justify-between border-b border-[var(--card-border)] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">All Tenants</h3>
              <p className="text-xs text-slate-500">
                {filtered.length} of {tenants.length} tenants
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Users className="h-12 w-12 mb-3 opacity-40" />
            <p className="text-sm font-medium">No tenants found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
          </div>
        ) : (
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
                {filtered.map((tenant, i) => {
                  const status =
                    statusConfig[tenant.status] ?? statusConfig.Active;
                  return (
                    <tr
                      key={tenant._id}
                      className="group border-b border-[var(--card-border)] last:border-0 transition-colors hover:bg-slate-50/80"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} text-xs font-bold text-white shadow-sm`}
                          >
                            {getInitials(tenant.name)}
                          </div>
                          <div>
                            <span className="font-medium text-slate-800">
                              {tenant.name}
                            </span>
                            <p className="text-xs text-slate-400">
                              {tenant.gender}
                            </p>
                          </div>
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
                        {tenant.moveIn
                          ? new Date(tenant.moveIn).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric", year: "numeric" }
                            )
                          : "—"}
                      </td>
                      <td className="px-6 py-3.5">
                        <button
                          onClick={() => setDeleteTarget(tenant)}
                          className="rounded-lg p-1.5 text-slate-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Tenant Modal */}
      {modalOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800">
                  Add New Tenant
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddTenant} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="e.g. Juan dela Cruz"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={form.gender}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          gender: e.target.value as "Male" | "Female",
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Room
                    </label>
                    <select
                      required
                      value={form.room}
                      onChange={(e) =>
                        setForm({ ...form, room: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Select room</option>
                      {availableRooms.map((r) => (
                        <option key={r} value={r}>
                          Room {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Contact
                    </label>
                    <input
                      required
                      type="text"
                      value={form.contact}
                      onChange={(e) =>
                        setForm({ ...form, contact: e.target.value })
                      }
                      placeholder="0917-123-4567"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status: e.target.value as
                            | "Active"
                            | "Pending"
                            | "Overdue",
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Move-in Date
                  </label>
                  <input
                    required
                    type="date"
                    value={form.moveIn}
                    onChange={(e) =>
                      setForm({ ...form, moveIn: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {submitting ? "Adding..." : "Add Tenant"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Delete Confirmation Modal */}
      {deleteTarget &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDeleteTarget(null)}
            />
            <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl mx-4">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 mb-4">
                  <Trash2 className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  Delete Tenant
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Are you sure you want to remove{" "}
                  <span className="font-semibold text-slate-700">
                    {deleteTarget.name}
                  </span>{" "}
                  from Room {deleteTarget.room}? This action cannot be undone.
                </p>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
