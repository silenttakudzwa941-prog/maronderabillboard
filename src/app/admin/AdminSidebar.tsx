
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

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
  const router = useRouter();

  const [attention, setAttention] = useState({
    pendingAds: 0,
    pendingPayments: 0,
    pendingOrders: 0,
  });
    useEffect(() => {
    async function loadAttention() {
      try {
        const response = await fetch("/api/admin/attention");

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setAttention({
          pendingAds: data.pendingAds ?? 0,
          pendingPayments: data.pendingPayments ?? 0,
          pendingOrders: data.pendingOrders ?? 0,
        });
      } catch {
        // Keep sidebar usable if the attention request fails.
      }
    }

    loadAttention();
  }, []);

async function handleLogout() {
  const supabase = createClient();

  await supabase.auth.signOut();

  router.replace("/admin/login");
  router.refresh();
}

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

                 <span className="flex-1">{item.name}</span>

{item.name === "Advertisements" &&
  attention.pendingAds > 0 && (
    <span className="min-w-[24px] rounded-full bg-amber-500 px-2 py-1 text-center text-[11px] font-black text-white">
      {attention.pendingAds}
    </span>
  )}

{item.name === "Orders" &&
  attention.pendingOrders > 0 && (
    <span className="min-w-[24px] rounded-full bg-red-500 px-2 py-1 text-center text-[11px] font-black text-white">
      {attention.pendingOrders}
    </span>
  )}

{item.name === "Payments" &&
  attention.pendingPayments > 0 && (
    <span className="min-w-[24px] rounded-full bg-purple-500 px-2 py-1 text-center text-[11px] font-black text-white">
      {attention.pendingPayments}
    </span>
  )} 
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-blue-900 px-6 py-5 space-y-3">

  <button
    type="button"
    onClick={handleLogout}
    className="w-full rounded-xl bg-red-600 px-4 py-3 text-left text-sm font-bold text-white transition hover:bg-red-700"
  >
    🚪 Sign out
  </button>

  <Link
    href="/"
    className="block text-sm font-semibold text-blue-200 transition hover:text-white"
  >
    ← Back to website
  </Link>

</div>
      </div>
    </aside>
  );
}