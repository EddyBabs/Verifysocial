"use server";

import * as z from "zod";
import { getCurrentUser } from "@/data/user";
import { database } from "@/lib/database";
import { accountFormSchema, AccountFormValues } from "@/schemas/account-info";

export const fetchVendorPaymentInfo = async () => {
  const user = await getCurrentUser();

  const vendor = await database.vendor.findUnique({
    where: { userId: user?.id },
  });
  if (!vendor) {
    return { error: "Access Denied" };
  }
  const paymentInfo = await database.paymentInformation.findUnique({
    where: { vendorId: vendor.id },
  });

  return { paymentInfo };
};

export const updateVendorPaymentInfo = async (values: AccountFormValues) => {
  const user = await getCurrentUser();

  const vendor = await database.vendor.findUnique({
    where: { userId: user?.id },
    include: { paymentInformation: true },
  });
  if (!vendor) {
    return { error: "Access Denied" };
  }

  const validatedFields = accountFormSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  const { bank, accountNumber, accountName } = validatedFields.data;
  //   let paymentInfo = await database.paymentInformation.findUnique({
  //     where: { vendorId: vendor.id },
  //   });
  //   if (!paymentInfo){
  //     paymentInfo = database.paymentInformation.create({

  //     })
  //   } else {

  //   }
  const paymentInfo = await database.paymentInformation.upsert({
    where: {
      vendorId: vendor.id,
    },
    create: {
      vendorId: vendor.id,
      accountNumber,
      accountName: accountName,
      bankCode: bank.code,
      bankSlug: bank.slug,
      bankName: bank.name,
    },
    update: {
      accountNumber,
      accountName: accountName,
      bankCode: bank.code,
      bankSlug: bank.slug,
      bankName: bank.name,
    },
  });

  if (paymentInfo) {
    return {
      success: `Payment ${
        vendor.paymentInformation ? "updated" : "created"
      } successfully`,
    };
  }
  return {
    error: `Error ${
      vendor.paymentInformation ? "updating" : "creating"
    } payment`,
  };
};
