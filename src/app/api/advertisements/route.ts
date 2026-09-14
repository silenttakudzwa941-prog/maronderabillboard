
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const ads = await prisma.ad.findMany({
      where: {
        status: "active",
      },
      include: {
        advertiser: {
          select: {
            businessName: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const adsWithUrls = ads.map((ad) => {
      const { data } = supabase.storage
        .from("advertisements")
        .getPublicUrl(ad.mediaUrl);

      return {
        id: ad.id,
        title: ad.title,
        mediaUrl: data.publicUrl,
        mediaType: ad.mediaType,
        duration: ad.duration,
        category: ad.category,
        location: ad.location,
        status: ad.status,
        views: ad.views,
        isFeatured: ad.isFeatured,
        createdAt: ad.createdAt,
        advertiser: ad.advertiser,
      };
    });

    return NextResponse.json(adsWithUrls);
  } catch (error) {
    console.error("Failed to fetch advertisements:", error);

    return NextResponse.json(
      { error: "Failed to fetch advertisements" },
      { status: 500 }
    );
  }
}