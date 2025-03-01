import { handleApiError } from "@/lib/api/error";
import { database } from "@/lib/database";
import {
  compileOrderDeliveryConfirmation,
  compileVendorOrderDeliveryConfirmation,
  sendMail,
} from "@/lib/emails/mail";
import { verifyVercelSignature } from "@/lib/verify-vercel";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await verifyVercelSignature(req);
    const orders = await database.order.findMany({
      where: {
        deliveryPeriod: {
          lte: new Date(),
        },
        status: "PROCESSING",
      },
      include: {
        user: {
          select: {
            fullname: true,
            email: true,
          },
        },
        vendor: {
          select: {
            User: {
              select: {
                email: true,
                fullname: true,
              },
            },
          },
        },
      },
    });

    await Promise.all(
      orders.map(async (order) => {
        await sendMail({
          to: order.user?.email || "",
          subject: "Order delivery Confirmation",
          body: compileOrderDeliveryConfirmation(
            order.user?.fullname || "",
            `${process.env.NEXTAUTH_URL}/orders/${order.id}`
          ),
        });

        await sendMail({
          to: order.vendor.User.email,
          subject: "Order Pending delivery - Action required",
          body: compileVendorOrderDeliveryConfirmation(
            order.vendor.User.fullname,
            order.code,
            `${process.env.NEXTAUTH_URL}/orders/${order.id}?delayReason=true`
          ),
        });
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    const { status, error: newError } = handleApiError(error);
    return NextResponse.json({ error: newError }, { status });
  }
}
