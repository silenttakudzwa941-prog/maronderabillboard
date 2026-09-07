import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const businessName =
      body.businessName || user.user_metadata?.businessName || "";

    const phone = body.phone || user.user_metadata?.phone || "";

    if (!businessName || !phone) {
      return NextResponse.json(
        {
          error: "Business name and phone number are required.",
        },
        { status: 400 }
      );
    }

    const advertiser = await prisma.advertiser.upsert({
      where: {
        id: user.id,
      },

      update: {
        businessName,
        phone,
        email: user.email ?? "",
      },

      create: {
        id: user.id,
        businessName,
        phone,
        email: user.email ?? "",
      },
    });

    return NextResponse.json({
      success: true,
      advertiser,
    });
  } catch (error) {
    console.error("Advertiser profile error:", error);

    return NextResponse.json(
      {
        error: "Failed to create advertiser profile.",
      },
      { status: 500 }
    );
  }
}