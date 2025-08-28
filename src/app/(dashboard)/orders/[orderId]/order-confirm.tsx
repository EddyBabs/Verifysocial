"use client";
import { useCustomerOrderConfirmationModal } from "@/components/modals/customer-confirmation-order.modal";
import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import { useEffect } from "react";

const OrderConfirm = ({
  order,
}: {
  order: Prisma.OrderGetPayload<{
    select: {
      id: true;
      status: true;
      userDeliveryConfirmation: true;
      vendorDeliveryConfirmation: true;
      code: { select: { deliveryPeriod: true } };
    };
  }>;
}) => {
  const { AddOrderConfirmationModal, openModal } =
    useCustomerOrderConfirmationModal();

  useEffect(() => {
    if (
      order.code.deliveryPeriod.getTime() < new Date().getTime() &&
      order.status === "PROCESSING"
    ) {
      openModal(order.id);
    }
  }, [openModal, order.code.deliveryPeriod, order.id, order.status]);

  return (
    <>
      <Button onClick={() => openModal(order.id)}>Confirm Order</Button>
      <AddOrderConfirmationModal />
    </>
  );
};

export default OrderConfirm;
