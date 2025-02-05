import { login } from "@/actions/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { signInSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type SignInProps = z.infer<typeof signInSchema>;

const SignInEmail = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<"signup" | "verify">>;
}) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [passwordVisible, setPassworVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInProps>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (values: SignInProps) => {
    startTransition(async () => {
      await login(values)
        .then((response) => {
          if (response?.error) {
            toast({ variant: "destructive", description: response.error });
          } else if (response?.unverified) {
            sessionStorage.setItem("email", values.email);
            setStep("verify");
          }
        })
        .catch((error) => {
          toast({ variant: "destructive", description: "An error occured!" });
        });
    });
  };
  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <div className="flex flex-col space-y-6">
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
        <div className="text-right">
          <Link
            href={"/auth/forgot-password"}
            className="text-primary font-semibold"
          >
            {" "}
            Forgot password?
          </Link>
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-gradient-to-r from-[#003399] to-[#87B077]"
        >
          Login
        </Button>
        <div className="text-center">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-primary font-semibold">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default SignInEmail;
