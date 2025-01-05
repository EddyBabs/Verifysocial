import AccessoryImage from "@/assets/images/accessories.jpeg";
import CaptionImage from "@/assets/images/captionImage.jpeg";
import FacialsImage from "@/assets/images/facials.jpeg";
import { Button } from "@/components/ui/button";
import VendorAvatar from "@/components/vendor-avatar";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { FiAward } from "react-icons/fi";
import UploadProductForm from "./upload-product-form";
import { getCurrentVendorProducts } from "@/actions/product";
import { Card, CardContent, CardHeader } from "./ui/card";
import { getCurrentVendorReviews } from "@/actions/vendor";
import ReviewCard from "./reveiw-card";

export interface VendorProfileProps {
  user: Prisma.UserGetPayload<{
    select: {
      fullname: true;
      email: true;
      role: true;
      phone: true;
      gender: true;
      image: true;
      address: {
        select: {
          country: true;
          state: true;
        };
      };
      vendor: {
        select: {
          buisnessName: true;
          buisnessAbout: true;
          tier: true;
          reviewCount: true;
          rating: true;
        };
      };
    };
  }>;
}

const VendorProfile: React.FC<VendorProfileProps> = async ({ user }) => {
  const products = await getCurrentVendorProducts();
  const reviews = await getCurrentVendorReviews();
  return (
    <div className="pb-20">
      <div className="space-y-4 h-full">
        <h4 className="text-xl font-semibold">Hi, {user.fullname}</h4>
        <div className="flex items-center justify-between">
          <VendorAvatar
            vendor={{
              buisnessName: user.vendor?.buisnessName || "",
              reviewCount: user.vendor?.reviewCount || 0,
              rating: user.vendor?.rating || 0,
              User: {
                address: user.address,
                image: user.image,
              },
            }}
          />
          <div className="">
            <Button
              variant={"ghost"}
              className="flex relative hover:bg-transparent"
            >
              <FiAward
                size={50}
                className="text-[#AF8A6F] z-20 fill-background"
                strokeWidth={3}
              />
              <h1 className="absolute text-[#AF8A6F] left-[37px] top-0 z-30 font-extrabold ">
                {user.vendor?.tier === "TIER1"
                  ? 1
                  : user.vendor?.tier === "TIER2"
                  ? 2
                  : 3}
              </h1>

              <div className="-ml-6">
                <span className="bg-[#AF8A6F] p-2 text-background z-10 rounded-xl pl-6">
                  Upgrade to tier 2
                </span>
              </div>
            </Button>
          </div>
        </div>

        {products.length ? (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div key={product.id}>
                  <Card>
                    <Image
                      src={product.image}
                      width={250}
                      height={250}
                      alt=""
                      className="aspect-video object-contain w-full h-full max-h-64"
                    />
                  </Card>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <UploadProductForm />
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center items-center min-h-[400px] bg-gray-200 mt-10 rounded-xl py-10 px-4">
            <div className="space-y-6 text-center">
              <div>
                <Image
                  src="https://staticmania.cdn.prismic.io/staticmania/7c82d76e-be06-41ca-a6ef-3db9009e6231_Property+1%3DFolder_+Property+2%3DSm.svg"
                  height={234}
                  width={350}
                  alt="404"
                />
              </div>
              <h2 className="text-lg font-semibold">No Product Added</h2>
              <div className="text-center">
                <UploadProductForm />
              </div>
            </div>
          </div>
        )}

        <div className="pt-8 mb-8">
          <div>
            <h4 className="text-xl font-semibold my-4">
              What Customers are saying
            </h4>
          </div>
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {reviews.map((review) => (
                <ReviewCard review={review} key={review.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VendorProducts = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        <div>
          <Image
            src={AccessoryImage}
            alt=""
            className="rounded-xl w-full h-full aspect-video object-cover"
          />
        </div>
        <div>
          <Image
            src={CaptionImage}
            alt=""
            className="rounded-xl w-full h-full aspect-video object-cover"
          />
        </div>
        <div>
          <Image
            src={FacialsImage}
            alt=""
            className="rounded-xl w-full h-full aspect-video object-cover"
          />
        </div>
      </div>
    </div>
  );
};

// const VendorVendorReviews = () => {
//   return (
//     <div className="space-y-4 pt-8">
//       <h3 className="text-xl font-semibold">What Customers Saying</h3>
//       <div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
//           {Array.from({ length: 3 }, (_, index) => (
//             <ReviewCard key={index} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

export default VendorProfile;
