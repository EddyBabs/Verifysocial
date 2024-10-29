import Image from "next/image";
import React from "react";
import CaptionImage from "@/assets/images/captionImage.jpeg";
import { IoLocationOutline } from "react-icons/io5";
import { Star } from "lucide-react";

const VendorAvatar = () => {
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
        <h1>Glow by Banks</h1>
        <div className="flex items-center gap-1">
          <IoLocationOutline className="text-green-500" /> Lagos{" "}
          <div className="h-4 w-[1px] bg-black"></div>
          <Star className="fill-[#FFDD55] text-[#FFDD55] h-4" />
          4.8 (20)
        </div>
      </div>
    </div>
  );
};

export default VendorAvatar;
