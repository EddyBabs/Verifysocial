import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import * as z from "zod";
import { signUpSchema } from "@/schemas/auth";

type SignUpProps = z.infer<typeof signUpSchema>;

const SignInEmail = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<SignUpProps>({
    resolver: zodResolver(signUpSchema),
  });
  const onSubmit = async (values: SignUpProps) => {};
  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <div className="flex flex-col space-y-4">
        <Input
          type="text"
          placeholder="Full name"
          autoComplete="name"
          required
          {...register("fullname")}
          error={errors.email?.message}
        />
        <Input
          type="email"
          placeholder="Email"
          autoComplete="email"
          required
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          type="password"
          placeholder="Password"
          required
          {...register("password")}
          error={errors.password?.message}
        />
        <Button type="submit">Sign In</Button>
      </div>
    </form>
  );
};

export default SignInEmail;
