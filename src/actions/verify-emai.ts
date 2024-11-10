"use server";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { database } from "@/lib/database";

export const newVerification = async (token: string) => {
  console.log({ token });
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired" };
  }
  const existingUser = await getUserByEmail(existingToken.identifier);
  if (!existingUser) {
    return { error: "Email does not exist" };
  }

  await database.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingUser.email,
    },
  });

  await database.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email Verified" };
};
