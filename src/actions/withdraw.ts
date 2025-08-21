"use server";

import { getCurrentUser } from "@/data/user";
import { database } from "@/lib/database";
import { createTransfer, createTransferRecipient } from "./paystack";

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

export const getWithdraw = async (id: string) => {
  const user = await getCurrentUser();
  const vendor = await database.vendor.findUnique({
    where: {
      userId: user?.id,
    },
  });
  if (!vendor) {
    return null;
  }
  const withdraw = await database.withdraw.findUnique({ where: { id } });
  return withdraw;
};

export const createWithdrawal = async (
  amount: number,
  paymentMethod: string
) => {
  const user = await getCurrentUser();
  let vendor = await database.vendor.findUnique({
    where: {
      userId: user?.id,
    },
    include: { paymentInformation: true },
  });

  if (!vendor) {
    return { error: "Access Denied" };
  }
  if (amount > vendor.availableBalance) {
    return { error: "Insufficient amount" };
  }
  const fee = amount * 0.01; // 1% fee
  const total = amount - fee;
  if (!vendor.paymentInformation) {
    throw new Error("No payment information added");
  }

  if (!vendor.paymentInformation?.recipient) {
    const recipient = await createTransferRecipient(vendor.paymentInformation);
    vendor = await database.vendor.update({
      where: {
        id: vendor.id,
      },
      data: {
        paymentInformation: {
          update: {
            recipient,
          },
        },
      },
      include: {
        paymentInformation: true,
      },
    });
  }

  const transfer = await createTransfer(
    vendor.paymentInformation?.recipient || "",
    total,
    `Payment on ${new Date().toLocaleString()}`
  );

  if (transfer.data.status === "otp") {
    // handle Otp
  } else {
    // Transaction: create withdrawal + update balance
    await database.$transaction(async (tx) => {
      if (amount > vendor.availableBalance) {
        return { error: "Insufficient amount" };
      }
      await tx.withdraw.create({
        data: {
          vendorId: vendor.id,
          reference: transfer.data.reference,
          paymentMethod: "TRANSFER",
          revenue: total,
          status:
            transfer.data.status === "success" ? "COMPLETED" : "PROCESSING",
          amount,
          fee,
          ...(transfer.data.status === "success"
            ? {
                completedAt: new Date(),
              }
            : {}),
        },
      });
      await tx.vendor.update({
        where: { id: vendor.id },
        data: { availableBalance: { decrement: amount } },
      });
    });

    // await database.withdraw.create({
    //   data: {
    //     vendorId: vendor.id,
    //     reference: transfer.data.reference,
    //     paymentMethod: paymentMethod === "transfer" ? "TRANSFER" : "TRANSFER",
    //     revenue: total,
    //     amount,
    //     fee,
    //   },
    // });

    // const newAmount = vendor.availableBalance - amount;
    // await database.vendor.update({
    //   where: {
    //     id: vendor.id,
    //   },
    //   data: {
    //     availableBalance: newAmount,
    //   },
    // });
  }
  return { success: "Processing withdrawal" };
};
