"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Subscription = {
  authenticated: boolean;
  isSeller: boolean;
  status: string;
  planName: string | null;
  amount: number;
  startsAt: string | null;
  expiresAt: string | null;
};

export default function SellerSubscriptionPage() {
  const router = useRouter();

  const [subscription, setSubscription] =
    useState<Subscription | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState("ecocash");

  const [paymentReference, setPaymentReference] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const response = await fetch(
          "/api/seller/subscription"
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/advertiser/dashboard/login");
            return;
          }

          throw new Error(
            data.error ||
              "Failed to load subscription"
          );
        }

        setSubscription(data);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load subscription."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, [router]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!paymentReference.trim()) {
      setError(
        "Please enter your payment reference."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        "/api/seller/subscription/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethod,
            paymentReference,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to submit subscription."
        );
      }

      setSuccess(
        "Your seller subscription has been submitted successfully. Your payment will be reviewed by our team before your seller account is activated."
      );

      setPaymentReference("");

      setSubscription((current) =>
        current
          ? {
              ...current,
              isSeller: false,
              status: "pending",
            }
          : current
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to submit subscription."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="mt-4 text-sm text-slate-600">
            Loading seller subscription...
          </p>
        </div>
      </main>
    );
  }

  if (!subscription) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">
            Unable to load your subscription.
          </p>
        </div>
      </main>
    );
  }

  if (subscription.isSeller) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                ✓
              </div>

              <h1 className="mt-5 text-3xl font-bold text-slate-950">
                You're a ZBM Seller
              </h1>

              <p className="mt-3 text-slate-600">
                Your seller subscription is active.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Monthly subscription
                </span>

                <span className="text-2xl font-bold text-slate-950">
                  $50
                </span>
              </div>

              {subscription.expiresAt && (
                <div className="mt-4 border-t border-slate-200 pt-4 text-sm text-slate-600">
                  Renews/expires on{" "}
                  <strong className="text-slate-950">
                    {new Date(
                      subscription.expiresAt
                    ).toLocaleDateString()}
                  </strong>
                </div>
              )}
            </div>

            <Link
              href="/advertiser/products"
              className="mt-8 flex w-full items-center justify-center rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Manage My Products →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (subscription.status === "pending") {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">
                ⏳
              </div>

              <h1 className="mt-5 text-3xl font-bold text-slate-950">
                Payment Under Review
              </h1>

              <p className="mt-3 leading-7 text-slate-600">
                We've received your seller subscription
                request. Your payment will be verified by
                our team before your seller account is
                activated.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-6">
              <p className="text-sm text-slate-500">
                Seller Membership
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-950">
                $50
                <span className="text-sm font-medium text-slate-500">
                  {" "}
                  / month
                </span>
              </p>
            </div>

            <Link
              href="/advertiser/dashboard"
              className="mt-8 flex w-full items-center justify-center rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <Link
            href="/advertiser/dashboard"
            className="text-sm font-medium text-slate-500 hover:text-slate-950"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-8 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            🛍️ ZBM Seller Membership
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950">
            Start Selling on Zim Digital Billboards
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Reach customers across Zimbabwe and let them
            contact you directly about your products.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* BENEFITS */}
          <div className="rounded-3xl bg-slate-950 p-8 text-white sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Seller Membership
            </p>

            <div className="mt-3 flex items-end gap-2">
              <span className="text-5xl font-bold">
                $50
              </span>

              <span className="pb-2 text-slate-400">
                / month
              </span>
            </div>

            <div className="mt-8 space-y-5">
              {[
                "List your products on Shop Zimbabwe",
                "Upload product images",
                "Manage your product listings",
                "Update prices and stock",
                "Receive customer enquiries",
                "Connect directly with buyers on WhatsApp",
              ].map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 text-green-400">
                    ✓
                  </span>

                  <span className="text-sm leading-6 text-slate-300">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold">
                Important
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your seller access will only be activated
                after your $50 payment has been verified.
              </p>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-slate-950">
              Submit Payment
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Make your $50 payment, then enter the
              payment details below.
            </p>

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-700">
                {success}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Payment Method
                </label>

                <select
                  value={paymentMethod}
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="ecocash">
                    EcoCash
                  </option>

                  <option value="bank">
                    Bank Transfer
                  </option>

                  <option value="cash">
                    Cash
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Payment Reference
                </label>

                <input
                  type="text"
                  value={paymentReference}
                  onChange={(event) =>
                    setPaymentReference(
                      event.target.value
                    )
                  }
                  placeholder="e.g. EcoCash transaction ID"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Enter the transaction/reference number
                  from your payment.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Seller Membership
                  </span>

                  <span className="font-bold text-slate-950">
                    $50 / month
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Seller Subscription"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}