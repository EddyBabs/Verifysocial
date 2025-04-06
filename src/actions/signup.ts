"use server";

import { getUserByEmail } from "@/data/user";
import { database, UserRole } from "@/lib/database";
import { signUpSchema, VerifyEmailSchema } from "@/schemas/auth";
import bcrypt from "bcryptjs";

import * as z from "zod";
import { sendVerification } from "./send-verification";
import { RoleType } from "@/types";

export const signupAction = async (values: z.infer<typeof signUpSchema>) => {
  try {
    const validatedFields = signUpSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }

    const user = await createUser(
      validatedFields.data,
      validatedFields.data.role
    );

    if (!user) {
      return { error: "An error occured" };
    }

    await sendVerification(user);

    return { success: "User Created" };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export async function verifyEmail(values: z.infer<typeof VerifyEmailSchema>) {
  try {
    const validatedFields = VerifyEmailSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }
    const { email, code } = validatedFields.data;

    const verificationToken = await database.verificationToken.findUnique({
      where: { identifier: email, token: code },
    });
    if (!verificationToken) {
      return { error: "Verification code has expired or does not exist" };
    }
    const hasExpired = new Date(verificationToken.expires) < new Date();

    if (hasExpired) {
      return { error: "Verification code has expired or does not exist" };
    }
    const user = await getUserByEmail(verificationToken.identifier);
    if (!user) {
      return { error: "User does not exist" };
    }
    await database.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        email: verificationToken.identifier,
      },
    });

    await database.verificationToken.delete({
      where: { id: verificationToken.id },
    });
    return { success: "Email Verified successfully" };
  } catch {
    return { error: "Error Occured" };
  }
}

export async function createUser(
  values: z.infer<typeof signUpSchema>,
  role: RoleType
) {
  const { fullname, email, password } = values;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await database.user.create({
    data: {
      fullname,
      email,
      password: hashedPassword,
      role: role === "user" ? UserRole.USER : UserRole.VENDOR,
    },
  });
}
