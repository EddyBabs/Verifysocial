"use server";
import { getCurrentUser } from "@/data/user";
import { database } from "@/lib/database";
import { generateCode } from "@/lib/utils";
import { redirect } from "next/navigation";

export const vendorGetCode = async () => {
  const currentUser = await getCurrentUser();
  const vendor = await database.vendor.findUnique({
    where: { userId: currentUser?.id },
  });
  if (!vendor) {
    throw new Error("Access Denied");
  }
  let order = await database.order.findFirst({
    where: { vendorId: vendor.id, status: "PENDING" },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!order) {
    order = await database.order.create({
      data: {
        vendorId: vendor.id,
        code: generateCode(),
        status: "PENDING",
      },
    });
  }
  return order;
};

export const getNewCode = async () => {
  const currentUser = await getCurrentUser(true);
  const vendor = await database.vendor.findUnique({
    where: { userId: currentUser?.id },
  });
  if (!vendor) {
    redirect("/auth/login");
  }

  const order = await database.order.create({
    data: {
      vendorId: vendor.id,
      code: generateCode(),
      status: "PENDING",
    },
  });
  if (order) {
    return { success: "Generated new code successfully" };
  }
  return { error: "Unable to generate code" };
};
