import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

async function getAuthorizedAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const admin = await prisma.admin.findUnique({
    where: {
      id: user.id,
    },
  });

  return admin;
}

export async function GET() {
  try {
    const admin = await getAuthorizedAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 403 }
      );
    }

    const subscriptions =
      await prisma.sellerSubscription.findMany({
        include: {
          advertiser: {
            select: {
              id: true,
              businessName: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error(
      "GET SELLER SUBSCRIPTIONS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load seller subscriptions.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await getAuthorizedAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const subscriptionId = String(
      body.subscriptionId || ""
    ).trim();

    const action = String(
      body.action || ""
    ).trim().toLowerCase();

    if (!subscriptionId) {
      return NextResponse.json(
        {
          error: "Subscription ID is required.",
        },
        { status: 400 }
      );
    }

    if (
      action !== "activate" &&
      action !== "reject"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid action. Use activate or reject.",
        },
        { status: 400 }
      );
    }

    const subscription =
      await prisma.sellerSubscription.findUnique({
        where: {
          id: subscriptionId,
        },
      });

    if (!subscription) {
      return NextResponse.json(
        {
          error: "Seller subscription not found.",
        },
        { status: 404 }
      );
    }

    if (action === "reject") {
      const rejected =
        await prisma.sellerSubscription.update({
          where: {
            id: subscription.id,
          },
          data: {
            status: "rejected",
          },
        });

      return NextResponse.json({
        success: true,
        message:
          "Seller subscription rejected.",
        subscription: rejected,
      });
    }

    if (subscription.status === "active") {
      if (
        subscription.expiresAt &&
        subscription.expiresAt > new Date()
      ) {
        return NextResponse.json(
          {
            error:
              "This seller subscription is already active.",
          },
          { status: 400 }
        );
      }
    }

    const startsAt = new Date();

    const expiresAt = new Date(startsAt);

    expiresAt.setDate(
      expiresAt.getDate() + 30
    );

    const activated =
      await prisma.sellerSubscription.update({
        where: {
          id: subscription.id,
        },
        data: {
          status: "active",
          startsAt,
          expiresAt,
        },
      });

    return NextResponse.json({
      success: true,
      message:
        "Seller subscription activated for 30 days.",
      subscription: activated,
    });
  } catch (error) {
    console.error(
      "UPDATE SELLER SUBSCRIPTION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update seller subscription.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}