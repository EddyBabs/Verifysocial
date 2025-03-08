"use server";

import { getCurrentUser } from "@/data/user";
import { uploadFileToServer } from "./upload";
import { database } from "@/lib/database";

export const uploadProductImage = async (formData: FormData) => {
  const user = await getCurrentUser();

  const vendor = await database.vendor.findUnique({
    where: { userId: user?.id },
  });
  if (!vendor) {
    return { error: "You're not a vendor" };
  }
  const productUrl = await uploadFileToServer(formData);

  if (!productUrl) {
    return { error: "Could not upload product" };
  }

  await database.product.create({
    data: {
      vendorId: vendor.id,
      image: productUrl,
    },
  });
  return { success: "Image uploaded successfully" };
};

export const getCurrentVendorProducts = async () => {
  const user = await getCurrentUser();
  const products = await database.product.findMany({
    where: {
      vendor: {
        userId: user?.id,
      },
    },
  });
  return products;
};
