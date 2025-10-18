/* eslint-disable @typescript-eslint/no-unused-vars */
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import SignUpEmail from "./signup-email";
import { signIn } from "next-auth/react";
import { setCookie } from "cookies-next";

type SignUpFormProps = {
  selectedRole: "user" | "vendor";
  setStep: Dispatch<SetStateAction<"signup" | "verify">>;
  setSelectedRole: (role: "user" | "vendor" | null) => void;
};

const SignUpForm: React.FC<SignUpFormProps> = ({
  setStep,
  setSelectedRole,
  selectedRole,
}) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="w-full max-w-md px-1 overflow-hidden">
        <div className="flex items-center justify-center">
          <Link href="/" passHref>
            <Logo />
          </Link>
        </div>
        <div className="flex items-start">
          <div className="pb-6 pt-8 space-y-4">
            <h3 className="text-2xl font-[510] -ml-1">Create an account</h3>
            <h5 className="text-lg">Select method to sign up:</h5>
          </div>
        </div>
        <div>
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => setSelectedRole(null)}
          >
            <BsArrowLeft className="mr-2" /> Back to selection
          </Button>
        </div>
        <div className="flex gap-4 items-center justify-center">
          <Button variant={"outline"} className="w-full">
            <FcGoogle size={18} className="mr-2" />
            Google
          </Button>
          <Button
            variant={"outline"}
            className="w-full"
            onClick={() => {
              setCookie("signup-role", selectedRole, {
                maxAge: 60 * 60 * 1,
              });
              signIn("facebook");
            }}
          >
            <FaFacebook size={18} className="mr-2 text-blue-600" />
            Facebook
          </Button>
        </div>
        <div>
          <div className="my-4 flex flex-shrink items-center justify-center gap-2">
            <div className="grow basis-0 border-b border-gray-300" />
            <span className="text-xs font-normal leading-none text-gray-500">
              or continue with email
            </span>
            <div className="grow basis-0 border-b border-gray-300" />
          </div>
        </div>

        <SignUpEmail setStep={setStep} selectedRole={selectedRole} />
      </div>
    </div>
  );
};

export default SignUpForm;
