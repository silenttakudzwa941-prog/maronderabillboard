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
        {
          error: "You must be logged in to create an advertiser profile.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      businessName,
      phone,
    } = body;

    if (!businessName || !phone) {
      return NextResponse.json(
        {
          error: "Business name and phone are required.",
        },
        { status: 400 }
      );
    }

    const existingAdvertiser = await prisma.advertiser.findUnique({
      where: {
        id: user.id,
      },
    });

    if (existingAdvertiser) {
      return NextResponse.json({
        advertiser: existingAdvertiser,
        message: "Advertiser profile already exists.",
      });
    }

    const advertiser = await prisma.advertiser.create({
      data: {
        id: user.id,
        businessName: businessName.trim(),
        email: user.email!.trim().toLowerCase(),
        phone: phone.trim(),
      },
    });

    return NextResponse.json(
      {
        advertiser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Advertiser signup error:", error);

    return NextResponse.json(
      {
        error: "Unable to create advertiser profile.",
      },
      { status: 500 }
    );
  }
}