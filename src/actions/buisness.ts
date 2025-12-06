"use server";
import { getBuisnessVerificationTokenByToken } from "@/data/buisness-token";
import { getCurrentUser } from "@/data/user";
import { customCheckRateLimitAndThrowError } from "@/lib/check-ratelimit-throw-error";
import { database, GenderType, Tier } from "@/lib/database";
import {
  compileBuisnessVerificationTemplate,
  sendMail,
} from "@/lib/emails/mail";
import { DojahService } from "@/lib/services/dojah";
import { generateBusinessVerificationToken } from "@/lib/token";
import {
  BecomeAVendorSchemaType,
  becomeAVendorShcema,
} from "@/schemas/become-a-vendor";
import { AxiosError } from "axios";

const DEVELOPMENT = false;

export const verifyNIN = async (nin: string) => {
  const currentUser = await getCurrentUser();

  if (!currentUser || !currentUser.id) {
    return { error: "Access Denied" };
  }

  console.log({ currentUser });

  const user = await database.user.findUnique({
    where: { id: currentUser.id },
    include: { vendor: true },
  });

  console.log({ user });
  if (!user) {
    return { error: "Access Denied" };
  }

  await customCheckRateLimitAndThrowError(user.email || "");
  if (DEVELOPMENT) {
    if (!user.vendor) {
      const vendor = await database.vendor.create({
        data: {
          userId: user.id,
        },
      });
      user.vendor = vendor;
    }
    const approvedCredentials = await database.kYCCredential.count({
      where: { vendorId: user.vendor.id, status: "APPROVED" },
    });
    if (approvedCredentials < 1) {
      await database.kYCCredential.create({
        data: {
          vendorId: user.vendor.id,
          type: "NIN",
          status: "APPROVED",
          verifiedAt: new Date(),
        },
      });
    }

    return { success: "NIN Verified" };
  }

  console.log("Checking dojah");

  const doja = new DojahService({
    appId: process.env.DOJAH_APP_ID as string,
    // environment: "sandbox",
    environment: "live",
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
    console.log({ error });
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        return error.response.data;
      }
    }
  }

  kyc_data.document_type = "nin";
  kyc_data.verifiedFirstname = response.entity.first_name;
  kyc_data.verifiedLastname = response.entity.last_name;

  console.log({ kyc_data, fullname: user.fullname });

  // Check if kyc is correct
  if (
    !user.fullname
      ?.toLowerCase()
      .includes(kyc_data.verifiedFirstname.toLowerCase()) ||
    !user.fullname
      ?.toLowerCase()
      .includes(kyc_data.verifiedLastname.toLowerCase())
  ) {
    return { error: "NIN does not match user details" };
  }

  // if (
  //   !user.name?.includes(kyc_data.verifiedFirstname) &&
  //   !user.vendor?.name?.includes(kyc_data.verifiedLastname)
  // ) {
  //   // Enable to test
  //   return { error: "NIN not valid" };
  // }

  return { success: "NIN Verified" };
};

export const sendBusinessVerification = async (name: string) => {
  const vendor = await getCurrentUser();
  if (!vendor || !vendor.email) {
    return { error: "Access Denied" };
  }
  await customCheckRateLimitAndThrowError(vendor.email);

  const businessVerificationToken = await generateBusinessVerificationToken(
    vendor.email
  );

  await sendMail({
    to: vendor.email,
    subject: "Verify Business",
    body: compileBuisnessVerificationTemplate(
      name,
      businessVerificationToken.token
    ),
  });
  return { success: "OTP Sent" };
};

export const addBuisness = async (values: BecomeAVendorSchemaType) => {
  const vendor = await getCurrentUser();
  if (!vendor || !vendor?.id) {
    return { error: "Access Denied" };
  }

  const approvedCredentials = await database.kYCCredential.count({
    where: { vendorId: vendor.id, status: "APPROVED" },
  });
  if (approvedCredentials < 1) {
    return { error: "Your NIN has not been verified" };
  }
  const validatedField = becomeAVendorShcema.safeParse(values);
  if (!validatedField.success) {
    return { error: "Invalid Fields" };
  }

  const validatedData = validatedField.data;

  const existingToken = await getBuisnessVerificationTokenByToken(
    validatedData.step3.otp
  );

  if (!existingToken) {
    return { error: "Invalid Token" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired" };
  }

  if (existingToken.email !== vendor.email) {
    return { error: "Token has expired" };
  }

  await database.vendor.upsert({
    where: {
      userId: vendor.id,
    },
    update: {
      businessName: validatedData.step2.businessName,
      businessAbout: validatedData.step2.businessAbout,
      // socialPlatform: validatedData.step2.socialPlatform,
      tier: Tier.TIER1,
    },
    create: {
      userId: vendor.id,
      businessName: validatedData.step2.businessName,
      businessAbout: validatedData.step2.businessAbout,
      // socialPlatform: validatedData.step2.socialPlatform,
      tier: Tier.TIER1,
    },
  });

  await database.user.update({
    where: {
      id: vendor.id,
    },
    data: {
      fullname: `${validatedData.step1.firstname} ${validatedData.step1.lastname}`,
      address: {
        upsert: {
          where: {
            userId: vendor.id,
          },
          create: {
            country: validatedData.step2.address.country,
            city: validatedData.step2.address.city,
            state: validatedData.step2.address.state,
            street: validatedData.step2.address.street,
          },
          update: {
            country: validatedData.step2.address.country,
            city: validatedData.step2.address.city,
            state: validatedData.step2.address.state,
            street: validatedData.step2.address.street,
          },
        },
      },
      gender:
        validatedData.step1.gender === "male"
          ? GenderType.MALE
          : GenderType.FEMALE,
      phone: validatedData.step1.phone,
    },
  });
  return { success: "Verified Successfully" };
};
