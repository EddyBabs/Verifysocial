"use server";

import { database } from "@/lib/database";

export async function getVendorOverallRating(vendorId: string) {
  const result = await database.review.aggregate({
    where: { vendorId }, // Filter reviews by vendor ID
    _avg: {
      rating: true, // Compute the average of the "rating" field
    },
  });

  return result._avg.rating || 0; // Default to 0 if there are no reviews
}

export async function getVendorOverallRatingWithLength(vendorId: string) {
  const reviews = await database.review.findMany({
    where: { vendorId }, // Fetch all reviews for the vendor
    select: { rating: true },
  });

  // Calculate the average rating
  const totalReviews = reviews.length;
  if (totalReviews === 0) {
    return { overallRating: null, totalReviews }; // No reviews yet
  }

  const sumOfRatings = reviews.reduce((sum, review) => {
    return sum + Number(review.rating);
  }, 0);

  const overallRating = sumOfRatings / totalReviews;

  return { overallRating: overallRating.toFixed(2), totalReviews };
}

export const getVendorAndOrder = async (
  vendorId: string,
  searchParams: { vendorcode?: string }
) => {
  const vendor = await database.vendor.findUnique({
    where: {
      id: vendorId,
    },
  });

  let order;

  if (!vendor) {
    throw new Error("Could not find vendor");
  }

  if (searchParams.vendorcode) {
    order = await database.order.findUnique({
      where: {
        code_vendorId: {
          code: searchParams.vendorcode,
          vendorId: vendor.id,
        },
      },
    });
  }

  return { vendor, order };
};
