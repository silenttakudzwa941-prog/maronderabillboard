import { redirect } from "next/navigation";
import Link from "next/link";

import { getAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import PaymentSearch from "./PaymentSearch";

export default async function PaymentsPage() {
  const admin = await getAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  const payments = await prisma.payment.findMany({
    include: {
      order: {
        include: {
        advertiser: {
  select: {
    id: true,
    businessName: true,
    email: true,
  },
},
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const searchPayments = payments.map((payment) => ({
  id: payment.id,
  paymentMethod: payment.paymentMethod,
  paymentReference: payment.paymentReference,
  amount: Number(payment.amount),
  status: payment.status,
  createdAt: payment.createdAt.toISOString(),

  order: {
    id: payment.order.id,
    orderNumber: payment.order.orderNumber,

    advertiser: {
      id: payment.order.advertiser.id,
      businessName:
        payment.order.advertiser.businessName,
      email:
        payment.order.advertiser.email,
    },
  },
}));

  const totalPayments = payments.length;

  const pendingPayments = payments.filter(
    (payment) =>
      payment.status.toLowerCase() === "pending"
  ).length;

  const verifiedPayments = payments.filter(
    (payment) =>
      payment.status.toLowerCase() === "verified"
  ).length;

  const rejectedPayments = payments.filter(
    (payment) =>
      payment.status.toLowerCase() === "rejected"
  ).length;

  const totalAmount = payments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount),
    0
  );

  const verifiedAmount = payments
    .filter(
      (payment) =>
        payment.status.toLowerCase() ===
        "verified"
    )
    .reduce(
      (sum, payment) =>
        sum + Number(payment.amount),
      0
    );

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat(
      "en-ZW",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(date);
  }

  function statusClasses(status: string) {
    switch (status.toLowerCase()) {
      case "verified":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-700">
            Admin Panel
          </p>

          <h1 className="mt-1 text-3xl font-black text-slate-900">
            Payments
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Review and monitor advertiser payments.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-500">
              Total Payments
            </p>

            <p className="mt-2 text-3xl font-black text-slate-900">
              {totalPayments}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-black text-yellow-600">
              {pendingPayments}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-500">
              Verified
            </p>

            <p className="mt-2 text-3xl font-black text-green-600">
              {verifiedPayments}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-500">
              Rejected
            </p>

            <p className="mt-2 text-3xl font-black text-red-600">
              {rejectedPayments}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-500">
              Verified Revenue
            </p>

            <p className="mt-2 text-2xl font-black text-blue-950">
              ${verifiedAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Payment table */}
        <PaymentSearch payments={searchPayments} />

        {/* Additional summary */}
        <div className="mt-6 rounded-2xl bg-blue-950 p-6 text-white">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-200">
                Total Submitted Value
              </p>

              <p className="mt-1 text-2xl font-black">
                ${totalAmount.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-blue-200">
                Verified Revenue
              </p>

              <p className="mt-1 text-2xl font-black">
                ${verifiedAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}