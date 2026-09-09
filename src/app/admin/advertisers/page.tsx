import { redirect } from "next/navigation";
import Link from "next/link";

import { getAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminAdvertisersPage() {
  const admin = await getAdmin();

  if (!admin) {
    redirect("/advertiser/login?error=admin_required");
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
    },

    orderBy: {
      createdAt: "desc",
    },
  });

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
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-900">
              Registered Advertisers
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              All advertisers currently registered on the platform.
            </p>
          </div>

          {advertisers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-semibold text-slate-700">
                No advertisers found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Registered advertisers will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Business
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Advertisements
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Orders
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Registered
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {advertisers.map((advertiser) => (
                    <tr
                      key={advertiser.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-bold text-slate-900">
                            {advertiser.businessName}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            ID: {advertiser.id}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-slate-700">
                          {advertiser.email}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {advertiser.phone}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                          {advertiser._count.ads}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-sm font-bold text-purple-700">
                          {advertiser._count.orders}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-500">
                        {new Date(
                          advertiser.createdAt
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-6 py-5">
                        <Link
                          href={`/admin/advertisers/${advertiser.id}`}
                          className="inline-flex rounded-lg bg-blue-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-900"
                        >
                          View
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