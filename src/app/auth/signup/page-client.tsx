"use client";

import { useState } from "react";
import VerifyEmailForm from "./verify-email-form";
import SignUpForm from "./signup-form";

export default function SignupPageClient() {
  const [step, setStep] = useState<"signup" | "verify">("signup");
  if (step === "verify") {
    return <VerifyEmailForm />;
  }

  return <SignUpForm setStep={setStep} />;
}
