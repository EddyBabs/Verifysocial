import { fetchUserOrderById } from "@/actions/order";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/data/user";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import OrderCancel from "./order-cancel";
import OrderDelay from "./order-delay";
import OrderModal from "./order-modal";
import OrderVendorCustomerContact from "./order-vendor-customer-contact";
import OrderCustomerVendorContact from "./order-customer-vendor-contact";
import OrderCustomerSatisfaction from "./order-customer-satisfaction";
import { OrderStatus } from "@prisma/client";

const Page = async ({ params }: { params: { orderId: string } }) => {
  const user = await getCurrentUser();
  const order = await fetchUserOrderById(params.orderId);

  return (
    <div className="container my-10">
      <div className="grid">
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <h2>Order Title:</h2>
            <h4 className="text-lg font-bold uppercase">{order.name}</h4>
          </div>
          <div className="hidden md:block">
            <Badge
              className={cn({
                "bg-destructive hover:bg-destructive/50":
                  order.status === "CANCELLED",
              })}
            >
              {order.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <h2>Order Code:</h2>
          <h4 className="text-lg font-bold uppercase">{order.code}</h4>
        </div>
        <h2>Amount:</h2>
        <h4>{order.amountValue}</h4>
        <h2>Delivery Period</h2>
        <h4>{formatDate(order.deliveryPeriod, "PPP")}</h4>

        <div className="block md:hidden my-4">
          <Badge
            className={cn({
              "bg-destructive hover:bg-destructive/50":
                order.status === "CANCELLED",
            })}
          >
            {order.status}
          </Badge>
        </div>

        <div className="flex items-center gap-2 mt-4">
          {user?.role === "USER" && ["PROCESSING"].includes(order.status) && (
            <OrderCancel orderId={order.id} />
          )}
          {user?.role === "VENDOR" && <OrderDelay orderId={order.id} />}
          {user?.role === "VENDOR" && (
            <OrderVendorCustomerContact orderId={order.id} />
          )}
          {user?.role === "VENDOR" && !order.vendorSatisfaction && (
            <OrderCustomerSatisfaction orderId={order.id} user={user} />
          )}
        </div>
      </div>

      {user?.role === "USER" && (
        <OrderModal
          isOpen={
            order.deliveryPeriod.getTime() < new Date().getTime() &&
            order.status === "PROCESSING"
          }
          orderId={order.id}
        />
      )}

      {user?.role === "USER" && (
        <OrderCustomerVendorContact orderId={order.id} />
      )}
      {user?.role === "USER" &&
        !order.customerSatisfaction &&
        [OrderStatus.COMPLETED, OrderStatus.CANCELLED].includes(
          order.status as any
        ) && <OrderCustomerSatisfaction orderId={order.id} user={user} />}
    </div>
  );
};

export default Page;
