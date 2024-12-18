"use server";
import { database, OrderStatus } from "@/lib/database";
import { orderSchema } from "@/schemas/auth";
import * as z from "zod";

type orderSchemaType = z.infer<typeof orderSchema>;

export const fillOrder = async (values: orderSchemaType) => {
  const validatedFields = orderSchema.safeParse(values);
  if (validatedFields.error) {
    return { error: "Invalid Fields" };
  }
  const validatedData = validatedFields.data;
  const order = await database.order.update({
    where: {
      code: validatedData.code,
      status: OrderStatus.PENDING,
    },
    data: {
      amount: validatedData.value,
      delivery: validatedData.date,
      status: OrderStatus.PROCESSING,
    },
  });
  if (order) {
    return { success: "Order is processing" };
  }
  return { error: "Unable to process order" };
};
