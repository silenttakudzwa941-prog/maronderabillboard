import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const advertiser = await prisma.advertiser.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        businessName: true,
        email: true,
        phone: true,

        ads: {
          select: {
            id: true,
            title: true,
            mediaUrl: true,
            mediaType: true,
            duration: true,
            category: true,
            status: true,
            views: true,
            isFeatured: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },

        orders: {
          select: {
            id: true,
            orderNumber: true,
            packageId: true,
            packageName: true,
            billboardPrice: true,
            socialMediaTotal: true,
            campaignManagementFee: true,
            totalPrice: true,
            status: true,
            createdAt: true,
            updatedAt: true,

            payment: {
              select: {
                id: true,
                paymentMethod: true,
                paymentReference: true,
                amount: true,
                status: true,
                verifiedAt: true,
                createdAt: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!advertiser) {
      return NextResponse.json(
        { error: "Advertiser profile not found" },
        { status: 404 }
      );
    }

    const totalAds = advertiser.ads.length;

    const activeAds = advertiser.ads.filter(
      (ad) => ad.status.toLowerCase() === "active"
    ).length;

    const pendingAds = advertiser.ads.filter(
      (ad) => ad.status.toLowerCase() === "pending"
    ).length;

    const rejectedAds = advertiser.ads.filter(
      (ad) => ad.status.toLowerCase() === "rejected"
    ).length;

    const completedAds = advertiser.ads.filter(
      (ad) => ad.status.toLowerCase() === "completed"
    ).length;

    const totalViews = advertiser.ads.reduce(
      (total, ad) => total + ad.views,
      0
    );

    const totalOrders = advertiser.orders.length;

    const pendingOrders = advertiser.orders.filter(
      (order) => order.status.toLowerCase() === "pending"
    ).length;

    const paidOrders = advertiser.orders.filter((order) => {
      const orderStatus = order.status.toLowerCase();
      const paymentStatus = order.payment?.status?.toLowerCase();

      return (
        orderStatus === "paid" ||
        orderStatus === "confirmed" ||
        orderStatus === "completed" ||
        paymentStatus === "paid" ||
        paymentStatus === "verified"
      );
    }).length;

    const totalSpent = advertiser.orders.reduce(
      (total, order) => total + Number(order.totalPrice),
      0
    );

    const pendingPayments = advertiser.orders.filter((order) => {
      const paymentStatus = order.payment?.status?.toLowerCase();

      return !order.payment || paymentStatus === "pending";
    }).length;

    const verifiedPayments = advertiser.orders.filter((order) => {
      const paymentStatus = order.payment?.status?.toLowerCase();

      return (
        paymentStatus === "verified" ||
        paymentStatus === "paid"
      );
    }).length;

    return NextResponse.json({
      id: advertiser.id,
      businessName: advertiser.businessName,
      email: advertiser.email,
      phone: advertiser.phone,

      stats: {
        totalAds,
        activeAds,
        pendingAds,
        rejectedAds,
        completedAds,
        totalViews,

        totalOrders,
        pendingOrders,
        paidOrders,

        totalSpent,

        pendingPayments,
        verifiedPayments,
      },

      ads: advertiser.ads,

      orders: advertiser.orders.map((order) => ({
        ...order,
        billboardPrice: Number(order.billboardPrice),
        socialMediaTotal: Number(order.socialMediaTotal),
        campaignManagementFee: Number(order.campaignManagementFee),
        totalPrice: Number(order.totalPrice),

        payment: order.payment
          ? {
              ...order.payment,
              amount: Number(order.payment.amount),
            }
          : null,
      })),
    });
  } catch (error) {
    console.error("Advertiser profile error:", error);

    return NextResponse.json(
      { error: "Failed to load advertiser profile" },
      { status: 500 }
    );
  }
}