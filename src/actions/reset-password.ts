"use server";
import { getPasswordResetTokenByToken } from "@/data/forgot-password-token";
import { getUserByEmail } from "@/data/user";
import { database } from "@/lib/database";
import { resetPasswordSchema } from "@/schemas/auth";
import bcrypt from "bcryptjs";
import * as z from "zod";

export const resetPassword = async (
  values: z.infer<typeof resetPasswordSchema>
) => {
  try {
    const validatedData = resetPasswordSchema.safeParse(values);

    if (!validatedData.success) {
      return { error: "Invalid Fields" };
    }

    const { token, password } = validatedData.data;

    console.log({ token });

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
      return { error: "Invalid Token" };
    }
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: "Token has expired!" };
    }
    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
      return { error: "Email does not exist" };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await database.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });
    await database.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
    return { success: "Password updated" };
  } catch (error) {
    return { error: "An error occured" };
  }
};
