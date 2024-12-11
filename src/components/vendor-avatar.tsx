import Image from "next/image";
import React from "react";
import CaptionImage from "@/assets/images/captionImage.jpeg";
import { IoLocationOutline } from "react-icons/io5";
import { Star } from "lucide-react";
import { Prisma } from "@prisma/client";

interface VendorAvatarProps {
  user: Prisma.UserGetPayload<{
    select: { vendor: { select: { buisnessName: true } } };
  }>;
}

const VendorAvatar: React.FC<VendorAvatarProps> = ({ user }) => {
  return (
    <div className="flex items-center gap-4">
      <div>
        <Image
          src={CaptionImage}
          alt=""
          className="rounded-full w-14 h-14 object-cover"
        />
      </div>
      <div>
        <h1 className="text-base">{user.vendor?.buisnessName}</h1>
        <div className="flex items-center gap-1">
          <IoLocationOutline className="text-green-500" /> Lagos{" "}
          <div className="h-4 w-[1px] bg-black"></div>
          <Star className="fill-[#FFDD55] text-[#FFDD55] h-4" />0 (0)
        </div>
      </div>
    </div>
  );
};

export default VendorAvatar;
