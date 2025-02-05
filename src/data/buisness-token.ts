import { database } from "@/lib/database";

export const getBuisnessVerificationTokenByEmail = async (email: string) => {
  try {
    const passwordToken = await database.businessVerificationToken.findFirst({
      where: { email },
    });

    return passwordToken;
  } catch {
    return null;
  }
};

export const getBuisnessVerificationTokenByToken = async (token: string) => {
  try {
    const passwordToken = await database.businessVerificationToken.findUnique({
      where: { token },
    });

    return passwordToken;
  } catch {
    return null;
  }
};
