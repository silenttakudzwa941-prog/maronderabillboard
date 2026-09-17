import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
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

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const adsWithUrls = ads.map((ad) => {
      let mediaUrl = ad.mediaUrl;

      /*
       * Existing uploads may have been stored as:
       *
       * userId/file.png
       *
       * while newer uploads may already contain:
       *
       * https://....supabase.co/storage/v1/object/public/advertisements/...
       */

      if (
        supabaseUrl &&
        mediaUrl &&
        !mediaUrl.startsWith("http://") &&
        !mediaUrl.startsWith("https://")
      ) {
        const cleanPath = mediaUrl.replace(/^\/+/, "");

        mediaUrl =
          `${supabaseUrl}/storage/v1/object/public/advertisements/${cleanPath}`;
      }

      return {
        id: ad.id,
        title: ad.title,
        mediaUrl,
        mediaType: ad.mediaType,
        duration: ad.duration,
        category: ad.category,
        subcategory: ad.subcategory,
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
    console.error(
      "Failed to fetch advertisements:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch advertisements",
      },
      {
        status: 500,
      }
    );
  }
}