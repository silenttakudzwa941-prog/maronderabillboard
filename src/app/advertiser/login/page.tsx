"use client";

import { FormEvent, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function AdvertiserLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const redirectPath =
    searchParams.get("redirect") || "/advertiser/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(redirectPath);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <Link
            href="/advertise"
            className="text-sm font-bold text-blue-700 hover:text-blue-900"
          >
            ← Back to advertising
          </Link>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Advertiser login
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Sign in to continue creating your advertisement.
          </p>

          {redirectPath !== "/advertiser/dashboard" && (
            <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
              Sign in to continue with your selected advertising package.
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email address
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="Your password"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Don't have an advertiser account?
            </p>

            <Link
              href={`/advertiser/signup${
                redirectPath !== "/advertiser/dashboard"
                  ? `?redirect=${encodeURIComponent(redirectPath)}`
                  : ""
              }`}
              className="mt-2 inline-block font-bold text-blue-700 hover:text-blue-900"
            >
              Create Advertiser Account →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
export default function AdvertiserLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdvertiserLoginContent />
    </Suspense>
  );
}