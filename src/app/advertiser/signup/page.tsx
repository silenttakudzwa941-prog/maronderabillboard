
"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdvertiserSignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const redirectPath =
    searchParams.get("redirect") || "/advertiser/dashboard";

  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const callbackUrl = new URL(
        "/auth/callback",
        window.location.origin
      );

      callbackUrl.searchParams.set("redirect", redirectPath);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,

        options: {
          data: {
            businessName,
            phone,
          },

          emailRedirectTo: callbackUrl.toString(),
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Account could not be created.");
        setLoading(false);
        return;
      }

      setMessage(
        "Account created successfully. Please check your email to confirm your account."
      );

      setLoading(false);
    } catch (error) {
      console.error("Signup error:", error);

      setError("Something went wrong while creating your account.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <button
            type="button"
            onClick={() => router.push("/advertise")}
            className="text-sm font-bold text-blue-700 hover:text-blue-900"
          >
            ← Back to advertising
          </button>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Create advertiser account
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Create an account to advertise on MaronderaBillboard.
          </p>

          {redirectPath !== "/advertiser/dashboard" && (
            <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
              <p className="font-bold">
                You're almost ready to advertise.
              </p>

              <p className="mt-1">
                After confirming your email, you'll be taken back to
                your advertisement.
              </p>
            </div>
          )}

          <form onSubmit={handleSignup} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Business name
              </label>

              <input
                type="text"
                value={businessName}
                onChange={(event) =>
                  setBusinessName(event.target.value)
                }
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="Your business name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Phone number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="077..."
              />
            </div>

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
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
                minLength={6}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="At least 6 characters"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
                <p className="font-bold">Account created!</p>

                <p className="mt-1">
                  {message}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-50"
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an advertiser account?
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/advertiser/login${
                    redirectPath !== "/advertiser/dashboard"
                      ? `?redirect=${encodeURIComponent(
                          redirectPath
                        )}`
                      : ""
                  }`
                )
              }
              className="mt-2 font-bold text-blue-700 hover:text-blue-900"
            >
              Sign in →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

