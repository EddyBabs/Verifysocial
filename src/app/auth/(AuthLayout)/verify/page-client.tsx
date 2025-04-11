"use client";

import { newVerification } from "@/actions/verify-emai";
import Logo from "@/components/logo";
import { useToast } from "@/hooks/use-toast";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";

const VerifyEmailClient = () => {
  const { toast } = useToast();
  const router = useRouter();
  const searchparams = useSearchParams();
  const token = searchparams.get("token");

  if (!token) {
    redirect("/auth/signin");
  }

  const onSubmit = useCallback(() => {
    newVerification(token)
      .then((data) => {
        if (data.success) {
          toast({
            description: data.success,
          });
        } else {
          toast({
            description: data.error,
            variant: "destructive",
          });
        }
        router.push("/auth/signin");
      })
      .catch(() => {
        toast({
          description: "Something went wrong!",
          variant: "destructive",
        });

        router.push("/auth/signin");
      });
  }, [router, toast, token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="w-full max-w-md overflow-hidden px-1">
        <div className="flex items-center justify-center">
          <Link href="/" passHref>
            <Logo />
          </Link>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="pb-6 pt-8 space-y-4">
            <h3 className="text-2xl font-[550]">
              Verifying your Email Address.
            </h3>
            <div className="flex justify-center items-center">
              <LoaderIcon className="animate-spin w-20 h-20 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailClient;
