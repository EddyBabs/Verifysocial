"use server";
import { getCurrentUser } from "@/data/user";
import { database, OrderStatus } from "@/lib/database";
import {
  compileRequestCancelled,
  compileRequestReceived,
  compileVendorRequestCancelled,
  compileVendorRequestReceived,
  sendMail,
} from "@/lib/emails/mail";
import {
  orderCancelFormSchema,
  orderCancelFormSchemaType,
  orderConfirmationSchema,
  orderConfirmationSchemaType,
} from "@/schemas";
import { orderSchema } from "@/schemas/auth";
import { addDays } from "date-fns";
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
            `${process.env.NEXTAUTH_URL}/vendor/${order.vendorId}?vendorCode=${order.code}`
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

  let vendorId = "";
  if (userSession.role === "VENDOR") {
    const vendor = await database.vendor.findUnique({
      where: {
        userId: userSession.id,
      },
    });
    if (!vendor) {
      redirect("/auth/signin");
    }
    vendorId = vendor.id;
  }

  const orders = await database.order.findMany({
    where: {
      ...(userSession.role === "VENDOR"
        ? {
            vendorId,
          }
        : {
            userId: userSession.id,
          }),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
};

export const fetchUserOrderById = async (orderId: string) => {
  const userSession = await getCurrentUser();
  if (!userSession?.id) {
    redirect("/auth/signin");
  }
  let vendorId = "";
  if (userSession.role === "VENDOR") {
    const vendor = await database.vendor.findUnique({
      where: {
        userId: userSession.id,
      },
    });
    if (!vendor) {
      redirect("/auth/signin");
    }
    vendorId = vendor.id;
  }
  const order = await database.order.findUnique({
    where: {
      id: orderId,
      ...(userSession.role === "VENDOR"
        ? {
            vendorId,
          }
        : {
            userId: userSession.id,
          }),
    },
  });

  if (!order) {
    return notFound();
  }
  return order;
};

export const cancelOrder = async (values: orderCancelFormSchemaType) => {
  try {
    const userSession = await getCurrentUser();
    if (!userSession?.id) {
      redirect("/auth/signin");
    }
    let vendorId = "";
    if (userSession.role === "VENDOR") {
      const vendor = await database.vendor.findUnique({
        where: {
          userId: userSession.id,
        },
      });
      if (!vendor) {
        redirect("/auth/signin");
      }
      vendorId = vendor.id;
    }
    const validatedData = orderCancelFormSchema.safeParse(values);
    if (validatedData.error) {
      return { error: "Invalid fields" };
    }
    const { orderId, reason, otherReason } = validatedData.data;
    if (reason === "Other" && !otherReason)
      return { error: "Other reason is required" };

    const cancelledReason = reason === "Other" ? otherReason || "" : reason;
    const order = await database.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "CANCELLED",
        cancelled: {
          cancelledAt: new Date(),
          reason: cancelledReason,
          cancelledBy:
            userSession.role === "VENDOR" ? vendorId : userSession.id,
        },
      },
      include: {
        user: true,
        vendor: {
          include: {
            User: true,
          },
        },
      },
    });
    await Promise.all([
      sendMail({
        to: order.user?.email || "",
        subject: "Order Cancelled",
        body: compileRequestCancelled(
          order.user?.fullname || "",
          order.name,
          cancelledReason
        ),
      }),

      sendMail({
        to: order.vendor.User.email,
        subject: "Order Cancelled",
        body: compileVendorRequestCancelled(
          order.name,
          `${process.env.NEXTAUTH_URL}/order/${order.id}`,
          cancelledReason
        ),
      }),
    ]);
    return { success: "Cancelled order successfully" };
  } catch {
    return { error: "An error occured. Please try again later" };
  }
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

  const {
    rating,
    received,
    comment,
    orderId,
    orderExtend,
    deliveryExtension,
    vendorContact,
    madePayment,
  } = validatedData.data;

  if (received === "yes") {
    const order = await database.order.update({
      where: { id: orderId, userId: userSession.id },
      data: {
        status: "COMPLETED",
      },
      include: {
        vendor: {
          select: {
            User: true,
            id: true,
            rating: true,
            reviewCount: true,
          },
        },
        user: true,
      },
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

    await database.review.upsert({
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
    await Promise.all([
      sendMail({
        to: order.user?.email || "",
        subject: "Order Completed",
        body: compileRequestReceived(
          order.user?.fullname || "",
          order.name,
          `${process.env.NEXTAUTH_URL}/orders/${order.id}`
        ),
      }),

      sendMail({
        to: order.vendor.User.email,
        subject: "Order Completed",
        body: compileVendorRequestReceived(
          order.vendor.User.fullname,
          order.name
        ),
      }),
    ]);
    return { success: "Order completed successfully" };
  } else if (received === "no") {
    const order = await database.order.findUnique({
      where: { id: orderId },
      include: {
        vendor: {
          select: {
            User: true,
            id: true,
            rating: true,
            reviewCount: true,
          },
        },
        user: true,
        orderExtension: true,
      },
    });
    if (!order) {
      return { error: "Invalid Order" };
    }
    if (order.orderExtension.length >= 2) {
      return { error: "You have reached the maximum updates" };
    }
    if (orderExtend === "yes") {
      if (!deliveryExtension) {
        return { error: "Extension delivery date is required" };
      }
      await database.order.update({
        where: {
          id: orderId,
        },
        data: {
          deliveryPeriod: deliveryExtension,

          orderExtension: {
            create: {
              previousDeliveryDate: order.deliveryPeriod,
              hasBeenContacted: vendorContact === "yes" ? true : false,
              // newDeliveryDate: deliveryExtension,
            },
          },
        },
      });

      return { success: "Order has been rescheduled successfully" };
    }

    if (madePayment === "yes") {
      await database.order.update({
        where: {
          id: orderId,
        },
        data: {
          deliveryPeriod: addDays(new Date(), 1),
          orderExtension: {
            create: {
              previousDeliveryDate: order.deliveryPeriod,
              hasBeenContacted: vendorContact === "yes" ? true : false,
              hasMadePayment: true,
            },
          },
        },
      });

      return { success: "An email will be sent tomorrow for confirmation" };
    }

    const cancelledReason = "Long wait time";
    await database.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "CANCELLED",
        cancelled: {
          reason: cancelledReason,
          cancelledAt: new Date(),
          cancelledBy: userSession.id,
        },
      },
    });

    await Promise.all([
      sendMail({
        to: order.user?.email || "",
        subject: "Order Cancelled",
        body: compileRequestCancelled(
          order.user?.fullname || "",
          order.name,
          cancelledReason
        ),
      }),

      sendMail({
        to: order.vendor.User.email,
        subject: "Order Cancelled",
        body: compileVendorRequestCancelled(
          order.name,
          `${process.env.NEXTAUTH_URL}/order/${order.id}`,
          cancelledReason
        ),
      }),
    ]);

    return { success: "Order has been cancelled" };
  }
  return { error: "Not handle No yet" };
};
