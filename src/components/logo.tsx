import Image from "next/image";
import React from "react";
import LogoText from "@/assets/logo.jpeg";
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
        src={LogoText.src}
        width={width ?? 150}
        height={height ?? 100}
        alt="logo"
      />
      <h3
        className={cn("-ml-10 font-semibold text-xl font-jakarta", className)}
      >
        Verify Social
      </h3>
    </div>
  );
};

export default Logo;
