"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AdvertisementActionsProps = {
  advertisementId: string;
  currentStatus: string;
};

export default function AdvertisementActions({
  advertisementId,
  currentStatus,
}: AdvertisementActionsProps) {
  const router = useRouter();

  const [loading, setLoading] = useState<
    "active" | "rejected" | null
  >(null);

  const [error, setError] = useState("");

  async function updateStatus(
    status: "active" | "rejected"
  ) {
    const confirmed = window.confirm(
      status === "active"
        ? "Are you sure you want to approve this advertisement?"
        : "Are you sure you want to reject this advertisement?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(status);
      setError("");

      const response = await fetch(
        `/api/admin/advertisements/${advertisementId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update advertisement."
        );
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Advertisement status update error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update advertisement."
      );
    } finally {
      setLoading(null);
    }
  }

  const status = currentStatus.toLowerCase();

  return (
    <div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">

        <button
          onClick={() => updateStatus("active")}
          disabled={loading !== null}
          className="rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading === "active"
            ? "Approving..."
            : "✓ Approve Advertisement"}
        </button>

        <button
          onClick={() => updateStatus("rejected")}
          disabled={loading !== null}
          className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading === "rejected"
            ? "Rejecting..."
            : "✕ Reject Advertisement"}
        </button>

      </div>

      {error && (
        <p className="mt-4 text-sm font-semibold text-red-600">
          {error}
        </p>
      )}

      {status === "active" && (
        <p className="mt-4 text-sm font-semibold text-green-600">
          ✓ This advertisement is currently active.
        </p>
      )}

      {status === "rejected" && (
        <p className="mt-4 text-sm font-semibold text-red-600">
          ✕ This advertisement is currently rejected.
        </p>
      )}
    </div>
  );
}