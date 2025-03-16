"use server";

import { getCurrentUser } from "@/data/user";
import { database } from "@/lib/database";
import { satisfactionSchema, satisfactionSchemaType } from "@/schemas";
import { redirect } from "next/navigation";

export const customerSatisfaction = async (values: satisfactionSchemaType) => {
  const userSession = await getCurrentUser();
  if (!userSession) {
    redirect("/auth/signin");
  }

  if (userSession.role !== "USER") {
    return { error: "Access Denied" };
  }
  const validatedField = satisfactionSchema.safeParse(values);
  if (validatedField.error) {
    return { error: "Invalid Fields" };
  }
  const {
    orderId,
    rateApp,
    transactionSatisfaction,
    recommend,
    returnToApp,
    feelSafe,
  } = validatedField.data;
  const order = await database.order.findUnique({
    where: { id: orderId, userId: userSession.id },
    include: { user: true },
  });
  if (!order) {
    return { error: "Order could not be found" };
  }
  if (order.customerSatisfaction)
    return { error: "Satisfaction feedback already received" };
  await database.order.update({
    where: {
      id: order.id,
    },
    data: {
      customerSatisfaction: {
        rateApp,
        transactionSatisfaction,
        recommend,
        returnToApp,
        feelSafe,
      },
    },
  });
  return { success: "Satisfaction feedback received" };
};

export const vendorSatisfaction = async (values: satisfactionSchemaType) => {
  const userSession = await getCurrentUser();
  if (!userSession) {
    redirect("/auth/signin");
  }

  if (userSession.role !== "VENDOR") {
    return { error: "Access Denied" };
  }
  const validatedField = satisfactionSchema.safeParse(values);
  if (validatedField.error) {
    return { error: "Invalid Fields" };
  }
  const {
    orderId,
    rateApp,
    transactionSatisfaction,
    recommend,
    returnToApp,
    feelSafe,
  } = validatedField.data;
  const order = await database.order.findUnique({
    where: { id: orderId, vendor: { userId: userSession.id } },
    include: { user: true },
  });
  if (!order) {
    return { error: "Order could not be found" };
  }
  if (order.customerSatisfaction)
    return { error: "Satisfaction feedback already received" };
  await database.order.update({
    where: {
      id: order.id,
    },
    data: {
      vendorSatisfaction: {
        rateApp,
        transactionSatisfaction,
        recommend,
        returnToApp,
        feelSafe,
      },
    },
  });
  return { success: "Satisfaction feedback received" };
};
