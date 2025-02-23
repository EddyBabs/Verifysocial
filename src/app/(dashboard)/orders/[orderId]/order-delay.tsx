"use client";
import { delayOrder } from "@/actions/order";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { orderDelayFormSchemaType, orderDelaySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDate } from "date-fns";
import { CalendarIcon, Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";

const REASONS = [
  "Logistics",
  "Customer asked me to delay",
  "Goods altered in transit",
];

const OrderDelay = ({ orderId }: { orderId: string }) => {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(orderDelaySchema),
    defaultValues: {
      orderId: orderId,
      reason: "",
      hasPaid: false,
      extend: false,
      otherReason: undefined,
      deliveryExtension: undefined,
    },
  });

  const onSubmit = async (values: any) => {
    const response = await delayOrder(values);
    if (response.error) {
      toast({ description: response.error, variant: "destructive" });
    } else {
      toast({ description: response.success });
      router.refresh();
      setOpen(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("delayReason")) {
      setOpen(true);
    }
  }, [searchParams]);

  return (
    <div>
      <Dialog open={open} onOpenChange={() => setOpen((prev) => !prev)}>
        <DialogTrigger asChild>
          <Button className="bg-destructive">Request Delay</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order delay form</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
              <OrderDelayCondition />
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const OrderDelayCondition = () => {
  const {
    control,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useFormContext<orderDelayFormSchemaType>();
  const extend = watch("extend");

  const [step, setStep] = useState(1);

  if (step === 3) {
    if (extend) {
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
              onClick={() => {
                setValue("extend", false);
                setStep(2);
              }}
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={!watch("deliveryExtension") || isSubmitting}
            >
              Submit {isSubmitting && <Loader className="animate-spin ml-2" />}
            </Button>
          </DialogFooter>
        </>
      );
    }
    return (
      <div>
        <DialogDescription>Have you been paid?</DialogDescription>
        <DialogFooter className="mt-4">
          <Button variant={"outline"} type="button" onClick={() => setStep(2)}>
            Back
          </Button>
          <Button
            type="button"
            onClick={() => {
              setValue("hasPaid", true);
            }}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => {
              setValue("hasPaid", false);
            }}
          >
            No
          </Button>
        </DialogFooter>
      </div>
    );
  }

  if (step === 2) {
    return (
      <>
        <DialogDescription>Do you want to extend?</DialogDescription>
        <DialogFooter className="mt-4">
          <Button variant={"outline"} type="button" onClick={() => setStep(1)}>
            Back
          </Button>
          <Button
            type="button"
            onClick={() => {
              setValue("extend", true);
              setStep(3);
            }}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => {
              setValue("extend", false);
              setStep(3);
            }}
          >
            No
          </Button>
        </DialogFooter>
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <FormField
          control={control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for delay?</FormLabel>
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
                  {REASONS.map((reason, index) => (
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
          <Button type="button" onClick={() => setStep(2)}>
            Next
          </Button>
        </DialogFooter>
      </div>
    </>
  );
};

export default OrderDelay;
