import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const admin = await getAdmin();

  if (!admin) {
    redirect("/advertiser/login?error=admin_required");
  }

  const [advertiserCount, advertisementCount, orderCount, paymentCount] =
    await Promise.all([
      prisma.advertiser.count(),
      prisma.ad.count(),
      prisma.order.count(),
      prisma.payment.count(),
    ]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl bg-blue-950 p-8 text-white shadow-lg">
          <p className="text-sm font-semibold text-blue-200">
            MaronderaBillboard
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-blue-100">
            Welcome back, {admin.name || admin.email}.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Advertisers
            </p>

            <p className="mt-2 text-3xl font-black text-blue-950">
              {advertiserCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Advertisements
            </p>

            <p className="mt-2 text-3xl font-black text-blue-950">
              {advertisementCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Orders
            </p>

            <p className="mt-2 text-3xl font-black text-blue-950">
              {orderCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Payments
            </p>

            <p className="mt-2 text-3xl font-black text-blue-950">
              {paymentCount}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
