"use client";

import { userOrderConfirmation } from "@/actions/order";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Ratings from "@/components/ui/ratings";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  orderConfirmationSchema,
  orderConfirmationSchemaType,
} from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { formatDate } from "date-fns";
import { CalendarIcon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useFormContext } from "react-hook-form";

const OrderModal = ({
  isOpen,
  orderId,
}: {
  isOpen: boolean;
  orderId: string;
}) => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(orderConfirmationSchema),
    defaultValues: {
      orderId,
      rating: 0,
      received: undefined,
      comment: "",
      vendorContact: "",
      orderExtend: "",
      madePayment: "",
      deliveryExtension: undefined,
    },
  });

  const {
    setValue,
    watch,
    formState: { errors },
  } = form;

  const received = watch("received");
  const onSubmit = async (values: any) => {
    const response = await userOrderConfirmation(values);
    if (response.success) {
      toast({ description: response.success });
      router.refresh();
    } else {
      toast({ description: response.error, variant: "destructive" });
    }
  };

  console.log({ errors });

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
    formState: { errors, isSubmitting },
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
        <Button type="submit" disabled={isSubmitting}>
          Submit {isSubmitting && <Loader className="ml-2 animate-spin" />}
        </Button>
      </DialogFooter>
    </>
  );
};

const NoReponse = () => {
  const {
    setValue,
    watch,
    control,
    formState: { isSubmitting },
  } = useFormContext<orderConfirmationSchemaType>();
  const vendorContact = watch("vendorContact");
  const orderExtend = watch("orderExtend");
  const madePayment = watch("madePayment");

  if (madePayment) {
    if (madePayment === "yes") {
      return (
        <>
          <DialogDescription>
            An email will be sent tomorrow to confirm delivery.
          </DialogDescription>
          <DialogFooter className="mt-4">
            <Button
              variant={"outline"}
              type="button"
              onClick={() => setValue("madePayment", "")}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Submit {isSubmitting && <Loader className="animate-spin ml-2" />}
            </Button>
          </DialogFooter>
        </>
      );
    }

    return (
      <>
        <DialogDescription>Proceeding to cancel request.</DialogDescription>
        <DialogFooter className="mt-4">
          <Button
            variant={"outline"}
            type="button"
            onClick={() => setValue("madePayment", "")}
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Submit
            {isSubmitting && <Loader className="animate-spin ml-2" />}
          </Button>
        </DialogFooter>
      </>
    );
  }

  if (orderExtend) {
    if (orderExtend === "yes") {
      return (
        <>
          <div>
            <FormField
              control={control}
              name="deliveryExtension"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Delivery Extension</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            formatDate(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        className="z-50 pointer-events-auto"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant={"outline"}
              type="button"
              onClick={() => setValue("orderExtend", "")}
            >
              Back
            </Button>
            <Button type="submit" disabled={!watch("deliveryExtension")}>
              Submit
            </Button>
          </DialogFooter>
        </>
      );
    }
    return (
      <>
        <DialogDescription>Have you made payment?</DialogDescription>
        <DialogFooter>
          <Button
            variant={"outline"}
            type="button"
            onClick={() => setValue("orderExtend", "")}
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={() => {
              setValue("madePayment", "yes");
            }}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => {
              setValue("madePayment", "no");
            }}
          >
            No
          </Button>
        </DialogFooter>
      </>
    );
  }

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
          <Button type="button" onClick={() => setValue("orderExtend", "yes")}>
            Yes
          </Button>
          <Button type="button" onClick={() => setValue("orderExtend", "no")}>
            No
          </Button>
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
        <Button type="button" onClick={() => setValue("vendorContact", "no")}>
          No
        </Button>
      </DialogFooter>
    </>
  );
};

export default OrderModal;
