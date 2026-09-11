import { redirect, notFound } from "next/navigation";
import Link from "next/link";

import { getAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdvertiserDetailsPage({
  params,
}: PageProps) {
  const admin = await getAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const advertiser = await prisma.advertiser.findUnique({
    where: {
      id,
    },

    include: {
      ads: {
        orderBy: {
          createdAt: "desc",
        },
      },

      orders: {
        include: {
          payment: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!advertiser) {
    notFound();
  }

  const totalAds = advertiser.ads.length;

  const activeAds = advertiser.ads.filter(
    (ad) => ad.status.toLowerCase() === "active"
  ).length;

  const pendingAds = advertiser.ads.filter(
    (ad) => ad.status.toLowerCase() === "pending"
  ).length;

  const rejectedAds = advertiser.ads.filter(
    (ad) => ad.status.toLowerCase() === "rejected"
  ).length;

const totalOrders = advertiser.orders.length;

const totalSpent = advertiser.orders.reduce(
  (total, order) => total + Number(order.totalPrice),
  0
);

const verifiedPayments = advertiser.orders
  .filter(
    (order) =>
      order.payment?.status.toLowerCase() === "verified"
  )
  .reduce(
    (total, order) =>
      total + Number(order.payment?.amount || 0),
    0
  );

const pendingPayments = advertiser.orders
  .filter(
    (order) =>
      order.payment?.status.toLowerCase() === "pending"
  )
  .reduce(
    (total, order) =>
      total + Number(order.payment?.amount || 0),
    0
  );

const rejectedPayments = advertiser.orders
  .filter(
    (order) =>
      order.payment?.status.toLowerCase() === "rejected"
  )
  .reduce(
    (total, order) =>
      total + Number(order.payment?.amount || 0),
    0
  );
  const verifiedPaymentCount = advertiser.orders.filter(
  (order) =>
    order.payment?.status.toLowerCase() === "verified"
).length;

const pendingPaymentCount = advertiser.orders.filter(
  (order) =>
    order.payment?.status.toLowerCase() === "pending"
).length;

const rejectedPaymentCount = advertiser.orders.filter(
  (order) =>
    order.payment?.status.toLowerCase() === "rejected"
).length;

const unpaidOrderCount = advertiser.orders.filter(
  (order) => !order.payment
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
              Advertiser Details
            </h1>

            <p className="mt-2 text-slate-500">
              View advertiser information, advertisements and orders.
            </p>
          </div>

          <Link
            href="/admin/advertisers"
            className="inline-flex w-fit items-center rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-900"
          >
            ← Advertisers
          </Link>
        </div>

        {/* Business information */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

            <div>
              <p className="text-sm font-semibold text-blue-700">
                Business
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-900">
                {advertiser.businessName}
              </h2>

              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="font-semibold text-slate-700">
                    Email:
                  </span>{" "}
                  <span className="text-slate-500">
                    {advertiser.email}
                  </span>
                </p>

                <p>
                  <span className="font-semibold text-slate-700">
                    Phone:
                  </span>{" "}
                  <span className="text-slate-500">
                    {advertiser.phone}
                  </span>
                </p>

                <p>
                  <span className="font-semibold text-slate-700">
                    Registered:
                  </span>{" "}
                  <span className="text-slate-500">
                    {new Date(
                      advertiser.createdAt
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Advertiser ID
              </p>

              <p className="mt-1 break-all text-sm font-mono text-slate-600">
                {advertiser.id}
              </p>
            </div>

          </div>
        </div>
        {/* Quick Actions */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage this advertiser's advertisements and orders.
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/advertisements"
              className="inline-flex items-center justify-center rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-900"
            >
              📢 Manage Advertisements
            </Link>

            <Link
              href="/admin/orders"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              🧾 Manage Orders
            </Link>

            <Link
              href="/admin/payments"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              💳 Manage Payments
            </Link>
          </div>
        </div>
        {/* Statistics */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Ads
            </p>

            <p className="mt-2 text-3xl font-black text-blue-950">
              {totalAds}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Active
            </p>

            <p className="mt-2 text-3xl font-black text-green-600">
              {activeAds}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-black text-amber-500">
              {pendingAds}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Rejected
            </p>

            <p className="mt-2 text-3xl font-black text-red-600">
              {rejectedAds}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Orders
            </p>

            <p className="mt-2 text-3xl font-black text-purple-700">
              {totalOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Spent
            </p>

            <p className="mt-2 text-2xl font-black text-blue-950">
              ${totalSpent.toFixed(2)}
            </p>
          </div>

        </div>

        {/* Financial Overview */}
        <div className="mt-8">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Financial Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Payment activity for this advertiser.
            </p>
          </div>

        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">

            {/* Total Order Value */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Total Order Value
              </p>

              <p className="mt-2 text-2xl font-black text-blue-950">
                ${totalSpent.toFixed(2)}
              </p>
            </div>

          {/* Verified Payments */}
<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <p className="text-sm text-slate-500">
    Verified Payments
  </p>

  <p className="mt-2 text-2xl font-black text-green-600">
    ${verifiedPayments.toFixed(2)}
  </p>

  <p className="mt-2 text-xs font-semibold text-slate-400">
    {verifiedPaymentCount}{" "}
    {verifiedPaymentCount === 1 ? "payment" : "payments"}
  </p>
</div>

           {/* Pending Payments */}
<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <p className="text-sm text-slate-500">
    Pending Payments
  </p>

  <p className="mt-2 text-2xl font-black text-amber-500">
    ${pendingPayments.toFixed(2)}
  </p>

  <p className="mt-2 text-xs font-semibold text-slate-400">
    {pendingPaymentCount}{" "}
    {pendingPaymentCount === 1 ? "payment" : "payments"}
  </p>
</div>
          {/* Rejected Payments */}
<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <p className="text-sm text-slate-500">
    Rejected Payments
  </p>

  <p className="mt-2 text-2xl font-black text-red-600">
    ${rejectedPayments.toFixed(2)}
  </p>

  <p className="mt-2 text-xs font-semibold text-slate-400">
    {rejectedPaymentCount}{" "}
    {rejectedPaymentCount === 1 ? "payment" : "payments"}
  </p>
</div>
            {/* Unpaid Orders */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Unpaid Orders
              </p>

              <p className="mt-2 text-2xl font-black text-orange-600">
                {unpaidOrderCount}
              </p>

              <p className="mt-2 text-xs font-semibold text-slate-400">
                {unpaidOrderCount === 1
                  ? "order awaiting payment"
                  : "orders awaiting payment"}
              </p>
            </div>
          </div>
        </div>

        {/* Advertisements */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-900">
              Advertisements
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Advertisements submitted by this advertiser.
            </p>
          </div>

          {advertiser.ads.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-semibold text-slate-700">
                No advertisements
              </p>

              <p className="mt-1 text-sm text-slate-500">
                This advertiser has not submitted any advertisements.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Advertisement
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
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {advertiser.ads.map((ad) => (
                    <tr key={ad.id}>
                     <td className="px-6 py-5">
  <Link
    href={`/admin/advertisements/${ad.id}`}
    className="group block"
  >
    <p className="font-bold text-slate-900 group-hover:text-blue-700">
      {ad.title}
    </p>

    <p className="mt-1 text-xs text-slate-400">
      {ad.mediaType}
    </p>

    <p className="mt-2 text-xs font-bold text-blue-600">
      Review advertisement →
    </p>
  </Link>
</td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {ad.category}
                      </td>

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

                      <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                        {ad.views}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-500">
                        {new Date(
                          ad.createdAt
                        ).toLocaleDateString("en-GB")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* Orders */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-900">
              Orders
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Orders placed by this advertiser.
            </p>
          </div>

          {advertiser.orders.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-semibold text-slate-700">
                No orders
              </p>

              <p className="mt-1 text-sm text-slate-500">
                This advertiser has not placed any orders.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Order
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Package
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Amount
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
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {advertiser.orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-5">
  <Link
    href={`/admin/orders/${order.id}`}
    className="group block"
  >
    <p className="font-bold text-slate-900 group-hover:text-blue-700">
      {order.orderNumber}
    </p>

    <p className="mt-2 text-xs font-bold text-blue-600">
      View order →
    </p>
  </Link>
</td>

                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-700">
                          {order.packageName}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {order.packageId}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm font-bold text-slate-900">
                        ${Number(order.totalPrice).toFixed(2)}
                      </td>

                      <td className="px-6 py-5">
                       <span
  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
    order.status.toLowerCase() === "paid"
      ? "bg-green-100 text-green-700"
      : order.status.toLowerCase() === "payment_rejected"
      ? "bg-red-100 text-red-700"
      : order.status.toLowerCase() === "pending"
      ? "bg-amber-100 text-amber-700"
      : "bg-slate-100 text-slate-700"
  }`}
>
  {order.status}
</span>
                      </td>

                      <td className="px-6 py-5">
                        {order.payment ? (
                          <div>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                                order.payment.status.toLowerCase() ===
                                  "verified" ||
                                order.payment.status.toLowerCase() ===
                                  "paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {order.payment.status}
                            </span>

                            <p className="mt-1 text-xs text-slate-400">
                              {order.payment.paymentMethod}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">
                            No payment
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-500">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString("en-GB")}
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