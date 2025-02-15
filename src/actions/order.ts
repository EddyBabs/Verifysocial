"use server";
import { getCurrentUser } from "@/data/user";
import { database, OrderStatus } from "@/lib/database";
import {
  compileRequestReceived,
  compileVendorRequestReceived,
  sendMail,
} from "@/lib/emails/mail";
import {
  orderConfirmationSchema,
  orderConfirmationSchemaType,
} from "@/schemas";
import { orderSchema } from "@/schemas/auth";
import { notFound, redirect } from "next/navigation";
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

export const fetchUserOrderById = async (orderId: string) => {
  const userSession = await getCurrentUser();
  if (!userSession?.id) {
    redirect("/auth/signin");
  }
  const order = await database.order.findUnique({
    where: { id: orderId, userId: userSession.id },
  });
  if (!order) {
    return notFound();
  }
  return order;
};

export const userOrderConfirmation = async (
  values: orderConfirmationSchemaType
) => {
  const userSession = await getCurrentUser();
  if (!userSession?.id) {
    redirect("/auth/signin");
  }
  const validatedData = orderConfirmationSchema.safeParse(values);

  if (validatedData.error) {
    return { error: "Invalidated Fields" };
  }

  const { rating, received, comment, orderId } = validatedData.data;
  if (received === "yes") {
    const order = await database.order.update({
      where: { id: orderId },
      data: {
        status: "COMPLETED",
      },
      include: { vendor: true },
    });
    if (!order) {
      return { error: "Invalid Order" };
    }
    const existingReview = await database.review.findUnique({
      where: { orderId: order.id },
    });

    let ratingDiff = 0;

    if (existingReview) {
      // Update: Calculate the difference to adjust the total rating
      ratingDiff = rating - existingReview.rating;
    } else {
      // Create: Use the entire rating as the difference
      ratingDiff = rating;
    }

    const reivew = await database.review.upsert({
      where: {
        orderId,
      },
      create: {
        orderId,
        rating,
        comment,
        userId: userSession.id,
        vendorId: order.vendorId,
      },
      update: {
        rating,
        comment,
      },
    });
    const totalRating = order.vendor.rating + ratingDiff;
    const reviewCount = order.vendor.reviewCount + (existingReview ? 0 : 1);
    const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

    await database.vendor.update({
      where: {
        id: order.vendorId,
      },
      data: {
        totalRating,
        reviewCount,
        rating: averageRating,
      },
    });
    return { success: "Order completed successfully" };
  }
  return { error: "Not handle No yet" };
};
