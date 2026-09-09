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
    // --------------------------------------------------
    // 1. CHECK AUTHENTICATION
    // --------------------------------------------------

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

    // --------------------------------------------------
    // 2. READ REQUEST
    // --------------------------------------------------

    const body = await request.json();

    const {
      packageId,

      businessName,
      advertisementTitle,
      description,
      whatsapp,

      advertisementType,
      location,
      startDate,
      endDate,

      mediaUrl,
      mediaType,

      socialPlatforms,

      paymentMethod,
      paymentReference,
    } = body;

    // --------------------------------------------------
    // 3. VALIDATE PACKAGE
    // --------------------------------------------------

    const selectedPackage =
      packages[
        packageId as keyof typeof packages
      ];

    if (!selectedPackage) {
      return NextResponse.json(
        {
          error: "Invalid advertising package.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 4. VALIDATE ADVERTISEMENT
    // --------------------------------------------------

    if (
      typeof businessName !== "string" ||
      !businessName.trim()
    ) {
      return NextResponse.json(
        {
          error: "Business name is required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof advertisementTitle !== "string" ||
      !advertisementTitle.trim()
    ) {
      return NextResponse.json(
        {
          error: "Advertisement title is required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof mediaUrl !== "string" ||
      !mediaUrl.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Advertisement media is missing. Please upload your advertisement again.",
        },
        { status: 400 }
      );
    }

    if (
      mediaType !== "image" &&
      mediaType !== "video"
    ) {
      return NextResponse.json(
        {
          error: "Invalid advertisement media type.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 5. VALIDATE PAYMENT
    // --------------------------------------------------

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

    // --------------------------------------------------
    // 6. CALCULATE SOCIAL MEDIA PRICING
    // --------------------------------------------------

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

    const uniquePlatforms = [
      ...new Set(validPlatforms),
    ];

    const socialMediaTotal =
      uniquePlatforms.reduce(
        (total, platform) =>
          total +
          socialPlatformPricing[platform],
        0
      );

    const campaignManagementFee =
      uniquePlatforms.length > 0 ? 5 : 0;

    // --------------------------------------------------
    // 7. CALCULATE FINAL PRICE ON SERVER
    // --------------------------------------------------

    const totalPrice =
      selectedPackage.price +
      socialMediaTotal +
      campaignManagementFee;

    // --------------------------------------------------
    // 8. GENERATE ORDER NUMBER
    // --------------------------------------------------

    const orderNumber =
      `MB-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

    // --------------------------------------------------
    // 9. CREATE ORDER + PAYMENT + AD
    // --------------------------------------------------

    const result = await prisma.$transaction(
      async (tx) => {
        const order = await tx.order.create({
          data: {
            orderNumber,

            advertiserId: user.id,

            packageId,
            packageName: selectedPackage.name,

            billboardPrice:
              selectedPackage.price,

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

        const ad = await tx.ad.create({
          data: {
            id: crypto.randomUUID(),

            title:
              advertisementTitle.trim(),

            mediaUrl:
              mediaUrl.trim(),

            mediaType,

            duration:
              selectedPackage.duration,

            category:
              location?.trim() || "General",

            status: "pending",

            advertiserId: user.id,
          },
        });

        return {
          order,
          ad,
        };
      }
    );

    // --------------------------------------------------
    // 10. RETURN RESULT
    // --------------------------------------------------

    return NextResponse.json({
      success: true,

      order: {
        id: result.order.id,

        orderNumber:
          result.order.orderNumber,

        packageId:
          result.order.packageId,

        packageName:
          result.order.packageName,

        billboardPrice:
          Number(
            result.order.billboardPrice
          ),

        socialMediaTotal:
          Number(
            result.order.socialMediaTotal
          ),

        campaignManagementFee:
          Number(
            result.order
              .campaignManagementFee
          ),

        totalPrice:
          Number(
            result.order.totalPrice
          ),

        status:
          result.order.status,

        createdAt:
          result.order.createdAt,
      },

      advertisement: {
        id: result.ad.id,

        title:
          result.ad.title,

        mediaUrl:
          result.ad.mediaUrl,

        mediaType:
          result.ad.mediaType,

        duration:
          result.ad.duration,

        status:
          result.ad.status,
      },

      payment: result.order.payment
        ? {
            id:
              result.order.payment.id,

            paymentMethod:
              result.order.payment
                .paymentMethod,

            paymentReference:
              result.order.payment
                .paymentReference,

            amount:
              Number(
                result.order.payment.amount
              ),

            status:
              result.order.payment.status,

            createdAt:
              result.order.payment.createdAt,
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