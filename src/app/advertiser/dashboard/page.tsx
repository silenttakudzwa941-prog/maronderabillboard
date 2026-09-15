"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Advertiser = {
  id: string;
  businessName: string;
  email: string;
  phone: string;
};

type DashboardStats = {
  totalAds: number;
  activeAds: number;
  pendingAds: number;
  rejectedAds: number;
  completedAds: number;
  totalViews: number;
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  totalSpent: number;
  pendingPayments: number;
  verifiedPayments: number;
};

type Advertisement = {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: string;
  duration: number | null;
  category: string;
  status: string;
  views: number;
  isFeatured: boolean;
  createdAt: string;
};

type Payment = {
  id: string;
  paymentMethod: string;
  paymentReference: string;
  amount: number;
  status: string;
  verifiedAt: string | null;
  createdAt: string;
};

type Order = {
  id: string;
  orderNumber: string;
  packageId: string;
  packageName: string;
  billboardPrice: number;
  socialMediaTotal: number;
  campaignManagementFee: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  payment: Payment | null;
};

export default function AdvertiserDashboard() {
  const router = useRouter();

  /*
   * IMPORTANT:
   * Create the Supabase browser client only once.
   * This prevents Safari/iOS from repeatedly creating
   * new clients during re-renders.
   */
  const [supabase] = useState(() => createClient());

  const [advertiser, setAdvertiser] =
    useState<Advertiser | null>(null);

  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [ads, setAds] =
    useState<Advertisement[]>([]);

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] = useState(true);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const [loadingMessage, setLoadingMessage] =
    useState("Checking your login session...");

  const [dashboardError, setDashboardError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setDashboardError("");
        setLoadingMessage("Checking your login session...");

        console.log("DASHBOARD: Starting load");

        /*
         * STEP 1
         * Check Supabase authentication.
         */
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        console.log("DASHBOARD AUTH USER:", user);
        console.log("DASHBOARD AUTH ERROR:", userError);

        if (cancelled) return;

        if (userError) {
          console.error(
            "DASHBOARD AUTH ERROR:",
            userError
          );

          setDashboardError(
            `Safari could not verify your login session: ${userError.message}`
          );

          return;
        }

        if (!user) {
          console.log("NO AUTH USER");

          setDashboardError(
            "Your login session could not be found. Please log in again."
          );

          return;
        }

        console.log(
          "AUTHENTICATED USER:",
          user.id
        );

        /*
         * STEP 2
         * Load advertiser profile.
         */
        setLoadingMessage(
          "Login confirmed. Loading your advertiser profile..."
        );

        console.log(
          "CALLING ADVERTISER PROFILE API..."
        );

        const controller = new AbortController();

        const timeout = setTimeout(() => {
          controller.abort();
        }, 10000);

        let response: Response;

        try {
          response = await fetch(
            "/api/advertiser/profile",
            {
              method: "GET",
              cache: "no-store",
              credentials: "include",
              signal: controller.signal,
            }
          );
        } finally {
          clearTimeout(timeout);
        }

        console.log(
          "PROFILE API STATUS:",
          response.status
        );

        if (cancelled) return;

        if (response.status === 401) {
          setDashboardError(
            "Your login session was not accepted by the server. Please log in again."
          );

          return;
        }

        if (!response.ok) {
          setDashboardError(
            `The advertiser profile could not be loaded. Server returned ${response.status}.`
          );

          return;
        }

        /*
         * STEP 3
         */
        setLoadingMessage(
          "Profile found. Loading your advertisements and orders..."
        );

        const data = await response.json();

        console.log(
          "PROFILE API DATA:",
          data
        );

        if (cancelled) return;

        if (
          !data ||
          !data.id ||
          !data.stats
        ) {
          setDashboardError(
            "The server returned incomplete advertiser information."
          );

          return;
        }

        /*
         * STEP 4
         * Store dashboard information.
         */
        setAdvertiser({
          id: data.id || user.id,
          businessName:
            data.businessName || "",
          email:
            data.email ||
            user.email ||
            "",
          phone:
            data.phone || "",
        });

        setStats(data.stats);

        setAds(
          Array.isArray(data.ads)
            ? data.ads
            : []
        );

        setOrders(
          Array.isArray(data.orders)
            ? data.orders
            : []
        );

        console.log(
          "DASHBOARD LOAD COMPLETE"
        );

        setLoadingMessage(
          "Dashboard loaded."
        );
      } catch (error) {
        console.error(
          "DASHBOARD LOAD ERROR:",
          error
        );

        if (cancelled) return;

        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          setDashboardError(
            "Safari took too long to connect to the advertiser profile server."
          );
        } else if (
          error instanceof Error
        ) {
          setDashboardError(
            `Dashboard error: ${error.message}`
          );
        } else {
          setDashboardError(
            "An unexpected error occurred while loading your dashboard."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await supabase.auth.signOut();

      router.replace(
        "/advertiser/login"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      setLoggingOut(false);
    }
  }

  function formatCurrency(
    amount: number
  ) {
    return `$${amount.toFixed(2)}`;
  }

  function formatDate(
    date: string
  ) {
    return new Date(
      date
    ).toLocaleDateString(
      "en-ZW",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  function statusClasses(
    status: string
  ) {
    switch (
      status.toLowerCase()
    ) {
      case "active":
      case "paid":
      case "verified":
      case "completed":
      case "confirmed":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-amber-100 text-amber-700";

      case "rejected":
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  }

  /*
   * LOADING SCREEN
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-900" />

            <h1 className="text-lg font-black text-blue-950">
              Loading your dashboard
            </h1>

            <p className="mt-3 text-sm font-medium text-slate-600">
              {loadingMessage}
            </p>

            <p className="mt-5 text-xs text-slate-400">
              Please wait while we connect your account.
            </p>

          </div>
        </div>
      </main>
    );
  }

  /*
   * ERROR SCREEN
   */
  if (
    !advertiser ||
    !stats
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl font-black text-red-600">
            !
          </div>

          <h1 className="mt-5 text-xl font-black text-blue-950">
            Unable to load dashboard
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {dashboardError ||
              "We couldn't load your advertiser information."}
          </p>

          <div className="mt-6 flex flex-col gap-3">

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="min-h-[48px] rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white active:scale-[0.98]"
            >
              Try Again
            </button>

            <Link
              href="/advertiser/login"
              className="flex min-h-[48px] items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700"
            >
              Return to Login
            </Link>

          </div>
        </div>
      </main>
    );
  }

  /*
   * YOUR EXISTING DASHBOARD UI STARTS HERE.
   */

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <Link
              href="/"
              className="text-2xl font-black tracking-tight text-blue-950"
            >
              ZimDigitalBillboard
            </Link>

            <p className="mt-1 text-sm text-slate-500">
              Advertising Portal
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="min-h-[44px] rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingOut
              ? "Logging out..."
              : "Logout"}
          </button>

        </div>
      </header>


      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Welcome */}
        <section className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
            Welcome back
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-blue-950 sm:text-4xl">
            {advertiser.businessName}
          </h1>

          <p className="mt-2 text-slate-600">
          Manage your advertising campaigns, orders and payments from one place.
          </p>
        </section>

        {/* Main statistics */}
        <section className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-500">
                Advertisements
              </p>

              <span className="text-2xl">📢</span>
            </div>

            <p className="mt-3 text-3xl font-black text-blue-950">
              {stats.totalAds}
            </p>

            <p className="mt-2 text-xs font-bold text-green-600">
              {stats.activeAds} active
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-500">
                Orders
              </p>

              <span className="text-2xl">📦</span>
            </div>

            <p className="mt-3 text-3xl font-black text-blue-950">
              {stats.totalOrders}
            </p>

            <p className="mt-2 text-xs font-bold text-amber-600">
              {stats.pendingOrders} pending
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-500">
                Total Views
              </p>

              <span className="text-2xl">👁️</span>
            </div>

            <p className="mt-3 text-3xl font-black text-blue-950">
              {stats.totalViews.toLocaleString()}
            </p>

            <p className="mt-2 text-xs font-bold text-slate-500">
              Across all advertisements
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-500">
                Total Spent
              </p>

              <span className="text-2xl">💳</span>
            </div>

            <p className="mt-3 text-3xl font-black text-blue-950">
              {formatCurrency(stats.totalSpent)}
            </p>

            <p className="mt-2 text-xs font-bold text-green-600">
              {stats.verifiedPayments} verified payments
            </p>
          </div>
        </section>

        {/* Business profile */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-black text-blue-950">
                Business Profile
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your registered advertiser information
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-900">
              Advertiser Account
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Business Name
              </p>

              <p className="mt-2 font-bold text-slate-900">
                {advertiser.businessName}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Email
              </p>

              <p className="mt-2 break-all font-bold text-slate-900">
                {advertiser.email}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Phone
              </p>

              <p className="mt-2 font-bold text-slate-900">
                {advertiser.phone}
              </p>
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-black text-blue-950">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your advertising activity.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Link
              href="/advertise"
              className="group rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                📢
              </div>

              <h3 className="mt-5 text-lg font-black text-blue-950">
                Create Advertisement
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Create a new billboard advertising campaign.
              </p>

              <div className="mt-5 text-sm font-black text-blue-700">
                Start advertising →
              </div>
            </Link>

            <Link
              href="#advertisements"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                📋
              </div>

              <h3 className="mt-5 text-lg font-black text-blue-950">
                My Advertisements
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                View the advertisements linked to your account.
              </p>

              <div className="mt-5 text-sm font-black text-blue-700">
                View advertisements →
              </div>
            </Link>

            <Link
              href="#orders"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                📦
              </div>

              <h3 className="mt-5 text-lg font-black text-blue-950">
                My Orders
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Track your advertising orders and payments.
              </p>

              <div className="mt-5 text-sm font-black text-blue-700">
                View orders →
              </div>
            </Link>
          </div>
        </section>

        {/* Advertisements */}
        <section
          id="advertisements"
          className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-black text-blue-950">
                My Advertisements
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Advertisements associated with your account.
              </p>
            </div>

            <div className="text-sm font-bold text-slate-500">
              {stats.totalAds} total
            </div>
          </div>

          {ads.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
              <div className="text-3xl">📢</div>

              <h3 className="mt-3 font-black text-blue-950">
                No advertisements yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create your first advertisement to get started.
              </p>

              <Link
                href="/advertise"
                className="mt-5 inline-block rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-900"
              >
                Create Advertisement
              </Link>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3 font-bold">Advertisement</th>
                    <th className="px-4 py-3 font-bold">Category</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 font-bold">Views</th>
                    <th className="px-4 py-3 font-bold">Created</th>
                  </tr>
                </thead>

                <tbody>
                  {ads.map((ad) => (
                    <tr
                      key={ad.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                    <td className="px-4 py-4">
  <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
  {ad.mediaType?.toLowerCase().includes("video") ? (
    <video
      src={ad.mediaUrl}
      controls
      playsInline
      preload="metadata"
      className="h-full w-full object-cover"
      onError={(event) => {
        console.error(
          "Advertisement video failed to load:",
          ad.mediaUrl,
          event
        );
      }}
    />
  ) : (
    <img
      src={ad.mediaUrl}
      alt={ad.title}
      className="h-full w-full object-cover"
      onError={(event) => {
        console.error(
          "Advertisement image failed to load:",
          ad.mediaUrl,
          event
        );
      }}
      onLoad={() => {
        console.log(
          "Advertisement image loaded:",
          ad.mediaUrl
        );
      }}
    />
  )}
</div>
</td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {ad.category}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${statusClasses(
                            ad.status
                          )}`}
                        >
                          {ad.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm font-bold text-slate-700">
                        {ad.views.toLocaleString()}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {formatDate(ad.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Orders */}
        <section
          id="orders"
          className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-black text-blue-950">
                My Orders
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your advertising orders and payment status.
              </p>
            </div>

            <div className="text-sm font-bold text-slate-500">
              {stats.totalOrders} total
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
              <div className="text-3xl">📦</div>

              <h3 className="mt-3 font-black text-blue-950">
                No orders yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your advertising orders will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3 font-bold">Order</th>
                    <th className="px-4 py-3 font-bold">Package</th>
                    <th className="px-4 py-3 font-bold">Amount</th>
                    <th className="px-4 py-3 font-bold">Order Status</th>
                    <th className="px-4 py-3 font-bold">Payment</th>
                    <th className="px-4 py-3 font-bold">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900">
                          {order.orderNumber}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {order.packageName}
                      </td>

                      <td className="px-4 py-4 font-bold text-slate-900">
                        {formatCurrency(order.totalPrice)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${statusClasses(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        {order.payment ? (
                          <div>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${statusClasses(
                                order.payment.status
                              )}`}
                            >
                              {order.payment.status}
                            </span>

                            <p className="mt-1 text-xs text-slate-500">
                              {order.payment.paymentMethod}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-400">
                            No payment
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Payment overview */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-blue-950">
              Payment Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Overview of your advertising payments.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-amber-50 p-5">
              <p className="text-sm font-bold text-amber-700">
                Pending Payments
              </p>

              <p className="mt-2 text-3xl font-black text-amber-900">
                {stats.pendingPayments}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-5">
              <p className="text-sm font-bold text-green-700">
                Verified Payments
              </p>

              <p className="mt-2 text-3xl font-black text-green-900">
                {stats.verifiedPayments}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-5">
              <p className="text-sm font-bold text-blue-700">
                Paid Orders
              </p>

              <p className="mt-2 text-3xl font-black text-blue-950">
                {stats.paidOrders}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}