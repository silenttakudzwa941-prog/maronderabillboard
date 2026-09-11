"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: "📊",
  },
  {
    name: "Advertisers",
    href: "/admin/advertisers",
    icon: "👥",
  },
  {
    name: "Advertisements",
    href: "/admin/advertisements",
    icon: "📢",
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: "🧾",
  },
  {
  name: "Payments",
  href: "/admin/payments",
  icon: "💳",
},
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-slate-200 bg-blue-950 text-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-b border-blue-900 px-6 py-6">
          <Link
            href="/admin/dashboard"
            className="block"
          >
            <p className="text-xl font-black">
              MaronderaBillboard
            </p>

            <p className="mt-1 text-xs font-medium text-blue-200">
              Admin Panel
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-blue-300">
            Management
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(
                  `${item.href}/`
                );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? "bg-white text-blue-950"
                      : "text-blue-100 hover:bg-blue-900 hover:text-white"
                  }`}
                >
                  <span className="text-lg">
                    {item.icon}
                  </span>

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-blue-900 px-6 py-5">
          <Link
            href="/"
            className="text-sm font-semibold text-blue-200 transition hover:text-white"
          >
            ← Back to website
          </Link>
        </div>
      </div>
    </aside>
  );
}