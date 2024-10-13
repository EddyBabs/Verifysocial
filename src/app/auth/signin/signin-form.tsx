/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import React, { Dispatch, SetStateAction } from "react";
import SignInEmail from "./signin-email";

type SignUpFormProps = {
  setStep: Dispatch<SetStateAction<"signup" | "verify">>;
};

const SignInForm: React.FC<SignUpFormProps> = ({ setStep }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="w-full max-w-md overflow-hidden">
        <div className="pb-6 pt-8 text-center">
          <h3 className="text-lg font-semibold">Create an A</h3>
          <h5>Welcome back! Select method to login</h5>
        </div>
        <div className="flex gap-2 items-center justify-center">
          <Button variant={"outline"}>Google</Button>
          <Button variant={"outline"}>Facebook</Button>
        </div>
        <div>
          <div className="my-2 flex flex-shrink items-center justify-center gap-2">
            <div className="grow basis-0 border-b border-gray-300" />
            <span className="text-xs font-normal leading-none text-gray-500">
              or continue with email
            </span>
            <div className="grow basis-0 border-b border-gray-300" />
          </div>
        </div>

        <SignInEmail />
      </div>
    </div>
  );
};

export default SignInForm;
