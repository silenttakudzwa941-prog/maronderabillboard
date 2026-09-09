"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

const locations = [
  "Marondera CBD",
  "Marondera East",
  "Marondera West",
  "Harare Road",
  "Mutoko Road",
];

const socialPlatformPricing = {
  facebook: 10,
  instagram: 10,
  tiktok: 15,
  whatsapp: 5,
};

const campaignManagementFee = 5;

function CreateAdvertisementContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const packageId = searchParams.get("package") || "starter";

  const selectedPackage =
    packages[packageId as keyof typeof packages] || packages.starter;

  const [businessName, setBusinessName] = useState("");
  const [advertisementTitle, setAdvertisementTitle] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [advertisementType, setAdvertisementType] = useState<
    "image" | "video"
  >("image");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState("");
  const [socialPlatforms, setSocialPlatforms] = useState<string[]>([]);

  useEffect(() => {
    if (!mediaFile || advertisementType !== "image") {
      setMediaPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(mediaFile);
    setMediaPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [mediaFile, advertisementType]);

  // SOCIAL MEDIA PRICING
  const socialMediaTotal = socialPlatforms.reduce((total, platform) => {
    return (
      total +
      (socialPlatformPricing[
        platform as keyof typeof socialPlatformPricing
      ] || 0)
    );
  }, 0);

  // TOTAL PRICE
  const totalPrice =
    selectedPackage.price +
    socialMediaTotal +
    (socialPlatforms.length > 0 ? campaignManagementFee : 0);

  // AUTOMATIC END DATE
  const endDate = useMemo(() => {
    if (!startDate) return "";

    const date = new Date(startDate);

    date.setDate(date.getDate() + selectedPackage.duration);

    return date.toISOString().split("T")[0];
  }, [startDate, selectedPackage.duration]);

  // FILE UPLOAD
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setMediaFile(file);
  };

  // CONTINUE TO PAYMENT
  const handleContinue = () => {
    const missingFields: string[] = [];

    if (!businessName.trim()) {
      missingFields.push("Business Name");
    }

    if (!advertisementTitle.trim()) {
      missingFields.push("Advertisement Title");
    }

    if (!description.trim()) {
      missingFields.push("Advertisement Description");
    }

    if (!whatsapp.trim()) {
      missingFields.push("WhatsApp Number");
    }

    if (!location) {
      missingFields.push("Billboard Location");
    }

    if (!startDate) {
      missingFields.push("Start Date");
    }

    if (missingFields.length > 0) {
      alert(
        `Please complete the following required field${
          missingFields.length > 1 ? "s" : ""
        }:\n\n${missingFields.join("\n")}`
      );

      return;
    }

    const advertisementData = {
      packageId,
      businessName: businessName.trim(),
      socialPlatforms,
      socialMediaTotal,
      campaignManagementFee:
        socialPlatforms.length > 0 ? campaignManagementFee : 0,
      totalPrice,
      advertisementTitle: advertisementTitle.trim(),
      description: description.trim(),
      whatsapp: whatsapp.trim(),
      advertisementType,
      location,
      startDate,
      endDate,
      mediaFileName: mediaFile?.name || null,
    };

    sessionStorage.setItem(
      "marondera-billboard-advertisement",
      JSON.stringify(advertisementData)
    );

    router.push(`/advertise/payment?package=${packageId}`);
  };

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
            href="/advertise"
            className="text-sm font-bold text-slate-600 hover:text-blue-900"
          >
            ← Change Package
          </Link>
        </div>
      </header>

      {/* PAGE INTRO */}
      <section className="px-6 pb-8 pt-14">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-900">
            📢 Create Your Advertisement
          </div>

          <h1 className="mt-5 text-4xl font-black text-blue-950 md:text-5xl">
            Tell Us About Your Advertisement
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-500">
            Provide the details of your advertisement and choose where and
            when you would like it displayed.
          </p>
        </div>
      </section>

      {/* PROGRESS */}
      <section className="px-6 pb-10">
        <div className="mx-auto flex max-w-3xl items-center justify-center">
          {/* STEP 1 */}
          <div className="flex items-center text-blue-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 font-black text-white">
              ✓
            </div>

            <span className="ml-3 hidden text-sm font-bold sm:block">
              Package
            </span>
          </div>

          <div className="mx-4 h-px w-12 bg-blue-900 sm:w-24" />

          {/* STEP 2 */}
          <div className="flex items-center text-blue-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 font-black text-white">
              2
            </div>

            <span className="ml-3 text-sm font-bold">
              Advertisement
            </span>
          </div>

          <div className="mx-4 h-px w-12 bg-slate-300 sm:w-24" />

          {/* STEP 3 */}
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

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* FORM */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            {/* SELECTED PACKAGE */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="text-xs font-black uppercase tracking-wide text-blue-600">
                    Selected Package
                  </div>

                  <div className="mt-1 text-xl font-black text-blue-950">
                    {selectedPackage.name} Package
                  </div>

                  <div className="mt-1 text-sm font-semibold text-slate-500">
                    {selectedPackage.duration} days ·{" "}
                    {selectedPackage.advertisements} advertisement
                    {selectedPackage.advertisements > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="text-3xl font-black text-blue-900">
                  ${selectedPackage.price}
                </div>
              </div>
            </div>

            {/* BUSINESS DETAILS */}
            <div className="mt-8">
              <h2 className="text-xl font-black text-blue-950">
                Business Details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Tell customers who is behind the advertisement.
              </p>

              <div className="mt-6 grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Business Name *
                  </label>

                  <input
                    type="text"
                    value={businessName}
                    onChange={(event) =>
                      setBusinessName(event.target.value)
                    }
                    placeholder="e.g. Takudzwa Butchery"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    WhatsApp Number *
                  </label>

                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(event) =>
                      setWhatsapp(event.target.value)
                    }
                    placeholder="e.g. 077 123 4567"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* ADVERTISEMENT DETAILS */}
            <div className="mt-10 border-t border-slate-200 pt-8">
              <h2 className="text-xl font-black text-blue-950">
                Advertisement Details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Create the message customers will see.
              </p>

              <div className="mt-6 grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Advertisement Title *
                  </label>

                  <input
                    type="text"
                    value={advertisementTitle}
                    onChange={(event) =>
                      setAdvertisementTitle(event.target.value)
                    }
                    placeholder="e.g. Fresh Beef Available Today!"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Advertisement Description *
                  </label>

                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    rows={5}
                    placeholder="Describe your products, services, special offer or promotion..."
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                  />

                  <div className="mt-2 text-right text-xs text-slate-400">
                    {description.length} characters
                  </div>
                </div>
              </div>
            </div>

            {/* MEDIA */}
            <div className="mt-10 border-t border-slate-200 pt-8">
              <h2 className="text-xl font-black text-blue-950">
                Advertisement Media
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload the image or video you want customers to see.
              </p>

              {/* TYPE */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setAdvertisementType("image")}
                  className={`rounded-xl border-2 p-4 text-left transition ${
                    advertisementType === "image"
                      ? "border-blue-900 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="text-2xl">🖼️</div>

                  <div className="mt-2 font-black text-blue-950">
                    Image
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    Upload a promotional image
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAdvertisementType("video")}
                  className={`rounded-xl border-2 p-4 text-left transition ${
                    advertisementType === "video"
                      ? "border-blue-900 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="text-2xl">🎥</div>

                  <div className="mt-2 font-black text-blue-950">
                    Video
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    Upload a promotional video
                  </div>
                </button>
              </div>

              {/* UPLOAD */}
              <div className="mt-5">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition hover:border-blue-500 hover:bg-blue-50">
                  <div className="text-4xl">
                    {advertisementType === "image"
                      ? "🖼️"
                      : "🎥"}
                  </div>

                  <div className="mt-4 font-black text-blue-950">
                    {mediaFile
                      ? mediaFile.name
                      : `Upload your ${advertisementType}`}
                  </div>

                  <div className="mt-2 text-sm text-slate-500">
                    Click to choose a file from your device
                  </div>

                  <input
                    type="file"
                    accept={
                      advertisementType === "image"
                        ? "image/*"
                        : "video/*"
                    }
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* PLATFORMS */}
            <div className="mt-10 border-t border-slate-200 pt-8">
              <h2 className="text-xl font-black text-blue-950">
                Where Should Your Advertisement Appear?
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                MaronderaBillboard is included with every advertising
                package. You can also choose additional social media
                platforms.
              </p>

              {/* MARONDERA BILLBOARD */}
              <div className="mt-6 rounded-2xl border-2 border-blue-900 bg-blue-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900 text-xl">
                      🖥️
                    </div>

                    <div>
                      <div className="font-black text-blue-950">
                        MaronderaBillboard
                      </div>

                      <div className="mt-1 text-sm text-slate-600">
                        Included with your advertising package
                      </div>

                      <div className="mt-2 inline-flex rounded-full bg-blue-900 px-3 py-1 text-xs font-black text-white">
                        REQUIRED
                      </div>
                    </div>
                  </div>

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-900 text-white">
                    ✓
                  </div>
                </div>
              </div>

              {/* SOCIAL MEDIA PLATFORMS */}
              <div className="mt-6">
                <div className="text-sm font-black text-blue-950">
                  Choose Additional Social Media Platforms
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      id: "facebook",
                      name: "Facebook",
                      description:
                        "Promote your advertisement on Facebook.",
                    },
                    {
                      id: "instagram",
                      name: "Instagram",
                      description:
                        "Reach customers through Instagram.",
                    },
                    {
                      id: "tiktok",
                      name: "TikTok",
                      description:
                        "Promote your business on TikTok.",
                    },
                    {
                      id: "whatsapp",
                      name: "WhatsApp",
                      description:
                        "Promote your advertisement through WhatsApp.",
                    },
                  ].map((platform) => {
                    const selected = socialPlatforms.includes(
                      platform.id
                    );

                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => {
                          setSocialPlatforms((current) =>
                            current.includes(platform.id)
                              ? current.filter(
                                  (item) =>
                                    item !== platform.id
                                )
                              : [...current, platform.id]
                          );
                        }}
                        className={`rounded-2xl border-2 p-5 text-left transition ${
                          selected
                            ? "border-blue-700 bg-blue-50 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                              {platform.id === "facebook" && (
                                <FaFacebook className="text-[#1877F2]" />
                              )}

                              {platform.id === "instagram" && (
                                <FaInstagram className="text-[#E4405F]" />
                              )}

                              {platform.id === "tiktok" && (
                                <FaTiktok className="text-black" />
                              )}

                              {platform.id === "whatsapp" && (
                                <FaWhatsapp className="text-[#25D366]" />
                              )}
                            </div>

                            <div>
                              <div className="font-black text-blue-950">
                                {platform.name}
                              </div>

                              <div className="mt-1 text-xs leading-5 text-slate-500">
                                {platform.description}
                              </div>
                            </div>
                          </div>

                          <div
                            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                              selected
                                ? "border-blue-900 bg-blue-900 text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {selected && (
                              <span className="text-xs font-black">
                                ✓
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* SELECTED PLATFORMS */}
                <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  <span className="font-bold text-slate-700">
                    Selected platforms:
                  </span>{" "}
                  {socialPlatforms.length > 0
                    ? socialPlatforms
                        .map(
                          (platform) =>
                            platform.charAt(0).toUpperCase() +
                            platform.slice(1)
                        )
                        .join(", ")
                    : "MaronderaBillboard only"}
                </div>

                {/* SOCIAL MEDIA COST */}
                {socialPlatforms.length > 0 && (
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="font-black text-blue-950">
                      Social Media Campaign Cost
                    </div>

                    <div className="mt-4 space-y-3 text-sm">
                      {socialPlatforms.map((platform) => (
                        <div
                          key={platform}
                          className="flex items-center justify-between"
                        >
                          <span className="flex items-center gap-2 text-slate-600">
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

                          <span className="font-bold text-slate-800">
                            $
                            {socialPlatformPricing[
                              platform as keyof typeof socialPlatformPricing
                            ].toFixed(2)}
                          </span>
                        </div>
                      ))}

                      <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                        <span className="text-slate-600">
                          Campaign Management
                        </span>

                        <span className="font-bold text-slate-800">
                          ${campaignManagementFee.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                        <span className="font-black text-blue-950">
                          Social Media Total
                        </span>

                        <span className="text-xl font-black text-blue-900">
                          $
                          {(
                            socialMediaTotal +
                            campaignManagementFee
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* LOCATION & DATES */}
            <div className="mt-10 border-t border-slate-200 pt-8">
              <h2 className="text-xl font-black text-blue-950">
                Advertising Schedule
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose where and when your advertisement should run.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Billboard Location *
                  </label>

                  <select
                    value={location}
                    onChange={(event) =>
                      setLocation(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Select location</option>

                    {locations.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Start Date *
                  </label>

                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) =>
                      setStartDate(event.target.value)
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    End Date
                  </label>

                  <input
                    type="date"
                    value={endDate}
                    readOnly
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
                  />

                  {startDate && (
                    <div className="mt-2 text-xs font-semibold text-blue-700">
                      Automatically calculated from your package.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CONTINUE */}
            <div className="mt-10 border-t border-slate-200 pt-8">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full rounded-xl bg-blue-900 px-6 py-4 text-lg font-black text-white shadow-lg transition hover:bg-blue-800"
              >
                Continue to Payment →
              </button>

              <p className="mt-3 text-center text-xs text-slate-400">
                You will review your advertisement before completing
                payment.
              </p>
            </div>
          </div>

          {/* PREVIEW */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <div className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Live Preview
                </div>

                <div className="mt-1 text-lg font-black text-blue-950">
                  How your advertisement will appear
                </div>
              </div>

              {/* AD PREVIEW */}
              <div className="bg-slate-950 p-5">
                <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
                  {/* MEDIA PREVIEW */}
                  <div className="flex aspect-video items-center justify-center bg-slate-200">
                    {mediaFile &&
mediaPreviewUrl &&
advertisementType === "image" ? (
  <img
    src={mediaPreviewUrl}
    alt="Advertisement preview"
    className="h-full w-full object-cover"
  />
) : (
                      <div className="text-center">
                        <div className="text-5xl">
                          {advertisementType === "image"
                            ? "🖼️"
                            : "🎥"}
                        </div>

                        <div className="mt-3 text-sm font-bold text-slate-500">
                          Your {advertisementType} will appear here
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AD CONTENT */}
                  <div className="p-5">
                    <div className="text-xs font-bold uppercase tracking-wide text-blue-600">
                      {businessName || "Your Business"}
                    </div>

                    <div className="mt-2 text-xl font-black text-blue-950">
                      {advertisementTitle ||
                        "Your Advertisement Title"}
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {description ||
                        "Your advertisement description will appear here."}
                    </p>

                    {location && (
                      <div className="mt-4 text-xs font-bold text-slate-500">
                        📍 {location}
                      </div>
                    )}

                    {whatsapp && (
                      <div className="mt-4 rounded-xl bg-green-500 px-4 py-3 text-center text-sm font-black text-white">
                        💬 WhatsApp: {whatsapp}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* PACKAGE SUMMARY */}
              <div className="border-t border-slate-200 p-6">
                <div className="text-sm font-black text-blue-950">
                  Package Summary
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Package
                    </span>

                    <span className="font-bold text-slate-800">
                      {selectedPackage.name}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Duration
                    </span>

                    <span className="font-bold text-slate-800">
                      {selectedPackage.duration} days
                    </span>
                  </div>

                  {/* SOCIAL MEDIA SUMMARY */}
                  {socialPlatforms.length > 0 && (
                    <>
                      <div className="border-t border-slate-200 pt-3">
                        <div className="font-black text-blue-950">
                          Social Media
                        </div>

                        <div className="mt-2 space-y-2">
                          {socialPlatforms.map((platform) => (
                            <div
                              key={platform}
                              className="flex items-center justify-between"
                            >
                              <span className="flex items-center gap-2 text-slate-500">
                                {platform === "facebook" && (
                                  <FaFacebook className="text-[#1877F2]" />
                                )}

                                {platform === "instagram" && (
                                  <FaInstagram className="text-[#E4405F]" />
                                )}

                                {platform === "tiktok" && (
                                  <FaTiktok className="text-black" />
                                )}

                                {platform === "whatsapp" && (
                                  <FaWhatsapp className="text-[#25D366]" />
                                )}

                                {platform.charAt(0).toUpperCase() +
                                  platform.slice(1)}
                              </span>

                              <span className="font-bold text-slate-700">
                                $
                                {socialPlatformPricing[
                                  platform as keyof typeof socialPlatformPricing
                                ].toFixed(2)}
                              </span>
                            </div>
                          ))}

                          <div className="flex justify-between text-slate-500">
                            <span>Management</span>
                            <span>
                              ${campaignManagementFee.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* TOTAL */}
                  <div className="flex justify-between border-t border-slate-200 pt-3">
                    <span className="font-black text-blue-950">
                      Total
                    </span>

                    <span className="text-xl font-black text-blue-900">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
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

export default function CreateAdvertisement() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateAdvertisementContent />
    </Suspense>
  );
}
