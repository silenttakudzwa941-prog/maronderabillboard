
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(
        error.message === "Invalid login credentials"
          ? "Incorrect email or password."
          : error.message
      );

      setLoading(false);
      return;
    }

    const response = await fetch("/api/admin/check");

    if (response.ok) {
      router.push("/admin/dashboard");
      router.refresh();
      return;
    }

    router.push("/advertise");
    router.refresh();
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google login error:", error);
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

  async function handleFacebookLogin() {
    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Facebook login error:", error);
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* NAVBAR */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-950 text-xl font-black text-white">
              ZD
            </div>

            <div>
              <div className="text-lg font-black text-blue-950">
                ZimDigitalBillboard
              </div>

              <div className="text-xs text-slate-500">
                Zimbabwe&apos;s Digital Advertising Platform
              </div>
            </div>
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-yellow-400 px-5 py-3 text-sm font-bold text-blue-950 transition hover:bg-yellow-300"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* LOGIN */}
      <section className="flex min-h-[calc(100vh-82px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-950 text-2xl font-black text-white shadow-lg">
              ZD
            </div>

            <h1 className="mt-6 text-3xl font-black text-blue-950">
              Welcome back
            </h1>

            <p className="mt-3 text-slate-500">
              Log in to manage your advertising campaigns.
            </p>
          </div>

          {/* Card */}
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-9">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold text-slate-700"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-blue-700 hover:text-blue-900"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-20 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-slate-500 hover:bg-slate-100 hover:text-blue-900"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Error */}
              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {errorMessage}
                </div>
              )}

              {/* Login */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-950 px-5 py-4 font-black text-white shadow-lg transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.21 2.91-7.42Z"
                />
                <path
                  fill="#34A853"
                  d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.54 13.59A5.85 5.85 0 0 1 6.23 12c0-.55.1-1.09.31-1.59V7.88H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.12l3.24-2.53Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.49 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53C7.31 8.1 9.46 6.38 12 6.38Z"
                />
              </svg>

              Continue with Google
            </button>

            {/* Facebook Login */}
            <button
              type="button"
              onClick={handleFacebookLogin}
              disabled={loading}
              className="mt-3 flex w-full items-center justify-center gap-3 rounded-xl bg-[#1877F2] px-5 py-3.5 font-bold text-white shadow-sm transition hover:bg-[#166FE5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M13.5 21v-8h2.75l.41-3h-3.16V8.08c0-.87.24-1.46 1.49-1.46h1.59V3.94c-.28-.04-1.24-.12-2.36-.12-2.34 0-3.94 1.43-3.94 4.06V10H7.63v3h2.65v8h3.22Z" />
              </svg>

              Continue with Facebook
            </button>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                New to ZimDigitalBillboard?
              </span>

              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Signup */}
            <Link
              href="/signup"
              className="block w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-center font-bold text-blue-950 transition hover:border-blue-200 hover:bg-blue-50"
            >
              Create an advertiser account
            </Link>
          </div>

          {/* Bottom */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm font-semibold text-slate-500 hover:text-blue-900"
            >
              ← Back to ZimDigitalBillboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

