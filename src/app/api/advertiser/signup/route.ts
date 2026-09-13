import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("SIGNUP REQUEST BODY:", body);

    const businessName = body?.businessName?.toString().trim();
    const phone = body?.phone?.toString().trim();
    const email = body?.email?.toString().trim().toLowerCase();
    const password = body?.password?.toString();

    if (!businessName || !phone || !email || !password) {
      return NextResponse.json(
        {
          error:
            "Business name, phone, email and password are required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          error: "Password must be at least 6 characters.",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const callbackUrl = new URL(
      "/auth/callback",
      request.url
    );

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          businessName,
          phone,
        },
        emailRedirectTo: callbackUrl.toString(),
      },
    });

    if (error) {
      console.error("SUPABASE SIGNUP ERROR:", error);

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        {
          error: "Supabase did not return a user.",
        },
        { status: 400 }
      );
    }

    console.log("SUPABASE USER CREATED:", data.user.id);

    await prisma.advertiser.upsert({
      where: {
        id: data.user.id,
      },
      update: {
        businessName,
        email,
        phone,
      },
      create: {
        id: data.user.id,
        businessName,
        email,
        phone,
      },
    });

    console.log("ADVERTISER CREATED IN PRISMA");

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created successfully. Please check your email to confirm your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADVERTISER SIGNUP ERROR:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while creating your account.",
      },
      { status: 500 }
    );
  }
}