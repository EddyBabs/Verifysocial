"use client";

import SignInForm from "@/app/auth/signin/signin-form";
import VerifyEmailForm from "@/components/verify-email-form";
import { useState } from "react";

export default function SigninPageClient() {
  const [step, setStep] = useState<"signup" | "verify">("signup");
  if (step === "verify") {
    return <VerifyEmailForm />;
  }

  return <SignInForm setStep={setStep} />;
}
