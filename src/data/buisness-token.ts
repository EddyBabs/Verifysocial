import { database } from "@/lib/database";

export const getBuisnessVerificationTokenByEmail = async (email: string) => {
  try {
    const passwordToken = await database.buisnessVerificationToken.findFirst({
      where: { email },
    });

    return passwordToken;
  } catch {
    return null;
  }
};

export const getBuisnessVerificationTokenByToken = async (token: string) => {
  try {
    const passwordToken = await database.buisnessVerificationToken.findUnique({
      where: { token },
    });

    return passwordToken;
  } catch {
    return null;
  }
};
