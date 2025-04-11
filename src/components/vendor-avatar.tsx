import CaptionImage from "@/assets/images/captionImage.jpeg";
import { Prisma } from "@prisma/client";
import { State } from "country-state-city";
import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";
import { IoLocationOutline } from "react-icons/io5";

type VendorDetails = Prisma.VendorGetPayload<{
  select: {
    businessName: true;
    rating: true;
    reviewCount: true;
    User: {
      select: {
        image: true;
        address: {
          select: {
            country: true;
            state: true;
          };
        };
      };
    };
  };
}>;

interface VendorAvatarProps {
  vendor: VendorDetails;
}

const VendorAvatar: React.FC<VendorAvatarProps> = ({ vendor }) => {
  return (
    <div className="flex items-center gap-4">
      <div>
        <Image
          src={vendor.User.image || CaptionImage}
          alt=""
          className="rounded-full w-14 h-14 object-cover"
        />
      </div>
      <div>
        <h1 className="text-base">{vendor?.businessName}</h1>
        <div className="flex items-center gap-1">
          <IoLocationOutline className="text-green-500" />{" "}
          {
            State.getStateByCodeAndCountry(
              vendor?.User?.address?.state || "",
              vendor.User.address?.country || ""
            )?.name
          }
          <div className="h-4 w-[1px] bg-black"></div>
          <Star className="fill-[#FFDD55] text-[#FFDD55] h-4" />
          {vendor?.rating.toFixed(1)}
        </div>
      </div>
    </div>
  );
};

export default VendorAvatar;
