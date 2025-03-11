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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Ratings from "@/components/ui/ratings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { constants } from "@/lib/constant";
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
import { Dispatch, SetStateAction, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";

const OrderModal = ({
  isOpen,
  orderId,
}: {
  isOpen: boolean;
  orderId: string;
}) => {
  const [step, setStep] = useState(0);
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
      extensionReason: "",
    },
  });

  const { setValue, watch } = form;

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

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Confirmation</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
            {step === 0 ? (
              <>
                <DialogDescription>
                  Have You received the goods?
                </DialogDescription>
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={() => {
                      setValue("received", "yes" as any);
                      setStep(1);
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setValue("received", "no" as any);
                      setStep(1);
                    }}
                  >
                    No
                  </Button>
                </DialogFooter>
              </>
            ) : step === 1 ? (
              <>
                {received === "yes" ? (
                  <RateVendor setStep={setStep} />
                ) : (
                  <NoResponse setStep={setStep} />
                )}
              </>
            ) : step === 2 ? (
              <>
                <DialogDescription>Do you want to extend?</DialogDescription>
                <DialogFooter>
                  <Button
                    variant={"outline"}
                    type="button"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setValue("orderExtend", "yes");
                      setStep(3);
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setValue("orderExtend", "no");
                      setStep(3);
                    }}
                  >
                    No
                  </Button>
                </DialogFooter>
              </>
            ) : step === 3 ? (
              <Step3 setStep={setStep} />
            ) : step === 4 ? (
              <Step4 setStep={setStep} />
            ) : (
              <Step5 setStep={setStep} />
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const Step5 = ({ setStep }: { setStep: Dispatch<SetStateAction<number>> }) => {
  const {
    watch,
    control,
    formState: { isSubmitting },
  } = useFormContext<orderConfirmationSchemaType>();
  const cancellationReason = watch("cancellationReason");
  const otherReason = watch("otherReason");

  return (
    <>
      <DialogDescription>Cancellation Reason</DialogDescription>

      <FormField
        control={control}
        name="cancellationReason"
        render={({ field }) => (
          <FormItem>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {constants.CANCELLATION_REASONS.map((reason, index) => (
                  <SelectItem value={reason} key={index}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {cancellationReason === "Other" && (
        <FormField
          control={control}
          name="otherReason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other Reasons</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <DialogFooter className="mt-4">
        <Button onClick={() => setStep(4)}>Back</Button>
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !cancellationReason ||
            (cancellationReason === "other" && !otherReason)
          }
        >
          Submit
        </Button>
      </DialogFooter>
    </>
  );
};

const Step3 = ({ setStep }: { setStep: Dispatch<SetStateAction<number>> }) => {
  const { setValue, watch, control } =
    useFormContext<orderConfirmationSchemaType>();
  const orderExtend = watch("orderExtend");
  const deliveryExtension = watch("deliveryExtension");

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
          <Button variant={"outline"} type="button" onClick={() => setStep(2)}>
            Back
          </Button>
          <Button disabled={!deliveryExtension} onClick={() => setStep(4)}>
            Next
          </Button>
        </DialogFooter>
      </>
    );
  }
  return (
    <>
      <DialogDescription>Have you made payment?</DialogDescription>
      <DialogFooter>
        <Button variant={"outline"} type="button" onClick={() => setStep(2)}>
          Back
        </Button>
        <Button
          type="button"
          onClick={() => {
            setValue("madePayment", "yes");
            setStep(4);
          }}
        >
          Yes
        </Button>
        <Button
          type="button"
          onClick={() => {
            setValue("madePayment", "no");
            setStep(4);
          }}
        >
          No
        </Button>
      </DialogFooter>
    </>
  );
};

const Step4 = ({ setStep }: { setStep: Dispatch<SetStateAction<number>> }) => {
  const {
    setValue,
    watch,
    control,
    formState: { isSubmitting },
  } = useFormContext<orderConfirmationSchemaType>();
  const orderExtend = watch("orderExtend");
  const deliveryExtension = watch("deliveryExtension");
  const madePayment = watch("madePayment");

  if (orderExtend === "yes" && deliveryExtension) {
    return (
      <>
        <div className="space-y-4">
          <FormField
            control={control}
            name="extensionReason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason for extension?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {constants.EXTENSION_REASONS.map((reason, index) => (
                      <SelectItem value={reason} key={index}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="mt-4">
            <Button onClick={() => setStep(3)}>Back</Button>
            <Button type="submit" disabled={isSubmitting}>
              Submit {isSubmitting && <Loader className="animate-spin ml-2" />}
            </Button>
          </DialogFooter>
        </div>
      </>
    );
  }

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
        <Button variant={"outline"} type="button" onClick={() => setStep(3)}>
          Back
        </Button>
        <Button onClick={() => setStep(5)}>Next</Button>
      </DialogFooter>
    </>
  );
};

const RateVendor = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) => {
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
        <Button type="button" onClick={() => setStep(0)}>
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Submit {isSubmitting && <Loader className="ml-2 animate-spin" />}
        </Button>
      </DialogFooter>
    </>
  );
};

const NoResponse = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const { setValue } = useFormContext<orderConfirmationSchemaType>();

  return (
    <>
      <DialogDescription>Did the vendor contact you?</DialogDescription>
      <DialogFooter>
        <Button variant={"outline"} type="button" onClick={() => setStep(0)}>
          Back
        </Button>
        <Button
          type="button"
          onClick={() => {
            setValue("vendorContact", "yes");
            setStep(2);
          }}
        >
          Yes
        </Button>
        <Button
          type="button"
          onClick={() => {
            setValue("vendorContact", "no");
            setStep(2);
          }}
        >
          No
        </Button>
      </DialogFooter>
    </>
  );
};

export default OrderModal;
