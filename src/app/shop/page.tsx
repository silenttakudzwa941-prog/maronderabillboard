"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  "All Categories",
  "Electronics",
  "Cars & Vehicles",
  "Property",
  "Furniture & Home",
  "Fashion & Beauty",
  "Food & Restaurants",
  "Agriculture",
  "Health & Medical",
  "Education",
  "Shopping & Retail",
  "Business & Services",
  "Events & Entertainment",
  "Other",
];

const locations = [
  "All Locations",
  "Marondera CBD",
  "Marondera East",
  "Marondera West",
  "Harare Road",
  "Mutoko Road",
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");

  const loadProducts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (category !== "All Categories") {
        params.set("category", category);
      }

      if (location !== "All Locations") {
        params.set("location", location);
      }

      const response = await fetch(
        `/api/products?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("SHOP PRODUCTS ERROR:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [category, location]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    loadProducts();
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold">
  🛍️ ZIMBILLBOARDS MARKETPLACE
</div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Find Products From Local Businesses & Sellers
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
             Discover products and services from businesses and
sellers on ZIMBILLBOARDS MEDIA. Browse local listings
and contact sellers directly on WhatsApp.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
  <Link
    href="/advertiser/seller"
    className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
  >
    Become a Seller →
  </Link>

  <Link
    href="/advertiser/dashboard"
    className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
  >
    Seller Dashboard
  </Link>
</div>
          </div>
        </div>
      </section>

      {/* SEARCH + FILTERS */}
      <section className="border-b border-slate-200 bg-white px-6 py-6">
        <div className="mx-auto max-w-7xl">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-4 lg:flex-row"
          >
            {/* SEARCH */}
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Search products
              </label>

              <div className="flex">
                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search for products..."
                  className="w-full rounded-l-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

                <button
                  type="submit"
                  className="rounded-r-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Search
                </button>
              </div>
            </div>

            {/* CATEGORY */}
            <div className="w-full lg:w-64">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* LOCATION */}
            <div className="w-full lg:w-64">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Location
              </label>

              <select
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                {locations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Marketplace
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-950">
                Products
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                {loading
                  ? "Finding products..."
                  : `${products.length} ${
                      products.length === 1
                        ? "product"
                        : "products"
                    } available`}
              </p>
            </div>

           <div className="flex flex-wrap items-center gap-4">
  <Link
    href="/"
    className="text-sm font-semibold text-slate-700 transition hover:text-slate-950"
  >
    ← Home
  </Link>

  <Link
    href="/ads"
    className="text-sm font-semibold text-slate-700 transition hover:text-slate-950"
  >
    Advertisements
  </Link>
</div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="h-56 animate-pulse bg-slate-200" />

                  <div className="space-y-3 p-5">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                    <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
                    <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EMPTY */}
          {!loading && products.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
              <div className="text-5xl">🛍️</div>

              <h3 className="mt-5 text-2xl font-bold text-slate-950">
                No products found
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
                We couldn't find any products matching your search
                or filters. Try a different search or category.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All Categories");
                  setLocation("All Locations");
                }}
                className="mt-6 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* PRODUCT GRID */}
          {!loading && products.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => {
                const isOutOfStock = product.stock <= 0;
                const isLimitedStock =
                  product.stock > 0 && product.stock <= 3;

                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* IMAGE */}
                    <div className="relative h-56 overflow-hidden bg-slate-100">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-6xl">
                          📦
                        </div>
                      )}

                      {/* CATEGORY */}
                      <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                        {product.category}
                      </div>

                      {/* STOCK */}
                      {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/55">
                          <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950 shadow">
                            Out of Stock
                          </span>
                        </div>
                      )}

                      {!isOutOfStock && isLimitedStock && (
                        <div className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-900 shadow">
                          Only {product.stock} left
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-5">
                      <h3 className="line-clamp-2 text-lg font-bold text-slate-950 transition group-hover:text-slate-700">
                        {product.name}
                      </h3>

                      <p className="mt-2 text-2xl font-bold text-slate-950">
                        ${Number(product.price).toFixed(2)}
                      </p>

                      <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                        <p className="flex items-center gap-2 text-sm text-slate-600">
                          <span>🏪</span>
                          <span className="truncate">
                            {product.advertiser.businessName}
                          </span>
                        </p>

                        {product.location && (
                          <p className="flex items-center gap-2 text-sm text-slate-500">
                            <span>📍</span>
                            <span>{product.location}</span>
                          </p>
                        )}
                      </div>

                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700">
                          View Product
                        </span>

                        <span className="text-lg transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* SELLER CTA */}
          <div className="mt-16 overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-white sm:px-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Are you a business owner?
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  Sell your products on ZIMBILLBOARDS MEDIA
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Put your products in front of customers and let
                  them contact you directly. No complicated checkout
                  process — just genuine conversations with buyers.
                </p>
              </div>

              <Link
                href="/advertiser/products"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                Add Your Products →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}