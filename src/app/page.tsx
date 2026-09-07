"use client";

import { useState } from "react";

const mockAds = [
{
id: 1,
title: "Chicken Inn Marondera",
description: "Delicious meals and great deals available today.",
mediaType: "image",
mediaUrl: "https://via.placeholder.com/800x500",
category: "Food",
whatsapp: "263770000000",
},
{
id: 2,
title: "Toyota Corolla For Sale",
description: "Clean Toyota Corolla available for sale in Marondera.",
mediaType: "video",
mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
category: "Cars",
whatsapp: "263771111111",
},
{
id: 3,
title: "Fresh Farm Produce",
description: "Fresh vegetables and farm produce delivered locally.",
mediaType: "image",
mediaUrl: "https://via.placeholder.com/800x500",
category: "Agriculture",
whatsapp: "263772222222",
},
];

const packages = [
{
name: "Starter",
price: "$5",
duration: "7 Days",
ads: "1 Advertisement",
description: "Perfect for individuals and small businesses.",
},
{
name: "Business",
price: "$12",
duration: "14 Days",
ads: "3 Advertisements",
description: "Great for businesses looking for more exposure.",
popular: true,
},
{
name: "Premium",
price: "$25",
duration: "30 Days",
ads: "7 Advertisements",
description: "Maximum exposure for growing businesses.",
},
];

