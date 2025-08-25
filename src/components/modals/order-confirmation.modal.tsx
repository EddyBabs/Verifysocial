import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

import { vendorOrderConfirmationAction } from "@/actions/order";
import { useToast } from "@/hooks/use-toast";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Loader2 } from "lucide-react";

const OrderConfirmationHelper = ({
  showOrderConfirmationModal,
  setShowOrderConfirmationModal,
  orderId,
}: {
  showOrderConfirmationModal: boolean;
  setShowOrderConfirmationModal: Dispatch<SetStateAction<boolean>>;
  orderId: string;
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const confirmOrder = useCallback(async () => {
    setLoading(true);
    await vendorOrderConfirmationAction(orderId)
      .then((response) => {
        if (response?.error) {
          toast({ description: response.error });
        } else {
          router.refresh();
          setShowOrderConfirmationModal(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId, router, setShowOrderConfirmationModal, toast]);
  return (
    <Dialog
      open={showOrderConfirmationModal}
      onOpenChange={setShowOrderConfirmationModal}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark Order as Delivered?</DialogTitle>
        </DialogHeader>
        <Separator />

        <div className="flex justify-start items-center min-h-20">
          <p>
            This action will confirm that the order has been delivered to the
            customer.
          </p>
        </div>

        <DialogFooter>
          <div className="flex justify-between w-full gap-3">
            <Button
              variant={"outline"}
              className="flex-1"
              onClick={() => setShowOrderConfirmationModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant={"secondary"}
              onClick={confirmOrder}
              className="flex-1"
              disabled={loading}
            >
              Confirm Order
              {loading && <Loader2 className="animate-spin" />}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function useOrderConfirmationModal() {
  const [showOrderConfirmationModal, setShowOrderConfirmationModal] =
    useState(false);

  const [orderId, setOrderId] = useState("");

  const AddOrderConfirmationModal = useCallback(() => {
    return (
      <OrderConfirmationHelper
        orderId={orderId}
        showOrderConfirmationModal={showOrderConfirmationModal}
        setShowOrderConfirmationModal={setShowOrderConfirmationModal}
      />
    );
  }, [orderId, showOrderConfirmationModal]);

  return useMemo(
    () => ({
      setShowOrderConfirmationModal,
      AddOrderConfirmationModal,
      showOrderConfirmationModal,
      openModal: (orderId: string) => {
        setOrderId(orderId);
        setShowOrderConfirmationModal(true);
      },
    }),
    [AddOrderConfirmationModal, showOrderConfirmationModal]
  );
}
