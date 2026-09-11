import { redirect } from "next/navigation";
import Link from "next/link";

import { getAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminAdvertisementsPage() {
  const admin = await getAdmin();

  if (!admin) {
    redirect("/advertiser/login?error=admin_required");
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
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-900">
              All Advertisements
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review advertisements submitted to the platform.
            </p>
          </div>

          {advertisements.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-semibold text-slate-700">
                No advertisements found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Advertisements submitted by advertisers will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">

                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Advertisement
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Advertiser
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Views
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Created
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
  Action
</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {advertisements.map((ad) => (
                    <tr
                      key={ad.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* Advertisement */}
                      <td className="px-6 py-5">
                        <p className="font-bold text-slate-900">
                          {ad.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {ad.mediaType}
                        </p>
                      </td>

                      {/* Advertiser */}
                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-700">
                          {ad.advertiser.businessName}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {ad.advertiser.email}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {ad.category}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            ad.status.toLowerCase() === "active"
                              ? "bg-green-100 text-green-700"
                              : ad.status.toLowerCase() === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {ad.status}
                        </span>
                      </td>

                      {/* Views */}
                      <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                        {ad.views}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5 text-sm text-slate-500">
                        {new Date(
                          ad.createdAt
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      {/* Review */}
<td className="px-6 py-5">
  <Link
    href={`/admin/advertisements/${ad.id}`}
    className="inline-flex rounded-lg bg-blue-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-900"
  >
    Review
  </Link>
</td>

                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}