export default function Home() {
const [menuOpen, setMenuOpen] = useState(false);

return ( <main className="min-h-screen bg-slate-50 text-slate-900">

```
  {/* NAVIGATION */}
  <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

      <a href="/" className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900 text-xl font-black text-white">
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

      <nav className="hidden items-center gap-8 md:flex">
        <a href="/" className="text-sm font-semibold text-blue-900">
          Home
        </a>

        <a
          href="#advertisements"
          className="text-sm font-medium text-slate-600 hover:text-blue-900"
        >
          Browse Ads
        </a>

        <a
          href="#how-it-works"
          className="text-sm font-medium text-slate-600 hover:text-blue-900"
        >
          How It Works
        </a>

        <a
          href="#pricing"
          className="text-sm font-medium text-slate-600 hover:text-blue-900"
        >
          Pricing
        </a>

        <a
          href="/advertise"
          className="rounded-lg bg-yellow-400 px-5 py-3 text-sm font-bold text-blue-950 shadow-sm transition hover:bg-yellow-300"
        >
          Advertise Now
        </a>
      </nav>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="rounded-lg border border-slate-200 px-3 py-2 text-xl md:hidden"
      >
        ☰
      </button>
    </div>

    {menuOpen && (
      <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
        <div className="flex flex-col gap-4">

          <a href="/" className="font-semibold">
            Home
          </a>

          <a href="#advertisements">
            Browse Ads
          </a>

          <a href="#how-it-works">
            How It Works
          </a>

          <a href="#pricing">
            Pricing
          </a>

          <a
            href="/advertise"
            className="rounded-lg bg-yellow-400 px-4 py-3 text-center font-bold text-blue-950"
          >
            Advertise Now
          </a>

        </div>
      </div>
    )}
  </header>

  {/* HERO */}
  <section className="relative overflow-hidden bg-blue-950">
    <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">

      <div>
        <div className="mb-6 inline-flex items-center rounded-full border border-blue-800 bg-blue-900 px-4 py-2 text-sm font-semibold text-blue-100">
          📍 Advertising in Marondera
        </div>

        <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
          Put Your Business
          <span className="block text-yellow-400">
            In Front of Marondera
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
          Advertise your products, services, special offers and events
          through one simple platform built for businesses and customers
          in Marondera.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">

          <a
            href="/advertise"
            className="rounded-xl bg-yellow-400 px-7 py-4 text-center font-black text-blue-950 shadow-lg transition hover:bg-yellow-300"
          >
            Start Advertising →
          </a>

          <a
            href="#advertisements"
            className="rounded-xl border border-blue-700 bg-blue-900 px-7 py-4 text-center font-bold text-white transition hover:bg-blue-800"
          >
            Browse Advertisements
          </a>

        </div>

        <div className="mt-8 flex flex-wrap gap-6 text-sm text-blue-200">
          <span>✓ Local audience</span>
          <span>✓ Image & video ads</span>
          <span>✓ Simple payment</span>
        </div>
      </div>

      <div className="relative">
        <div className="rounded-3xl border border-blue-800 bg-blue-900 p-4 shadow-2xl">

          <div className="rounded-2xl bg-white p-4">

            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-400">
                  FEATURED AD
                </div>
                <div className="font-black text-blue-900">
                  Marondera Billboard
                </div>
              </div>

              <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                LIVE
              </div>
            </div>

            <div className="flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 via-orange-400 to-blue-700 text-center">
              <div className="px-8">
                <div className="text-5xl">📢</div>
                <div className="mt-4 text-2xl font-black text-white">
                  YOUR AD HERE
                </div>
                <div className="mt-2 text-sm font-semibold text-white/90">
                  Reach customers across Marondera
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="font-bold">
                  Advertise Your Business
                </div>
                <div className="text-sm text-slate-500">
                  Get noticed locally
                </div>
              </div>

              <div className="rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white">
                WhatsApp
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </section>

  {/* TRUST / STATS */}
  <section className="border-b border-slate-200 bg-white">
    <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 md:grid-cols-4">

      <div className="px-6 py-8 text-center">
        <div className="text-3xl font-black text-blue-900">
          100%
        </div>
        <div className="mt-1 text-sm text-slate-500">
          Local Focus
        </div>
      </div>

      <div className="px-6 py-8 text-center">
        <div className="text-3xl font-black text-blue-900">
          24/7
        </div>
        <div className="mt-1 text-sm text-slate-500">
          Online Exposure
        </div>
      </div>

      <div className="px-6 py-8 text-center">
        <div className="text-3xl font-black text-blue-900">
          15 sec
        </div>
        <div className="mt-1 text-sm text-slate-500">
          Video Ads
        </div>
      </div>

      <div className="px-6 py-8 text-center">
        <div className="text-3xl font-black text-blue-900">
          1 → Many
        </div>
        <div className="mt-1 text-sm text-slate-500">
          Social Platforms
        </div>
      </div>

    </div>
  </section>

  {/* TRENDING ADS */}
  <section id="advertisements" className="mx-auto max-w-7xl px-6 py-20">

    <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">

      <div>
        <div className="text-sm font-black uppercase tracking-widest text-blue-700">
          Discover
        </div>

        <h2 className="mt-2 text-3xl font-black md:text-4xl">
          🔥 Trending in Marondera
        </h2>

        <p className="mt-3 max-w-xl text-slate-500">
          Discover businesses, products, services and special offers
          currently being promoted on MaronderaBillboard.
        </p>
      </div>

      <a
        href="#advertisements"
        className="font-bold text-blue-700 hover:text-blue-900"
      >
        View All Ads →
      </a>

    </div>

    <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

      {mockAds.map((ad) => (
        <article
          key={ad.id}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >

          <div className="relative">

            {ad.mediaType === "video" ? (
              <video
                src={ad.mediaUrl}
                controls
                className="h-56 w-full object-cover"
              />
            ) : (
              <img
                src={ad.mediaUrl}
                alt={ad.title}
                className="h-56 w-full object-cover"
              />
            )}

            <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-black text-blue-900 shadow">
              {ad.category}
            </span>

          </div>

          <div className="p-5">

            <h3 className="text-xl font-black">
              {ad.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {ad.description}
            </p>

            <a
              href={`https://wa.me/${ad.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-5 block rounded-xl bg-green-500 py-3 text-center font-bold text-white transition hover:bg-green-600"
            >
              WhatsApp Seller
            </a>

          </div>

        </article>
      ))}

    </div>
  </section>

  {/* WHY ADVERTISE */}
  <section className="bg-white py-20">
    <div className="mx-auto max-w-7xl px-6">

      <div className="mx-auto max-w-2xl text-center">
        <div className="text-sm font-black uppercase tracking-widest text-blue-700">
          Why MaronderaBillboard?
        </div>

        <h2 className="mt-3 text-3xl font-black md:text-4xl">
          Everything You Need To Get Noticed
        </h2>

        <p className="mt-4 text-slate-500">
          A simple advertising platform designed to help local businesses
          reach more potential customers.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {[
          {
            icon: "📍",
            title: "Reach Local Customers",
            text: "Put your business in front of people looking for products and services around Marondera.",
          },
          {
            icon: "🎥",
            title: "Image & Video Ads",
            text: "Promote your business using professional images or short promotional videos.",
          },
          {
            icon: "📱",
            title: "Multiple Platforms",
            text: "Prepare your campaigns for Facebook, Instagram, TikTok and WhatsApp.",
          },
          {
            icon: "⚡",
            title: "Simple & Fast",
            text: "Choose a package, make payment, upload your advertisement and let us handle the rest.",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-7"
          >
            <div className="text-4xl">{feature.icon}</div>

            <h3 className="mt-5 text-xl font-black">
              {feature.title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {feature.text}
            </p>
          </div>
        ))}

      </div>
    </div>
  </section>

  {/* HOW IT WORKS */}
  <section id="how-it-works" className="bg-slate-50 py-20">

    <div className="mx-auto max-w-7xl px-6">

      <div className="text-center">
        <div className="text-sm font-black uppercase tracking-widest text-blue-700">
          Simple Process
        </div>

        <h2 className="mt-3 text-3xl font-black md:text-4xl">
          How It Works
        </h2>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-4">

        {[
          {
            number: "01",
            title: "Choose a Package",
            text: "Select the advertising package that fits your needs.",
          },
          {
            number: "02",
            title: "Make Payment",
            text: "Pay securely using one of our available payment methods.",
          },
          {
            number: "03",
            title: "Upload Your Ad",
            text: "Submit your image or short promotional video with your details.",
          },
          {
            number: "04",
            title: "Go Live",
            text: "After approval, your advertisement is ready to reach customers.",
          },
        ].map((step) => (
          <div key={step.number} className="relative text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-900 text-xl font-black text-white">
              {step.number}
            </div>

            <h3 className="mt-5 text-xl font-black">
              {step.title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {step.text}
            </p>

          </div>
        ))}

      </div>
    </div>
  </section>

  {/* PRICING */}
  <section id="pricing" className="bg-white py-20">

    <div className="mx-auto max-w-7xl px-6">

      <div className="mx-auto max-w-2xl text-center">

        <div className="text-sm font-black uppercase tracking-widest text-blue-700">
          Advertising Packages
        </div>

        <h2 className="mt-3 text-3xl font-black md:text-4xl">
          Start Advertising Today
        </h2>

        <p className="mt-4 text-slate-500">
          Affordable packages designed for individuals, small businesses
          and growing brands.
        </p>

      </div>

      <div className="mt-12 grid gap-7 md:grid-cols-3">

        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className={`relative rounded-2xl border p-8 ${
              pkg.popular
                ? "border-blue-700 shadow-xl"
                : "border-slate-200 shadow-sm"
            }`}
          >

            {pkg.popular && (
              <div className="absolute right-5 top-5 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-blue-950">
                MOST POPULAR
              </div>
            )}

            <h3 className="text-xl font-black">
              {pkg.name}
            </h3>

            <div className="mt-5 text-5xl font-black text-blue-900">
              {pkg.price}
            </div>

            <div className="mt-2 font-semibold text-slate-500">
              {pkg.duration}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-6">

              <div className="font-bold">
                ✓ {pkg.ads}
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {pkg.description}
              </p>

            </div>

            <a
              href="/advertise"
              className={`mt-7 block rounded-xl py-3 text-center font-black ${
                pkg.popular
                  ? "bg-blue-900 text-white hover:bg-blue-800"
                  : "bg-slate-100 text-blue-900 hover:bg-slate-200"
              }`}
            >
              Choose Package
            </a>

          </div>
        ))}

      </div>
    </div>
  </section>

  {/* SOCIAL MEDIA */}
  <section className="bg-blue-950 py-20">

    <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">

      <div>

        <div className="text-sm font-black uppercase tracking-widest text-yellow-400">
          Coming Soon
        </div>

        <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">
          One Advertisement.
          <span className="block text-yellow-400">
            Multiple Platforms.
          </span>
        </h2>

        <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
          Create your advertisement once and prepare it for promotion
          across the platforms where your customers spend their time.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">

          <span className="rounded-full bg-white px-5 py-3 font-bold text-slate-900">
            Facebook
          </span>

          <span className="rounded-full bg-white px-5 py-3 font-bold text-slate-900">
            Instagram
          </span>

          <span className="rounded-full bg-white px-5 py-3 font-bold text-slate-900">
            TikTok
          </span>

          <span className="rounded-full bg-white px-5 py-3 font-bold text-slate-900">
            WhatsApp
          </span>

        </div>

      </div>

      <div className="rounded-3xl border border-blue-800 bg-blue-900 p-8">

        <div className="rounded-2xl bg-white p-7">

          <div className="text-sm font-bold text-slate-400">
            YOUR CAMPAIGN
          </div>

          <div className="mt-2 text-2xl font-black text-blue-900">
            1 Advertisement
          </div>

          <div className="mt-6 space-y-3">

            {[
              "Website",
              "Facebook",
              "Instagram",
              "TikTok",
              "WhatsApp",
            ].map((platform) => (
              <div
                key={platform}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
              >
                <span className="font-semibold">
                  {platform}
                </span>

                <span className="font-bold text-green-500">
                  ✓
                </span>
              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  </section>

  {/* FINAL CTA */}
  <section className="bg-yellow-400 py-20">

    <div className="mx-auto max-w-4xl px-6 text-center">

      <div className="text-4xl">
        🚀
      </div>

      <h2 className="mt-4 text-3xl font-black text-blue-950 md:text-5xl">
        Ready To Get Your Business Noticed?
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-900">
        Start advertising your products, services or special offers to
        customers in Marondera today.
      </p>

      <a
        href="/advertise"
        className="mt-8 inline-block rounded-xl bg-blue-950 px-8 py-4 font-black text-white shadow-lg transition hover:bg-blue-900"
      >
        Advertise on MaronderaBillboard →
      </a>

    </div>

  </section>

  {/* FOOTER */}
  <footer className="bg-slate-950 text-white">

    <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">

      <div className="md:col-span-2">

        <div className="text-2xl font-black">
          MaronderaBillboard
        </div>

        <p className="mt-4 max-w-md leading-7 text-slate-400">
          A local digital advertising platform connecting businesses,
          products and services with customers in Marondera.
        </p>

      </div>

      <div>
        <h3 className="font-black">
          Platform
        </h3>

        <div className="mt-4 space-y-3 text-sm text-slate-400">

          <a href="#advertisements" className="block hover:text-white">
            Browse Ads
          </a>

          <a href="#pricing" className="block hover:text-white">
            Pricing
          </a>

          <a href="#how-it-works" className="block hover:text-white">
            How It Works
          </a>

          <a href="/advertise" className="block hover:text-white">
            Advertise
          </a>

        </div>
      </div>

      <div>
        <h3 className="font-black">
          Contact
        </h3>

        <div className="mt-4 space-y-3 text-sm text-slate-400">

          <div>📍 Marondera, Zimbabwe</div>
          <div>📱 WhatsApp</div>
          <div>✉️ Email</div>

        </div>
      </div>

    </div>

    <div className="border-t border-slate-800 px-6 py-6 text-center text-sm text-slate-500">
      © {new Date().getFullYear()} MaronderaBillboard. All rights reserved.
    </div>

  </footer>

</main>);
}
