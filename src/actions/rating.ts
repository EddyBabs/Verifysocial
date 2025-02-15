"use server";

import { getCurrentUser } from "@/data/user";
import { database, Prisma } from "@/lib/database";
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
    include: { vendor: true },
  });
  if (!order) {
    return { error: "Invalid Order" };
  }
  const existingReview = await database.review.findUnique({
    where: { orderId: order.id },
  });

  let ratingDiff = 0;

  if (existingReview) {
    // Update: Calculate the difference to adjust the total rating
    ratingDiff = validatedData.rating - existingReview.rating;
  } else {
    // Create: Use the entire rating as the difference
    ratingDiff = validatedData.rating;
  }

  console.log({ validatedData });

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

  const totalRating = order.vendor.rating + ratingDiff;
  const reviewCount = order.vendor.reviewCount + (existingReview ? 0 : 1);
  const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

  await database.vendor.update({
    where: {
      id: order.vendorId,
    },
    data: {
      totalRating,
      reviewCount,
      rating: averageRating,
    },
  });

  if (rate) {
    return { success: "Submitted Rating successfully" };
  }
  return { error: "Could not create recview" };
};

export const getLatestReviews = async () => {
  const reviews = await database.review.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      vendor: {
        select: {
          businessName: true,
          rating: true,
          reviewCount: true,
          User: {
            select: {
              image: true,
              address: {
                select: {
                  country: true,
                  state: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return reviews;
};
