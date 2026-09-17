"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Advertisement = {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: string;
  duration: number | null;
  category: string;
  subcategory: string | null;
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
type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  imageUrl: string | null;
  category: string;
  location: string | null;
  stock: number;
  status: string;
  views: number;
  createdAt: string;
  advertiser: {
    id: string;
    businessName: string;
    phone: string | null;
    email: string | null;
  };
};


const categories = [
  {
    name: "Cars & Vehicles",
    subcategories: [
      "Cars",
      "Trucks",
      "Buses",
      "Motorcycles",
      "Car Parts & Accessories",
      "Vehicle Services",
    ],
  },
  {
    name: "Property",
    subcategories: [
      "Houses for Sale",
      "Houses to Rent",
      "Stands & Land",
      "Commercial Property",
      "Offices & Shops",
      "Lodges & Guest Houses",
    ],
  },
  {
    name: "Furniture & Home",
    subcategories: [
      "Furniture",
      "Appliances",
      "Home Decor",
      "Kitchen",
      "Garden & Outdoor",
    ],
  },
  {
    name: "Jobs & Careers",
    subcategories: [
      "Jobs",
      "Job Seekers",
      "Recruitment",
      "Training & Courses",
    ],
  },
  {
    name: "Business & Services",
    subcategories: [
      "General Services",
      "Construction",
      "Plumbing",
      "Electrical",
      "Cleaning",
      "Transport & Logistics",
      "Professional Services",
      "Repairs & Maintenance",
    ],
  },
  {
    name: "Electronics",
    subcategories: [
      "Phones",
      "Computers & Laptops",
      "TVs & Audio",
      "Cameras",
      "Accessories",
    ],
  },
  {
    name: "Fashion & Beauty",
    subcategories: [
      "Clothing",
      "Shoes",
      "Bags & Accessories",
      "Hair & Beauty",
      "Cosmetics",
    ],
  },
  {
    name: "Food & Restaurants",
    subcategories: [
      "Restaurants",
      "Takeaways",
      "Catering",
      "Groceries",
      "Bakeries",
    ],
  },
  {
    name: "Agriculture",
    subcategories: [
      "Livestock",
      "Poultry",
      "Farming Equipment",
      "Seeds & Fertilizer",
      "Agricultural Products",
    ],
  },
  {
    name: "Health & Medical",
    subcategories: [
      "Clinics",
      "Pharmacies",
      "Medical Services",
      "Fitness & Wellness",
    ],
  },
  {
    name: "Education",
    subcategories: [
      "Schools",
      "Colleges",
      "Tutors",
      "Training",
    ],
  },
  {
    name: "Shopping & Retail",
    subcategories: [
      "Hardware",
      "Building Materials",
      "Supermarkets",
      "Wholesale",
      "General Retail",
    ],
  },
  {
    name: "Events & Entertainment",
    subcategories: [
      "Events",
      "Wedding Services",
      "Photography",
      "Entertainment",
      "Venues",
    ],
  },
  {
    name: "Other",
    subcategories: ["Other Listings"],
  },
];

const locations = [
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
];

/*
|--------------------------------------------------------------------------
| Temporary marketplace products
|--------------------------------------------------------------------------
| These are only for the first version of the Shop Zimbabwe UI.
| Later we will replace this with products from our database.
*/


export default function AdsPage() {
const [ads, setAds] = useState<Advertisement[]>([]);
const [products, setProducts] = useState<Product[]>([]);

const [loading, setLoading] = useState(true);
const [productsLoading, setProductsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const [visibleAds, setVisibleAds] = useState(12);

  useEffect(() => {
    const loadAds = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/advertisements");

        if (!response.ok) {
          throw new Error("Failed to fetch advertisements");
        }

        const data = await response.json();

        setAds(Array.isArray(data) ? data : data.ads ?? []);
      } catch (error) {
        console.error("Failed to load advertisements:", error);
        setAds([]);
      } finally {
        setLoading(false);
      }
    };

    loadAds();
  }, []);
