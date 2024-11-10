import { resendVerificationEmail } from "@/actions/resend-verification";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import React, { useTransition } from "react";

const VerifyEmailForm = () => {
  const { toast } = useToast();
  const email = sessionStorage.getItem("email");
  const [isPending, startTransition] = useTransition();
  const handleResend = () => {
    startTransition(async () => {
      if (email) {
        const response = await resendVerificationEmail(email);
        if (response.success) {
          toast({
            description: response.success,
          });
        } else {
          toast({
            description: response.error,
            variant: "destructive",
          });
        }
      }
    });
  };
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
            <h3 className="text-2xl font-[550] -ml-1">
              Please Verify your email
            </h3>
            <h5 className="text-lg">
              You&apos;re almost there! We sent an email to you
            </h5>
          </div>
        </div>
        <div className="space-y-6">
          <h5>
            Just click on the link in that email to complete your signup. If you
            don&apos;t see it, you may need to <b>check your spam</b> folder.
          </h5>
          {email && (
            <>
              <h5>Still can&apos;t find the email? No problem.</h5>
              <Button onClick={handleResend} disabled={isPending}>
                Resend Verification Email
              </Button>
            </>
          )}
          <div className="text-left">
            <p>
              Back to{" "}
              <Link href="/auth/signin" className="text-primary font-semibold">
                SignIn
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailForm;
