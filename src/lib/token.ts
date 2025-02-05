import { getBuisnessVerificationTokenByEmail } from "@/data/buisness-token";
import { getPasswordResetTokenByEmail } from "@/data/forgot-password-token";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { database } from "./database";

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

export const generateBusinessVerificationToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 900 * 1000);
  const existingToken = await getBuisnessVerificationTokenByEmail(email);
  if (existingToken) {
    await database.businessVerificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const businessVerificationToken =
    await database.businessVerificationToken.create({
      data: {
        token,
        expires,
        email,
      },
    });

  return businessVerificationToken;
};
