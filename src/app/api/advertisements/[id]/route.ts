import { NextResponse } from "next/server";

import { getAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check that the current user is an admin
    const admin = await getAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await params;

    // Find the advertisement
    const advertisement = await prisma.ad.findUnique({
      where: {
        id,
      },
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
    });

    if (!advertisement) {
      return NextResponse.json(
        {
          error: "Advertisement not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      advertisement,
    });
  } catch (error) {
    console.error(
      "Admin advertisement fetch error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load advertisement",
      },
      {
        status: 500,
      }
    );
  }
}