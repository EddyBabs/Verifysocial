import Image from "next/image";
import React from "react";
import LogoText from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const Logo = ({
  className,
  width,
  height,
}: {
  className?: string;
  width?: number;
  height?: number;
}) => {
  return (
    <div className="flex items-center">
      <Image
        src={LogoText}
        width={70}
        // width={width ?? 80}
        // height={height ?? 40}
        // className="w-[130px] h-[80px]  sm:w-[150px] sm:h-[100px] aspect-auto"
        alt="logo"
      />
      <h3
        className={cn(
          "-ml-2 font-semibold text-lg md:text-lg font-jakarta",
          className
        )}
      >
        Verify Social
      </h3>
    </div>
  );
};

export default Logo;
