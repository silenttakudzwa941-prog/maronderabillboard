"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const packages = [
  {
    id: "starter",
    name: "Starter",
    price: 5,
    duration: "7 Days",
    advertisements: "1 Advertisement",
    description: "Perfect for individuals and small businesses.",
    features: [
      "1 advertisement",
      "7 days advertising",
      "Image or video",
      "WhatsApp contact",
    ],
    popular: false,
  },
  {
    id: "business",
    name: "Business",
    price: 12,
    duration: "14 Days",
    advertisements: "3 Advertisements",
    description: "Great for businesses that want more exposure.",
    features: [
      "3 advertisements",
      "14 days advertising",
      "Image or video",
      "WhatsApp contact",
      "Priority placement",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 25,
    duration: "30 Days",
    advertisements: "10 Advertisements",
    description: "Maximum exposure for established businesses.",
    features: [
      "10 advertisements",
      "30 days advertising",
      "Image or video",
      "WhatsApp contact",
      "Priority placement",
      "Featured advertising",
    ],
    popular: false,
  },
];

export default function Home() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [checkingAccount, setCheckingAccount] = useState(false);

  const handleContinue = async () => {
    if (!selectedPackage || checkingAccount) return;

    setCheckingAccount(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        window.location.href = `/advertise/create?package=${selectedPackage}`;
        return;
      }

      // Remember the selected package so the account flow can continue
      sessionStorage.setItem(
        "marondera-billboard-selected-package",
        selectedPackage
      );

      window.location.href = `/advertiser/login?redirect=/advertise/create?package=${selectedPackage}`;
    } catch (error) {
      console.error("Account check error:", error);

      window.location.href = `/advertiser/login?redirect=/advertise/create?package=${selectedPackage}`;
    } finally {
      setCheckingAccount(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-3">
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
          </a>

          <div className="flex items-center gap-5">
            <a
              href="/advertiser/login"
              className="text-sm font-bold text-slate-600 hover:text-blue-900"
            >
              Advertiser Login
            </a>

            <a
              href="/advertiser/signup"
              className="hidden rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800 sm:block"
            >
              Create Account
            </a>

            <a
              href="/"
              className="text-sm font-bold text-slate-600 hover:text-blue-900"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* PAGE INTRO */}
      <section className="px-6 pb-8 pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-900">
            📢 Start Advertising
          </div>

          <h1 className="mt-5 text-4xl font-black text-blue-950 md:text-5xl">
            Choose Your Advertising Package
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-500">
            Select the package that best fits your advertising needs.
            You can promote your products, services, special offers and
            more on MaronderaBillboard.
          </p>

          {/* ACCOUNT NOTICE */}
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:text-left">
              <div>
                <p className="font-black text-blue-950">
                  New to MaronderaBillboard?
                </p>

                <p className="mt-1 text-sm text-blue-800">
                  You'll need an advertiser account before creating an
                  advertisement.
                </p>
              </div>

              <a
                href="/advertiser/signup"
                className="shrink-0 rounded-xl bg-blue-900 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-800"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRESS */}
      <section className="px-6 pb-10">
        <div className="mx-auto flex max-w-3xl items-center justify-center">
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 font-black text-white">
              1
            </div>

            <span className="ml-3 text-sm font-bold text-blue-900">
              Package
            </span>
          </div>

          <div className="mx-4 h-px w-12 bg-slate-300 sm:w-24" />

          <div className="flex items-center text-slate-400">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-black">
              2
            </div>

            <span className="ml-3 hidden text-sm font-bold sm:block">
              Advertisement
            </span>
          </div>

          <div className="mx-4 h-px w-12 bg-slate-300 sm:w-24" />

          <div className="flex items-center text-slate-400">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-black">
              3
            </div>

            <span className="ml-3 hidden text-sm font-bold sm:block">
              Payment
            </span>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-7 lg:grid-cols-3">
          {packages.map((pkg) => {
            const isSelected = selectedPackage === pkg.id;

            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`relative cursor-pointer rounded-3xl border bg-white p-8 transition ${
                  isSelected
                    ? "border-blue-700 ring-4 ring-blue-100 shadow-2xl"
                    : pkg.popular
                    ? "border-blue-200 shadow-xl"
                    : "border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-xl"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-4 py-2 text-xs font-black text-blue-950">
                    MOST POPULAR
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-blue-950">
                      {pkg.name}
                    </h2>

                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      {pkg.advertisements}
                    </p>
                  </div>

                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                      isSelected
                        ? "border-blue-900 bg-blue-900 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {isSelected && (
                      <span className="text-sm font-black">✓</span>
                    )}
                  </div>
                </div>

                <div className="mt-7 flex items-end gap-2">
                  <span className="text-5xl font-black text-blue-900">
                    ${pkg.price}
                  </span>

                  <span className="mb-2 text-sm font-semibold text-slate-500">
                    / package
                  </span>
                </div>

                <div className="mt-2 font-bold text-slate-700">
                  {pkg.duration}
                </div>

                <p className="mt-5 min-h-[72px] text-sm leading-6 text-slate-500">
                  {pkg.description}
                </p>

                <div className="mt-6 border-t border-slate-200 pt-6">
                  <div className="space-y-3">
                    {pkg.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3 text-sm"
                      >
                        <span className="mt-0.5 font-black text-green-500">
                          ✓
                        </span>

                        <span className="text-slate-600">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedPackage(pkg.id);
                  }}
                  className={`mt-8 w-full rounded-xl py-4 font-black transition ${
                    isSelected
                      ? "bg-blue-900 text-white"
                      : pkg.popular
                      ? "bg-blue-900 text-white hover:bg-blue-800"
                      : "bg-slate-100 text-blue-900 hover:bg-slate-200"
                  }`}
                >
                  {isSelected
                    ? "✓ Package Selected"
                    : "Select Package"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* CONTINUE BAR */}
      <section className="sticky bottom-0 border-t border-slate-200 bg-white/95 px-6 py-5 shadow-lg backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            {selectedPackage ? (
              <>
                <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Selected Package
                </div>

                <div className="mt-1 text-lg font-black text-blue-950">
                  {
                    packages.find(
                      (pkg) => pkg.id === selectedPackage
                    )?.name
                  }{" "}
                  Package — $
                  {
                    packages.find(
                      (pkg) => pkg.id === selectedPackage
                    )?.price
                  }
                </div>
              </>
            ) : (
              <>
                <div className="text-lg font-black text-blue-950">
                  Ready to advertise?
                </div>

                <div className="text-sm text-slate-500">
                  Select a package to continue.
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleContinue}
            disabled={!selectedPackage || checkingAccount}
            className={`w-full rounded-xl px-8 py-4 font-black transition sm:w-auto ${
              selectedPackage && !checkingAccount
                ? "bg-yellow-400 text-blue-950 shadow-lg hover:bg-yellow-300"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
          >
            {checkingAccount
              ? "Checking account..."
              : "Continue →"}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 px-6 py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} MaronderaBillboard. All rights reserved.
      </footer>
    </main>
  );
}