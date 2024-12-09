"use server";
import { getCurrentUser } from "@/data/user";
import { customCheckRateLimitAndThrowError } from "@/lib/check-ratelimit-throw-error";
import { database } from "@/lib/database";
import {
  compileBuisnessVerificationTemplate,
  sendMail,
} from "@/lib/emails/mail";
import { DojahService } from "@/lib/services/dojah";
import { AxiosError } from "axios";
import crypto from "crypto";

export const verifyNIN = async (nin: string) => {
  const vendor = await getCurrentUser();

  console.log({ vendor });

  const doja = new DojahService({
    appId: process.env.DOJAH_APP_ID as string,
    environment: "sandbox",
    secretKey: process.env.DOJAH_PRIVATE_KEY as string,
  });

  const kyc_data = {
    document_type: "",
    verifiedFirstname: "",
    verifiedLastname: "",
  };

  let response;
  try {
    response = await doja.lookupNIN(nin);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        return error.response.data;
      }
    }
  }

  kyc_data.document_type = "nin";
  kyc_data.verifiedFirstname = response.entity.first_name;
  kyc_data.verifiedLastname = response.entity.last_name;

  if (
    !vendor?.name?.includes(kyc_data.verifiedFirstname) &&
    !vendor?.name?.includes(kyc_data.verifiedLastname)
  ) {
    // Enable to test
    // return { error: "NIN not valid" };
  }

  return { success: "NIN Verified" };
};

export const sendBuisnessVerification = async (name: string) => {
  const vendor = await getCurrentUser();
  if (!vendor || !vendor.email) {
    return { error: "Access Denied" };
  }
  await customCheckRateLimitAndThrowError(vendor.email);
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 900 * 1000);

  await database.buisnessVerificationToken.create({
    data: {
      token,
      expires,
      email: vendor.email,
    },
  });
  await sendMail({
    to: vendor.email,
    subject: "Verify Buisness",
    body: compileBuisnessVerificationTemplate(name, token),
  });
  return { success: "OTP Sent" };
};
