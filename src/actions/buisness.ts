"use server";
import { getBuisnessVerificationTokenByToken } from "@/data/buisness-token";
import { getCurrentUser } from "@/data/user";
import { customCheckRateLimitAndThrowError } from "@/lib/check-ratelimit-throw-error";
import { database } from "@/lib/database";
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
import { GenderType, Tier } from "@prisma/client";
import { AxiosError } from "axios";

const DEVELOPMENT = false;

export const verifyNIN = async (nin: string) => {
  const currentUser = await getCurrentUser();

  if (!currentUser || !currentUser.id) {
    return { error: "Access Denied" };
  }

  const user = await database.user.findUnique({
    where: { id: currentUser.id },
    include: { vendor: true },
  });

  if (!user) {
    return { error: "Access Denied" };
  }
  try {
    await customCheckRateLimitAndThrowError(user.email || "");
  } catch (error) {
    return { error: "Too many requests. Please try again later." };
  }
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
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        // return error.response.data;
        return { error: "NIN not valid" };
      }
    }
    return { error: "An error occured while verifying NIN" };
  }

  if (!response || !response?.entity) {
    return { error: "NIN not valid" };
  }
  kyc_data.document_type = "nin";
  kyc_data.verifiedFirstname = response?.entity?.first_name;
  kyc_data.verifiedLastname = response?.entity?.last_name;

  // Check if kyc is correct
  if (
    !user.fullname
      ?.toLowerCase()
      .includes(kyc_data.verifiedFirstname?.toLowerCase()) ||
    !user.fullname
      ?.toLowerCase()
      .includes(kyc_data.verifiedLastname?.toLowerCase())
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
  if (!user.vendor || !user.vendor.id) {
    const vendor = await database.vendor.create({
      data: {
        userId: user.id,
      },
    });
    user.vendor = vendor;
  }
  await database.kYCCredential.create({
    data: {
      vendorId: user.vendor.id,
      type: "NIN",
      status: "APPROVED",
      verifiedAt: new Date(),
    },
  });

  return { success: "NIN Verified" };
};

export const sendBusinessVerification = async (name: string) => {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.id) {
    return { error: "Access Denied" };
  }

  const vendor = await database.user.findUnique({
    where: { id: currentUser.id },
    select: { email: true },
  });
  if (!vendor || !vendor.email) {
    return { error: "Access Denied" };
  }
  try {
    await customCheckRateLimitAndThrowError(vendor.email);
  } catch (error) {
    return { error: "Too many requests. Please try again later." };
  }

  const businessVerificationToken = await generateBusinessVerificationToken(
    vendor.email,
  );

  await sendMail({
    to: vendor.email,
    subject: "Verify Business",
    body: compileBuisnessVerificationTemplate(
      name,
      businessVerificationToken.token,
    ),
  });
  return { success: "OTP Sent" };
};

export const addBuisness = async (values: BecomeAVendorSchemaType) => {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.id) {
    return { error: "Access Denied" };
  }

  const vendor = await database.vendor.findUnique({
    where: { userId: currentUser.id },
    include: { User: true },
  });

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
    validatedData.step3.otp,
  );

  if (!existingToken) {
    return { error: "Invalid Token" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired" };
  }

  if (existingToken.email !== vendor.User.email) {
    return { error: "Token has expired" };
  }

  await database.vendor.upsert({
    where: {
      id: vendor.id,
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
      id: vendor.User.id,
    },
    data: {
      fullname: `${validatedData.step1.firstname} ${validatedData.step1.lastname}`,
      address: {
        upsert: {
          where: {
            userId: vendor.User.id,
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
