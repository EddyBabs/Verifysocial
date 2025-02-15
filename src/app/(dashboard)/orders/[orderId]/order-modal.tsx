"use client";

import { userOrderConfirmation } from "@/actions/order";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import Ratings from "@/components/ui/ratings";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  orderConfirmationSchema,
  orderConfirmationSchemaType,
} from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useForm, useFormContext } from "react-hook-form";

const OrderModal = ({
  isOpen,
  orderId,
}: {
  isOpen: boolean;
  orderId: string;
}) => {
  const form = useForm({
    resolver: zodResolver(orderConfirmationSchema),
    defaultValues: {
      orderId,
      rating: 0,
      received: undefined,
      comment: "",
      vendorContact: "",
    },
  });

  const { setValue, watch } = form;

  const received = watch("received");
  const onSubmit = async (values: orderConfirmationSchemaType) => {
    const response = await userOrderConfirmation(values);
    if (response.success) {
      toast({ description: response.success });
    } else {
      toast({ description: response.error, variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Confirmation</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
            {received === "yes" ? (
              <RateVendor />
            ) : received === "no" ? (
              <NoReponse />
            ) : (
              <>
                <DialogDescription>
                  Have You received the goods?
                </DialogDescription>
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={() => setValue("received", "yes" as any)}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setValue("received", "no" as any)}
                  >
                    No
                  </Button>
                </DialogFooter>
              </>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const RateVendor = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<orderConfirmationSchemaType>();
  const rate = watch("rating");

  return (
    <>
      <DialogDescription>How was your experience?</DialogDescription>
      <div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Ratings
              asInput
              value={rate}
              variant="yellow"
              onValueChange={(value) => setValue("rating", value)}
            />
            <div className="flex gap-8 mt-2">
              <span className="text-xs">Very Bad</span>
              <span className="text-xs">Excellent</span>
            </div>
          </div>
          <div>
            <Textarea
              rows={5}
              placeholder="Type a review"
              {...register("comment")}
            />
            {errors.comment?.message && (
              <p className="text-[0.8rem] text-destructive">
                {errors.comment.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <DialogFooter className="mt-4">
        <Button type="button" onClick={() => setValue("received", undefined)}>
          Back
        </Button>
        <Button type="submit">Submit</Button>
      </DialogFooter>
    </>
  );
};

const NoReponse = () => {
  const { setValue, watch } = useFormContext<orderConfirmationSchemaType>();

  const vendorContact = watch("vendorContact");
  if (vendorContact) {
    return (
      <>
        <DialogDescription>Do you want to extend?</DialogDescription>
        <DialogFooter>
          <Button
            variant={"outline"}
            type="button"
            onClick={() => setValue("vendorContact", "")}
          >
            Back
          </Button>
          <Button>Yes</Button>
          <Button type="submit">No</Button>
        </DialogFooter>
      </>
    );
  }
  return (
    <>
      <DialogDescription>Did the vendor contact you?</DialogDescription>
      <DialogFooter>
        <Button
          variant={"outline"}
          type="button"
          onClick={() => setValue("received", undefined)}
        >
          Back
        </Button>
        <Button type="button" onClick={() => setValue("vendorContact", "yes")}>
          Yes
        </Button>
        <Button type="submit" onClick={() => setValue("vendorContact", "no")}>
          No
        </Button>
      </DialogFooter>
    </>
  );
};

export default OrderModal;
