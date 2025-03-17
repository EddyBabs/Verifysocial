"use server";
import { getCurrentUser } from "@/data/user";
import { database, OrderStatus } from "@/lib/database";
import {
  compileCustomerCancellationCustomer,
  compileCustomerCancellationVendor,
  compileCustomerExtensionCustomer,
  compileCustomerExtensionVendor,
  compileOrderDelayFlagged,
  compileRequestReceived,
  compileSatisfactionEmail,
  compileVendorCancellationCustomer,
  compileVendorCancellationVendor,
  compileVendorExtensionCustomer,
  compileVendorExtensionVendor,
  compileVendorRequestCancelled,
  compileVendorRequestReceived,
  sendMail,
} from "@/lib/emails/mail";
import {
  orderCancelFormSchema,
  orderCancelFormSchemaType,
  orderConfirmationSchema,
  orderConfirmationSchemaType,
  orderDelayFormSchemaType,
  orderDelaySchema,
} from "@/schemas";
import { orderSchema } from "@/schemas/auth";
import { addDays, formatDate } from "date-fns";
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
    const { orderId, reason, otherReason, hasPaid } = validatedData.data;
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
          cancelledBy: userSession.role === "VENDOR" ? vendorId : "USER",
        },
        ...(userSession.role === "USER"
          ? {
              userPaymentConfirmation: hasPaid,
            }
          : {}),
        ...(userSession.role === "VENDOR"
          ? {
              vendorPaymentConfirmation: hasPaid,
            }
          : {}),
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

    // Customer Outright Cancellation
    if (userSession.role === "USER") {
      // Order Flagged
      if (hasPaid) {
        await Promise.all([
          sendMail({
            // to: order.user?.email || "",
            to: "emeroleikenna123@gmail.com",
            subject: "Order has been flagged",
            body: compileOrderDelayFlagged(
              order.user?.fullname || "",
              order.code
            ),
          }),
          sendMail({
            to: order.vendor.User.email,
            subject: "Order has been flagged",
            body: compileVendorRequestCancelled(
              order.vendor.User.fullname,
              order.id,
              `${process.env.NEXTAUTH_URL}/orders/${order.id}?delayReason=true`
            ),
          }),
        ]);
      } else {
        // Order Cancelled
        await Promise.all([
          sendMail({
            to: order.user?.email || "",
            subject: "Order Cancelled",
            body: compileCustomerCancellationCustomer(
              order.user?.fullname || "",
              order.code
            ),
          }),

          sendMail({
            to: order.vendor.User.email,
            subject: "Order Cancelled",
            body: compileCustomerCancellationVendor(
              order.vendor.User.fullname,
              order.code,
              reason || otherReason || "",
              `${process.env.NEXTAUTH_URL}/orders/${order.id}?customerContact=true`
            ),
          }),
        ]);
      }
    }
    return { success: "Cancelled order successfully" };
  } catch {
    return { error: "An error occured. Please try again later" };
  }
};

