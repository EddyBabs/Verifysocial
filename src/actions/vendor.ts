"use server";

import { getCurrentUser } from "@/data/user";
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

export const getVendorAndCode = async (
  vendorId: string,
  searchParams: { vendorcode?: string }
) => {
  const vendor = await database.vendor.findUnique({
    where: {
      id: vendorId,
    },
    include: {
      socialAccount: {
        select: {
          provider: true,
          username: true,
        },
      },
      Product: {
        orderBy: {
          createdAt: "desc",
        },
        take: 2,
        select: {
          id: true,
          image: true,
        },
      },
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
  });

  let code;

  if (!vendor) {
    throw new Error("Could not find vendor");
  }

  if (searchParams.vendorcode) {
    code = await database.code.findUnique({
      where: {
        value_vendorId: {
          value: searchParams.vendorcode,
          vendorId: vendor.id,
        },
      },
      include: {
        order: {
          include: {
            user: {
              select: {
                fullname: true,
                email: true,
                gender: true,
                phone: true,
              },
            },
          },
        },
      },
    });
  }

  return { vendor, code };
};

export const getVendors = async () => {
  const vendors = await database.vendor.findMany({
    select: {
      id: true,
      businessName: true,
      reviewCount: true,
      rating: true,
      Product: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          image: true,
        },
      },
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
  });
  return vendors;
};

export const getSearchedVendors = async (value: string) => {
  const code = await database.code.findFirst({
    where: {
      value,
    },
    include: {
      vendor: {
        select: {
          businessAbout: true,
          businessName: true,
          rating: true,
          reviewCount: true,
          tier: true,
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
  if (code) {
    return { code };
  }
  const vendors = await database.vendor.findMany({
    where: {
      businessName: { contains: value, mode: "insensitive" },
    },
    include: {
      User: {
        select: {
          image: true,
          address: {
            select: { country: true, state: true },
          },
        },
      },
    },
  });
  return { vendors };
};

export const getVendorReviews = async (
  vendorId: string,
  page: number = 1,
  size: number = 6
) => {
  const reviews = await database.review.findMany({
    where: {
      vendorId,
    },
    include: {
      user: {
        select: {
          fullname: true,
        },
      },
    },
    skip: (page - 1) * size,
    take: size,
  });

  const totalReviews = await database.review.count({
    where: {
      vendorId,
    },
  });

  return { totalReviews, reviews };
};

export const getCurrentVendorReviews = async () => {
  const user = await getCurrentUser();
  const vendor = await database.vendor.findUnique({
    where: {
      userId: user?.id,
    },
  });

  return await getVendorReviews(vendor?.id || "");
};

export async function getVendorWalletOverview() {
  const user = await getCurrentUser();
  const vendor = await database.vendor.findUnique({
    where: {
      userId: user?.id,
    },
  });

  return {
    totalBalance: vendor?.totalBalance || 0,
    pendingBalance: vendor?.pendingBalance || 0,
    availableBalance: vendor?.availableBalance || 0,
  };
}

export async function getVendorTransactionHistory() {
  const user = await getCurrentUser();
  const vendor = await database.vendor.findUnique({
    where: {
      userId: user?.id,
    },
  });
  if (!vendor) {
    return [];
  }
  const orders = await database.order.findMany({
    where: {
      transaction: { isNot: null },
      code: {
        vendorId: vendor.id,
      },
    },
    include: {
      user: { select: { fullname: true } },
      transaction: { select: { reference: true } },
    },
  });
  return orders;
}

export const getPaginatedVendors = async (category: string | undefined) => {
  const vendors = await database.vendor.findMany({
    where: {
      ...(!!category
        ? {
            categories: {
              has: category as string,
            },
          }
        : {}),
    },
    orderBy: {
      rating: "desc",
    },
    include: {
      Product: true,
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
  });
  return vendors;
};
