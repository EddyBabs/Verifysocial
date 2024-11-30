"use client";

import SignUpForm from "@/components/signup-form";
import VerifyEmailForm from "@/components/verify-email-form";
import { useState } from "react";

export default function SignupPageClient() {
  const [step, setStep] = useState<"signup" | "verify">("signup");
  if (step === "verify") {
    return <VerifyEmailForm />;
  }

  return <SignUpForm setStep={setStep} role="vendor" />;
}
