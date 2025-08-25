"use client";

import { useOrderConfirmationModal } from "@/components/modals/order-confirmation.modal";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@prisma/client";
import React from "react";

const VendorOrderConfirmed = ({
  order,
}: {
  order: {
    id: string;
    status: OrderStatus;
    vendorDeliveryConfirmation: boolean;
  };
}) => {
  const { AddOrderConfirmationModal, openModal } = useOrderConfirmationModal();
  return (
    <>
      {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
        <Button
          className="w-full"
          disabled={order.vendorDeliveryConfirmation}
          onClick={() => openModal(order.id)}
        >
          Mark as Delivered
        </Button>
      )}
      <AddOrderConfirmationModal />
    </>
  );
};

export default VendorOrderConfirmed;
