"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Subscription = {
  id: string;
  planName: string;
  amount: string | number;
  status: string;
  paymentMethod: string | null;
  paymentReference: string | null;
  startsAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  advertiser: {
    id: string;
    businessName: string;
    email: string;
    phone: string;
  };
};

export default function AdminSellerSubscriptionsPage() {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>([]);

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/seller-subscriptions"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load subscriptions."
        );
      }

      setSubscriptions(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load subscriptions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const updateSubscription = async (
    subscriptionId: string,
    action: "activate" | "reject"
  ) => {
    const confirmed = window.confirm(
      action === "activate"
        ? "Verify this payment and activate the seller for 30 days?"
        : "Reject this seller subscription payment?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(subscriptionId);
      setError("");

      const response = await fetch(
        "/api/admin/seller-subscriptions",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subscriptionId,
            action,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update subscription."
        );
      }

      await loadSubscriptions();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update subscription."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = subscriptions.filter(
    (subscription) =>
      subscription.status === "pending"
  ).length;

  const activeCount = subscriptions.filter(
    (subscription) =>
      subscription.status === "active" &&
      subscription.expiresAt &&
      new Date(subscription.expiresAt) >
        new Date()
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm font-medium text-slate-500 hover:text-slate-950"
            >
              ← Back to Admin Dashboard
            </Link>

            <h1 className="mt-4 text-3xl font-bold text-slate-950">
              Seller Subscriptions
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Review $50/month seller membership
              payments and manage marketplace access.
            </p>
          </div>

          <button
            onClick={loadSubscriptions}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            Refresh
          </button>
        </div>

        {/* STATS */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Applications
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {subscriptions.length}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm text-amber-700">
              Pending Review
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-900">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <p className="text-sm text-green-700">
              Active Sellers
            </p>

            <p className="mt-2 text-3xl font-bold text-green-900">
              {activeCount}
            </p>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* CONTENT */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

              <p className="mt-4 text-sm text-slate-500">
                Loading seller subscriptions...
              </p>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl">🛍️</div>

              <h2 className="mt-4 text-xl font-bold text-slate-950">
                No seller applications yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Seller subscription requests will
                appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {subscriptions.map((subscription) => {
                const isPending =
                  subscription.status === "pending";

                const isActive =
                  subscription.status === "active" &&
                  subscription.expiresAt &&
                  new Date(
                    subscription.expiresAt
                  ) > new Date();

                return (
                  <div
                    key={subscription.id}
                    className="p-6"
                  >
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                      {/* SELLER */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-lg font-bold text-slate-950">
                            {
                              subscription.advertiser
                                .businessName
                            }
                          </h2>

                          {isPending && (
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                              Pending
                            </span>
                          )}

                          {isActive && (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                              Active
                            </span>
                          )}

                          {subscription.status ===
                            "rejected" && (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800">
                              Rejected
                            </span>
                          )}

                          {subscription.status ===
                            "expired" && (
                            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700">
                              Expired
                            </span>
                          )}
                        </div>

                        <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                          <p>
                            <strong className="text-slate-800">
                              Email:
                            </strong>{" "}
                            {
                              subscription.advertiser
                                .email
                            }
                          </p>

                          <p>
                            <strong className="text-slate-800">
                              Phone:
                            </strong>{" "}
                            {
                              subscription.advertiser
                                .phone
                            }
                          </p>

                          <p>
                            <strong className="text-slate-800">
                              Plan:
                            </strong>{" "}
                            {subscription.planName}
                          </p>

                          <p>
                            <strong className="text-slate-800">
                              Amount:
                            </strong>{" "}
                            $
                            {Number(
                              subscription.amount
                            ).toFixed(2)}
                          </p>

                          <p>
                            <strong className="text-slate-800">
                              Payment:
                            </strong>{" "}
                            {subscription.paymentMethod ||
                              "—"}
                          </p>

                          <p>
                            <strong className="text-slate-800">
                              Reference:
                            </strong>{" "}
                            <span className="font-mono">
                              {subscription.paymentReference ||
                                "—"}
                            </span>
                          </p>
                        </div>

                        {subscription.startsAt && (
                          <p className="mt-4 text-xs text-slate-500">
                            Started:{" "}
                            {new Date(
                              subscription.startsAt
                            ).toLocaleDateString()}
                            {" • "}
                            Expires:{" "}
                            {subscription.expiresAt
                              ? new Date(
                                  subscription.expiresAt
                                ).toLocaleDateString()
                              : "—"}
                          </p>
                        )}
                      </div>

                      {/* ACTIONS */}
                      <div className="flex shrink-0 flex-col gap-3 sm:flex-row xl:flex-col">
                        {isPending && (
                          <>
                            <button
                              onClick={() =>
                                updateSubscription(
                                  subscription.id,
                                  "activate"
                                )
                              }
                              disabled={
                                processingId ===
                                subscription.id
                              }
                              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {processingId ===
                              subscription.id
                                ? "Processing..."
                                : "✓ Verify & Activate"}
                            </button>

                            <button
                              onClick={() =>
                                updateSubscription(
                                  subscription.id,
                                  "reject"
                                )
                              }
                              disabled={
                                processingId ===
                                subscription.id
                              }
                              className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {isActive && (
                          <Link
                            href={`/admin/advertisers/${subscription.advertiser.id}`}
                            className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            View Seller
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}