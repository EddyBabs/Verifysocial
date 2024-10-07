import Image from "next/image";
import React from "react";
import LogoText from "@/assets/logo_with_text.png";

const Logo = () => {
  return <Image src={LogoText.src} width={250} height={200} alt="logo" />;
};

export default Logo;
