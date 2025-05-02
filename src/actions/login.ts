"use server";
import { getUserByEmail } from "@/data/user";
import { signIn } from "@/lib/auth";
import { signInSchema } from "@/schemas/auth";
import { AuthError } from "next-auth";
import * as z from "zod";
import { sendVerification } from "./send-verification";

export const login = async (values: z.infer<typeof signInSchema>) => {
  const validatedFields = signInSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  const { email, password } = validatedFields.data;

  const user = await getUserByEmail(email);
  if (!user) {
    return { error: "Invalid Email or Password" };
  }
  if (!user?.emailVerified) {
    await sendVerification(user);
    return { unverified: true };
  }

  console.log("Signing in");
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    console.log({ error });
    if (error instanceof AuthError) {
      console.log("It is an Instance");
      switch (error.type) {
        case "CredentialsSignin": {
          return { error: "Invalid Credentials" };
        }
        default: {
          return { error: "Something went wrong" };
        }
      }
    }
    throw error;
  }
};
