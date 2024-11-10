import { database } from "@/lib/database";

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordToken = await database.passwordResetToken.findFirst({
      where: { email },
    });

    return passwordToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordToken = await database.passwordResetToken.findUnique({
      where: { token },
    });

    return passwordToken;
  } catch {
    return null;
  }
};
