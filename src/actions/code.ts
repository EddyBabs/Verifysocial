"use server";
import { getCurrentUser } from "@/data/user";
import { database } from "@/lib/database";
import { generateCode } from "@/lib/utils";
import { createOrderShema, createOrderShemaType } from "@/schemas";
import { redirect } from "next/navigation";

// export const vendorGetCode = async () => {
//   const currentUser = await getCurrentUser();
//   const vendor = await database.vendor.findUnique({
//     where: { userId: currentUser?.id },
//   });
//   if (!vendor) {
//     throw new Error("Access Denied");
//   }
//   let order = await database.order.findFirst({
//     where: { vendorId: vendor.id, status: "PENDING" },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
//   if (!order) {
//     order = await database.order.create({
//       data: {
//         vendorId: vendor.id,
//         code: generateCode(),
//         status: "PENDING",
//       },
//     });
//   }
//   return order;
// };

export const vendorGetCodes = async () => {
  const currentUser = await getCurrentUser();
  const vendor = await database.vendor.findUnique({
    where: { userId: currentUser?.id },
  });
  if (!vendor || !vendor.id) {
    redirect("/auth/signin");
  }

  const orders = await database.order.findMany({
    where: { vendorId: vendor.id },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });
  return orders;
};

export const getNewCode = async (values: createOrderShemaType) => {
  const currentUser = await getCurrentUser();
  const vendor = await database.vendor.findUnique({
    where: { userId: currentUser?.id },
  });
  if (!vendor) {
    redirect("/auth/login");
  }

  const fraudCount = await database.order.count({
    where: { vendorId: vendor.id, fraudulent: true },
  });

  if (fraudCount >= 3) {
    return {
      error: "Your account is restricted due to fraudulent activities.",
    };
  }
  const validatedData = createOrderShema.parse(values);

  const order = await database.order.create({
    data: {
      vendorId: vendor.id,
      code: generateCode(),
      status: "PENDING",
      quantity: validatedData.quantity,
      minAmount: validatedData.amount.min,
      maxAmount: validatedData.amount.max,
      returnPeriod: validatedData.returnPeriod,
      deliveryPeriod: validatedData.deliveryPeriod,
      name: validatedData.name,
    },
  });
  if (order) {
    return { success: order };
  }
  return { error: "Unable to generate code" };
};
