import { handleApiError } from "@/lib/api/error";
import { database } from "@/lib/database";
import { compileOrderDeliveryConfirmation, sendMail } from "@/lib/emails/mail";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    // await verifyVercelSignature(req);
    const orders = await database.order.findMany({
      where: {
        deliveryPeriod: {
          lt: new Date(),
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
      })
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    const { status, error: newError } = handleApiError(error);
    return NextResponse.json({ error: newError }, { status });
  }
}
