import AccessoryImage from "@/assets/images/accessories.jpeg";
import CaptionImage from "@/assets/images/captionImage.jpeg";
import FacialsImage from "@/assets/images/facials.jpeg";
import ReviewCard from "@/components/reveiw-card";
import { Button } from "@/components/ui/button";
import VendorAvatar from "@/components/vendor-avatar";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { FiAward } from "react-icons/fi";

interface VendorProfileProps {
  user: Prisma.UserGetPayload<{
    select: {
      fullname: true;
      email: true;
      role: true;
      phone: true;
      gender: true;
      vendor: {
        select: { buisnessName: true; buisnessAbout: true; tier: true };
      };
    };
  }>;
}

const VendorProfile: React.FC<VendorProfileProps> = ({ user }) => {
  return (
    <div className="pb-20">
      <div className="space-y-4 h-full">
        <h4 className="text-xl font-semibold">Hi, {user.fullname}</h4>
        <div className="flex items-center justify-between">
          <VendorAvatar vendor={user.vendor} />
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

        {/* Test */}
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
              <Button>Add Products</Button>
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