useEffect(() => {
  const loadProducts = async () => {
    try {
      setProductsLoading(true);

      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  loadProducts();
}, []);
  const selectedCategoryData = categories.find(
    (category) => category.name === selectedCategory
  );

  const filteredAds = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return ads.filter((ad) => {
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
        !selectedCategory || ad.category === selectedCategory;

      const matchesSubcategory =
        !selectedSubcategory || ad.subcategory === selectedSubcategory;

      const matchesLocation =
        !selectedLocation || ad.location === selectedLocation;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesLocation
      );
    });
  }, [
    ads,
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    selectedLocation,
  ]);

  const featuredAds = filteredAds.filter((ad) => ad.isFeatured);

  const normalAds = filteredAds;

  const displayedAds = normalAds.slice(0, visibleAds);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedLocation("");
    setVisibleAds(12);
  };

  const whatsappLink = (phone: string | null, businessName: string) => {
    if (!phone) return "#";

    const cleanedPhone = phone.replace(/\D/g, "");

    const message = encodeURIComponent(
      `Hello ${businessName}, I saw your advertisement on ZIMBILLBOARDS MEDIA  and I'm interested.`
    );

    return `https://wa.me/${cleanedPhone}?text=${message}`;
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link
              href="/"
              className="mb-5 inline-flex items-center text-sm font-semibold text-blue-200 hover:text-white"
            >
              ← Back to Home
            </Link>

            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
              Zimbabwe's Digital Marketplace
            </p>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Discover Zimbabwe
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Find businesses, products, services, jobs, vehicles, property
              and more from across Zimbabwe.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mt-8 max-w-4xl">
            <div className="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-2xl sm:flex-row">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search advertisements, businesses, services..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setVisibleAds(12);
                  }}
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="button"
                className="h-12 rounded-xl bg-blue-700 px-7 font-bold text-white transition hover:bg-blue-800"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
    SHOP ZIMBABWE
========================================================= */}
<section className="border-b border-slate-200 bg-white">
  <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <span className="text-sm font-black uppercase tracking-wider text-blue-700">
          🛍️ Shop Zimbabwe
        </span>

        <h2 className="mt-2 text-3xl font-black text-slate-900">
          Products from local sellers
        </h2>

        <p className="mt-2 max-w-2xl text-slate-500">
          Discover products from businesses and sellers across Zimbabwe.
        </p>
      </div>

      <Link
  href="/shop"
  className="group inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-100 hover:text-blue-900 hover:shadow-sm"
>
  View All Products
  <span className="text-base transition-transform duration-200 group-hover:translate-x-1">
    →
  </span>
</Link>
    </div>

    {productsLoading ? (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <div className="aspect-square animate-pulse bg-slate-200" />

            <div className="space-y-3 p-4">
              <div className="h-4 animate-pulse rounded bg-slate-200" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200" />
              <div className="h-8 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    ) : products.length === 0 ? (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <div className="text-4xl">🛍️</div>

        <h3 className="mt-3 text-lg font-black text-slate-900">
          No products yet
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Products from Zimbabwean sellers will appear here.
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => (
<div
  key={product.id}
  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
>
            {/* PRODUCT IMAGE */}
            <div className="relative aspect-square overflow-hidden bg-slate-100">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-center">
                  <div>
                    <div className="text-4xl">📦</div>
                    <p className="mt-2 text-xs font-semibold text-slate-400">
                      No image
                    </p>
                  </div>
                </div>
              )}

              {product.stock <= 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* PRODUCT DETAILS */}
            <div className="p-4">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                {product.category}
              </span>

              <h3 className="mt-3 line-clamp-2 text-sm font-black text-slate-900">
                {product.name}
              </h3>

              <p className="mt-2 text-lg font-black text-blue-700">
                ${Number(product.price).toFixed(2)}
              </p>

              <p className="mt-1 truncate text-xs font-semibold text-slate-600">
                {product.advertiser?.businessName}
              </p>

              {product.location && (
                <p className="mt-1 text-xs text-slate-400">
                  📍 {product.location}
                </p>
              )}
<Link
  href={`/product/${product.id}`}
  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-2.5 text-xs font-bold text-white transition hover:bg-blue-800 hover:shadow-md"
>
  View Product
  <span className="transition-transform duration-200 group-hover:translate-x-1">
    →
  </span>
</Link>
              {product.advertiser?.phone && (
                <a
  href={`https://wa.me/${product.advertiser.phone.replace(
    /\D/g,
    ""
  )}?text=${encodeURIComponent(
    `Hello ${product.advertiser.businessName}, I saw your ${product.name} on ZIMBILLBOARDS MEDIA and I'm interested.`
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  onClick={(e) => e.stopPropagation()}
  className="mt-4 flex w-full items-center justify-center rounded-xl bg-green-600 py-2.5 text-xs font-bold text-white transition hover:bg-green-700 hover:shadow-md"
>
  WhatsApp Seller
</a>
              )}
                       </div>
          </div>
        ))}
      </div>
    )}
  </div>
