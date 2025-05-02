"use client";
import { createChargeSession, verifyTransaction } from "@/actions/paystack";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ExtendedUser } from "@/types";
import PaystackPop from "@paystack/inline-js";
import { OrderStatus, Prisma } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const OrderPayment = ({
  order,
  user,
}: {
  order: Prisma.OrderGetPayload<{
    include: { code: { select: { value: true } } };
  }>;
  user: ExtendedUser | undefined;
}) => {
  const popup = new PaystackPop();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const config = {
    onClose: function () {
      alert("Window closed.");
    },
    callback: function (response: { reference: string }) {
      const message = "Payment complete! Reference: " + response.reference;
      alert(message);
    },
    onSuccess: async function (response: { trxref: string }) {
      const serverResponse = await verifyTransaction(response.trxref);
      if (serverResponse.error) {
        toast({ description: serverResponse.error, variant: "destructive" });
      } else {
        toast({ description: serverResponse.success });
      }
      router.refresh();
    },
    onCancel: function () {
      alert("Cancelled");
    },
  };
  const handleMakePayment = () => {
    startTransition(async () => {
      const session = await createChargeSession(order.code.value);
      if (session.error) {
        toast({ description: session.error, variant: "destructive" });
      } else {
        const result = await popup.resumeTransaction(session.success, config);
        console.log({ result });
      }
    });
  };

  if (
    order.paymentStatus === "PENDING" &&
    user?.role === "USER" &&
    ![OrderStatus.COMPLETED, OrderStatus.CANCELLED].includes(
      order.status as any
    )
  ) {
    return (
      <Button disabled={isPending} onClick={handleMakePayment}>
        Make payment {isPending && <Loader2 className="ml-1 animate-spin" />}
      </Button>
    );
  }
  return (
    <Badge variant={"outline"}>
      Payment Status: {order.paymentStatus.toLowerCase()}
    </Badge>
  );
};

export default OrderPayment;
