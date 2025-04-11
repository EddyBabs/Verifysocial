import Logo from "@/components/logo";
import Link from "next/link";
import React, { Suspense } from "react";
import ResetPasswordForm from "./reset-password-form";

const ResetPassword = () => {
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
            <h3 className="text-2xl font-[550]">Reset Password.</h3>
            <h5 className="text-lg">Input your new password.</h5>
          </div>
        </div>
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
};

export default ResetPassword;
