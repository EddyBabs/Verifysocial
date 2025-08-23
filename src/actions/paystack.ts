"use server";

import { getCurrentUser } from "@/data/user";
import { database } from "@/lib/database";
import { Bank } from "@/types";
import { PaymentInformation, Prisma } from "@prisma/client";
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
          (bank: {
            name: string;
            code: string;
            slug: string;
            currency: string;
            type: string;
          }) => ({
            name: bank.name,
            code: bank.code,
            slug: bank.slug,
            currency: bank.currency,
            type: bank.type,
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

      const order = await database.order.findUnique({
        where: { id: orderId },
        include: { code: true },
      });

      if (!order || !order.amountValue) {
        return { error: "Could not find plan" };
      }

      const totalAmount = order.amountValue;
      const amountPaid = paystackResponse.amount / 100;
      if (totalAmount < amountPaid) {
        return { error: "Transaction not complete" };
      }

      const email: string = paystackResponse.customer.email;

      const user = await database.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        return { error: "Could not find user!" };
      }

      const neworder = await database.order.update({
        where: { id: order.id, paymentStatus: "PENDING" },
        data: {
          paymentStatus: "SUCCESS",
          paymentDate: new Date(),
        },
        include: {
          code: true,
        },
      });

      if (neworder) {
        await database.vendor.update({
          where: {
            id: order.code.vendorId,
          },
          data: {
            pendingBalance: { increment: amountPaid },
            totalBalance: { increment: amountPaid },
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
      }

      return { success: "Transaction Successful" };
    }
    return { error: "Could not verify transaction" };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { success: "Transaction Successful" };
    }

    return { error: "An error occured!" };
  }
};

export const createTransferRecipient = async (
  paymentInfo: PaymentInformation
) => {
  const response = await axios.post(
    "https://api.paystack.co/transferrecipient",
    {
      type: paymentInfo.type,
      name: paymentInfo.accountName,
      account_number: paymentInfo.accountNumber,
      bank_code: paymentInfo.bankCode,
      currency: paymentInfo.currency,
    },
    {
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    }
  );
  const responseData = response.data;
  if (responseData.status === true && responseData.data.active) {
    return responseData.data.recipient_code;
  }
  throw Error("Unable to create recipient");
};

export const createTransfer = async (
  recipient: string,
  amount: number,
  reason: string
) => {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transfer",
      {
        source: "balance",
        reason,
        amount: amount * 100,
        recipient,
      },
      {
        headers: {
          Authorization: `Bearer ${secret}`,
        },
      }
    );
    const responseData = response.data;
    console.log({ responseData });
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.dir(error.response?.data, { depth: null });

      // {
      //   status: false,
      //   message: 'You cannot initiate third party payouts as a starter business',
      //   meta: {
      //     nextStep: "You'll need to upgrade your business to a Registered Business."
      //   },
      //   type: 'api_error',
      //   code: 'transfer_unavailable'
      // }
    } else {
      console.log({ error });
    }
  }
};
