"use client";
import { reset } from "@/actions/forgot-password";
import { resetPassword } from "@/actions/reset-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { resetPasswordSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { redirect, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type resetPasswordValuesProps = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [passwordVisible, setPassworVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPassworVisible] = useState(false);
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = (values: resetPasswordValuesProps) => {
    startTransition(async () => {
      await resetPassword(values).then((response) => {
        if (response.success) {
          toast({ description: response.success });
          router.push("/auth/signin");
        } else {
          toast({ description: response.error, variant: "destructive" });
        }
      });
    });
  };

  if (!token) {
    redirect("/auth/signin");
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<resetPasswordValuesProps>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  });
  return (
    <form noValidate onSubmit={handleSubmit((data) => onSubmit(data))}>
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <Input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            className="pe-10"
            required
            {...register("password")}
            error={errors.password?.message}
          />

          <Button
            variant={"ghost"}
            onClick={() => setPassworVisible((prev) => !prev)}
            type="button"
            className="absolute inset-y-0.5 end-0 flex items-center z-20 outline-none focus:outline-none focus:text-primary hover:bg-transparent"
          >
            {passwordVisible ? <EyeOpenIcon /> : <EyeNoneIcon />}
          </Button>
        </div>

        <div className="relative">
          <Input
            type={confirmPasswordVisible ? "text" : "password"}
            placeholder="Password"
            className="pe-10"
            required
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          <Button
            variant={"ghost"}
            onClick={() => setConfirmPassworVisible((prev) => !prev)}
            type="button"
            className="absolute inset-y-0.5 end-0 flex items-center z-20 outline-none focus:outline-none focus:text-primary hover:bg-transparent"
          >
            {confirmPasswordVisible ? <EyeOpenIcon /> : <EyeNoneIcon />}
          </Button>
        </div>

        <Button type="submit" disabled={isPending}>
          Reset Password
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
