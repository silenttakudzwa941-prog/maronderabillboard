import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const SELLER_MONTHLY_PRICE = 50;

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          authenticated: false,
          isSeller: false,
          status: "unauthenticated",
        },
        { status: 401 }
      );
    }

    const advertiser = await prisma.advertiser.findUnique({
      where: {
        id: user.id,
      },
      include: {
        sellerSubscription: true,
      },
    });

    if (!advertiser) {
      return NextResponse.json(
        {
          authenticated: true,
          isSeller: false,
          status: "no_profile",
        },
        { status: 404 }
      );
    }

    const subscription = advertiser.sellerSubscription;

    if (!subscription) {
      return NextResponse.json({
        authenticated: true,
        isSeller: false,
        status: "not_subscribed",
        planName: null,
        amount: SELLER_MONTHLY_PRICE,
        startsAt: null,
        expiresAt: null,
      });
    }

    const now = new Date();

    const isActive =
      subscription.status === "active" &&
      subscription.expiresAt !== null &&
      subscription.expiresAt > now;

    if (
      subscription.status === "active" &&
      subscription.expiresAt !== null &&
      subscription.expiresAt <= now
    ) {
      await prisma.sellerSubscription.update({
        where: {
          id: subscription.id,
        },
        data: {
          status: "expired",
        },
      });

      return NextResponse.json({
        authenticated: true,
        isSeller: false,
        status: "expired",
        planName: subscription.planName,
        amount: Number(subscription.amount),
        startsAt: subscription.startsAt,
        expiresAt: subscription.expiresAt,
      });
    }

    return NextResponse.json({
      authenticated: true,
      isSeller: isActive,
      status: subscription.status,
      planName: subscription.planName,
      amount: Number(subscription.amount),
      startsAt: subscription.startsAt,
      expiresAt: subscription.expiresAt,
    });
  } catch (error) {
    console.error("SELLER SUBSCRIPTION GET ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to check seller subscription",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}