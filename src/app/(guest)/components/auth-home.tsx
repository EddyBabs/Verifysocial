import { getLatestReviews } from "@/actions/rating";
import { getVendors } from "@/actions/vendor";
import noImagePlacehoder from "@/assets/images/no-image-placehoder.webp";
import BecomeAVendor from "@/components/become-a-vendor";
import SearchVendors from "@/components/search-vendors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VendorAvatar from "@/components/vendor-avatar";
import VendorProfile from "@/components/vendor-profile";
import { getCurrentUserDetails } from "@/data/user";

import { UserRole } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const AuthHome = async () => {
  const { user, ninVerified } = await getCurrentUserDetails();

  const latestReviews = await getLatestReviews();

  if (user?.role === UserRole.VENDOR) {
    if (user.vendor?.tier === "TIER1") {
      return <VendorProfile user={user} />;
    }
    return <BecomeAVendor user={user} ninVerified={ninVerified} />;
  }
  return (
    <div>
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-4xl font-bold">Vendors</h1>
        </div>
        <SearchVendors />
      </div>
      <div>
        <Card className="">
          <CardHeader>
            <CardTitle>Explore</CardTitle>
          </CardHeader>
          <CardContent className="">
            <VendorList />
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">Reviews</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-2">
                {!latestReviews.length && (
                  <div className="min-h-60 flex items-center justify-center">
                    <h4 className="text-xl font-semibold">
                      No review at the moment
                    </h4>
                  </div>
                )}
                {latestReviews.map((review, index) => (
                  <div
                    key={index}
                    className="py-4 border-b-2 border-accent last:border-b-0"
                  >
                    {review.vendor?.User && (
                      <VendorAvatar vendor={review.vendor} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const VendorList = async () => {
  const vendors = await getVendors();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10">
      {vendors.map((vendor, index) => (
        <div className="flex justify-center items-center" key={index}>
          <div className="group cursor-pointer">
            <Link href={`/vendor/${vendor.id}`}>
              <div className="mb-4 overflow-hidden">
                <Image
                  src={vendor.Product?.[0]?.image || noImagePlacehoder}
                  alt=""
                  width={250}
                  height={250}
                  className="group-hover:scale-105 transition-all rounded-xl object-cover aspect-square overflow-hidden"
                />
              </div>
              <VendorAvatar vendor={vendor} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuthHome;
