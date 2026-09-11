"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Order = {
  id: string;
  orderNumber: string;
  packageName: string;
  totalPrice: number | string;
  status: string;
  createdAt: Date | string;

  advertiser: {
    id: string;
    businessName: string;
    email: string;
  };

  payment: {
    id: string;
    paymentMethod: string;
    paymentReference: string;
    amount: number | string;
    status: string;
  } | null;
};

type OrderSearchProps = {
  orders: Order[];
};

export default function OrderSearch({
  orders,
}: OrderSearchProps) {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "paid" | "payment_rejected"
  >("all");

  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highestValue" | "lowestValue"
  >("newest");

  const filteredOrders = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    const filtered = orders.filter((order) => {
      const matchesSearch =
        !searchTerm ||
        order.orderNumber
          .toLowerCase()
          .includes(searchTerm) ||
        order.advertiser.businessName
          .toLowerCase()
          .includes(searchTerm) ||
        order.advertiser.email
          .toLowerCase()
          .includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" ||
        order.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      }

      if (sortBy === "highestValue") {
        return (
          Number(b.totalPrice) -
          Number(a.totalPrice)
        );
      }

      if (sortBy === "lowestValue") {
        return (
          Number(a.totalPrice) -
          Number(b.totalPrice)
        );
      }

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });
  }, [orders, search, statusFilter, sortBy]);

  const pendingCount = orders.filter(
    (order) =>
      order.status.toLowerCase() === "pending"
  ).length;

  const paidCount = orders.filter(
    (order) =>
      order.status.toLowerCase() === "paid"
  ).length;

  const rejectedCount = orders.filter(
    (order) =>
      order.status.toLowerCase() === "payment_rejected"
  ).length;

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setSortBy("newest");
  }

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              All Orders
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search, filter and manage advertiser orders.
            </p>
          </div>

          <div className="text-sm font-semibold text-slate-500">
            Showing{" "}
            <span className="font-black text-blue-950">
              {filteredOrders.length}
            </span>{" "}
            of{" "}
            <span className="font-black text-blue-950">
              {orders.length}
            </span>
          </div>

        </div>
      </div>

      {/* Search and sorting */}
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">

        <div className="flex flex-col gap-4 lg:flex-row">

          {/* Search */}
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
              🔎
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by order number, business or email..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target.value as
                  | "newest"
                  | "oldest"
                  | "highestValue"
                  | "lowestValue"
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="newest">
              Newest first
            </option>

            <option value="oldest">
              Oldest first
            </option>

            <option value="highestValue">
              Highest value
            </option>

            <option value="lowestValue">
              Lowest value
            </option>
          </select>

        </div>

        {/* Status filters */}
        <div className="mt-4 flex flex-wrap gap-2">

          {/* All */}
          <button
            type="button"
            onClick={() =>
              setStatusFilter("all")
            }
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              statusFilter === "all"
                ? "bg-blue-950 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            All ({orders.length})
          </button>

          {/* Pending */}
          <button
            type="button"
            onClick={() =>
              setStatusFilter("pending")
            }
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              statusFilter === "pending"
                ? "bg-amber-500 text-white"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            Pending ({pendingCount})
          </button>

          {/* Paid */}
          <button
            type="button"
            onClick={() =>
              setStatusFilter("paid")
            }
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              statusFilter === "paid"
                ? "bg-green-600 text-white"
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            Paid ({paidCount})
          </button>

          {/* Payment rejected */}
          <button
            type="button"
            onClick={() =>
              setStatusFilter("payment_rejected")
            }
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              statusFilter === "payment_rejected"
                ? "bg-red-600 text-white"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            Payment Rejected ({rejectedCount})
          </button>

        </div>

        {/* Clear */}
        {(search ||
          statusFilter !== "all" ||
          sortBy !== "newest") && (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 text-sm font-bold text-blue-700 hover:text-blue-900"
          >
            Clear filters
          </button>
        )}

      </div>

      {/* Empty state */}
      {filteredOrders.length === 0 ? (
        <div className="px-6 py-16 text-center">

          <div className="text-4xl">
            🔍
          </div>

          <p className="mt-4 font-bold text-slate-700">
            No orders found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Try changing your search or filters.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-900"
          >
            Clear Filters
          </button>

        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px] text-left">

            <thead className="bg-slate-50">
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
                  Amount
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Order Status
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Payment
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

              {filteredOrders.map((order) => {
                const orderStatus =
                  order.status.toLowerCase();

                const paymentStatus =
                  order.payment?.status?.toLowerCase() ||
                  "none";

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

                      <p className="mt-1 text-xs text-slate-400">
                        {order.id}
                      </p>
                    </td>

                    {/* Advertiser */}
                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-700">
                        {order.advertiser.businessName}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {order.advertiser.email}
                      </p>
                    </td>

                    {/* Package */}
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-slate-700">
                        {order.packageName}
                      </p>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-5">
                      <p className="font-black text-blue-950">
                        ${Number(order.totalPrice).toFixed(2)}
                      </p>
                    </td>

                    {/* Order status */}
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          orderStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : orderStatus ===
                              "payment_rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Payment */}
                    <td className="px-6 py-5">
                      {order.payment ? (
                        <div>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                              paymentStatus === "verified"
                                ? "bg-green-100 text-green-700"
                                : paymentStatus ===
                                  "rejected"
                                ? "bg-red-100 text-red-700"
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

                    {/* Created */}
                    <td className="px-6 py-5 text-sm text-slate-500">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
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
  );
}