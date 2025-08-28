"use server";

import { database, Order } from "@/lib/database";

export const createAccountTransaction = async (
  vendorId: string,
  order: Order
) => {
  const [transaction, vendor] = await Promise.all([
    database.accountTransaction.create({
      data: {
        vendorId,
        orderId: order.id,
      },
    }),
    database.vendor.update({
      where: { id: vendorId },
      data: {
        availableBalance: { increment: order.amountValue },
        pendingBalance: { decrement: order.amountValue },
      },
    }),
  ]);
  return { transaction, vendor };
};
