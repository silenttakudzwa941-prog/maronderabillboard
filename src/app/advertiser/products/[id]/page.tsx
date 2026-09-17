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

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        console.error(error);

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

    const phone = product.advertiser.phone.replace(
      /[^0-9]/g,
      ""
    );

    const productUrl =
      typeof window !== "undefined"
        ? window.location.href
        : "";

    const message = `Hi, I found this product on Zim Digital Billboards.

Product: ${product.name}
Price: $${Number(product.price).toFixed(2)}
${
  product.location
    ? `Location: ${product.location}`
    : ""
}

Is this product still available?

ZDB Product:
${productUrl}`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-3xl bg-slate-200" />

            <div className="space-y-5">
              <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-12 w-40 animate-pulse rounded bg-slate-200" />
              <div className="h-32 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-5xl">📦</div>

          <h1 className="mt-5 text-2xl font-black text-slate-900">
            Product not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error ||
              "This product may have been removed or is no longer available."}
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800"
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
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/shop"
            className="text-sm font-bold text-blue-700 hover:text-blue-900"
          >
            ← Back to Marketplace
          </Link>

          <Link
            href="/"
            className="font-black text-slate-900"
          >
            ZIM DIGITAL BILLBOARDS
          </Link>
        </div>
      </header>

      {/* PRODUCT */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* IMAGE */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="aspect-square overflow-hidden bg-slate-100">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-7xl">
                  📦
                </div>
              )}
            </div>
          </div>

          {/* DETAILS */}
          <div className="flex flex-col">
            <div>
              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                {product.category}
              </span>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {product.name}
              </h1>

              <p className="mt-4 text-3xl font-black text-blue-700">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>

            {/* AVAILABILITY */}
            {availability && (
              <div
                className={`mt-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${availability.className}`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${availability.dot}`}
                />

                {availability.label}
              </div>
            )}

            {/* LOCATION */}
            {product.location && (
              <div className="mt-5 flex items-center gap-2 text-sm text-slate-600">
                <span>📍</span>
                <span>{product.location}</span>
              </div>
            )}

            {/* DESCRIPTION */}
            <div className="mt-8 border-t border-slate-200 pt-8">
              <h2 className="text-lg font-black text-slate-900">
                Product Description
              </h2>

              <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                {product.description ||
                  "The seller has not provided a description for this product."}
              </p>
            </div>

            {/* SELLER */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Seller
              </p>

              <h2 className="mt-2 text-xl font-black text-slate-900">
                {product.advertiser.businessName}
              </h2>

              {product.location && (
                <p className="mt-1 text-sm text-slate-500">
                  📍 {product.location}
                </p>
              )}
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
                : "Contact Seller on WhatsApp"}
            </button>

            {/* NOTICE */}
            <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
              <strong>Before purchasing:</strong>{" "}
              Product availability can change. Please confirm
              availability, price and collection/delivery details
              directly with the seller before making payment.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}