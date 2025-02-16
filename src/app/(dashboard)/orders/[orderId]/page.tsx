import { fetchUserOrderById } from "@/actions/order";
import { getCurrentUser } from "@/data/user";
import { formatDate } from "date-fns";
import OrderCancel from "./order-cancel";
import OrderModal from "./order-modal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Page = async ({ params }: { params: { orderId: string } }) => {
  const user = await getCurrentUser();
  const order = await fetchUserOrderById(params.orderId);

  return (
    <div className="container">
      <div className="grid">
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <h2>Order Title:</h2>
            <h4 className="text-lg font-bold uppercase">{order.name}</h4>
          </div>
          <div>
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
        <h2>Amount:</h2>
        <h4>{order.amountValue}</h4>
        <h2>Delivery Period</h2>
        <h4>{formatDate(order.deliveryPeriod, "PPP")}</h4>

        {["PROCESSING"].includes(order.status) && (
          <OrderCancel orderId={order.id} />
        )}
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
    </div>
  );
};

export default Page;
