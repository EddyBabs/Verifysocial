"use client";
import { reset } from "@/actions/forgot-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { requestPasswordResetSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type ForgotPasswordProps = z.infer<typeof requestPasswordResetSchema>;

const ForgotPasswordForm = () => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordProps>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = (values: ForgotPasswordProps) => {
    startTransition(async () => {
      await reset(values).then((response) => {
        if (response.success) {
          toast({ description: response.success });
        } else {
          toast({ description: response.error, variant: "destructive" });
        }
      });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-6">
        <Input
          type="email"
          placeholder="Email"
          autoComplete="email"
          required
          {...register("email")}
          error={errors.email?.message}
        />
        <Button type="submit" disabled={isPending}>
          Forgot Password
        </Button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
