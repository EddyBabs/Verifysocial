"use server";
import { getCurrentUser } from "@/data/user";
import { CodeStatus, database, OrderStatus } from "@/lib/database";
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
  compileVendorConfirmationEmail,
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
import { createAccountTransaction } from "./transaction";

type orderSchemaType = z.infer<typeof orderSchema>;

export const fillOrder = async (values: orderSchemaType) => {
  const userSession = await getCurrentUser();
  if (!userSession?.id) {
    return { error: "Access Denied" };
  }
  const validatedFields = orderSchema.safeParse(values);
  if (validatedFields.error) {
    return { error: "Invalid Fields" };
  }

  const validatedData = validatedFields.data;
  const code = await database.code.findUnique({
    where: {
      value: validatedData.code,
      status: CodeStatus.PENDING,
    },
    include: {
      order: {
        select: {
          id: true,
          user: true,
          userId: true,
        },
      },
    },
  });

  if (!code) {
    return { error: "Order does not exist" };
  }

  if (code.order) {
    if (code.order.userId !== userSession?.id)
      return {
        error:
          "This order has already been used by another customer. Please request for a new code.",
      };
    return { error: "This order has already been filled by you" };
  }

  const { date } = validatedData;

  if (new Date(date).getTime() != new Date(code.deliveryPeriod).getTime()) {
    return { error: "Delivery date does not correlate with the vendor" };
  }

  const order = await database.order.create({
    data: {
      amountValue: code.amountValue,
      userId: userSession.id,
      status: OrderStatus.PROCESSING,
      codeId: code.id,
    },
    include: {
      code: {
        include: {
          vendor: {
            include: {
              User: true,
            },
          },
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
            order.code.name,
            `${process.env.NEXTAUTH_URL}/vendor/${order.code.vendorId}?vendorCode=${order.code}`
          ),
        }),

        sendMail({
          to: order.code.vendor.User.email,
          subject: "Request Confirmed",
          body: compileVendorRequestReceived(
            order.code.vendor.User.fullname,
            order.code.name
          ),
        }),
      ]);
    }
    return { success: "Order is processing" };
  }
  return { error: "Unable to process order" };
};

export const fetchVendorOrderOVerview = async () => {
  const userSession = await getCurrentUser();
  if (!userSession?.id) {
    return { error: "Access Denied" };
  }
  const vendor = await database.vendor.findUnique({
    where: { userId: userSession.id },
  });
  if (!vendor) {
    return { error: "Access Denied" };
  }

  const [totalOrders, pendingOrders, processingOrders, completedOrders] =
    await Promise.all([
      database.order.count({
        where: {
          code: {
            vendorId: vendor.id,
          },
        },
      }),
      database.order.count({
        where: {
          code: {
            vendorId: vendor.id,
            status: "PENDING",
          },
        },
      }),
      database.order.count({
        where: {
          code: {
            vendorId: vendor.id,
            status: "PROCESSING",
          },
        },
      }),
      database.order.count({
        where: {
          code: {
            vendorId: vendor.id,
            status: "COMPLETED",
          },
        },
      }),
    ]);

  return { totalOrders, pendingOrders, processingOrders, completedOrders };
};

export const fetchVendorOrders = async () => {
  const userSession = await getCurrentUser();
  const vendor = await database.vendor.findUnique({
    where: { userId: userSession?.id },
  });
  if (!vendor?.id) {
    return [];
  }
  const orders = await database.order.findMany({
    where: {
      code: {
        vendorId: vendor.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          fullname: true,
        },
      },
    },
  });
  return orders;
};

