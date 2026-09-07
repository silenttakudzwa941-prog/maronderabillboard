import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      advertiserId,
      packageId,
      packageName,
      billboardPrice,
      socialMediaTotal,
      campaignManagementFee,
      totalPrice,
      paymentMethod,
      paymentReference,
    } = body;

    if (!advertiserId) {
      return NextResponse.json(
        { error: "Advertiser ID is required" },
        { status: 400 }
      );
    }

    if (!packageId || !packageName) {
      return NextResponse.json(
        { error: "Package information is required" },
        { status: 400 }
      );
    }

    if (!paymentMethod || !paymentReference) {
      return NextResponse.json(
        { error: "Payment information is required" },
        { status: 400 }
      );
    }

    const advertiser = await prisma.advertiser.findUnique({
      where: {
        id: advertiserId,
      },
    });

    if (!advertiser) {
      return NextResponse.json(
        { error: "Advertiser not found" },
        { status: 404 }
      );
    }

    const orderNumber = `MB-${Date.now()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        advertiserId,

        packageId,
        packageName,

        billboardPrice,
        socialMediaTotal: socialMediaTotal || 0,
        campaignManagementFee: campaignManagementFee || 0,
        totalPrice,

        status: "payment_submitted",

        payment: {
          create: {
            paymentMethod,
            paymentReference,
            amount: totalPrice,
            status: "pending",
          },
        },
      },

      include: {
        payment: true,
      },
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return NextResponse.json(
      {
        error: "Failed to create order",
      },
      { status: 500 }
    );
  }
}