import Logo from "@/components/logo";
import Link from "next/link";
import React from "react";
import ForgotPasswordForm from "./forgot-password-form";

const ForgotPassword = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="w-full max-w-md overflow-hidden px-1">
        <div className="flex items-center justify-center">
          <Link href="/" passHref>
            <Logo />
          </Link>
        </div>
        <div className="flex flex-col items-start">
          <div className="pb-6 pt-8 space-y-4">
            <h3 className="text-2xl font-[550]">Forgot Password.</h3>
            <h5 className="text-lg">
              Input your email to get a recovery link.
            </h5>
          </div>
        </div>

        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPassword;
