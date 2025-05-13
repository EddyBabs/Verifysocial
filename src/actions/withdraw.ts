"use server";

import { getCurrentUser } from "@/data/user";
import { database } from "@/lib/database";

export async function getWithdrawalOverview() {
  const user = await getCurrentUser();
  const vendor = await database.vendor.findUnique({
    where: {
      userId: user?.id,
    },
  });

  if (!vendor) {
    return {
      availableWithdrawals: 0,
      pendingWithdrawals: 0,
      totalWithdrawals: 0,
    };
  }
  const [pendingWithdrawals, totalWithdrawals] = await Promise.all([
    database.withdraw.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        vendorId: vendor.id,
        status: "PROCESSING",
      },
    }),
    database.withdraw.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        vendorId: vendor.id,
        status: "COMPLETED",
      },
    }),
  ]);

  return {
    availableWithdrawals: vendor.availableBalance,
    pendingWithdrawals: pendingWithdrawals._sum.amount || 0,
    totalWithdrawals: totalWithdrawals._sum.amount || 0,
  };
}

export const getWalletHistory = async (
  tab: "all" | "pending" | "completed"
) => {
  const user = await getCurrentUser();
  const vendor = await database.vendor.findUnique({
    where: {
      userId: user?.id,
    },
  });

  if (!vendor) {
    return [];
  }
  const withdraws = await database.withdraw.findMany({
    where: {
      vendorId: vendor.id,
      ...(tab !== "all"
        ? {
            status: tab === "pending" ? "PROCESSING" : "COMPLETED",
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 8,
  });
  return withdraws;
};

export const createWithdrawal = async (
  amount: number,
  paymentMethod: string
) => {
  const user = await getCurrentUser();
  const vendor = await database.vendor.findUnique({
    where: {
      userId: user?.id,
    },
  });

  if (!vendor) {
    return { error: "Access Denied" };
  }
  if (amount > vendor.availableBalance) {
    return { error: "Insufficient amount" };
  }
  const fee = amount * 0.01; // 1% fee
  const total = amount - fee;
  await database.withdraw.create({
    data: {
      vendorId: vendor.id,
      paymentMethod: paymentMethod === "transfer" ? "TRANSFER" : "TRANSFER",
      revenue: total,
      amount,
      fee,
    },
  });

  const newAmount = vendor.availableBalance - amount;
  await database.vendor.update({
    where: {
      id: vendor.id,
    },
    data: {
      availableBalance: newAmount,
    },
  });
  return { success: "Processing withdrawal" };
};
