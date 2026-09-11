import { NextResponse } from "next/server";

import { getAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    console.log("🔥 ADMIN PAYMENT STATUS ROUTE HIT");

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

    const { id } = await context.params;

    const body = await request.json();

    const paymentId = body.paymentId;
    const status = body.status;

    if (
      status !== "verified" &&
      status !== "rejected"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid payment status. Use verified or rejected.",
        },
        {
          status: 400,
        }
      );
    }

    if (!paymentId) {
      return NextResponse.json(
        {
          error: "Payment ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Make sure the order exists and the payment
    // actually belongs to this order.
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        payment: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          error: "Order not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (!order.payment) {
      return NextResponse.json(
        {
          error: "This order has no payment record.",
        },
        {
          status: 404,
        }
      );
    }

    if (order.payment.id !== paymentId) {
      return NextResponse.json(
        {
          error:
            "Payment does not belong to this order.",
        },
        {
          status: 400,
        }
      );
    }

    const updatedPayment =
      await prisma.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status,
          verifiedAt:
            status === "verified"
              ? new Date()
              : null,
        },
      });

    // Keep the order status synchronized with
    // the payment status.
    await prisma.order.update({
      where: {
        id,
      },
      data: {
        status:
          status === "verified"
            ? "paid"
            : "payment_rejected",
      },
    });

    console.log(
      "✅ Payment status updated:",
      updatedPayment.id,
      updatedPayment.status
    );

    return NextResponse.json({
      success: true,
      message:
        status === "verified"
          ? "Payment verified successfully."
          : "Payment rejected successfully.",
      payment: updatedPayment,
    });
  } catch (error) {
    console.error(
      "❌ Payment status API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update payment status.",
      },
      {
        status: 500,
      }
    );
  }
}