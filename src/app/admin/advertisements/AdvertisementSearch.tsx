"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Advertisement = {
  id: string;
  title: string;
  mediaType: string;
  category: string;
  status: string;
  views: number;
  createdAt: Date | string;
  advertiser: {
    id: string;
    businessName: string;
    email: string;
  };
};

type AdvertisementSearchProps = {
  advertisements: Advertisement[];
};

export default function AdvertisementSearch({
  advertisements,
}: AdvertisementSearchProps) {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "active" | "rejected"
  >("all");

  useEffect(() => {
    const status = searchParams.get("status");

    if (
      status === "pending" ||
      status === "active" ||
      status === "rejected"
    ) {
      setStatusFilter(status);
    } else {
      setStatusFilter("all");
    }
  }, [searchParams]);

  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "mostViews" | "leastViews"
  >("newest");

  const filteredAdvertisements = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    const filtered = advertisements.filter((ad) => {
      const matchesSearch =
        !searchTerm ||
        ad.title.toLowerCase().includes(searchTerm) ||
        ad.category.toLowerCase().includes(searchTerm) ||
        ad.advertiser.businessName
          .toLowerCase()
          .includes(searchTerm) ||
        ad.advertiser.email
          .toLowerCase()
          .includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" ||
        ad.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      }

      if (sortBy === "mostViews") {
        return b.views - a.views;
      }

      if (sortBy === "leastViews") {
        return a.views - b.views;
      }

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });
  }, [advertisements, search, statusFilter, sortBy]);

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              All Advertisements
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search, filter and review advertisements submitted to the platform.
            </p>
          </div>

          <div className="text-sm font-semibold text-slate-500">
            Showing{" "}
            <span className="font-black text-blue-950">
              {filteredAdvertisements.length}
            </span>{" "}
            of{" "}
            <span className="font-black text-blue-950">
              {advertisements.length}
            </span>
          </div>

        </div>
      </div>

      {/* Search */}
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">

        <div className="flex flex-col gap-4 lg:flex-row">

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
              placeholder="Search by title, advertiser, email or category..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target.value as
                  | "newest"
                  | "oldest"
                  | "mostViews"
                  | "leastViews"
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

            <option value="mostViews">
              Most views
            </option>

            <option value="leastViews">
              Least views
            </option>
          </select>

        </div>

        {/* Status filters */}
        <div className="mt-4 flex flex-wrap gap-2">

          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              statusFilter === "all"
                ? "bg-blue-950 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            All ({advertisements.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("pending")}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              statusFilter === "pending"
                ? "bg-amber-500 text-white"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            Pending (
            {
              advertisements.filter(
                (ad) =>
                  ad.status.toLowerCase() === "pending"
              ).length
            }
            )
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("active")}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              statusFilter === "active"
                ? "bg-green-600 text-white"
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            Active (
            {
              advertisements.filter(
                (ad) =>
                  ad.status.toLowerCase() === "active"
              ).length
            }
            )
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("rejected")}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              statusFilter === "rejected"
                ? "bg-red-600 text-white"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            Rejected (
            {
              advertisements.filter(
                (ad) =>
                  ad.status.toLowerCase() === "rejected"
              ).length
            }
            )
          </button>

        </div>

        {(search || statusFilter !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
            }}
            className="mt-4 text-sm font-bold text-blue-700 hover:text-blue-900"
          >
            Clear filters
          </button>
        )}

      </div>

      {/* Empty state */}
      {filteredAdvertisements.length === 0 ? (
        <div className="px-6 py-16 text-center">

          <div className="text-4xl">
            🔍
          </div>

          <p className="mt-4 font-bold text-slate-700">
            No advertisements found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Try changing your search or filters.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
            }}
            className="mt-5 rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-900"
          >
            Clear Filters
          </button>

        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px] text-left">

            <thead className="bg-slate-50">
              <tr>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Advertisement
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Advertiser
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

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Action
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredAdvertisements.map((ad) => {
                const status = ad.status.toLowerCase();

                return (
                  <tr
                    key={ad.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* Advertisement */}
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-900">
                        {ad.title}
                      </p>

                      <p className="mt-1 text-xs uppercase text-slate-400">
                        {ad.mediaType}
                      </p>
                    </td>

                    {/* Advertiser */}
                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-700">
                        {ad.advertiser.businessName}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {ad.advertiser.email}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {ad.category}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          status === "active"
                            ? "bg-green-100 text-green-700"
                            : status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {ad.status}
                      </span>
                    </td>

                    {/* Views */}
                    <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                      {ad.views}
                    </td>

                    {/* Created */}
                    <td className="px-6 py-5 text-sm text-slate-500">
                      {new Date(
                        ad.createdAt
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-5">
                      <Link
                        href={`/admin/advertisements/${ad.id}`}
                        className="inline-flex rounded-lg bg-blue-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-900"
                      >
                        Review
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