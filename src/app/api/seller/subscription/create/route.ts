import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const SELLER_MONTHLY_PRICE = 50;

const allowedPaymentMethods = [
  "ecocash",
  "bank",
  "cash",
];

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "You must be logged in to become a seller.",
        },
        { status: 401 }
      );
    }

    const advertiser = await prisma.advertiser.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!advertiser) {
      return NextResponse.json(
        {
          error: "Advertiser profile not found.",
        },
        { status: 404 }
      );
    }

    const existingSubscription =
      await prisma.sellerSubscription.findUnique({
        where: {
          advertiserId: advertiser.id,
        },
      });

    if (
      existingSubscription &&
      existingSubscription.status === "active" &&
      existingSubscription.expiresAt &&
      existingSubscription.expiresAt > new Date()
    ) {
      return NextResponse.json(
        {
          error: "You already have an active seller subscription.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const paymentMethod = String(
      body.paymentMethod || ""
    ).trim().toLowerCase();

    const paymentReference = String(
      body.paymentReference || ""
    ).trim();

    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json(
        {
          error:
            "Please select a valid payment method.",
        },
        { status: 400 }
      );
    }

    if (!paymentReference) {
      return NextResponse.json(
        {
          error:
            "Payment reference is required.",
        },
        { status: 400 }
      );
    }

    if (paymentReference.length < 3) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid payment reference.",
        },
        { status: 400 }
      );
    }

    const subscriptionData = {
      planName: "Seller",
      amount: SELLER_MONTHLY_PRICE,
      status: "pending",
      paymentMethod,
      paymentReference,
      startsAt: null,
      expiresAt: null,
    };

    let subscription;

    if (existingSubscription) {
      subscription =
        await prisma.sellerSubscription.update({
          where: {
            advertiserId: advertiser.id,
          },
          data: subscriptionData,
        });
    } else {
      subscription =
        await prisma.sellerSubscription.create({
          data: {
            advertiserId: advertiser.id,
            ...subscriptionData,
          },
        });
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Seller subscription submitted successfully. Your payment will be reviewed before seller access is activated.",
        subscription: {
          id: subscription.id,
          planName: subscription.planName,
          amount: Number(subscription.amount),
          status: subscription.status,
          paymentMethod:
            subscription.paymentMethod,
          paymentReference:
            subscription.paymentReference,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "CREATE SELLER SUBSCRIPTION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to submit seller subscription.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}