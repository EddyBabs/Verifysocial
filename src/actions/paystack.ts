"use server";

import { getCurrentUser } from "@/data/user";
import { database } from "@/lib/database";
import { Bank } from "@/types";
import { Prisma } from "@prisma/client";
import axios from "axios";

const secret = process.env.PAYSTACK_SECRET_KEY;

const BASE_URL = "https://api.paystack.co/transaction";

export const getBanks = async () => {
  try {
    const response = await axios.get("https://api.paystack.co/bank", {
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    });
    const data = response.data;
    if (data.status && data.data.length) {
      return {
        success: data.data.map(
          (bank: { name: string; code: string; slug: string }) => ({
            name: bank.name,
            code: bank.code,
            slug: bank.slug,
          })
        ),
      };
    }
    return { error: "Unable to fetch banks at the moment" };
  } catch (error) {
    // if (axios.isAxiosError(error)) {
    //   console.dir(error.response?.data, { depth: null });
    //   return { error: error.response?.data };
    // }
    // console.dir(error, { depth: null });
    return { error: "Unable to fetch banks at the moment" };
  }
};

export const getAccountName = async (bank: Bank, account: string) => {
  try {
    const response = await axios.get("https://api.paystack.co/bank/resolve", {
      params: {
        account_number: account,
        bank_code: bank.code,
      },
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    });
    const data = await response.data;

    if (data.status) {
      return {
        success: data.data.account_name,
      };
    }
    return { error: "Unable to fetch account name" };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // console.dir(error.response?.data, { depth: null });
      //   return { error: error.response?.data };
    }

    return { error: "Unable to fetch account name" };
  }
};

export const createChargeSession = async (code: string) => {
  const userSession = await getCurrentUser();
  const user = await database.user.findUnique({
    where: { id: userSession?.id },
  });
  if (!user) {
    throw new Error("Could not find user");
  }

  const prismaCode = await database.code.findUnique({
    where: {
      value: code,
    },
    include: {
      order: true,
    },
  });
  const order = prismaCode?.order;
  try {
    if (!order) {
      return { error: "Order does not exist" };
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: user.email,
        firstname: user?.fullname.split(" ")?.[0],
        lastname: user?.fullname.split(" ")?.[1],
        amount: Number(order.amountValue * 100).toFixed(2),
        callback_url: `${process.env.NEXTAUTH_URL}/orders/${order.id}`,
        callbackUrl: `${process.env.NEXTAUTH_URL}/orders/${order.id}`,
        metadata: {
          customer: user.id,
          orderId: order.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${secret}`,
        },
      }
    );

    const data = await response.data;

    const authorization = data.data;

    return { success: authorization.access_code };
  } catch (error) {
    console.log({ error });
    return { error: "An error occured" };
  }
};

export const verifyTransaction = async (trxRef: string) => {
  try {
    if (!trxRef) {
      return { error: "could not verify transaction" };
    }
    console.log("Verifying...");
    const response = await axios.get(`${BASE_URL}/verify/${trxRef}`, {
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    });
    const data = await response.data;
    let transaction = await database.transaction.findUnique({
      where: { reference: trxRef },
    });
    if (transaction) {
      return { success: "Transaction verified" };
    }
    const paystackResponse = data.data;
    if (paystackResponse.status === "success") {
      const orderId = paystackResponse.metadata?.orderId;

      if (!orderId) {
        return { error: "Could not find Order" };
      }

      let order = await database.order.findUnique({
        where: { id: orderId },
        include: { code: true },
      });
      if (!order || !order.amountValue) {
        return { error: "Could not find plan" };
      }

      const totalAmount = order.amountValue;

      if (totalAmount < paystackResponse.amount / 100) {
        return { error: "Transaction not complete" };
      }

      const email: string = paystackResponse.customer.email;

      const user = await database.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (!user) {
        return { error: "Could not find user!" };
      }

      order = await database.order.update({
        where: { id: order.id, userId: user.id },
        data: {
          paymentStatus: "SUCCESS",
        },
        include: {
          code: true,
        },
      });
      await database.vendor.update({
        where: {
          id: order.code.vendorId,
        },
        data: {
          availableBalance: { increment: paystackResponse.amount / 100 },
          totalBalance: { increment: paystackResponse.amount / 100 },
        },
      });

      transaction = await database.transaction.create({
        data: {
          reference: trxRef,
          userId: user.id,
          orderId: order.id,
          currency: paystackResponse.currency,
          amount: paystackResponse.amount / 100,
          channel: paystackResponse.channel,
        },
      });

      return { success: "Transaction Successful" };
    }
    return { error: "Could not verify transaction" };
  } catch (error) {
    console.log({ error });
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { success: "Transaction Successful" };
    }

    return { error: "An error occured!" };
  }
};
