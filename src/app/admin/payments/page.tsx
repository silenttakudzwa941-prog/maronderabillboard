import { redirect } from "next/navigation";
import Link from "next/link";

import { getAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

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
        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-black text-slate-900">
              Payment Records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {totalPayments} payment
              {totalPayments === 1 ? "" : "s"} recorded.
            </p>
          </div>

          {payments.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-semibold text-slate-500">
                No payments have been submitted yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                      Advertiser
                    </th>

                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                      Order
                    </th>

                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                      Method
                    </th>

                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                      Submitted
                    </th>

                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <p className="max-w-[180px] truncate text-sm font-bold text-slate-900">
                          {payment.paymentReference}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {payment.id}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-slate-900">
                          {payment.order.advertiser.businessName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {payment.order.advertiser.email}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-blue-950">
                          {payment.order.orderNumber}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {payment.order.packageName}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-black text-slate-900">
                          ${Number(
                            payment.amount
                          ).toFixed(2)}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-sm font-semibold capitalize text-slate-700">
                          {payment.paymentMethod}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-black capitalize ${statusClasses(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>

                        {payment.verifiedAt && (
                          <p className="mt-2 text-xs text-slate-400">
                            Verified{" "}
                            {formatDate(
                              payment.verifiedAt
                            )}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {formatDate(
                          payment.createdAt
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <Link
                          href={`/admin/orders/${payment.order.id}`}
                          className="inline-flex rounded-lg bg-blue-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-900"
                        >
                          View Order
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

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