// Customer Cancellation
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
    extensionReason,
    cancellationReason,
  } = validatedData.data;

  if (received === "yes") {
    const order = await database.order.update({
      where: { id: orderId, userId: userSession.id },
      data: {
        status: "COMPLETED",
        userDeliveryConfirmation: true,
        resolved: true,
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

    const sanitizedRating = Math.max(rating, 0); // Ensure rating is never negative

    if (existingReview) {
      // Update: Calculate the difference to adjust the total rating
      ratingDiff = sanitizedRating - existingReview.rating;
    } else {
      // Create: Use the entire rating as the difference
      ratingDiff = sanitizedRating;
    }

    await database.review.upsert({
      where: {
        orderId: order.id,
      },
      create: {
        orderId: order.id,
        rating: sanitizedRating,
        comment,
        userId: userSession.id,
        vendorId: order.vendorId,
      },
      update: {
        rating: sanitizedRating,
        comment,
      },
    });
    const totalRating = Math.max(order.vendor.rating + ratingDiff, 0);
    const reviewCount = Math.max(
      order.vendor.reviewCount + (existingReview ? 0 : 1),
      0
    );
    const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;
    const surveyLink = `${process.env.NEXT_PUBLIC_SITE_URL}/orders/${order.id}?satisfactoryFeedback=true`;
    await database.vendor.update({
      where: {
        id: order.vendorId,
      },
      data: {
        totalRating,
        reviewCount,
        rating: Math.max(averageRating, 0),
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
        to: order.user?.email || "",
        subject: "Order Satisfaction",
        body: compileSatisfactionEmail(order.user?.fullname || "", surveyLink),
      }),

      sendMail({
        to: order.vendor.User.email,
        subject: "Order Completed",
        body: compileVendorRequestReceived(
          order.vendor.User.fullname,
          order.name
        ),
      }),

      sendMail({
        to: order.vendor.User.email,
        subject: "Order Satisfaction",
        body: compileSatisfactionEmail(order.vendor.User.fullname, surveyLink),
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
    // if (order.orderExtension.length >= 2) {
    //   return { error: "You have reached the maximum updates" };
    // }
    if (orderExtend === "yes") {
      if (!deliveryExtension) {
        return { error: "Extension delivery date is required" };
      }
      if (!extensionReason) {
        return { error: "Extension reason is required" };
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
            },
          },
        },
      });

      // Send Email  Order Extended
      await Promise.all([
        sendMail({
          to: order.user?.email || "",
          subject: "Order has been extended",
          body: compileCustomerExtensionCustomer(
            order.user?.fullname || "",
            formatDate(deliveryExtension, "PPP")
          ),
        }),
        sendMail({
          to: order.vendor.User.email,
          subject: "Order has been extended",
          body: compileCustomerExtensionVendor(
            order.vendor.User.fullname,
            order.user?.fullname || "",
            extensionReason
          ),
        }),
      ]);

      return { success: "Order has been rescheduled successfully" };
    }

    if (madePayment === "yes") {
      // Send Email Order flagged calming the customer while warning the vendor

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

      await Promise.all([
        sendMail({
          to: order.user?.email || "",
          subject: "Order has been flagged",
          body: compileOrderDelayFlagged(
            order.user?.fullname || "",
            order.code
          ),
        }),
        sendMail({
          to: order.vendor.User.email,
          subject: "Order has been flagged",
          body: compileVendorRequestCancelled(
            order.vendor.User.fullname,
            order.id,
            `${process.env.NEXTAUTH_URL}/orders/${order.id}?delayReason=true`
          ),
        }),
      ]);

      return { success: "An email will be sent tomorrow for confirmation" };
    }

    // Outright Cancellation of Customer

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
    const surveyLink = `${process.env.NEXT_PUBLIC_SITE_URL}/orders/${order.id}?satisfactoryFeedback=true`;
    await Promise.all([
      sendMail({
        to: order.user?.email || "",
        subject: "Order Cancelled",
        body: compileCustomerCancellationCustomer(
          order.user?.fullname || "",
          order.code
        ),
      }),

      sendMail({
        to: order.user?.email || "",
        subject: "Order Satisfaction",
        body: compileSatisfactionEmail(order.user?.fullname || "", surveyLink),
      }),

      sendMail({
        to: order.vendor.User.email,
        subject: "Order Cancelled",
        body: compileCustomerCancellationVendor(
          order.vendor.User.fullname,
          cancellationReason || cancelledReason,
          order.code,
          `${process.env.NEXTAUTH_URL}/orders/${order.id}?customerContact=true`
        ),
      }),

      sendMail({
        to: order.vendor.User.email,
        subject: "Order Satisfaction",
        body: compileSatisfactionEmail(order.vendor.User.fullname, surveyLink),
      }),
    ]);

    return { success: "Order has been cancelled" };
  }
  return { error: "Not handle No yet" };
};

export const delayOrder = async (values: orderDelayFormSchemaType) => {
  const userSession = await getCurrentUser();
  if (!userSession?.id) {
    redirect("/auth/signin");
  }

  if (userSession.role !== "VENDOR") {
    return { error: "Only vendors are allowed to delay the order" };
  }
  const vendor = await database.vendor.findUnique({
    where: {
      userId: userSession.id,
    },
  });
  if (!vendor) {
    redirect("/auth/signin");
  }
  const vendorId = vendor.id;

  const validatedData = orderDelaySchema.safeParse(values);
  if (validatedData.error) {
    return { error: "Invalid fields" };
  }
  const { orderId, reason, extend, deliveryExtension, hasPaid } =
    validatedData.data;

  const order = await database.order.findUnique({
    where: { id: orderId, vendorId },
    include: {
      user: true,
      vendor: {
        include: {
          User: true,
        },
      },
    },
  });

  if (!order) {
    return { error: "Order does not exist!" };
  }

  if (extend) {
    if (!deliveryExtension) {
      return { error: "New delivery is required" };
    }

    await database.order.update({
      where: {
        id: orderId,
      },
      data: {
        deliveryPeriod: deliveryExtension,
        vendorOrderExtension: {
          create: {
            reason,
            previousDeliveryDate: order.deliveryPeriod,
          },
        },
      },
    });

    await Promise.all([
      sendMail({
        to: order.user?.email || "",
        subject: "Vendor Extension",
        body: compileVendorExtensionCustomer(
          order.user?.fullname || "",
          order.code,
          order.vendor.businessName || "",
          reason,
          formatDate(deliveryExtension, "PPP")
        ),
      }),

      sendMail({
        to: order.vendor.User.email || "",
        subject: "Vendor Extension",
        body: compileVendorExtensionVendor(order.vendor.User.fullname),
      }),
    ]);

    return { success: "Rescheduled Order successfully" };
  }
  if (hasPaid) {
    await database.order.update({
      where: {
        id: order.id,
        vendorId,
      },
      data: {
        status: "CANCELLED",
        cancelled: {
          cancelledAt: new Date(),
          reason: reason,
          cancelledBy: userSession.role === "VENDOR" ? vendorId : "USER",
        },
      },

      // data: {
      //   fraudulent: true,
      //   flaggedBy: "system",
      //   fraudReason: "Has Paid and not delivering products",
      //   fraudFlaggedAt: new Date(),
      // },
    });

    // await sendMail({
    //   to: order.user?.email || "",
    //   subject: "Order has been flagged",
    //   body: compileOrderDelayFlagged(order.user?.fullname || ""),
    // });

    await Promise.all([
      sendMail({
        to: order.user?.email || "",
        subject: "Order Cancellation",
        body: compileVendorCancellationCustomer(
          order.user?.fullname || "",
          order.code,
          `${process.env.NEXTAUTH_URL}/orders/${order.id}?vendorContact=true`
        ),
      }),

      sendMail({
        to: order.vendor.User.email,
        subject: "Order Cancellation",

        body: compileVendorCancellationVendor(
          order.vendor.User.fullname,
          order.code
        ),
      }),
    ]);
    return {
      success: "Order cancelled",
    };
  }

  await database.order.update({
    where: {
      id: order.id,
      vendorId,
    },
    data: {
      status: "CANCELLED",
      cancelled: {
        cancelledAt: new Date(),
        reason: reason,
        cancelledBy: userSession.role === "VENDOR" ? vendorId : "USER",
      },
    },
  });

  await Promise.all([
    sendMail({
      to: order.user?.email || "",
      subject: "Order Cancellation",
      body: compileVendorCancellationCustomer(
        order.user?.fullname || "",
        order.code,
        `${process.env.NEXTAUTH_URL}/orders/${order.id}?vendorContact=true`
      ),
    }),

    sendMail({
      to: order.vendor.User.email,
      subject: "Order Cancellation",
      body: compileVendorCancellationVendor(
        order.vendor.User.fullname,
        order.code
      ),
    }),
  ]);
  return { success: "Order cancelled" };
};
