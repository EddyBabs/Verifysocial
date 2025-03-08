"use server";

import { getCurrentUser } from "@/data/user";
import { database } from "@/lib/database";
import {
  compileVendorPaymentReversalCustomer,
  sendMail,
} from "@/lib/emails/mail";
import {
  vendorCustomerContactSchema,
  vendorCustomerContactSchemaType,
} from "@/schemas";
import { redirect } from "next/navigation";

export const vendorCustomerFeedback = async (
  values: vendorCustomerContactSchemaType
) => {
  const userSession = await getCurrentUser();
  if (!userSession || userSession.role !== "VENDOR") {
    redirect("/auth/signin");
  }
  const validatedField = vendorCustomerContactSchema.safeParse(values);
  if (validatedField.error) {
    return { error: "Invalid Fields" };
  }
  const { resolved, orderId, customerPayment } = validatedField.data;
  const order = await database.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });
  if (!order) {
    return { error: "Could not find order" };
  }
  if (resolved) {
    await database.order.update({
      where: {
        id: orderId,
      },
      data: {
        vendorPaymentConfirmation: customerPayment,
      },
    });
    await sendMail({
      //   to: order.user?.email || "",
      to: "holuwadanzy@gmail.com",
      subject: "Order Resolved",
      body: compileVendorPaymentReversalCustomer(
        order.user?.fullname || "",
        order.code
      ),
    });
    return { success: "Order has been resolved" };
  }
  return { success: `Order not resolved yet` };
};
