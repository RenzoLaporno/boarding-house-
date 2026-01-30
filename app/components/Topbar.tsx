"use client";

import { Bell, Search, CalendarDays, Menu } from "lucide-react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--card-border)] bg-white/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: hamburger + greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-[15px] font-semibold text-slate-800">
            {getGreeting()}, Admin
          </h1>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <CalendarDays className="h-3 w-3" />
            {getFormattedDate()}
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tenants, rooms..."
            className="h-9 w-72 rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-4 text-sm text-slate-600 outline-none transition-all placeholder:text-slate-400 focus:w-80 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Notification bell */}
        <button className="relative rounded-xl p-2.5 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2.5 rounded-xl p-1.5 transition-all hover:bg-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white ring-2 ring-white">
            A
          </div>
        </button>
      </div>
    </header>
  );
}
