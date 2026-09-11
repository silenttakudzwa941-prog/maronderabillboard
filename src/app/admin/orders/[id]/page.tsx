import { redirect, notFound } from "next/navigation";
import Link from "next/link";

import { getAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import PaymentActions from "./PaymentActions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminOrderDetailsPage({
  params,
}: PageProps) {
  const admin = await getAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      advertiser: {
        select: {
          id: true,
          businessName: true,
          email: true,
          phone: true,
          createdAt: true,
        },
      },

      payment: {
        select: {
          id: true,
          paymentMethod: true,
          paymentReference: true,
          amount: true,
          status: true,
          verifiedAt: true,
          createdAt: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const paymentStatus =
    order.payment?.status?.toLowerCase() || "unpaid";

  const orderStatus = order.status.toLowerCase();

  const totalPrice = Number(order.totalPrice);
  const billboardPrice = Number(order.billboardPrice);
  const socialMediaTotal = Number(order.socialMediaTotal);
  const campaignManagementFee = Number(
    order.campaignManagementFee
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm font-semibold text-blue-700">
              MaronderaBillboard
            </p>

            <h1 className="mt-1 text-3xl font-black text-blue-950">
              Order Details
            </h1>

            <p className="mt-2 text-slate-500">
              Inspect the complete order and payment information.
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="inline-flex w-fit items-center rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-900"
          >
            ← Orders
          </Link>

        </div>

        {/* Order summary */}
        <div className="mt-8 rounded-2xl bg-blue-950 p-8 text-white shadow-lg">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm font-semibold text-blue-200">
                Order Number
              </p>

              <h2 className="mt-1 text-2xl font-black">
                {order.orderNumber}
              </h2>

              <p className="mt-2 text-sm text-blue-200">
                Created{" "}
                {new Date(order.createdAt).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${
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
                Order: {order.status}
              </span>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  paymentStatus === "paid" ||
                  paymentStatus === "verified"
                    ? "bg-green-100 text-green-700"
                    : paymentStatus === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                Payment: {order.payment?.status || "Unpaid"}
              </span>

            </div>

          </div>

        </div>

        {/* Main information */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">

          {/* Advertiser */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold text-slate-900">
              Advertiser Information
            </h2>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Business Name
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {order.advertiser.businessName}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-1 text-slate-700">
                  {order.advertiser.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Phone
                </p>

                <p className="mt-1 text-slate-700">
                  {order.advertiser.phone}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Advertiser ID
                </p>

                <p className="mt-1 break-all font-mono text-xs text-slate-500">
                  {order.advertiser.id}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Registered
                </p>

                <p className="mt-1 text-slate-700">
                  {new Date(
                    order.advertiser.createdAt
                  ).toLocaleDateString("en-GB")}
                </p>
              </div>

            </div>

          </div>

          {/* Package */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold text-slate-900">
              Package Information
            </h2>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Package
                </p>

                <p className="mt-1 text-xl font-black text-blue-950">
                  {order.packageName}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Package ID
                </p>

                <p className="mt-1 font-mono text-sm text-slate-700">
                  {order.packageId}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Order ID
                </p>

                <p className="mt-1 break-all font-mono text-xs text-slate-500">
                  {order.id}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Last Updated
                </p>

                <p className="mt-1 text-slate-700">
                  {new Date(
                    order.updatedAt
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Financial breakdown */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold text-slate-900">
            Order Financial Breakdown
          </h2>

          <div className="mt-6 divide-y divide-slate-100">

            <div className="flex items-center justify-between py-4">
              <span className="text-slate-600">
                Billboard Package
              </span>

              <span className="font-bold text-slate-900">
                ${billboardPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between py-4">
              <span className="text-slate-600">
                Social Media
              </span>

              <span className="font-bold text-slate-900">
                ${socialMediaTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between py-4">
              <span className="text-slate-600">
                Campaign Management
              </span>

              <span className="font-bold text-slate-900">
                ${campaignManagementFee.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between py-5">

              <span className="text-lg font-black text-slate-900">
                Total Order Value
              </span>

              <span className="text-2xl font-black text-blue-950">
                ${totalPrice.toFixed(2)}
              </span>

            </div>

          </div>

        </div>

        {/* Payment information */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Payment Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Payment submitted for this order.
              </p>
            </div>

            <span
              className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-bold ${
                paymentStatus === "paid" ||
                paymentStatus === "verified"
                  ? "bg-green-100 text-green-700"
                  : paymentStatus === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {order.payment?.status || "No Payment"}
            </span>

          </div>

          {order.payment ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2">

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Payment Method
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {order.payment.paymentMethod}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Payment Amount
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  ${Number(order.payment.amount).toFixed(2)}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Payment Reference
                </p>

                <p className="mt-1 break-all rounded-lg bg-slate-50 p-3 font-mono text-sm text-slate-800">
                  {order.payment.paymentReference}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Submitted
                </p>

                <p className="mt-1 text-slate-700">
                  {new Date(
                    order.payment.createdAt
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Verified
                </p>

                <p className="mt-1 text-slate-700">
                  {order.payment.verifiedAt
                    ? new Date(
                        order.payment.verifiedAt
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "Not verified"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Payment ID
                </p>

                <p className="mt-1 break-all font-mono text-xs text-slate-500">
                  {order.payment.id}
                </p>
              </div>

            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
              <p className="font-semibold text-amber-800">
                No payment has been submitted for this order yet.
              </p>
            </div>
          )}

        </div>

        {/* Payment action placeholder */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold text-slate-900">
            Payment Review
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Payment verification controls will be added next.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">

            {order.payment ? (
  <PaymentActions
    orderId={order.id}
    paymentId={order.payment.id}
    currentPaymentStatus={order.payment.status}
  />
) : (
  <p className="mt-6 text-sm font-semibold text-slate-500">
    No payment has been submitted for this order.
  </p>
)}

          </div>

        </div>

      </div>
    </main>
  );
}