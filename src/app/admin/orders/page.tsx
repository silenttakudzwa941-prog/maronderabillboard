import { redirect } from "next/navigation";
import Link from "next/link";

import { getAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const admin = await getAdmin();

  if (!admin) {
    redirect("/advertiser/login?error=admin_required");
  }

  const orders = await prisma.order.findMany({
    include: {
      advertiser: {
        select: {
          businessName: true,
          email: true,
        },
      },

      payment: {
        select: {
          status: true,
          paymentMethod: true,
          amount: true,
          paymentReference: true,
          verifiedAt: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status.toLowerCase() === "pending"
  ).length;

  const paidOrders = orders.filter((order) => {
    const orderStatus = order.status.toLowerCase();
    const paymentStatus =
      order.payment?.status?.toLowerCase();

    return (
      orderStatus === "paid" ||
      orderStatus === "confirmed" ||
      orderStatus === "completed" ||
      paymentStatus === "paid" ||
      paymentStatus === "verified"
    );
  }).length;

  const pendingPayments = orders.filter((order) => {
    const paymentStatus =
      order.payment?.status?.toLowerCase();

    return (
      !order.payment ||
      paymentStatus === "pending"
    );
  }).length;

  const rejectedOrders = orders.filter((order) => {
    const orderStatus = order.status.toLowerCase();
    const paymentStatus =
      order.payment?.status?.toLowerCase();

    return (
      orderStatus === "rejected" ||
      orderStatus === "cancelled" ||
      paymentStatus === "rejected"
    );
  }).length;

  const totalRevenue = orders
    .filter((order) => {
      const orderStatus = order.status.toLowerCase();
      const paymentStatus =
        order.payment?.status?.toLowerCase();

      return (
        orderStatus === "paid" ||
        orderStatus === "confirmed" ||
        orderStatus === "completed" ||
        paymentStatus === "paid" ||
        paymentStatus === "verified"
      );
    })
    .reduce(
      (total, order) =>
        total + Number(order.totalPrice),
      0
    );

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
              Orders
            </h1>

            <p className="mt-2 text-slate-500">
              Manage customer orders and review payment information.
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
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Orders
            </p>

            <p className="mt-2 text-3xl font-black text-blue-950">
              {totalOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-black text-amber-600">
              {pendingOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Paid
            </p>

            <p className="mt-2 text-3xl font-black text-green-600">
              {paidOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Pending Payments
            </p>

            <p className="mt-2 text-3xl font-black text-orange-600">
              {pendingPayments}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Revenue
            </p>

            <p className="mt-2 text-3xl font-black text-blue-950">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>

        </div>

        {/* Orders table */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-900">
              All Orders
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View complete order and payment details.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-slate-500">
                No orders have been created yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px] text-left">

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Order
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Advertiser
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Package
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Total
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Order Status
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {orders.map((order) => {
                    const orderStatus =
                      order.status.toLowerCase();

                    const paymentStatus =
                      order.payment?.status?.toLowerCase() ||
                      "unpaid";

                    return (
                      <tr
                        key={order.id}
                        className="transition hover:bg-slate-50"
                      >

                        {/* Order */}
                        <td className="px-6 py-5">

                          <p className="font-bold text-slate-900">
                            {order.orderNumber}
                          </p>

                          <p className="mt-1 max-w-[180px] truncate font-mono text-xs text-slate-400">
                            {order.id}
                          </p>

                        </td>

                        {/* Advertiser */}
                        <td className="px-6 py-5">

                          <p className="font-semibold text-slate-900">
                            {order.advertiser.businessName}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {order.advertiser.email}
                          </p>

                        </td>

                        {/* Package */}
                        <td className="px-6 py-5">

                          <p className="font-semibold text-slate-900">
                            {order.packageName}
                          </p>

                          <p className="mt-1 font-mono text-xs text-slate-400">
                            {order.packageId}
                          </p>

                        </td>

                        {/* Total */}
                        <td className="px-6 py-5">

                          <p className="font-black text-blue-950">
                            $
                            {Number(
                              order.totalPrice
                            ).toFixed(2)}
                          </p>

                        </td>

                        {/* Order Status */}
                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                              orderStatus === "paid" ||
                              orderStatus === "confirmed" ||
                              orderStatus === "completed"
                                ? "bg-green-100 text-green-700"
                                : orderStatus === "rejected" ||
                                  orderStatus === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {order.status}
                          </span>

                        </td>

                        {/* Payment */}
                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                              paymentStatus === "paid" ||
                              paymentStatus === "verified"
                                ? "bg-green-100 text-green-700"
                                : paymentStatus === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {order.payment?.status ||
                              "Unpaid"}
                          </span>

                          {order.payment && (
                            <p className="mt-1 text-xs text-slate-400">
                              {order.payment.paymentMethod}
                            </p>
                          )}

                        </td>

                        {/* Date */}
                        <td className="px-6 py-5">

                          <p className="text-sm text-slate-700">
                            {new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {new Date(
                              order.createdAt
                            ).toLocaleTimeString(
                              "en-GB",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>

                        </td>

                        {/* Action */}
                        <td className="px-6 py-5">

                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex rounded-lg bg-blue-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-900"
                          >
                            View Order
                          </Link>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </main>
  );
}