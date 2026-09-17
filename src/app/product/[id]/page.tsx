"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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

export default function PublicProductPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/products?id=${encodeURIComponent(productId)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load product"
          );
        }

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("Product not found");
        }

        setProduct(data[0]);
      } catch (error) {
        console.error("PUBLIC PRODUCT ERROR:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const getAvailability = () => {
    if (!product) {
      return null;
    }

    if (product.stock <= 0) {
      return {
        label: "Out of Stock",
        className: "bg-red-50 text-red-700",
        dot: "bg-red-500",
      };
    }

    if (product.stock <= 3) {
      return {
        label: "Limited Stock",
        className: "bg-amber-50 text-amber-700",
        dot: "bg-amber-500",
      };
    }

    return {
      label: "In Stock",
      className: "bg-green-50 text-green-700",
      dot: "bg-green-500",
    };
  };

  const openWhatsApp = () => {
    if (!product?.advertiser.phone) {
      alert(
        "This seller has not provided a WhatsApp number."
      );
      return;
    }

    if (product.stock <= 0) {
      return;
    }

    const phone = product.advertiser.phone.replace(
      /[^0-9]/g,
      ""
    );

    const productUrl =
      typeof window !== "undefined"
        ? window.location.href
        : "";

    const message = `Hi, I found your product on ZIMBILLBOARDS MEDIA.

Product: ${product.name}
Price: $${Number(product.price).toFixed(2)}
${
  product.location
    ? `Location: ${product.location}`
    : ""
}

Is this product still available?

Product Link:
${productUrl}`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  const shareProduct = async () => {
    const productUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name || "Product",
          text: `Check out ${product?.name || "this product"} on ZIMBILLBOARDS MEDIA.`,
          url: productUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(productUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("SHARE ERROR:", error);
    }
  };

  const copyProductLink = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("COPY LINK ERROR:", error);

      alert(
        "Unable to copy the product link. Please copy the URL from your browser."
      );
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-3xl bg-slate-200" />

            <div className="space-y-5">
              <div className="h-6 w-28 animate-pulse rounded bg-slate-200" />

              <div className="h-12 w-3/4 animate-pulse rounded bg-slate-200" />

              <div className="h-10 w-40 animate-pulse rounded bg-slate-200" />

              <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />

              <div className="h-16 animate-pulse rounded-2xl bg-slate-200" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-6xl">📦</div>

          <h1 className="mt-5 text-2xl font-black text-slate-900">
            Product Not Found
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {error ||
              "This product may have been removed or is no longer available."}
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex rounded-xl bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
          >
            ← Browse Marketplace
          </Link>
        </div>
      </main>
    );
  }

  const availability = getAvailability();

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/shop"
            className="flex items-center gap-2 text-sm font-bold text-slate-700 transition hover:text-slate-950"
          >
            <span>←</span>
            <span>Back to Marketplace</span>
          </Link>

          <Link
            href="/"
            className="text-right font-black tracking-tight text-slate-950"
          >
            ZIMBILLBOARDS MEDIA
          </Link>
        </div>
      </header>

      {/* PRODUCT */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          {/* IMAGE */}
          <div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="aspect-square overflow-hidden bg-slate-100">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-8xl">
                    📦
                  </div>
                )}
              </div>
            </div>

            {/* SHARE ACTIONS */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={shareProduct}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                ↗️ Share Product
              </button>

              <button
                type="button"
                onClick={copyProductLink}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                {copied
                  ? "✓ Link Copied"
                  : "🔗 Copy Link"}
              </button>
            </div>
          </div>

          {/* DETAILS */}
          <div className="flex flex-col">
            {/* CATEGORY */}
            <span className="inline-flex w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              {product.category}
            </span>

            {/* TITLE */}
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {product.name}
            </h1>

            {/* PRICE */}
            <p className="mt-5 text-4xl font-black text-slate-950">
              ${Number(product.price).toFixed(2)}
            </p>

            {/* AVAILABILITY */}
            {availability && (
              <div
                className={`mt-5 flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${availability.className}`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${availability.dot}`}
                />

                {availability.label}

                {product.stock > 0 &&
                  product.stock <= 3 && (
                    <span>
                      · Only {product.stock} left
                    </span>
                  )}
              </div>
            )}

            {/* LOCATION */}
            {product.location && (
              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-600">
                <span className="text-lg">📍</span>
                <span>{product.location}</span>
              </div>
            )}

            {/* DESCRIPTION */}
            <div className="mt-8 border-t border-slate-200 pt-8">
              <h2 className="text-lg font-black text-slate-950">
                Product Description
              </h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                {product.description ||
                  "The seller has not provided a description for this product."}
              </p>
            </div>

            {/* SELLER */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Sold By
              </p>

              <h2 className="mt-2 text-xl font-black text-slate-950">
                {product.advertiser.businessName}
              </h2>

              {product.location && (
                <p className="mt-2 text-sm text-slate-500">
                  📍 {product.location}
                </p>
              )}

              <p className="mt-3 text-xs text-slate-400">
                Contact the seller directly to confirm
                availability and arrange collection or
                delivery.
              </p>
            </div>

            {/* WHATSAPP */}
            <button
              type="button"
              onClick={openWhatsApp}
              disabled={
                product.stock <= 0 ||
                !product.advertiser.phone
              }
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-green-600 px-6 py-4 text-lg font-black text-white shadow-lg transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <span className="text-2xl">💬</span>

              {product.stock <= 0
                ? "Currently Out of Stock"
                : !product.advertiser.phone
                  ? "Seller WhatsApp Unavailable"
                  : "Contact Seller on WhatsApp"}
            </button>

            {/* BUYER NOTICE */}
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              <p className="font-black">
                Before you pay
              </p>

              <p className="mt-1">
                Product availability can change. Confirm
                availability, final price, seller details
                and collection/delivery arrangements
                directly with the seller before making
                payment.
              </p>
            </div>

            {/* PLATFORM NOTICE */}
            <div className="mt-4 rounded-2xl bg-slate-100 p-4 text-xs leading-5 text-slate-500">
              ZIMBILLBOARDS MEDIA connects buyers with
              sellers. Payments and fulfilment are arranged
              directly between the buyer and seller.
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-slate-950">
            Looking for something else?
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Browse more products from local sellers.
          </p>

          <Link
            href="/shop"
            className="mt-5 inline-flex rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Browse Marketplace →
          </Link>
        </div>
      </section>
    </main>
  );
}