import Image from "next/image";
import React, { PropsWithChildren } from "react";
import Amico from "@/assets/amico.png";

const AuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen w-screen relative">
      <div className="grid w-full grid-cols-1 md:grid-cols-5">
        <div className="col-span1 sm:col-span-3 min-h-screen flex flex-col items-center">
          {children}
        </div>
        <div className="hidden col-span-1 md:flex items-center justify-center h-full">
          <Image src={Amico.src} alt="" width={200} height={200} />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
