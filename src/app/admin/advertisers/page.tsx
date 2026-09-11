import { redirect } from "next/navigation";
import Link from "next/link";

import { getAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import AdvertiserSearch from "./AdvertiserSearch";

export default async function AdminAdvertisersPage() {
  const admin = await getAdmin();

  if (!admin) {
   redirect("/admin/login");
  }

  const advertisers = await prisma.advertiser.findMany({
    select: {
      id: true,
      businessName: true,
      email: true,
      phone: true,
      createdAt: true,

     _count: {
  select: {
    ads: true,
    orders: true,
  },
},

ads: {
  select: {
    status: true,
  },
},

orders: {
  select: {
    totalPrice: true,
    payment: {
      select: {
        status: true,
        amount: true,
      },
    },
  },
},
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const searchAdvertisers = advertisers.map((advertiser) => ({
    id: advertiser.id,
    businessName: advertiser.businessName,
    email: advertiser.email,
    phone: advertiser.phone,
    createdAt: advertiser.createdAt.toISOString(),

    _count: advertiser._count,

    activeAds: advertiser.ads.filter(
      (ad) => ad.status.toLowerCase() === "active"
    ).length,

    pendingAds: advertiser.ads.filter(
      (ad) => ad.status.toLowerCase() === "pending"
    ).length,

    rejectedAds: advertiser.ads.filter(
      (ad) => ad.status.toLowerCase() === "rejected"
    ).length,

    totalOrderValue: advertiser.orders.reduce(
      (total, order) =>
        total + Number(order.totalPrice),
      0
    ),

    verifiedPayments: advertiser.orders.reduce(
      (total, order) =>
        order.payment?.status.toLowerCase() === "verified"
          ? total + Number(order.payment.amount)
          : total,
      0
    ),

    pendingPayments: advertiser.orders.reduce(
      (total, order) =>
        order.payment?.status.toLowerCase() === "pending"
          ? total + Number(order.payment.amount)
          : total,
      0
    ),
  }));

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              MaronderaBillboard
            </p>

            <h1 className="mt-1 text-3xl font-black text-blue-950">
              Advertisers
            </h1>

            <p className="mt-2 text-slate-500">
              Manage registered advertisers and view their activity.
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="inline-flex w-fit items-center rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-900"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Summary */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Advertisers
            </p>

            <p className="mt-2 text-3xl font-black text-blue-950">
              {advertisers.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Advertisements
            </p>

            <p className="mt-2 text-3xl font-black text-blue-950">
              {advertisers.reduce(
                (total, advertiser) => total + advertiser._count.ads,
                0
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Orders
            </p>

            <p className="mt-2 text-3xl font-black text-blue-950">
              {advertisers.reduce(
                (total, advertiser) => total + advertiser._count.orders,
                0
              )}
            </p>
          </div>
        </div>

        {/* Advertisers table */}
      {/* Advertisers table + search */}
<div className="mt-8">
 <AdvertiserSearch advertisers={searchAdvertisers} /> 
</div>
      </div>
    </main>
  );
}