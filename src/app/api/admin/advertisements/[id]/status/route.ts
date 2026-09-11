import { NextResponse } from "next/server";

import { getAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    console.log("🔥 ADMIN AD STATUS ROUTE HIT");

    const admin = await getAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const body = await request.json();
    const status = body.status;

    if (status !== "active" && status !== "rejected") {
      return NextResponse.json(
        {
          error: "Invalid status. Use active or rejected.",
        },
        { status: 400 }
      );
    }

    const advertisement = await prisma.ad.findUnique({
      where: {
        id,
      },
    });

    if (!advertisement) {
      return NextResponse.json(
        {
          error: "Advertisement not found",
        },
        { status: 404 }
      );
    }

    const updatedAdvertisement = await prisma.ad.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    console.log(
      "✅ Advertisement status updated:",
      updatedAdvertisement.id,
      updatedAdvertisement.status
    );

    return NextResponse.json({
      success: true,
      message:
        status === "active"
          ? "Advertisement approved successfully."
          : "Advertisement rejected successfully.",
      advertisement: updatedAdvertisement,
    });
  } catch (error) {
    console.error(
      "❌ Advertisement status API error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update advertisement status",
      },
      { status: 500 }
    );
  }
}