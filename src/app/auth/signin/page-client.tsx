"use client";

import { useState } from "react";
import VerifyEmailForm from "../signup/verify-email-form";
import SignUpForm from "./signin-form";

export default function SigninPageClient() {
  const [step, setStep] = useState<"signup" | "verify">("signup");
  if (step === "verify") {
    return <VerifyEmailForm />;
  }

  return <SignUpForm setStep={setStep} />;
}
