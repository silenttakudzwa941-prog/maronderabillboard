import { redirect } from "next/navigation";
import Link from "next/link";

import { getAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import AdvertisementSearch from "./AdvertisementSearch";

export default async function AdminAdvertisementsPage() {
  const admin = await getAdmin();

if (!admin) {
  redirect("/admin/login");
}

  const advertisements = await prisma.ad.findMany({
    include: {
      advertiser: {
        select: {
          id: true,
          businessName: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalAds = advertisements.length;

  const pendingAds = advertisements.filter(
    (ad) => ad.status.toLowerCase() === "pending"
  ).length;

  const activeAds = advertisements.filter(
    (ad) => ad.status.toLowerCase() === "active"
  ).length;

  const rejectedAds = advertisements.filter(
    (ad) => ad.status.toLowerCase() === "rejected"
  ).length;

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
              Advertisements
            </h1>

            <p className="mt-2 text-slate-500">
              Review and manage advertisements submitted by advertisers.
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="inline-flex w-fit items-center rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-900"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Ads
            </p>

            <p className="mt-2 text-3xl font-black text-blue-950">
              {totalAds}
            </p>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Pending Review
            </p>

            <p className="mt-2 text-3xl font-black text-amber-500">
              {pendingAds}
            </p>
          </div>

          {/* Active */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Active
            </p>

            <p className="mt-2 text-3xl font-black text-green-600">
              {activeAds}
            </p>
          </div>

          {/* Rejected */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Rejected
            </p>

            <p className="mt-2 text-3xl font-black text-red-600">
              {rejectedAds}
            </p>
          </div>
        </div>

        {/* Advertisements table */}
        <AdvertisementSearch advertisements={advertisements} />

      </div>
    </main>
  );
}