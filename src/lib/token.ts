import { v4 as uuidv4 } from "uuid";
import { database } from "./database";
import { getPasswordResetTokenByEmail } from "@/data/forgot-password-token";

export const generateForgotPasswordToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await database.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const forgotPasswordToken = await database.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return forgotPasswordToken;
};
