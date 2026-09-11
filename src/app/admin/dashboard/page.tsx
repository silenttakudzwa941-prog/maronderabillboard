import { redirect } from "next/navigation";
import Link from "next/link";

import { getAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const admin = await getAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  const [
    advertiserCount,
    advertisementCount,
    orderCount,
    paymentCount,
    activeAdvertisementCount,
    pendingAdvertisementCount,
    pendingOrderCount,
    pendingPaymentCount,
    verifiedPayments,
    recentOrders,
    recentPayments,
    recentAdvertisements,
  ] = await Promise.all([
    prisma.advertiser.count(),

    prisma.ad.count(),

    prisma.order.count(),

    prisma.payment.count(),

    prisma.ad.count({
      where: {
        status: "active",
      },
    }),

    prisma.ad.count({
      where: {
        status: "pending",
      },
    }),

    prisma.order.count({
      where: {
        status: "pending",
      },
    }),

    prisma.payment.count({
      where: {
        status: "pending",
      },
    }),

    prisma.payment.findMany({
      where: {
        status: "verified",
      },
      select: {
        amount: true,
      },
    }),

    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        advertiser: {
          select: {
            businessName: true,
          },
        },
        payment: {
          select: {
            status: true,
          },
        },
      },
    }),

    prisma.payment.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        order: {
  select: {
    id: true,
    orderNumber: true,
    advertiser: {
              select: {
                businessName: true,
              },
            },
          },
        },
      },
    }),

    prisma.ad.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        advertiser: {
          select: {
            businessName: true,
          },
        },
      },
    }),
  ]);

  const verifiedRevenue = verifiedPayments.reduce(
    (total, payment) =>
      total + Number(payment.amount),
    0
  );

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-ZW", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }

  function statusClasses(status: string) {
    switch (status.toLowerCase()) {
      case "verified":
      case "paid":
      case "active":
        return "bg-green-100 text-green-700";

      case "rejected":
      case "payment_rejected":
        return "bg-red-100 text-red-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="rounded-2xl bg-blue-950 p-6 text-white shadow-lg sm:p-8">
          <p className="text-sm font-semibold text-blue-200">
            MaronderaBillboard
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-blue-100">
            Welcome back, {admin.name || admin.email}.
          </p>
        </div>

        {/* Main Statistics */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Advertisers
            </p>

            <p className="mt-2 text-3xl font-black text-blue-950">
              {advertiserCount}
            </p>

            <Link
              href="/admin/advertisers"
              className="mt-3 inline-block text-xs font-bold text-blue-700 hover:underline"
            >
              View advertisers →
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Advertisements
            </p>

            <p className="mt-2 text-3xl font-black text-blue-950">
              {advertisementCount}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {activeAdvertisementCount} active
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Orders
            </p>

            <p className="mt-2 text-3xl font-black text-blue-950">
              {orderCount}
            </p>

            <p className="mt-2 text-xs text-yellow-600">
              {pendingOrderCount} pending
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Payments
            </p>

            <p className="mt-2 text-3xl font-black text-blue-950">
              {paymentCount}
            </p>

            <p className="mt-2 text-xs text-yellow-600">
              {pendingPaymentCount} pending
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Active Ads
            </p>

            <p className="mt-2 text-3xl font-black text-green-600">
              {activeAdvertisementCount}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Currently live
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Verified Revenue
            </p>

            <p className="mt-2 text-2xl font-black text-blue-950">
              ${verifiedRevenue.toFixed(2)}
            </p>

            <Link
              href="/admin/payments"
              className="mt-3 inline-block text-xs font-bold text-blue-700 hover:underline"
            >
              View payments →
            </Link>
          </div>

        </div>

        {/* Attention Cards */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">

          <Link
            href="/admin/advertisements"
            className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 transition hover:shadow-md"
          >
            <p className="text-sm font-bold text-yellow-700">
              Advertisements Awaiting Review
            </p>

            <p className="mt-2 text-3xl font-black text-yellow-900">
              {pendingAdvertisementCount}
            </p>

            <p className="mt-2 text-sm text-yellow-700">
              Review pending advertisements →
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="rounded-2xl border border-blue-200 bg-blue-50 p-6 transition hover:shadow-md"
          >
            <p className="text-sm font-bold text-blue-700">
              Pending Orders
            </p>

            <p className="mt-2 text-3xl font-black text-blue-950">
              {pendingOrderCount}
            </p>

            <p className="mt-2 text-sm text-blue-700">
              Review pending orders →
            </p>
          </Link>

          <Link
            href="/admin/payments"
            className="rounded-2xl border border-green-200 bg-green-50 p-6 transition hover:shadow-md"
          >
            <p className="text-sm font-bold text-green-700">
              Payments Awaiting Verification
            </p>

            <p className="mt-2 text-3xl font-black text-green-900">
              {pendingPaymentCount}
            </p>

            <p className="mt-2 text-sm text-green-700">
              Review payments →
            </p>
          </Link>

        </div>

        {/* Recent Activity */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          {/* Recent Orders */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Recent Orders
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest advertiser orders
                </p>
              </div>

              <Link
                href="/admin/orders"
                className="text-sm font-bold text-blue-700 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-slate-100">

              {recentOrders.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-slate-500">
                  No orders yet.
                </div>
              ) : (
                recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="block px-6 py-5 transition hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-blue-950">
                          {order.orderNumber}
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                          {order.advertiser.businessName}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {order.packageName} •{" "}
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-black text-slate-900">
                          ${Number(
                            order.totalPrice
                          ).toFixed(2)}
                        </p>

                        <span
                          className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusClasses(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                    </div>
                  </Link>
                ))
              )}

            </div>
          </div>

          {/* Recent Payments */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Recent Payments
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest payment activity
                </p>
              </div>

              <Link
                href="/admin/payments"
                className="text-sm font-bold text-blue-700 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-slate-100">

              {recentPayments.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-slate-500">
                  No payments yet.
                </div>
              ) : (
                recentPayments.map((payment) => (
                  <Link
                    key={payment.id}
                    href={`/admin/orders/${payment.order.id}`}
                    className="block px-6 py-5 transition hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-blue-950">
                          {payment.order.orderNumber}
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                          {payment.order.advertiser.businessName}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {payment.paymentMethod} •{" "}
                          {formatDate(payment.createdAt)}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-black text-slate-900">
                          ${Number(
                            payment.amount
                          ).toFixed(2)}
                        </p>

                        <span
                          className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusClasses(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </div>

                    </div>
                  </Link>
                ))
              )}

            </div>
          </div>

        </div>

        {/* Recent Advertisements */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

            <div>
              <h2 className="text-lg font-black text-slate-900">
                Recent Advertisements
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest advertisements submitted
              </p>
            </div>

            <Link
              href="/admin/advertisements"
              className="text-sm font-bold text-blue-700 hover:underline"
            >
              View all
            </Link>

          </div>

          <div className="overflow-x-auto">

            <table className="min-w-[700px] w-full text-left">

              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                    Advertisement
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                    Advertiser
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                    Created
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {recentAdvertisements.map((ad) => (
                  <tr
                    key={ad.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >

                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-slate-900">
                        {ad.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {ad.category}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                      {ad.advertiser.businessName}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${statusClasses(
                          ad.status
                        )}`}
                      >
                        {ad.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {formatDate(ad.createdAt)}
                    </td>

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
        </div>

      </div>
    </main>
  );
}