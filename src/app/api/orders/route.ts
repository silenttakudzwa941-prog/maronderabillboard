import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

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
} as const;

const socialPlatformPricing = {
  facebook: 10,
  instagram: 10,
  tiktok: 15,
  whatsapp: 5,
} as const;

const allowedPaymentMethods = [
  "ecocash",
  "bank",
  "cash",
] as const;

type PaymentMethod =
  (typeof allowedPaymentMethods)[number];

export async function POST(request: Request) {
  try {
    // Get the currently logged-in Supabase user
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error:
            "You must be logged in to place an order.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      packageId,
      socialPlatforms,
      paymentMethod,
      paymentReference,
    } = body;

    // Validate package
    const selectedPackage =
      packages[packageId as keyof typeof packages];

    if (!selectedPackage) {
      return NextResponse.json(
        {
          error: "Invalid advertising package.",
        },
        { status: 400 }
      );
    }

    // Validate payment method
    if (
      !allowedPaymentMethods.includes(
        paymentMethod as PaymentMethod
      )
    ) {
      return NextResponse.json(
        {
          error: "Invalid payment method.",
        },
        { status: 400 }
      );
    }

    // Validate payment reference
    if (
      typeof paymentReference !== "string" ||
      !paymentReference.trim()
    ) {
      return NextResponse.json(
        {
          error: "Payment reference is required.",
        },
        { status: 400 }
      );
    }

    // Validate social media platforms
    const requestedPlatforms = Array.isArray(
      socialPlatforms
    )
      ? socialPlatforms
      : [];

    const validPlatforms =
      requestedPlatforms.filter(
        (
          platform
        ): platform is keyof typeof socialPlatformPricing =>
          typeof platform === "string" &&
          platform in socialPlatformPricing
      );

    // Remove duplicates
    const uniquePlatforms = [
      ...new Set(validPlatforms),
    ];

    // Calculate social media charges on the server
    const socialMediaTotal =
      uniquePlatforms.reduce(
        (total, platform) =>
          total +
          socialPlatformPricing[platform],
        0
      );

    // Campaign management is $5 when social media
    // promotion is selected
    const campaignManagementFee =
      uniquePlatforms.length > 0 ? 5 : 0;

    // Calculate final price on the server
    const totalPrice =
      selectedPackage.price +
      socialMediaTotal +
      campaignManagementFee;

    // Generate unique order number
    const orderNumber = `MB-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    // Create Order + Payment together
    const order = await prisma.order.create({
      data: {
        orderNumber,

        // IMPORTANT:
        // Use the authenticated Supabase user's ID
        advertiserId: user.id,

        packageId,
        packageName: selectedPackage.name,

        billboardPrice: selectedPackage.price,
        socialMediaTotal,
        campaignManagementFee,
        totalPrice,

        status: "payment_submitted",

        payment: {
          create: {
            paymentMethod,
            paymentReference:
              paymentReference.trim(),
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

      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        packageId: order.packageId,
        packageName: order.packageName,

        billboardPrice:
          Number(order.billboardPrice),

        socialMediaTotal:
          Number(order.socialMediaTotal),

        campaignManagementFee:
          Number(
            order.campaignManagementFee
          ),

        totalPrice:
          Number(order.totalPrice),

        status: order.status,
        createdAt: order.createdAt,
      },

      payment: order.payment
        ? {
            id: order.payment.id,
            paymentMethod:
              order.payment.paymentMethod,

            paymentReference:
              order.payment.paymentReference,

            amount:
              Number(order.payment.amount),

            status: order.payment.status,
            createdAt: order.payment.createdAt,
          }
        : null,
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create your order. Please try again.",
      },
      { status: 500 }
    );
  }
}