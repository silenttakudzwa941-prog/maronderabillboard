
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const redirectPath =
    searchParams.get("redirect") || "/advertiser/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/advertiser/login`);
  }

  try {
    const supabase = await createClient();

    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("Auth callback error:", exchangeError);

      return NextResponse.redirect(
        `${origin}/advertiser/login?error=confirmation_failed`
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.redirect(
        `${origin}/advertiser/login?error=user_not_found`
      );
    }

    const businessName =
      user.user_metadata?.businessName || "";

    const phone =
      user.user_metadata?.phone || "";

    if (!businessName || !phone || !user.email) {
      return NextResponse.redirect(
        `${origin}/advertiser/login?error=profile_incomplete`
      );
    }

    await prisma.advertiser.upsert({
      where: {
        id: user.id,
      },

      update: {
        businessName,
        phone,
        email: user.email,
      },

      create: {
        id: user.id,
        businessName,
        phone,
        email: user.email,
      },
    });

    /*
     * Only allow internal redirects.
     * This prevents the redirect parameter from
     * sending users to an external website.
     */
    const safeRedirect =
      redirectPath.startsWith("/") &&
      !redirectPath.startsWith("//")
        ? redirectPath
        : "/advertiser/dashboard";

    return NextResponse.redirect(
      `${origin}${safeRedirect}`
    );
  } catch (error) {
    console.error("Auth callback error:", error);

    return NextResponse.redirect(
      `${origin}/advertiser/login?error=callback_failed`
    );
  }
}

