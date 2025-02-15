import { fetchUserOrderById } from "@/actions/order";
import React from "react";
import OrderModal from "./order-modal";
import { formatDate } from "date-fns";

const Page = async ({ params }: { params: { orderId: string } }) => {
  const order = await fetchUserOrderById(params.orderId);
  return (
    <div className="container">
      <div>
        <h2>Order Title</h2>
        <h4 className="text-lg font-bold uppercase">{order.name}</h4>
        <h2>Amount:</h2>
        <h4>{order.amountValue}</h4>
        <h2>Delivery Period</h2>

        <h4>{formatDate(order.deliveryPeriod, "PPP")}</h4>
      </div>
      <OrderModal
        isOpen={
          order.deliveryPeriod.getTime() < new Date().getTime() &&
          order.status === "PROCESSING"
        }
        orderId={order.id}
      />
    </div>
  );
};

export default Page;
