import { redirect, notFound } from "next/navigation";
import Link from "next/link";

import { getAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

import AdvertisementActions from "./AdvertisementActions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminAdvertisementReviewPage({
  params,
}: PageProps) {
  const admin = await getAdmin();

  if (!admin) {
   redirect("/admin/login");
  }

  const { id } = await params;

  const ad = await prisma.ad.findUnique({
    where: {
      id,
    },
    include: {
      advertiser: {
        select: {
          id: true,
          businessName: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!ad) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              MaronderaBillboard
            </p>

            <h1 className="mt-1 text-3xl font-black text-blue-950">
              Review Advertisement
            </h1>

            <p className="mt-2 text-slate-500">
              Review this advertisement before approving or rejecting it.
            </p>
          </div>

          <Link
            href="/admin/advertisements"
            className="inline-flex w-fit items-center rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-900"
          >
            ← Advertisements
          </Link>
        </div>

        {/* Advertisement preview */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-900">
              Advertisement Preview
            </h2>
          </div>

          <div className="bg-slate-100 p-6">
            {ad.mediaType.toLowerCase().includes("video") ? (
              <video
                src={ad.mediaUrl}
                controls
                className="mx-auto max-h-[600px] w-full rounded-xl bg-black object-contain"
              />
            ) : (
              <img
                src={ad.mediaUrl}
                alt={ad.title}
                className="mx-auto max-h-[600px] w-full rounded-xl object-contain"
              />
            )}
          </div>

        </div>

        {/* Advertisement information */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">

          {/* Ad details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold text-slate-900">
              Advertisement Information
            </h2>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Title
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {ad.title}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Category
                </p>

                <p className="mt-1 text-slate-700">
                  {ad.category}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Media Type
                </p>

                <p className="mt-1 text-slate-700">
                  {ad.mediaType}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Duration
                </p>

                <p className="mt-1 text-slate-700">
                  {ad.duration
                    ? `${ad.duration} seconds`
                    : "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Views
                </p>

                <p className="mt-1 text-slate-700">
                  {ad.views}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Submitted
                </p>

                <p className="mt-1 text-slate-700">
                  {new Date(ad.createdAt).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Current Status
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                    ad.status.toLowerCase() === "active"
                      ? "bg-green-100 text-green-700"
                      : ad.status.toLowerCase() === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {ad.status}
                </span>
              </div>

            </div>
          </div>

          {/* Advertiser */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold text-slate-900">
              Advertiser
            </h2>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Business Name
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {ad.advertiser.businessName}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-1 text-slate-700">
                  {ad.advertiser.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Phone
                </p>

                <p className="mt-1 text-slate-700">
                  {ad.advertiser.phone}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Advertiser ID
                </p>

                <p className="mt-1 break-all font-mono text-xs text-slate-500">
                  {ad.advertiser.id}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Action area */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold text-slate-900">
            Review Decision
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Approve this advertisement to make it active, or reject it if
            it does not meet the platform requirements.
          </p>

          <AdvertisementActions
            advertisementId={ad.id}
            currentStatus={ad.status}
          />

        </div>

      </div>
    </main>
  );
}