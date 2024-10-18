import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type SignInProps = z.infer<typeof signInSchema>;

const SignInEmail = () => {
  const [passwordVisible, setPassworVisible] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInProps>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "johndoe@example.com",
      password: "Password12345",
    },
  });
  const onSubmit = async (values: SignInProps) => {
    console.log(values);
    router.push("/dashboard");
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
          <Link href={"#"} className="text-primary font-semibold">
            {" "}
            Forgot password?
          </Link>
        </div>
        <Button type="submit">Login</Button>
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
