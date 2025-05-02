"use client";
import { createChargeSession, verifyTransaction } from "@/actions/paystack";
import { toast } from "@/hooks/use-toast";
import PaystackPop from "@paystack/inline-js";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import OrderForm from "./order-form";

const OrderPaymentForm = ({
  user,
  code,
}: {
  user: Prisma.UserGetPayload<{
    select: { fullname: true; email: true; gender: true; phone: true };
  }>;
  code:
    | Prisma.CodeGetPayload<{ include: { order: { select: { id: true } } } }>
    | undefined
    | null;
}) => {
  const router = useRouter();
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
  const popup = new PaystackPop();

  const handlePayment = async (code: string) => {
    const session = await createChargeSession(code);
    if (session.error) {
      //   setError(session.error);
      toast({ description: session.error, variant: "destructive" });
      router.refresh();
    } else {
      await popup.resumeTransaction(session.success, config);
    }
  };
  return (
    <>
      {code && code.status === "PENDING" && !code.order && (
        <OrderForm user={user} code={code} handlePayment={handlePayment} />
      )}
    </>
  );
};

export default OrderPaymentForm;
