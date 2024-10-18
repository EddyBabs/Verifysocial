"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import * as z from "zod";
import { signUpSchema } from "@/schemas/auth";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";

type SignUpProps = z.infer<typeof signUpSchema>;

const SignUpEmail = () => {
  const router = useRouter();
  const [passwordVisible, setPassworVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpProps>({
    resolver: zodResolver(signUpSchema),
  });
  const onSubmit = async (values: SignUpProps) => {
    console.log({ values });
    router.push("/dashboard");
  };
  return (
    <form noValidate onSubmit={handleSubmit((data) => onSubmit(data))}>
      <div className="flex flex-col space-y-4">
        <Input
          type="text"
          placeholder="Full name"
          autoComplete="name"
          required
          {...register("fullname")}
          error={errors.fullname?.message}
        />
        <Input
          type="email"
          placeholder="Email"
          autoComplete="email"
          required
          {...register("email")}
          error={errors.email?.message}
        />
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

        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <Link href="#" className="text-primary font-semibold">
              terms of service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-primary font-semibold">
              privacy policy
            </Link>
          </label>
        </div>

        <Button type="submit">Sign Up</Button>
        <div className="text-center">
          <p>
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default SignUpEmail;
