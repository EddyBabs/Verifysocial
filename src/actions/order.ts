"use server";
import { getCurrentUser } from "@/data/user";
import { database, OrderStatus } from "@/lib/database";
import {
  compileRequestReceived,
  compileVendorRequestReceived,
  sendMail,
} from "@/lib/emails/mail";
import { orderSchema } from "@/schemas/auth";
import * as z from "zod";

type orderSchemaType = z.infer<typeof orderSchema>;

export const fillOrder = async (values: orderSchemaType) => {
  const userSession = await getCurrentUser();
  const validatedFields = orderSchema.safeParse(values);
  if (validatedFields.error) {
    return { error: "Invalid Fields" };
  }
  const validatedData = validatedFields.data;
  const updateOrder = await database.order.findUnique({
    where: {
      code: validatedData.code,
      status: OrderStatus.PENDING,
    },
  });
  if (!updateOrder) {
    return { error: "Order does not exist" };
  }

  if (updateOrder.userId) {
    if (updateOrder.userId !== userSession?.id)
      return {
        error:
          "This order has already been used by another customer. Please request for a new code.",
      };
    return { error: "This order has already been filled by you" };
  }

  const { value, date } = validatedData;

  if (value < updateOrder.minAmount || value > updateOrder.maxAmount) {
    return { error: "Order value does not correlate with the vendor" };
  }

  if (
    new Date(date).getTime() != new Date(updateOrder.deliveryPeriod).getTime()
  ) {
    return { error: "Delivery date does not correlate with the vendor" };
  }

  const order = await database.order.update({
    where: {
      id: updateOrder.id,
    },
    data: {
      amountValue: value,
      userId: userSession?.id,
      status: OrderStatus.PROCESSING,
    },
    include: {
      vendor: {
        include: {
          User: true,
        },
      },
    },
  });
  if (order) {
    if (userSession?.email) {
      await Promise.all([
        sendMail({
          to: userSession.email,
          subject: "Request Received",
          body: compileRequestReceived(
            userSession.fullname,
            order.name,
            `https://verifysocial.vercel.app/vendor/${order.vendorId}?vendorCode=${order.code}`
          ),
        }),

        sendMail({
          to: order.vendor.User.email,
          subject: "Request Confirmed",
          body: compileVendorRequestReceived(
            order.vendor.User.fullname,
            order.name
          ),
        }),
      ]);
    }
    return { success: "Order is processing" };
  }
  return { error: "Unable to process order" };
};

export const fetchUserOrders = async () => {
  const userSession = await getCurrentUser();
  if (!userSession?.id) {
    return [];
  }
  const orders = await database.order.findMany({
    where: { userId: userSession.id },
  });
  return orders;
};
