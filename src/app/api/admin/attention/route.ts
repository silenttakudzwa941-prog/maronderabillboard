import { NextResponse } from "next/server";

import { getAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const admin = await getAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [pendingAds, pendingPayments, pendingOrders] =
      await Promise.all([
        prisma.ad.count({
          where: {
            status: "pending",
          },
        }),

        prisma.payment.count({
          where: {
            status: "pending",
          },
        }),

        prisma.order.count({
          where: {
            status: "pending",
          },
        }),
      ]);

    return NextResponse.json({
      pendingAds,
      pendingPayments,
      pendingOrders,
    });
  } catch (error) {
    console.error("Admin attention error:", error);

    return NextResponse.json(
      { error: "Failed to load admin attention data" },
      { status: 500 }
    );
  }
}