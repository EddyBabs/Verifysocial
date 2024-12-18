"use server";

import { getCurrentUser } from "@/data/user";
import { database } from "@/lib/database";
import { rateOrderShema } from "@/schemas";
import * as z from "zod";

type rateOrderValueType = z.infer<typeof rateOrderShema>;

export const reviewOrder = async (values: rateOrderValueType) => {
  const userSession = await getCurrentUser();
  if (!userSession || !userSession.id) {
    return { error: "Access Denied" };
  }
  const validateFields = await rateOrderShema.safeParse(values);
  if (validateFields.error) {
    return { error: "Invalid Fields" };
  }
  const validatedData = await validateFields.data;
  const order = await database.order.findUnique({
    where: { id: validatedData.orderId },
  });
  if (!order) {
    return { error: "Invalid Order" };
  }
  const rate = await database.review.upsert({
    where: {
      orderId: order.id,
    },
    create: {
      orderId: order.id,
      rating: validatedData.rating,
      comment: validatedData.comment,
      userId: userSession.id,
      vendorId: order.vendorId,
    },
    update: {
      rating: validatedData.rating,
      comment: validatedData.comment,
    },
  });
  if (rate) {
    return { success: "Submitted Rating successfully" };
  }
  return { error: "Could not create recview" };
};
