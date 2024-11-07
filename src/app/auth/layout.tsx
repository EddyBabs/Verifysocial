import Amico from "@/assets/amico.png";
import AuthCart from "@/assets/AuthCart.png";
import Image from "next/image";
import React, { PropsWithChildren } from "react";

const AuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen w-screen relative">
      <div className="grid w-full grid-cols-1 md:grid-cols-2">
        <div className="col-span-1  min-h-screen flex flex-col items-center">
          {children}
        </div>
        <div className="hidden text-primary col-span-1 md:flex flex-col relative  items-center justify-center h-full w-full">
          <div className="absolute top-20 text-center z-20">
            <h2 className=" text-3xl font-semibold">Shop With Certainty</h2>
            <h5>All in one access to verified Business</h5>
          </div>
          <Image
            src={AuthCart}
            alt="cart logo"
            className="absolute right-0 top-0 z-10 hidden xl:block"
          />
          <Image src={Amico} alt="" />
          {/* <AmicoSvgIcon /> */}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
