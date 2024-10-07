import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { Dispatch, SetStateAction } from "react";
import SignUpEmail from "./signup-email";

type SignUpFormProps = {
  setStep: Dispatch<SetStateAction<"signup" | "verify">>;
};

const SignUpForm: React.FC<SignUpFormProps> = ({ setStep }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="w-full max-w-md overflow-hidden">
        <div className="pb-6 pt-8 text-center">
          <h3 className="text-lg font-semibold">Create an Account</h3>
        </div>
        <div className="flex gap-2 items-center justify-center">
          <Button variant={"outline"}>Google</Button>
          <Button variant={"outline"}>Facebook</Button>
        </div>
        <div>
          <div className="my-2 flex flex-shrink items-center justify-center gap-2">
            <div className="grow basis-0 border-b border-gray-300" />
            <span className="text-xs font-normal uppercase leading-none text-gray-500">
              or continue with email
            </span>
            <div className="grow basis-0 border-b border-gray-300" />
          </div>
        </div>

        <SignUpEmail />
      </div>
    </div>
  );
};

export default SignUpForm;
