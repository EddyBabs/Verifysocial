"use client";

import { ExtendedUser } from "@/types";
import { Prisma } from "@prisma/client";
import dynamic from "next/dynamic";

const OrderPaymentClient = dynamic(() => import("./order-payment-client"), {
  ssr: false,
});

const OrderPayment = ({
  order,
  user,
}: {
  order: Prisma.OrderGetPayload<{
    include: { code: { select: { value: true } } };
  }>;
  user: ExtendedUser | undefined;
}) => {
  return <OrderPaymentClient order={order} user={user} />;
};

export default OrderPayment;
