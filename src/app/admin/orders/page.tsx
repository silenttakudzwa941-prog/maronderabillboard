import { redirect } from "next/navigation";
import Link from "next/link";

import { getAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import OrderSearch from "./OrderSearch";

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
  const searchOrders = orders.map((order) => ({
  id: order.id,
  orderNumber: order.orderNumber,
  packageName: order.packageName,

  totalPrice: Number(order.totalPrice),

  status: order.status,
  createdAt: order.createdAt.toISOString(),

  advertiser: {
    id: order.advertiser.id,
    businessName: order.advertiser.businessName,
    email: order.advertiser.email,
  },

  payment: order.payment
    ? {
        id: order.payment.id,
        paymentMethod: order.payment.paymentMethod,
        paymentReference: order.payment.paymentReference,
        amount: Number(order.payment.amount),
        status: order.payment.status,
      }
    : null,
}));

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
       <OrderSearch orders={searchOrders} />
      </div>
    </main>
  );
}