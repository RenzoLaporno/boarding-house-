"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  DoorOpen,
  CreditCard,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Tenants", href: "/tenants", icon: Users },
  { label: "Rooms", href: "/rooms", icon: DoorOpen },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-stretch border-t border-slate-200 bg-white/95 backdrop-blur-md lg:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
              isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div
              className={`rounded-xl p-1.5 transition-colors ${
                isActive ? "bg-blue-50" : ""
              }`}
            >
              <item.icon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-medium leading-none">
              {item.label}
            </span>
            {isActive && (
              <span className="absolute bottom-1 h-1 w-1 rounded-full bg-blue-600" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
