"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Advertiser = {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  createdAt: Date | string;

  _count: {
    ads: number;
    orders: number;
  };

  activeAds: number;
  pendingAds: number;
  rejectedAds: number;

  totalOrderValue: number;
  verifiedPayments: number;
  pendingPayments: number;
};

type AdvertiserSearchProps = {
  advertisers: Advertiser[];
};

export default function AdvertiserSearch({
  advertisers,
}: AdvertiserSearchProps) {
  const [search, setSearch] = useState("");
 const [sortBy, setSortBy] = useState<
  | "newest"
  | "oldest"
  | "mostAds"
  | "mostOrders"
  | "highestSpending"
>("newest");
const [filterBy, setFilterBy] = useState<
  "all" | "activeAds" | "pendingAds" | "pendingPayments"
>("all");

  const filteredAdvertisers = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    const filtered = advertisers.filter((advertiser) => {
  const matchesSearch =
    !searchTerm ||
    advertiser.businessName
      .toLowerCase()
      .includes(searchTerm) ||
    advertiser.email
      .toLowerCase()
      .includes(searchTerm) ||
    advertiser.phone
      .toLowerCase()
      .includes(searchTerm);

  if (!matchesSearch) {
    return false;
  }

  if (filterBy === "activeAds") {
    return advertiser.activeAds > 0;
  }

  if (filterBy === "pendingAds") {
    return advertiser.pendingAds > 0;
  }

  if (filterBy === "pendingPayments") {
    return advertiser.pendingPayments > 0;
  }

  return true;
});
    return [...filtered].sort((a, b) => {
      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      }

      if (sortBy === "mostAds") {
        return b._count.ads - a._count.ads;
      }

     if (sortBy === "mostOrders") {
  return b._count.orders - a._count.orders;
}

if (sortBy === "highestSpending") {
  return b.totalOrderValue - a.totalOrderValue;
}

return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });
  }, [advertisers, search, sortBy, filterBy]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Registered Advertisers
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search and manage advertisers currently registered on the platform.
            </p>
          </div>

          <div className="text-sm font-semibold text-slate-500">
            Showing{" "}
            <span className="font-black text-blue-950">
              {filteredAdvertisers.length}
            </span>{" "}
            of{" "}
            <span className="font-black text-blue-950">
              {advertisers.length}
            </span>
          </div>

        </div>
      </div>

      {/* Search + Sort */}
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
        <div className="flex flex-col gap-4 md:flex-row">

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
              placeholder="Search by business name, email or phone..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
<div className="flex flex-wrap gap-2">
  <button
    type="button"
    onClick={() => setFilterBy("all")}
    className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
      filterBy === "all"
        ? "bg-blue-950 text-white"
        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
    }`}
  >
    All
  </button>

  <button
    type="button"
    onClick={() => setFilterBy("activeAds")}
    className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
      filterBy === "activeAds"
        ? "bg-green-600 text-white"
        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
    }`}
  >
    Active Ads
  </button>

  <button
    type="button"
    onClick={() => setFilterBy("pendingAds")}
    className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
      filterBy === "pendingAds"
        ? "bg-amber-500 text-white"
        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
    }`}
  >
    Pending Ads
  </button>

  <button
    type="button"
    onClick={() => setFilterBy("pendingPayments")}
    className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
      filterBy === "pendingPayments"
        ? "bg-purple-600 text-white"
        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
    }`}
  >
    Pending Payments
  </button>
</div>
          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target.value as
                  | "newest"
                  | "oldest"
                  | "mostAds"
                  | "mostOrders"
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

            <option value="mostAds">
              Most advertisements
            </option>

            <option value="mostOrders">
              Most orders
            </option>
            <option value="highestSpending">Highest spending</option>
          </select>

        </div>

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="mt-3 text-sm font-bold text-blue-700 hover:text-blue-900"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Empty state */}
      {filteredAdvertisers.length === 0 ? (
        <div className="px-6 py-16 text-center">

          <div className="text-4xl">
            🔍
          </div>

          <p className="mt-4 font-bold text-slate-700">
            No advertisers found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Try a different business name, email or phone number.
          </p>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-900"
            >
              Clear Search
            </button>
          )}

        </div>
      ) : (
        /* Table */
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left">

            <thead className="bg-white">
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
  Financials
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

              {filteredAdvertisers.map((advertiser) => (
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
  <div className="flex flex-col gap-1">
    <span className="font-black text-slate-900">
      {advertiser._count.ads} total
    </span>

    <div className="flex flex-wrap gap-2 text-xs font-bold">
      <span className="rounded-full bg-green-50 px-2 py-1 text-green-700">
        {advertiser.activeAds} active
      </span>

      <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-700">
        {advertiser.pendingAds} pending
      </span>

      {advertiser.rejectedAds > 0 && (
        <span className="rounded-full bg-red-50 px-2 py-1 text-red-700">
          {advertiser.rejectedAds} rejected
        </span>
      )}
    </div>
  </div>
</td>
<td className="px-6 py-5">
  <div>
    <p className="font-black text-slate-900">
      ${advertiser.totalOrderValue.toFixed(2)}
    </p>

    <p className="mt-1 text-xs font-semibold text-green-600">
      ${advertiser.verifiedPayments.toFixed(2)} paid
    </p>

    {advertiser.pendingPayments > 0 && (
      <p className="mt-1 text-xs font-semibold text-amber-600">
        ${advertiser.pendingPayments.toFixed(2)} pending
      </p>
    )}
  </div>
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
  );
}