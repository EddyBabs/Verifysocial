"use server";
import * as z from "zod";

import { requestPasswordResetSchema } from "@/schemas/auth";
import { getUserByEmail } from "@/data/user";
import { generateForgotPasswordToken } from "@/lib/token";
import { compileForgotPasswordTemplate, sendMail } from "@/lib/emails/mail";
import { customCheckRateLimitAndThrowError } from "@/lib/check-ratelimit-throw-error";

const message =
  "If an account is associated with this email, a reset link will be sent.";
export const reset = async (
  values: z.infer<typeof requestPasswordResetSchema>
) => {
  try {
    const validatedFields = requestPasswordResetSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid Email" };
    }
    const { email } = validatedFields.data;

    const user = await getUserByEmail(email);
    if (!user) {
      return { success: message };
    }

    await customCheckRateLimitAndThrowError(email);
    const passwordResetToken = await generateForgotPasswordToken(email);

    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${passwordResetToken.token}`;

    await sendMail({
      to: user.email,
      subject: "Password Reset",
      body: compileForgotPasswordTemplate(user.fullname, resetLink),
    });

    return { success: message };
  } catch (error) {
    const message = (error as Error).message;
    if (message.includes("Rate limit exceeded")) {
      return { error: message };
    }
    return { error: "An error occured" };
  }
};
