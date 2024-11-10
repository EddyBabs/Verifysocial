import { database } from "@/lib/database";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await database.verificationToken.findUnique({
      where: { token },
    });
    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await database.verificationToken.findFirst({
      where: { identifier: email },
    });
    return verificationToken;
  } catch {
    return null;
  }
};
