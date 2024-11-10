"use server";
import { customCheckRateLimitAndThrowError } from "@/lib/check-ratelimit-throw-error";
import { database } from "@/lib/database";
import { compileVerifyEmailTemplate, sendMail } from "@/lib/emails/mail";
import { v4 as uuidv4 } from "uuid";

export const sendVerification = async (user: {
  email: string;
  fullname: string;
}) => {
  const { email, fullname } = user;

  await customCheckRateLimitAndThrowError(email);
  const existingToken = await database.verificationToken.findUnique({
    where: { identifier: email },
  });

  if (existingToken) {
    await database.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const token = uuidv4();
  await database.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + 24 * 3600 * 1000),
    },
  });
  const confirmLink = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;
  await sendMail({
    to: email,
    subject: "Verify Email Address",
    body: compileVerifyEmailTemplate(fullname, confirmLink),
  });
};
