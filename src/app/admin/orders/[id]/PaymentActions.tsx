"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PaymentActionsProps = {
  orderId: string;
  paymentId: string;
  currentPaymentStatus: string;
};

export default function PaymentActions({
  orderId,
  paymentId,
  currentPaymentStatus,
}: PaymentActionsProps) {
  const router = useRouter();

  const [loading, setLoading] = useState<
    "verified" | "rejected" | null
  >(null);

  const [error, setError] = useState("");

  async function updatePaymentStatus(
    status: "verified" | "rejected"
  ) {
    const confirmed = window.confirm(
      status === "verified"
        ? "Are you sure you want to verify this payment?"
        : "Are you sure you want to reject this payment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(status);
      setError("");

      const response = await fetch(
        `/api/admin/orders/${encodeURIComponent(
          orderId
        )}/payment`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentId,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update payment status."
        );
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Payment status update error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update payment status."
      );
    } finally {
      setLoading(null);
    }
  }

  const status = currentPaymentStatus.toLowerCase();

  return (
    <div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() =>
            updatePaymentStatus("verified")
          }
          disabled={loading !== null}
          className="rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading === "verified"
            ? "Verifying..."
            : "✓ Verify Payment"}
        </button>

        <button
          onClick={() =>
            updatePaymentStatus("rejected")
          }
          disabled={loading !== null}
          className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading === "rejected"
            ? "Rejecting..."
            : "✕ Reject Payment"}
        </button>
      </div>

      {error && (
        <p className="mt-4 text-sm font-semibold text-red-600">
          {error}
        </p>
      )}

      {status === "verified" && (
        <p className="mt-4 text-sm font-semibold text-green-600">
          ✓ This payment has been verified.
        </p>
      )}

      {status === "rejected" && (
        <p className="mt-4 text-sm font-semibold text-red-600">
          ✕ This payment has been rejected.
        </p>
      )}
    </div>
  );
}