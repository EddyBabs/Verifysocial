"use server";

import { getUserByEmail } from "@/data/user";
import { sendVerification } from "./send-verification";

export async function resendVerificationEmail(email: string) {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return { error: "Could not find user" };
    }
    if (user.emailVerified) {
      return { error: "User already verified" };
    }

    await sendVerification(user);

    return { success: "Resent verification code" };
  } catch (error) {
    return { error: (error as Error).message };
  }
}