export const fetchUserOrders = async () => {
  const userSession = await getCurrentUser();
  if (!userSession?.id) {
    return [];
  }

  const orders = await database.order.findMany({
    where: {
      userId: userSession.id,
    },
    include: {
      code: {
        select: {
          value: true,
          deliveryPeriod: true,
        },
      },
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
            code: {
              vendorId,
            },
          }
        : {
            userId: userSession.id,
          }),
    },
    include: {
      user: {
        select: {
          fullname: true,
        },
      },
      code: {
        select: {
          name: true,
          deliveryPeriod: true,
          value: true,
          quantity: true,
        },
      },
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
        code: {
          include: {
            vendor: {
              include: {
                User: true,
              },
            },
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
            // to: "emeroleikenna123@gmail.com",
            to: order.user?.email || "emeroleikenna123@gmail.com",
            subject: "Order has been flagged",
            body: compileOrderDelayFlagged(
              order.user?.fullname || "",
              order.code.value
            ),
          }),
          sendMail({
            to: order.code.vendor.User.email,
            subject: "Order has been flagged",
            body: compileVendorRequestCancelled(
              order.code.vendor.User.fullname,
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
              order.code.value
            ),
          }),

          sendMail({
            to: order.code.vendor.User.email,
            subject: "Order Cancelled",
            body: compileCustomerCancellationVendor(
              order.code.vendor.User.fullname,
              order.code.value,
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

export const vendorOrderConfirmationAction = async (orderId: string) => {
  const userSession = await getCurrentUser();
  if (!userSession?.id) {
    redirect("/auth/signin");
  }
  if (userSession.role !== "VENDOR") {
    return { error: "Access Denied" };
  }
  const order = await database.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      code: { include: { vendor: { include: { User: true } } } },
    },
  });
  if (!order) return { error: "Order does not exist" };
  const surveyLink = `${process.env.NEXT_PUBLIC_SITE_URL}/orders/${order.id}?satisfactoryFeedback=true`;
  const orderLink = `${process.env.NEXT_PUBLIC_SITE_URL}/orders/${order.id}?satisfactoryFeedback=true`;
  await database.order.update({
    where: { id: order.id },
    data: {
      vendorDeliveryConfirmation: true,
      ...(order.userDeliveryConfirmation ? {} : {}),
    },
  });

  await Promise.all([
    ...[
      order.userDeliveryConfirmation
        ? [
            // Send Email to User
            sendMail({
              to: order.user?.email || "",
              subject: "Order Satisfaction",
              body: compileSatisfactionEmail(
                order.user?.fullname || "",
                surveyLink
              ),
            }),
            // Send Email to Vendor
            sendMail({
              to: order.code.vendor.User.email,
              subject: "Order Completed",
              body: compileVendorRequestReceived(
                order.code.vendor.User.fullname,
                order.code.name
              ),
            }),
          ]
        : [
            // Send Email to User
            sendMail({
              to: order.user?.email || "",
              subject: "Vendor Confirmation",
              body: compileVendorConfirmationEmail(
                order.user?.fullname || "",
                order.id,
                orderLink
              ),
            }),
            // Send Email to Vendor
            sendMail({
              to: order.code.vendor.User.email,
              subject: "Order Completed",
              body: compileVendorRequestReceived(
                order.code.vendor.User.fullname,
                order.code.name
              ),
            }),
          ],
    ],
  ]);

  if (order?.userDeliveryConfirmation) {
    await createAccountTransaction(order.code.vendorId, order);
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
    let order = await database.order.findUnique({
      where: { id: orderId },
      include: {
        code: {
          include: {
            vendor: {
              select: {
                User: true,
                id: true,
                rating: true,
                reviewCount: true,
              },
            },
          },
        },
        user: true,
      },
    });
    order = await database.order.update({
      where: { id: orderId, userId: userSession.id },
      data: {
        status: order?.vendorDeliveryConfirmation ? "COMPLETED" : "PROCESSING",
        userDeliveryConfirmation: true,
        resolved: true,
      },
      include: {
        code: {
          include: {
            vendor: {
              select: {
                User: true,
                id: true,
                rating: true,
                reviewCount: true,
              },
            },
          },
        },
        user: true,
      },
    });
    if (!order) {
      return { error: "Invalid Order" };
    }
    if (order?.vendorDeliveryConfirmation) {
      await createAccountTransaction(order.code.vendorId, order);
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
        vendorId: order.code.vendorId,
      },
      update: {
        rating: sanitizedRating,
        comment,
      },
    });
    const totalRating = Math.max(order.code.vendor.rating + ratingDiff, 0);
    const reviewCount = Math.max(
      order.code.vendor.reviewCount + (existingReview ? 0 : 1),
      0
    );
    const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;
    const surveyLink = `${process.env.NEXT_PUBLIC_SITE_URL}/orders/${order.id}?satisfactoryFeedback=true`;
    await database.vendor.update({
      where: {
        id: order.code.vendorId,
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
          order.code.name,
          `${process.env.NEXTAUTH_URL}/orders/${order.id}`
        ),
      }),

      sendMail({
        to: order.user?.email || "",
        subject: "Order Satisfaction",
        body: compileSatisfactionEmail(order.user?.fullname || "", surveyLink),
      }),

      sendMail({
        to: order.code.vendor.User.email,
        subject: "Order Completed",
        body: compileVendorRequestReceived(
          order.code.vendor.User.fullname,
          order.code.name
        ),
      }),

      sendMail({
        to: order.code.vendor.User.email,
        subject: "Order Satisfaction",
        body: compileSatisfactionEmail(
          order.code.vendor.User.fullname,
          surveyLink
        ),
      }),
    ]);
    return { success: "Order completed successfully" };
  } else if (received === "no") {
    const order = await database.order.findUnique({
      where: { id: orderId },
      include: {
        code: {
          include: {
            vendor: {
              select: {
                User: true,
                id: true,
                rating: true,
                reviewCount: true,
              },
            },
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
          code: {
            update: {
              deliveryPeriod: deliveryExtension,
            },
          },
          orderExtension: {
            create: {
              previousDeliveryDate: order.code.deliveryPeriod,
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
          to: order.code.vendor.User.email,
          subject: "Order has been extended",
          body: compileCustomerExtensionVendor(
            order.code.vendor.User.fullname,
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
          code: {
            update: {
              deliveryPeriod: addDays(new Date(), 1),
            },
          },
          orderExtension: {
            create: {
              previousDeliveryDate: order.code.deliveryPeriod,
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
            order.code.value
          ),
        }),
        sendMail({
          to: order.code.vendor.User.email,
          subject: "Order has been flagged",
          body: compileVendorRequestCancelled(
            order.code.vendor.User.fullname,
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
          order.code.value
        ),
      }),

      sendMail({
        to: order.user?.email || "",
        subject: "Order Satisfaction",
        body: compileSatisfactionEmail(order.user?.fullname || "", surveyLink),
      }),

      sendMail({
        to: order.code.vendor.User.email,
        subject: "Order Cancelled",
        body: compileCustomerCancellationVendor(
          order.code.vendor.User.fullname,
          cancellationReason || cancelledReason,
          order.code.value,
          `${process.env.NEXTAUTH_URL}/orders/${order.id}?customerContact=true`
        ),
      }),

      sendMail({
        to: order.code.vendor.User.email,
        subject: "Order Satisfaction",
        body: compileSatisfactionEmail(
          order.code.vendor.User.fullname,
          surveyLink
        ),
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
    where: { id: orderId, code: { vendorId } },
    include: {
      user: true,
      code: {
        include: {
          vendor: {
            include: {
              User: true,
            },
          },
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
        code: {
          update: {
            deliveryPeriod: deliveryExtension,
          },
        },
        vendorOrderExtension: {
          create: {
            reason,
            previousDeliveryDate: order.code.deliveryPeriod,
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
          order.code.value,
          order.code.vendor.businessName || "",
          reason,
          formatDate(deliveryExtension, "PPP")
        ),
      }),

      sendMail({
        to: order.code.vendor.User.email || "",
        subject: "Vendor Extension",
        body: compileVendorExtensionVendor(order.code.vendor.User.fullname),
      }),
    ]);

    return { success: "Rescheduled Order successfully" };
  }
  if (hasPaid) {
    await database.order.update({
      where: {
        id: order.id,
        code: {
          vendorId,
        },
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
          order.code.value,
          `${process.env.NEXTAUTH_URL}/orders/${order.id}?vendorContact=true`
        ),
      }),

      sendMail({
        to: order.code.vendor.User.email,
        subject: "Order Cancellation",

        body: compileVendorCancellationVendor(
          order.code.vendor.User.fullname,
          order.code.value
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
      code: {
        vendorId,
      },
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
        order.code.value,
        `${process.env.NEXTAUTH_URL}/orders/${order.id}?vendorContact=true`
      ),
    }),

    sendMail({
      to: order.code.vendor.User.email,
      subject: "Order Cancellation",
      body: compileVendorCancellationVendor(
        order.code.vendor.User.fullname,
        order.code.value
      ),
    }),
  ]);
  return { success: "Order cancelled" };
};