</section>

      {/* =========================================================
          FILTERS
      ========================================================= */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* CATEGORY */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory("");
                setVisibleAds(12);
              }}
              className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="">All Categories</option>

              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* SUBCATEGORY */}
            <select
              value={selectedSubcategory}
              onChange={(e) => {
                setSelectedSubcategory(e.target.value);
                setVisibleAds(12);
              }}
              disabled={!selectedCategoryData}
              className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-500"
            >
              <option value="">All Subcategories</option>

              {selectedCategoryData?.subcategories.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>

            {/* LOCATION */}
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setVisibleAds(12);
              }}
              className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="">All Locations</option>

              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            {/* CLEAR */}
            <button
              type="button"
              onClick={clearFilters}
              className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-blue-500 hover:text-blue-700"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURED ADS
      ========================================================= */}
      {featuredAds.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-7">
            <span className="text-sm font-black uppercase tracking-wider text-orange-600">
              🔥 Featured
            </span>

            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Featured Advertisements
            </h2>

            <p className="mt-2 text-slate-500">
              Businesses paying for premium visibility appear here.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredAds.slice(0, 6).map((ad) => (
              <AdvertisementCard
                key={ad.id}
                ad={ad}
                whatsappLink={whatsappLink}
              />
            ))}
          </div>
        </section>
      )}

      {/* =========================================================
          ALL ADS
      ========================================================= */}
      <section
        id="all-advertisements"
        className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8"
      >
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-black uppercase tracking-wider text-blue-700">
              📢 Browse
            </span>

            <h2 className="mt-2 text-3xl font-black text-slate-900">
              All Advertisements
            </h2>

            <p className="mt-2 text-slate-500">
              {filteredAds.length} advertisement
              {filteredAds.length === 1 ? "" : "s"} found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="aspect-video animate-pulse bg-slate-200" />

                <div className="space-y-3 p-4">
                  <div className="h-4 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-10 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedAds.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="text-5xl">🔎</div>

            <h3 className="mt-4 text-xl font-black text-slate-900">
              No advertisements found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Try changing your search or removing one of the filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white hover:bg-blue-800"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayedAds.map((ad) => (
                <AdvertisementCard
                  key={ad.id}
                  ad={ad}
                  whatsappLink={whatsappLink}
                />
              ))}
            </div>

            {visibleAds < filteredAds.length && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleAds((current) => current + 12)}
                  className="rounded-xl bg-blue-700 px-8 py-3.5 font-bold text-white shadow-sm transition hover:bg-blue-800"
                >
                  Load More Advertisements
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

/* =============================================================
   ADVERTISEMENT CARD
============================================================= */

function AdvertisementCard({
  ad,
  whatsappLink,
}: {
  ad: Advertisement;
  whatsappLink: (phone: string | null, businessName: string) => string;
}) {
  const isVideo = (ad.mediaType ?? "").toLowerCase() === "video";

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* MEDIA */}
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        {isVideo ? (
          <video
            src={ad.mediaUrl}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={ad.mediaUrl}
            alt={ad.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}

        {/* FEATURED */}
        {ad.isFeatured && (
          <div className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-black text-white shadow">
            🔥 Featured
          </div>
        )}

        {/* MEDIA TYPE */}
        <div className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase text-white">
          {isVideo ? "Video" : "Image"}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
            {ad.category || "General"}
          </span>

          {ad.location && (
            <span className="truncate text-xs text-slate-400">
              📍 {ad.location}
            </span>
          )}
        </div>

        <h3 className="mt-3 line-clamp-2 text-lg font-black text-slate-900">
          {ad.title}
        </h3>

        <p className="mt-1 truncate text-sm font-semibold text-slate-600">
          {ad.advertiser?.businessName || "Advertiser"}
        </p>

        {ad.subcategory && (
          <p className="mt-1 text-xs text-slate-400">
            {ad.subcategory}
          </p>
        )}

        {/* WHATSAPP */}
        {ad.advertiser?.phone && (
          <a
            href={whatsappLink(
              ad.advertiser.phone,
              ad.advertiser.businessName
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center rounded-xl bg-green-600 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
          >
            WhatsApp Seller
          </a>
        )}
      </div>
    </article>
  );
}