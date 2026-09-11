import { NextResponse } from "next/server";

import { getAdmin } from "@/lib/auth/admin";

export async function GET() {
  try {
    const admin = await getAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          authorized: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json({
      authorized: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error(
      "Admin authorization check error:",
      error
    );

    return NextResponse.json(
      {
        authorized: false,
        error: "Authorization check failed.",
      },
      {
        status: 500,
      }
    );
  }
}