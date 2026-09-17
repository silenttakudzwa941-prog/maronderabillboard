"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
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
  createdAt: string;
};

const productCategories = [
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

export default function AdvertiserProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [showForm, setShowForm] = useState(false);
const [editingProductId, setEditingProductId] = useState<string | null>(
  null
);

const [deletingProductId, setDeletingProductId] = useState<string | null>(
  null
);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("Other");
  const [location, setLocation] = useState("");
  const [stock, setStock] = useState("1");

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setImageUrl("");
    setCategory("Other");
    setLocation("");
    setStock("1");

    setSelectedImage(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const startEditingProduct = (product: Product) => {
    setEditingProductId(product.id);

    setName(product.name);
    setDescription(product.description || "");
    setPrice(String(product.price));
    setImageUrl(product.imageUrl || "");
    setCategory(product.category || "Other");
    setLocation(product.location || "");
    setStock(String(product.stock));

    setSelectedImage(null);
    setImagePreview(product.imageUrl || "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a JPG, PNG or WEBP image.");
      event.target.value = "";
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Image is too large. Maximum size is 10MB.");
      event.target.value = "";
      return;
    }

    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    setImageUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadProductImage = async () => {
    if (!selectedImage) {
      return "";
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();

      formData.append("file", selectedImage);

      const response = await fetch("/api/products/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to upload product image"
        );
      }

      return data.publicUrl as string;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);

      let uploadedImageUrl = imageUrl;

      /*
       * Upload a new image if one was selected.
       */
      if (selectedImage) {
        uploadedImageUrl = await uploadProductImage();
      }

      /*
       * EDIT EXISTING PRODUCT
       */
      if (editingProductId) {
        const response = await fetch(
          `/api/products/${editingProductId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              description,
              price,
              imageUrl: uploadedImageUrl,
              category,
              location,
              stock,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to update product"
          );
        }

        alert("Product updated successfully.");

        resetForm();
        setEditingProductId(null);
        setShowForm(false);

        await loadProducts();

        return;
      }

      /*
       * CREATE NEW PRODUCT
       */
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          price,
          imageUrl: uploadedImageUrl,
          category,
          location,
          stock,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create product"
        );
      }

      alert("Product added successfully.");

      resetForm();
      setShowForm(false);

      await loadProducts();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : editingProductId
            ? "Failed to update product"
            : "Failed to create product"
      );
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/advertiser/dashboard"
            className="text-sm font-semibold text-blue-200 hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-300">
                Seller Centre
              </p>

              <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                My Products
              </h1>

              <p className="mt-2 max-w-2xl text-blue-100">
                Manage the products you want to sell on ZIMBILLBOARDS MEDIA.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm((current) => !current)}
              className="rounded-xl bg-white px-5 py-3 font-bold text-blue-900 shadow-lg transition hover:bg-blue-50"
            >
              {showForm ? "Close Form" : "+ Add Product"}
            </button>
          </div>
        </div>
      </section>

      {/* ADD PRODUCT */}
      {showForm && (
        <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900">
  {editingProductId ? "Edit Product" : "Add New Product"}
</h2>

            <p className="mt-1 text-sm text-slate-500">
  {editingProductId
    ? "Update your product details, price, image or stock."
    : "Add the product details customers will see."}
</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Product Name *
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Makita Power Drill 500W"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product..."
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* PRICE + STOCK */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Price (USD) *
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="85.00"
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* CATEGORY + LOCATION */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-500"
                  >
                    {productCategories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Location
                  </label>

                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Marondera"
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* PRODUCT IMAGE */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Product Image
                </label>

                {!imagePreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-blue-400 hover:bg-blue-50"
                  >
                    <div className="text-5xl">🖼️</div>

                    <p className="mt-3 font-bold text-slate-800">
                      Click to upload a product image
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      JPG, PNG or WEBP • Maximum 10MB
                    </p>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="mt-4 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800"
                    >
                      Choose Image
                    </button>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={removeSelectedImage}
                        className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-2 text-sm font-bold text-white transition hover:bg-black"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="p-4">
                      <p className="truncate text-sm font-bold text-slate-800">
                        {selectedImage?.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {selectedImage
                          ? `${(
                              selectedImage.size /
                              (1024 * 1024)
                            ).toFixed(2)} MB`
                          : ""}
                      </p>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-3 rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-white"
                      >
                        Choose Different Image
                      </button>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              {/* BUTTON */}
              <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploadingImage
  ? "Uploading Image..."
  : saving
    ? editingProductId
      ? "Updating Product..."
      : "Saving Product..."
    : editingProductId
      ? "Update Product"
      : "Save Product"}
                </button>

                <button
                  type="button"
                 onClick={() => {
  resetForm();
  setEditingProductId(null);
  setShowForm(false);
}}
                  disabled={saving || uploadingImage}
                  className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-900">
            Your Products
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {products.length} product
            {products.length === 1 ? "" : "s"}
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            Loading your products...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="text-5xl">📦</div>

            <h3 className="mt-4 text-xl font-black text-slate-900">
              You haven't added any products
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Add your first product and it will become available on
              the ZIMBILLBOARDS MEDIA marketplace.
            </p>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-6 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800"
            >
              + Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-video overflow-hidden bg-slate-100">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl">
                      📦
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <span className="text-xs font-bold text-blue-700">
                    {product.category}
                  </span>

                  <h3 className="mt-1 line-clamp-2 font-black text-slate-900">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-xl font-black text-blue-700">
                    ${Number(product.price).toFixed(2)}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Stock: {product.stock}
                    </span>

                    <span
                      className={`rounded-full px-2 py-1 font-bold ${
                        product.status === "active"
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                                    <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        startEditingProduct(product)
                      }
                      className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={
                        deletingProductId === product.id
                      }
                      onClick={async () => {
                        const confirmed = window.confirm(
                          `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
                        );

                        if (!confirmed) {
                          return;
                        }

                        try {
                          setDeletingProductId(product.id);

                          const response = await fetch(
                            `/api/products/${product.id}`,
                            {
                              method: "DELETE",
                            }
                          );

                          const data = await response.json();

                          if (!response.ok) {
                            throw new Error(
                              data.error ||
                                "Failed to delete product"
                            );
                          }

                          setProducts((currentProducts) =>
                            currentProducts.filter(
                              (item) =>
                                item.id !== product.id
                            )
                          );

                          alert(
                            "Product deleted successfully."
                          );
                        } catch (error) {
                          console.error(error);

                          alert(
                            error instanceof Error
                              ? error.message
                              : "Failed to delete product"
                          );
                        } finally {
                          setDeletingProductId(null);
                        }
                      }}
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingProductId === product.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}