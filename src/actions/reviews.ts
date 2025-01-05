"use server";

import { getCurrentUser } from "@/data/user";
import { database } from "@/lib/database";

export const getCurrentVendorReviews = async () => {
  const user = await getCurrentUser();
  const vendor = await database.vendor.findUnique({
    where: {
      userId: user?.id,
    },
  });
  const reviews = await database.review.findMany({
    where: {
      vendorId: vendor?.id,
    },
  });
  return reviews;
};
