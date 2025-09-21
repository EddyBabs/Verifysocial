/* eslint-disable @typescript-eslint/no-unused-vars */
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import SignInEmail from "./signin-email";
import FacebookLogin from "@greatsumini/react-facebook-login";

type SignUpFormProps = {
  setStep: Dispatch<SetStateAction<"signup" | "verify">>;
};

const SignInForm: React.FC<SignUpFormProps> = ({ setStep }) => {
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
            <h3 className="text-2xl font-[550]">Log in to your Account.</h3>
            <h5 className="text-lg">Welcome back! Select method log in:</h5>
          </div>
        </div>
        <div className="flex gap-4 items-center justify-center">
          <Button
            variant={"outline"}
            className="w-full"
            type="button"
            onClick={() => signIn("google")}
          >
            <FcGoogle size={18} className="mr-2" />
            Google
          </Button>
          {/* <FacebookLogin  render={({onclick}) => ()} /> */}
          <Button
            variant={"outline"}
            className="w-full"
            onClick={() => signIn("facebook")}
          >
            <FaFacebook size={18} className="mr-2 text-blue-600" />
            Facebook
          </Button>

          <Button
            variant={"outline"}
            className="w-full"
            onClick={() => signIn("instagram")}
          >
            <InstagramLogoIcon className="mr-2 text-blue-600" />
            Instagram
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

        <SignInEmail setStep={setStep} />
      </div>
    </div>
  );
};

export default SignInForm;
