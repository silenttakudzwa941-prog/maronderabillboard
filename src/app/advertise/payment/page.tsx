
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

const packages = {
  starter: {
    name: "Starter",
    price: 5,
    duration: 7,
    advertisements: 1,
  },
  business: {
    name: "Business",
    price: 12,
    duration: 14,
    advertisements: 3,
  },
  premium: {
    name: "Premium",
    price: 25,
    duration: 30,
    advertisements: 10,
  },
};

const socialPlatformPricing = {
  facebook: 10,
  instagram: 10,
  tiktok: 15,
  whatsapp: 5,
};

type AdvertisementData = {
  packageId: string;
  businessName: string;
  advertisementTitle: string;
  description: string;
  whatsapp: string;
  advertisementType: "image" | "video";
  location: string;
  startDate: string;
  endDate: string;
  mediaFileName: string | null;
  mediaUrl: string;
mediaType: "image" | "video";
  socialPlatforms?: string[];
  socialMediaTotal?: number;
  campaignManagementFee?: number;
  totalPrice?: number;
};

function AdvertisementPaymentContent() {
  const searchParams = useSearchParams();

  const packageId = searchParams.get("package") || "starter";

  const selectedPackage =
    packages[packageId as keyof typeof packages] || packages.starter;

  const [advertisement, setAdvertisement] =
    useState<AdvertisementData | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<
    "ecocash" | "bank" | "cash"
  >("ecocash");

  const [paymentReference, setPaymentReference] = useState("");

  const [submitted, setSubmitted] = useState(false);

const [orderNumber, setOrderNumber] = useState("");

const [submitting, setSubmitting] = useState(false);

const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem(
      "marondera-billboard-advertisement"
    );

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        const safeAdvertisement: AdvertisementData = {
          ...parsed,
          socialPlatforms: Array.isArray(parsed.socialPlatforms)
            ? parsed.socialPlatforms
            : [],
          socialMediaTotal:
            typeof parsed.socialMediaTotal === "number"
              ? parsed.socialMediaTotal
              : 0,
          campaignManagementFee:
            typeof parsed.campaignManagementFee === "number"
              ? parsed.campaignManagementFee
              : 0,
          totalPrice:
            typeof parsed.totalPrice === "number"
              ? parsed.totalPrice
              : selectedPackage.price,
        };

        setAdvertisement(safeAdvertisement);
      } catch {
        setAdvertisement(null);
      }
    }
  }, [selectedPackage.price]);

  const socialPlatforms = advertisement?.socialPlatforms ?? [];

  const calculateSocialMediaTotal = () => {
    return socialPlatforms.reduce((total, platform) => {
      const price =
        socialPlatformPricing[
          platform as keyof typeof socialPlatformPricing
        ];

      return total + (price || 0);
    }, 0);
  };

  const socialMediaTotal =
    advertisement?.socialMediaTotal ?? calculateSocialMediaTotal();

  const campaignManagementFee =
    advertisement?.campaignManagementFee ??
    (socialPlatforms.length > 0 ? 5 : 0);

  const totalPrice =
    advertisement?.totalPrice ??
    selectedPackage.price +
      socialMediaTotal +
      campaignManagementFee;

  const handleSubmit = async () => {
  if (!paymentReference.trim()) {
    setSubmitError("Please enter your payment reference.");
    return;
  }

  setSubmitting(true);
  setSubmitError("");

  try {
  const response = await fetch("/api/orders", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
  packageId,

  businessName:
    advertisementData.businessName,

  advertisementTitle:
    advertisementData.advertisementTitle,

  description:
    advertisementData.description,

  whatsapp:
    advertisementData.whatsapp,

  advertisementType:
    advertisementData.advertisementType,

  location:
    advertisementData.location,

  startDate:
    advertisementData.startDate,

  endDate:
    advertisementData.endDate,

  mediaUrl:
    advertisementData.mediaUrl,

  mediaType:
    advertisementData.mediaType,

  socialPlatforms,

  paymentMethod,

  paymentReference:
    paymentReference.trim(),
}),
  });

 

  // continue with the rest of your existing code...
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = `/advertiser/login?redirect=${encodeURIComponent(
          window.location.pathname + window.location.search
        )}`;

        return;
      }

      throw new Error(
        data.error || "Failed to submit your order."
      );
    }

    /*
     * Keep a local copy for the success screen only.
     * The real order now exists in the database.
     */
    sessionStorage.setItem(
      "marondera-billboard-order",
      JSON.stringify({
        ...advertisement,
        packageId,
        packageName: selectedPackage.name,
        amount: data.order.totalPrice,
        socialPlatforms,
        socialMediaTotal: data.order.socialMediaTotal,
        campaignManagementFee:
          data.order.campaignManagementFee,
        totalPrice: data.order.totalPrice,
        paymentMethod,
        paymentReference: data.payment.paymentReference,
        submittedAt: data.order.createdAt,
        status: data.order.status,
        orderNumber: data.order.orderNumber,
        databaseOrderId: data.order.id,
      })
    );

    setOrderNumber(data.order.orderNumber);
    setSubmitted(true);
  } catch (error) {
    console.error("Payment submission error:", error);

    setSubmitError(
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again."
    );
  } finally {
    setSubmitting(false);
  }
};
  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        {/* HEADER */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900 font-black text-white">
                MB
              </div>

              <div>
                <div className="text-lg font-black text-blue-900">
                  MaronderaBillboard
                </div>

                <div className="text-xs text-slate-500">
                  Your Local Advertising Platform
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* SUCCESS */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
              ✓
            </div>

            <div className="mt-6 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-800">
              Advertisement Submitted
            </div>

            <h1 className="mt-5 text-4xl font-black text-blue-950">
              We've Received Your Advertisement!
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-500">
              Your advertisement has been submitted successfully and is
              waiting for payment verification and approval.
            </p>

            {/* ORDER CARD */}
            <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-7 text-left shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                <div>
                  <div className="text-xs font-black uppercase tracking-wide text-slate-400">
                    Order Reference
                  </div>

                  <div className="mt-1 text-xl font-black text-blue-900">
                    {orderNumber}
                  </div>
                </div>

                <div className="rounded-full bg-yellow-100 px-4 py-2 text-xs font-black text-yellow-800">
                  PENDING
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Business</span>

                  <span className="text-right font-bold text-slate-800">
                    {advertisement?.businessName}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Advertisement</span>

                  <span className="text-right font-bold text-slate-800">
                    {advertisement?.advertisementTitle}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Package</span>

                  <span className="font-bold text-slate-800">
                    {selectedPackage.name}
                  </span>
                </div>

                <div>
                  <div className="text-slate-500">
                    Advertising Platforms
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-900">
                      🖥️ MaronderaBillboard
                    </span>

                    {socialPlatforms.map((platform) => (
                      <span
                        key={platform}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700"
                      >
                        {platform === "facebook" && "📘 Facebook"}
                        {platform === "instagram" && "📸 Instagram"}
                        {platform === "tiktok" && "🎵 TikTok"}
                        {platform === "whatsapp" && "💬 WhatsApp"}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Location</span>

                  <span className="font-bold text-slate-800">
                    {advertisement?.location}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Advertising Period
                  </span>

                  <span className="font-bold text-slate-800">
                    {advertisement?.startDate} →{" "}
                    {advertisement?.endDate}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Payment Method
                  </span>

                  <span className="font-bold capitalize text-slate-800">
                    {paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between border-t border-slate-200 pt-4">
                  <span className="font-black text-blue-950">
                    Amount
                  </span>

                  <span className="text-2xl font-black text-blue-900">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="rounded-xl bg-blue-900 px-7 py-4 font-black text-white transition hover:bg-blue-800"
              >
                Back to Home
              </Link>

              <Link
                href="/advertise"
                className="rounded-xl bg-slate-200 px-7 py-4 font-black text-blue-900 transition hover:bg-slate-300"
              >
                Create Another Advertisement
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-slate-950 px-6 py-8 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} MaronderaBillboard. All rights
          reserved.
        </footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900 font-black text-white">
              MB
            </div>

            <div>
              <div className="text-lg font-black text-blue-900">
                MaronderaBillboard
              </div>

              <div className="text-xs text-slate-500">
                Your Local Advertising Platform
              </div>
            </div>
          </Link>

          <Link
            href={`/advertise/create?package=${packageId}`}
            className="text-sm font-bold text-slate-600 hover:text-blue-900"
          >
            ← Edit Advertisement
          </Link>
        </div>
      </header>

      {/* INTRO */}
      <section className="px-6 pb-8 pt-14">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-900">
            💳 Step 3 of 3
          </div>

          <h1 className="mt-5 text-4xl font-black text-blue-950 md:text-5xl">
            Review & Payment
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-500">
            Review your advertisement details and complete your payment
            to submit your advertisement.
          </p>
        </div>
      </section>

      {/* PROGRESS */}
      <section className="px-6 pb-10">
        <div className="mx-auto flex max-w-3xl items-center justify-center">
          <div className="flex items-center text-blue-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 font-black text-white">
              ✓
            </div>

            <span className="ml-3 hidden text-sm font-bold sm:block">
              Package
            </span>
          </div>

          <div className="mx-4 h-px w-12 bg-blue-900 sm:w-24" />

          <div className="flex items-center text-blue-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 font-black text-white">
              ✓
            </div>

            <span className="ml-3 hidden text-sm font-bold sm:block">
              Advertisement
            </span>
          </div>

          <div className="mx-4 h-px w-12 bg-blue-900 sm:w-24" />

          <div className="flex items-center text-blue-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 font-black text-white">
              3
            </div>

            <span className="ml-3 text-sm font-bold">
              Payment
            </span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* LEFT */}
          <div className="space-y-8">
            {/* ADVERTISEMENT SUMMARY */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                <div>
                  <div className="text-xs font-black uppercase tracking-wide text-slate-400">
                    Advertisement
                  </div>

                  <h2 className="mt-1 text-2xl font-black text-blue-950">
                    {advertisement?.advertisementTitle ||
                      "Advertisement"}
                  </h2>
                </div>

                <div className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-900">
                  {selectedPackage.name}
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Business
                  </div>

                  <div className="mt-1 font-bold text-slate-800">
                    {advertisement?.businessName || "Not provided"}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    WhatsApp
                  </div>

                  <div className="mt-1 font-bold text-slate-800">
                    {advertisement?.whatsapp || "Not provided"}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Location
                  </div>

                  <div className="mt-1 font-bold text-slate-800">
                    📍 {advertisement?.location || "Not selected"}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Media
                  </div>

                  <div className="mt-1 font-bold text-slate-800">
                    {advertisement?.advertisementType === "video"
                      ? "🎥 Video"
                      : "🖼️ Image"}
                  </div>
                </div>

                {/* ADVERTISING PLATFORMS */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Advertising Platforms
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-900">
                      🖥️ MaronderaBillboard
                    </span>

                    {socialPlatforms.map((platform) => (
                      <span
                        key={platform}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700"
                      >
                        {platform === "facebook" && "📘 Facebook"}
                        {platform === "instagram" && "📸 Instagram"}
                        {platform === "tiktok" && "🎵 TikTok"}
                        {platform === "whatsapp" && "💬 WhatsApp"}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Start Date
                  </div>

                  <div className="mt-1 font-bold text-slate-800">
                    {advertisement?.startDate || "Not selected"}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    End Date
                  </div>

                  <div className="mt-1 font-bold text-slate-800">
                    {advertisement?.endDate || "Not calculated"}
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="mt-6 border-t border-slate-200 pt-6">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Description
                </div>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {advertisement?.description ||
                    "No description provided."}
                </p>
              </div>

              {/* MEDIA FILE */}
              {advertisement?.mediaFileName && (
                <div className="mt-6 rounded-xl bg-slate-50 p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Uploaded Media
                  </div>

                  <div className="mt-1 font-bold text-blue-900">
                    {advertisement.mediaFileName}
                  </div>
                </div>
              )}
            </div>

            {/* PAYMENT */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div>
                <h2 className="text-2xl font-black text-blue-950">
                  Payment Method
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select how you would like to pay for your
                  advertisement.
                </p>
              </div>

              {/* METHODS */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {/* ECOCASH */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("ecocash")}
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    paymentMethod === "ecocash"
                      ? "border-green-500 bg-green-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="text-2xl">📱</div>

                  <div className="mt-3 font-black text-blue-950">
                    EcoCash
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    Mobile payment
                  </div>
                </button>

                {/* BANK */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank")}
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    paymentMethod === "bank"
                      ? "border-blue-700 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="text-2xl">🏦</div>

                  <div className="mt-3 font-black text-blue-950">
                    Bank Transfer
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    Direct bank payment
                  </div>
                </button>

                {/* CASH */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    paymentMethod === "cash"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="text-2xl">💵</div>

                  <div className="mt-3 font-black text-blue-950">
                    Cash
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    Pay in person
                  </div>
                </button>
              </div>

              {/* PAYMENT INSTRUCTIONS */}
              <div className="mt-6 rounded-2xl bg-slate-50 p-6">
                {paymentMethod === "ecocash" && (
                  <>
                    <div className="font-black text-blue-950">
                      EcoCash Payment
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Send{" "}
                      <strong>
                        ${totalPrice.toFixed(2)}
                      </strong>{" "}
                      to the MaronderaBillboard EcoCash number.
                    </p>

                    <div className="mt-4 rounded-xl bg-white p-4">
                      <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        EcoCash Number
                      </div>

                      <div className="mt-1 text-xl font-black text-green-600">
                        077 XXX XXXX
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === "bank" && (
                  <>
                    <div className="font-black text-blue-950">
                      Bank Transfer
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Transfer{" "}
                      <strong>
                        ${totalPrice.toFixed(2)}
                      </strong>{" "}
                      to the MaronderaBillboard bank account.
                    </p>

                    <div className="mt-4 space-y-3 rounded-xl bg-white p-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Bank
                        </span>

                        <span className="font-bold">
                          Your Bank
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Account Name
                        </span>

                        <span className="font-bold">
                          MaronderaBillboard
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Account Number
                        </span>

                        <span className="font-bold">
                          XXXX XXXX XXXX
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === "cash" && (
                  <>
                    <div className="font-black text-blue-950">
                      Cash Payment
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      You can pay the{" "}
                      <strong>
                        ${totalPrice.toFixed(2)}
                      </strong>{" "}
                      advertising fee in person. Your advertisement
                      will remain pending until payment is verified.
                    </p>
                  </>
                )}
              </div>
              {submitError && (
  <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
    {submitError}
  </div>
)}

              {/* REFERENCE */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Payment Reference *
                </label>

                <input
                  type="text"
                  value={paymentReference}
                  onChange={(event) =>
                    setPaymentReference(event.target.value)
                  }
                  placeholder="e.g. EcoCash transaction reference"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Enter the transaction/reference number you
                  received after payment.
                </p>
              </div>

              {/* SUBMIT */}
              <button
  type="button"
  onClick={handleSubmit}
  disabled={submitting}
  className="mt-8 w-full rounded-xl bg-yellow-400 px-6 py-4 text-lg font-black text-blue-950 shadow-lg transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
>
  {submitting
    ? "Submitting Order..."
    : "Confirm Advertisement & Submit →"}
</button>

              <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                Your advertisement will be reviewed after payment
                verification.
              </p>
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-blue-950 p-6 text-white">
                <div className="text-sm font-bold text-blue-200">
                  Order Summary
                </div>

                <div className="mt-2 text-2xl font-black">
                  {selectedPackage.name} Package
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* BASE PACKAGE */}
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">
                      MaronderaBillboard
                    </span>

                    <span className="text-sm font-bold text-slate-800">
                      ${selectedPackage.price.toFixed(2)}
                    </span>
                  </div>

                  {/* SOCIAL PLATFORMS */}
                  {socialPlatforms.map((platform) => {
                    const price =
                      socialPlatformPricing[
                        platform as keyof typeof socialPlatformPricing
                      ] || 0;

                    return (
                      <div
                        key={platform}
                        className="flex justify-between"
                      >
                        <span className="flex items-center gap-2 text-sm text-slate-500">
                          {platform === "facebook" && (
                            <>
                              <FaFacebook className="text-[#1877F2]" />
                              Facebook
                            </>
                          )}

                          {platform === "instagram" && (
                            <>
                              <FaInstagram className="text-[#E4405F]" />
                              Instagram
                            </>
                          )}

                          {platform === "tiktok" && (
                            <>
                              <FaTiktok className="text-black" />
                              TikTok
                            </>
                          )}

                          {platform === "whatsapp" && (
                            <>
                              <FaWhatsapp className="text-[#25D366]" />
                              WhatsApp
                            </>
                          )}
                        </span>

                        <span className="text-sm font-bold text-slate-800">
                          ${price.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}

                  {/* MANAGEMENT FEE */}
                  {socialPlatforms.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">
                        Campaign Management
                      </span>

                      <span className="text-sm font-bold text-slate-800">
                        ${campaignManagementFee.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* TOTAL */}
                <div className="mt-6 border-t border-slate-200 pt-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-500">
                        Total
                      </div>

                      <div className="mt-1 text-xs text-slate-400">
                        Advertising package
                      </div>
                    </div>

                    <div className="text-4xl font-black text-blue-900">
                      ${totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* TRUST */}
                <div className="mt-6 rounded-2xl bg-green-50 p-4">
                  <div className="font-black text-green-800">
                    🔒 Secure Submission
                  </div>

                  <p className="mt-1 text-xs leading-5 text-green-700">
                    Your advertisement will only go live after payment
                    verification and approval.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 px-6 py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} MaronderaBillboard. All rights
        reserved.
      </footer>
    </main>
  );
}

export default function AdvertisementPayment() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdvertisementPaymentContent />
    </Suspense>
  );
}

