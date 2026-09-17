
"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import Link from "next/link";

type Advertisement = {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: string;
  duration: number | null;
  category: string;
   subcategory: string;
  location: string | null;
  status: string;
  views: number;
  isFeatured: boolean;
  createdAt: string;
  advertiser: {
    businessName: string;
    phone: string | null;
    email: string | null;
  };
};

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

function getWhatsAppNumber(phone: string | null) {
  if (!phone) return null;

  let number = phone.replace(/\D/g, "");

  // Zimbabwe local format: 0771234567 -> 263771234567
  if (number.startsWith("0")) {
    number = "263" + number.substring(1);
  }

  // Zimbabwe number without country code: 771234567 -> 263771234567
  if (number.startsWith("7") && number.length === 9) {
    number = "263" + number;
  }

  return number;
}

export default function Home() {
 const [menuOpen, setMenuOpen] = useState(false);

const [ads, setAds] = useState<Advertisement[]>([]);
const [adsLoading, setAdsLoading] = useState(true);
const [featuredAd, setFeaturedAd] = useState<Advertisement | null>(null);
const [featuredIndex, setFeaturedIndex] = useState(0);

const [searchTerm, setSearchTerm] = useState("");
const [selectedCategory, setSelectedCategory] = useState("");
const [selectedSubcategory, setSelectedSubcategory] = useState("");
const [selectedLocation, setSelectedLocation] = useState("");

const categories = {
  "Cars & Vehicles": [
    "Cars",
    "Trucks",
    "Buses",
    "Motorcycles",
    "Car Parts & Accessories",
    "Vehicle Services",
  ],
  Property: [
    "Houses for Sale",
    "Houses to Rent",
    "Stands & Land",
    "Commercial Property",
    "Offices & Shops",
    "Lodges & Guest Houses",
  ],
  "Furniture & Home": [
    "Furniture",
    "Appliances",
    "Home Decor",
    "Kitchen",
    "Garden & Outdoor",
  ],
  "Jobs & Careers": [
    "Jobs",
    "Job Seekers",
    "Recruitment",
    "Training & Courses",
  ],
  "Business & Services": [
    "General Services",
    "Construction",
    "Plumbing",
    "Electrical",
    "Cleaning",
    "Transport & Logistics",
    "Professional Services",
    "Repairs & Maintenance",
  ],
  Electronics: [
    "Phones",
    "Computers & Laptops",
    "TVs & Audio",
    "Cameras",
    "Accessories",
  ],
  "Fashion & Beauty": [
    "Clothing",
    "Shoes",
    "Bags & Accessories",
    "Hair & Beauty",
    "Cosmetics",
  ],
  "Food & Restaurants": [
    "Restaurants",
    "Takeaways",
    "Catering",
    "Groceries",
    "Bakeries",
  ],
  Agriculture: [
    "Livestock",
    "Poultry",
    "Farming Equipment",
    "Seeds & Fertilizer",
    "Agricultural Products",
  ],
  "Health & Medical": [
    "Clinics",
    "Pharmacies",
    "Medical Services",
    "Fitness & Wellness",
  ],
  Education: [
    "Schools",
    "Colleges",
    "Tutors",
    "Training",
  ],
  "Shopping & Retail": [
    "Hardware",
    "Building Materials",
    "Supermarkets",
    "Wholesale",
    "General Retail",
  ],
  "Events & Entertainment": [
    "Events",
    "Wedding Services",
    "Photography",
    "Entertainment",
    "Venues",
  ],
  Other: [
    "Other Listings",
  ],
} as const;

const availableSubcategories = selectedCategory
  ? categories[
      selectedCategory as keyof typeof categories
    ]
  : [];

  const socialIcons: Record<string, ReactNode> = {
    Website: <FaGlobe className="text-slate-600" />,
    Facebook: <FaFacebookF className="text-blue-600" />,
    Instagram: <FaInstagram className="text-pink-500" />,
    TikTok: <FaTiktok className="text-black" />,
    WhatsApp: <FaWhatsapp className="text-green-500" />,
    YouTube: <FaYoutube className="text-red-600" />,
    Twitter: <FaTwitter className="text-blue-500" />,
  };

  useEffect(() => {
    async function loadAds() {
      try {
        const response = await fetch("/api/advertisements", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load advertisements");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setAds(data);
   
        } else {
          setAds([]);
        }
      } catch (error) {
        console.error("Failed to load advertisements:", error);
        setAds([]);
      } finally {
        setAdsLoading(false);
      }
    }

    loadAds();
  }, []);
useEffect(() => {
  const activeAds = ads.filter((ad) => ad.status === "active");

  if (activeAds.length <= 1) {
    return;
  }

  const interval = setInterval(() => {
    setFeaturedIndex((current) => (current + 1) % activeAds.length);
  }, 8000);

  return () => clearInterval(interval);
}, [ads]);
useEffect(() => {
  const activeAds = ads.filter((ad) => ad.status === "active");

  if (activeAds.length === 0) {
    setFeaturedAd(null);
    return;
  }

  setFeaturedAd(activeAds[featuredIndex % activeAds.length]);
}, [ads, featuredIndex]);
  const closeMenu = () => {
    setMenuOpen(false);
  };
const filteredAds = ads.filter((ad) => {
  const search = searchTerm.trim().toLowerCase();

  const matchesSearch =
    !search ||
    (ad.title ?? "").toLowerCase().includes(search) ||
    (ad.category ?? "").toLowerCase().includes(search) ||
    (ad.subcategory ?? "").toLowerCase().includes(search) ||
    (ad.location ?? "").toLowerCase().includes(search) ||
    (ad.advertiser?.businessName ?? "")
      .toLowerCase()
      .includes(search);

  const matchesCategory =
    !selectedCategory ||
    ad.category === selectedCategory;

  const matchesSubcategory =
    !selectedSubcategory ||
    ad.subcategory === selectedSubcategory;

  const matchesLocation =
    !selectedLocation ||
    ad.location === selectedLocation;

  return (
    matchesSearch &&
    matchesCategory &&
    matchesSubcategory &&
    matchesLocation
  );
});

const clearFilters = () => {
  setSearchTerm("");
  setSelectedCategory("");
  setSelectedSubcategory("");
  setSelectedLocation("");
};

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-[100] isolate border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-6 py-4">
          {/* LOGO */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-3 touch-manipulation"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900 text-lg font-black text-white">
              ZBM
            </div>

            <div>
              <div className="text-lg font-black text-blue-900">
                Zim Billboards Media
              </div>

              <div className="text-xs text-slate-500">
                Zimbabwe&apos;s Digital Advertising Platform
              </div>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-sm font-semibold text-blue-900"
            >
              Home
            </Link>

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

            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="rounded-lg px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-blue-900"
              >
                Log in
              </a>

              <a
                href="/signup"
                className="rounded-lg bg-yellow-400 px-5 py-3 text-sm font-bold text-blue-950 shadow-sm transition hover:bg-yellow-300"
              >
                Get Started
              </a>
            </div>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            className="relative z-[110] flex h-12 w-12 min-h-12 min-w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-2xl font-bold text-slate-900 shadow-sm touch-manipulation select-none pointer-events-auto active:scale-95 md:hidden"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none leading-none"
            >
              {menuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        <div
          id="mobile-navigation"
          className={`relative z-[105] border-t border-slate-200 bg-white px-6 py-4 md:hidden ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <nav className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={closeMenu}
                className="flex min-h-[48px] items-center rounded-xl px-4 py-3 font-semibold text-slate-900 touch-manipulation active:bg-slate-100"
              >
                Home
              </Link>

              <a
                href="#advertisements"
                onClick={closeMenu}
                className="flex min-h-[48px] items-center rounded-xl px-4 py-3 font-medium text-slate-700 touch-manipulation active:bg-slate-100"
              >
                Browse Ads
              </a>

              <a
                href="#how-it-works"
                onClick={closeMenu}
                className="flex min-h-[48px] items-center rounded-xl px-4 py-3 font-medium text-slate-700 touch-manipulation active:bg-slate-100"
              >
                How It Works
              </a>

              <a
                href="#pricing"
                onClick={closeMenu}
                className="flex min-h-[48px] items-center rounded-xl px-4 py-3 font-medium text-slate-700 touch-manipulation active:bg-slate-100"
              >
                Pricing
              </a>

              <div className="my-2 border-t border-slate-200" />

              <a
                href="/login"
                onClick={closeMenu}
                className="flex min-h-[50px] items-center justify-center rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-700 touch-manipulation active:bg-slate-100"
              >
                Log in
              </a>

              <a
                href="/signup"
                onClick={closeMenu}
                className="flex min-h-[50px] items-center justify-center rounded-xl bg-yellow-400 px-4 py-3 font-bold text-blue-950 touch-manipulation active:scale-[0.98]"
              >
                Get Started
              </a>
            </div>
          </nav>
        </div>
      </header>

     {/* HERO */}
<section
  className="relative overflow-hidden bg-slate-950 text-white"
  style={{
    backgroundImage: "url('/hero.webp')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Background glow */}
  <div className="pointer-events-none absolute inset-0">
    <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
    <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl" />
    <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
  </div>

  {/* Subtle grid */}
  <div
    className="pointer-events-none absolute inset-0 opacity-20"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
      backgroundSize: "48px 48px",
    }}
  />

  <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-24 lg:px-8">
    <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
      
      {/* LEFT */}
      <div>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-200 backdrop-blur">
          <div className="mb-2">
  <img
    src="/flag.jpg"
    alt="Zimbabwe flag"
    className="h-6 w-auto"
  />
</div>
          Digital advertising built for Zimbabwe
        </div>

        <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Reach More Customers Across{" "}
          <span className="text-orange-400">Zimbabwe</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Launch digital billboard advertisements for your business in minutes.
          Promote products, services, properties, jobs, events and more — all
          from one simple platform.
        </p>

        {/* Feature badges */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="mb-2">
  <img
    src="/flag.jpg"
    alt="Zimbabwe flag"
    className="h-6 w-auto"
  />
</div>
            <p className="mt-2 text-sm font-black">
              Built for Zimbabwean Businesses
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="text-xl">📊</div>
            <p className="mt-2 text-sm font-black">
              Campaign Performance Tracking
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="text-xl">⚡</div>
            <p className="mt-2 text-sm font-black">
              Launch Your Ad in Minutes
            </p>
          </div>
        </div>

        {/* Payment / trust line */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-300">
          <span>🇿🇼</span>
          <span>Proudly supporting businesses across Zimbabwe</span>
          <span className="hidden text-slate-600 sm:inline">•</span>
          <span>USD pricing</span>
          <span className="hidden text-slate-600 sm:inline">•</span>
          <span>EcoCash, bank & cash payments</span>
        </div>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/advertise"
            className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-7 py-4 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-400"
          >
            Start Your Campaign
            <span className="ml-2">→</span>
          </Link>

          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-7 py-4 text-sm font-black text-white transition hover:bg-white/10"
          >
            ▶ See How It Works
          </a>
        </div>
      </div>

      {/* RIGHT — DIGITAL BILLBOARD PREVIEW */}
      <div className="relative mx-auto w-full max-w-xl">
        {/* Glow */}
        <div className="absolute inset-10 rounded-[3rem] bg-orange-500/20 blur-3xl" />

        {/* Billboard frame */}
        <div className="relative rounded-[2rem] border border-white/10 bg-slate-800/90 p-3 shadow-2xl shadow-black/60 backdrop-blur-sm">
          <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[2.5rem] bg-orange-500/10 blur-2xl" />
          {/* Top bar */}
          <div className="flex items-center justify-between rounded-t-[1.5rem] border-b border-white/10 bg-slate-900 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 animate-pulse rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Live
              </span>
            </div>

            <span className="text-xs font-semibold text-slate-400">
              Zim Billboards Media
            </span>
          </div>

          {/* Screen */}
          <div className="relative overflow-hidden rounded-b-[1.5rem] bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-300">
            
            {/* Decorative circles */}
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-black/10" />

   
   <div className="relative min-h-[330px] overflow-hidden sm:min-h-[380px]">
    <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
  {featuredAd ? (
    <div
      key={featuredAd.id}
      className="absolute inset-0 animate-[fadeIn_0.7s_ease-in-out]"
    >
      {/* AD MEDIA */}
      {featuredAd.mediaType === "video" ? (
        <video
          src={featuredAd.mediaUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <img
          src={featuredAd.mediaUrl}
          alt={featuredAd.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Advertisement information */}
      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/70 to-transparent p-6 pt-20 text-left">
        {/* LIVE BADGE */}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white backdrop-blur-md">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
          Live Advertisement
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-black leading-tight text-white sm:text-3xl">
          {featuredAd.title}
        </h2>

        {/* BUSINESS NAME */}
        <p className="mt-1 text-sm font-bold text-white/90">
          {featuredAd.advertiser?.businessName}
        </p>

        {/* LOCATION */}
        {featuredAd.location && (
          <p className="mt-1 text-xs font-medium text-white/70">
            📍 {featuredAd.location}
          </p>
        )}
      </div>

      {/* ROTATION PROGRESS BAR */}
      <div className="absolute bottom-0 left-0 z-30 h-1 w-full overflow-hidden bg-black/30">
        <div className="h-full w-full origin-left animate-[billboardProgress_8s_linear]" />
      </div>
    </div>
  ) : (
    /* FALLBACK WHEN THERE ARE NO ACTIVE ADS */
    <div className="relative flex min-h-[330px] flex-col items-center justify-center px-8 py-12 text-center sm:min-h-[380px]">
      <div className="mb-5 text-6xl sm:text-7xl">📣</div>

      <h2 className="text-4xl font-black tracking-tight text-white drop-shadow sm:text-5xl">
        YOUR AD HERE
      </h2>

      <p className="mt-4 max-w-sm text-sm font-bold text-white/90 sm:text-base">
        Showcase your business, products or services to customers across
        Zimbabwe.
      </p>

      <div className="mt-8 rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white shadow-lg">
        💬 Advertise With ZimDigitalBillboard
      </div>
    </div>
  )}
</div>
          </div>
        </div>

        {/* Bottom caption */}
        <div className="mt-5 text-center text-sm font-semibold text-slate-400">
          Simple advertising. Powerful reach. Built for Zimbabwe.
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
      <section
        id="advertisements"
        className="mx-auto max-w-7xl px-6 py-20"
      >
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="text-sm font-black uppercase tracking-widest text-blue-700">
              Discover
            </div>

           <h2 className="mt-2 text-3xl font-black md:text-4xl">
  🔥 Discover Advertisements
</h2>

            <p className="mt-3 max-w-xl text-slate-500">
              Discover businesses, products, services and special offers from across Zimbabwe.
            </p>
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
    {/* SEARCH */}
    <div className="lg:col-span-2">
      <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
        Search
      </label>

      <input
        type="text"
        value={searchTerm}
        onChange={(event) =>
          setSearchTerm(event.target.value)
        }
        placeholder="Search cars, houses, jobs, businesses..."
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
      />
    </div>

    {/* CATEGORY */}
    <div>
      <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
        Category
      </label>

      <select
        value={selectedCategory}
        onChange={(event) => {
          setSelectedCategory(event.target.value);
          setSelectedSubcategory("");
        }}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
      >
        <option value="">All Categories</option>

        {Object.keys(categories).map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>

    {/* LOCATION */}
    <div>
      <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
        Location
      </label>

      <select
        value={selectedLocation}
        onChange={(event) =>
          setSelectedLocation(event.target.value)
        }
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
      >
        <option value="">All Zimbabwe</option>

        {[
          "Harare",
          "Bulawayo",
          "Chitungwiza",
          "Mutare",
          "Gweru",
          "Masvingo",
          "Marondera",
          "Kwekwe",
          "Kadoma",
          "Chinhoyi",
          "Victoria Falls",
          "Bindura",
          "Other",
        ].map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>
    </div>

    {/* SUBCATEGORY */}
    <div>
      <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
        Subcategory
      </label>

      <select
        value={selectedSubcategory}
        onChange={(event) =>
          setSelectedSubcategory(event.target.value)
        }
        disabled={!selectedCategory}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">
          {selectedCategory
            ? "All Subcategories"
            : "Select category first"}
        </option>

        {availableSubcategories.map((subcategory) => (
          <option
            key={subcategory}
            value={subcategory}
          >
            {subcategory}
          </option>
        ))}
      </select>
    </div>

    {/* CLEAR */}
    <div className="flex items-end">
      <button
        type="button"
        onClick={clearFilters}
        className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200"
      >
        Clear Filters
      </button>
    </div>
  </div>

  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
    <p className="text-sm font-semibold text-slate-500">
      Showing{" "}
      <span className="font-black text-slate-900">
        {filteredAds.length}
      </span>{" "}
      {filteredAds.length === 1 ? "advertisement" : "advertisements"}
    </p>

    {(searchTerm ||
      selectedCategory ||
      selectedSubcategory ||
      selectedLocation) && (
      <button
        type="button"
        onClick={clearFilters}
        className="text-sm font-black text-blue-700 hover:text-blue-900"
      >
        Reset search
      </button>
    )}
  </div>
</div>
          </div>

          <a
            href="#advertisements"
            className="font-bold text-blue-700 hover:text-blue-900"
          >
            View All Ads →
          </a>
        </div>

        {/* LOADING */}
        {adsLoading && (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-56 animate-pulse bg-slate-200" />

                <div className="p-5">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />

                  <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-200" />

                  <div className="mt-5 h-12 animate-pulse rounded-xl bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NO ADS */}
        {!adsLoading && ads.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="text-5xl">📢</div>

            <h3 className="mt-5 text-2xl font-black text-slate-900">
              No advertisements are live yet
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              Be one of the first businesses to advertise on Zim Digital
              Billboards and reach customers around the World.
            </p>

            <a
              href="/advertise"
              className="mt-7 inline-block rounded-xl bg-blue-900 px-7 py-4 font-black text-white transition hover:bg-blue-800"
            >
              Start Advertising →
            </a>
          </div>
        )}
{!adsLoading && ads.length > 0 && filteredAds.length === 0 && (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
    <div className="text-5xl">🔎</div>

    <h3 className="mt-5 text-2xl font-black text-slate-900">
      No advertisements found
    </h3>

    <p className="mx-auto mt-3 max-w-xl text-slate-500">
      Try a different search term, category, subcategory or location.
    </p>

    <button
      type="button"
      onClick={clearFilters}
      className="mt-7 rounded-xl bg-blue-900 px-7 py-4 font-black text-white transition hover:bg-blue-800"
    >
      Clear Filters
    </button>
  </div>
)}
        {/* REAL ADS */}
        {!adsLoading && filteredAds.length > 0 && (
  <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
    {filteredAds.map((ad) => {
              const whatsappNumber = getWhatsAppNumber(
                ad.advertiser?.phone
              );

              return (
                <article
                  key={ad.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative">
                    {ad.mediaType.toLowerCase() === "video" ? (
                      <video
                        src={ad.mediaUrl}
                        controls
                        playsInline
                        preload="metadata"
                        className="h-56 w-full bg-black object-cover"
                      />
                    ) : (
                      <img
                        src={ad.mediaUrl}
                        alt={ad.title}
                        loading="lazy"
                        className="h-56 w-full object-cover"
                      />
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-black text-blue-900 shadow">
                      {ad.category}
                    </span>

                    {ad.isFeatured && (
                      <span className="absolute right-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-blue-950 shadow">
                        FEATURED
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-black">
                      {ad.title}
                    </h3>

                    <div className="mt-2 space-y-1 text-sm text-slate-500">
                      <p>
                        <span className="font-semibold text-slate-700">
                          Business:
                        </span>{" "}
                        {ad.advertiser?.businessName || "Advertiser"}
                      </p>

                      {ad.location && (
                        <p>
                          <span className="font-semibold text-slate-700">
                            Location:
                          </span>{" "}
                          {ad.location}
                        </p>
                      )}
                    </div>

                    {whatsappNumber ? (
                      <a
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-center font-bold text-white transition hover:bg-green-600"
                      >
                        <FaWhatsapp className="text-lg" />
                        WhatsApp Seller
                      </a>
                    ) : (
                      <div className="mt-5 rounded-xl bg-slate-100 py-3 text-center font-bold text-slate-500">
                        Contact Advertiser
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* WHY ADVERTISE */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-sm font-black uppercase tracking-widest text-blue-700">
              Why Zim Billboards Media?
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
                text: "Put your business in front of people looking for products and services around Zimbabwe.",
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
                <div className="text-4xl">
                  {feature.icon}
                </div>

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
      <section
        id="how-it-works"
        className="bg-slate-50 py-20"
      >
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
              <div
                key={step.number}
                className="relative text-center"
              >
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
      <section
        id="pricing"
        className="bg-white py-20"
      >
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
              <span className="flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-slate-900">
                <FaFacebookF className="text-blue-600" />
                Facebook
              </span>

              <span className="flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-slate-900">
                <FaInstagram className="text-pink-500" />
                Instagram
              </span>

              <span className="flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-slate-900">
                <FaTiktok className="text-black" />
                TikTok
              </span>

              <span className="flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-slate-900">
                <FaWhatsapp className="text-green-500" />
                WhatsApp
              </span>

              <span className="flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-slate-900">
                <FaYoutube className="text-red-600" />
                YouTube
              </span>

              <span className="flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-slate-900">
                <FaTwitter className="text-blue-500" />
                Twitter
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
                  "YouTube",
                  "Twitter",
                ].map((platform) => (
                  <div
                    key={platform}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                  >
                    <span className="flex items-center gap-3 font-semibold">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                        {socialIcons[platform]}
                      </span>

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
            customers in Zimbabwe today.
          </p>

          <a
            href="/advertise"
            className="mt-8 inline-block rounded-xl bg-blue-950 px-8 py-4 font-black text-white shadow-lg transition hover:bg-blue-900"
          >
            Advertise on Zim Billboards Media →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-black text-white">
              Zim Billboards Media
            </h2>

            <p className="mt-4 max-w-xl text-slate-400">
              A digital advertising platform connecting businesses, products
              and services with customers across Zimbabwe.
            </p>

            {/* Follow Us */}
            <div className="mt-6">
              <h3 className="font-black text-white">
                Follow Us
              </h3>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/263718299260"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white transition hover:scale-110 hover:bg-green-400"
                >
                  <FaWhatsapp className="text-xl" />
                </a>

                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition hover:scale-110 hover:bg-blue-500"
                >
                  <FaFacebookF className="text-lg" />
                </a>

                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-white transition hover:scale-110 hover:bg-pink-400"
                >
                  <FaInstagram className="text-xl" />
                </a>

                <a
                  href="#"
                  aria-label="TikTok"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white ring-1 ring-slate-700 transition hover:scale-110"
                >
                  <FaTiktok className="text-lg" />
                </a>

                <a
                  href="#"
                  aria-label="Twitter"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white transition hover:scale-110 hover:bg-sky-400"
                >
                  <FaTwitter className="text-lg" />
                </a>

                <a
                  href="#"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition hover:scale-110 hover:bg-red-500"
                >
                  <FaYoutube className="text-lg" />
                </a>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-black text-white">
              Platform
            </h3>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <a
                href="#advertisements"
                className="block transition hover:text-white"
              >
                Browse Ads
              </a>

              <a
                href="#pricing"
                className="block transition hover:text-white"
              >
                Pricing
              </a>

              <a
                href="#how-it-works"
                className="block transition hover:text-white"
              >
                How It Works
              </a>

              <a
                href="/advertise"
                className="block transition hover:text-white"
              >
                Advertise
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-black text-white">
              Contact
            </h3>

            <div className="mt-4 space-y-4 text-sm text-slate-400">
              <div>
                📍 Marondera, Zimbabwe
              </div>

              <a
                href="tel:+263718299260"
                className="block transition hover:text-white"
              >
                📱 0718 299 260
              </a>

              <a
                href="tel:+263716893336"
                className="block transition hover:text-white"
              >
                📱 0716 893 336
              </a>

              <a
                href="mailto:zimdigitalbillboards941@gmail.com"
                className="block break-all transition hover:text-white"
              >
                ✉️ zimdigitalbillboards941@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 px-6 py-6 text-center text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} Zim Billboards Media. All rights
            reserved.
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-4">
            <a
              href="/privacy"
              className="transition hover:text-white"
            >
              Privacy Policy
            </a>

            <a
              href="/terms"
              className="transition hover:text-white"
            >
              Terms &amp; Conditions
            </a>
          </div>

          <p className="mt-2">
            Created by{" "}
            <a
              href="https://wa.me/263775496377"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-white transition hover:text-green-400"
            >
              Silent Programs
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}

