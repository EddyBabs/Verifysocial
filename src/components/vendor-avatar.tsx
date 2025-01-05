import CaptionImage from "@/assets/images/captionImage.jpeg";
import { Prisma } from "@prisma/client";
import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";
import { IoLocationOutline } from "react-icons/io5";

type VendorDetails = Prisma.VendorGetPayload<{
  select: {
    buisnessName: true;
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
  // select: {
  //   image: true;
  //   address: {
  //     select: {
  //       country: true;
  //       state: true;
  //     };
  //   };
  //   vendor: {
  //     select: { buisnessName: true; rating: true; totalRating: true };
  //   };
  // };
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
        <h1 className="text-base">{vendor?.buisnessName}</h1>
        <div className="flex items-center gap-1">
          <IoLocationOutline className="text-green-500" />{" "}
          {vendor?.User?.address?.state}
          <div className="h-4 w-[1px] bg-black"></div>
          <Star className="fill-[#FFDD55] text-[#FFDD55] h-4" />
          {vendor?.rating} ({vendor?.reviewCount})
        </div>
      </div>
    </div>
  );
};

export default VendorAvatar;
