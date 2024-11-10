"use client";

import { useState } from "react";
import VerifyEmailForm from "../../../components/verify-email-form";
import SignInForm from "./signin-form";

export default function SigninPageClient() {
  const [step, setStep] = useState<"signup" | "verify">("signup");
  if (step === "verify") {
    return <VerifyEmailForm />;
  }

  return <SignInForm setStep={setStep} />;
}
