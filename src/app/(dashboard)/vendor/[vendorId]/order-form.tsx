"use client";
import { fillOrder } from "@/actions/order";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { orderSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Order, Prisma } from "@prisma/client";
import { formatDate } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type orderSchemaType = z.infer<typeof orderSchema>;

const OrderForm = ({
  user,
  order,
}: {
  user:
    | Prisma.UserGetPayload<{
        select: { fullname: true; email: true; gender: true; phone: true };
      }>
    | undefined
    | null;
  order: Order;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [openDate, setOpenDate] = useState(false);

  const methods = useForm<orderSchemaType>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: user?.fullname || "",
      email: user?.email || "",
      code: order.code,
      consent: false,
      value: 0,
    },
  });

  const onSubmit = async (values: orderSchemaType) => {
    await fillOrder(values).then((response) => {
      if (response.success) {
        toast({ description: response.success });
        router.refresh();
        setOpen(false);
      } else {
        toast({ description: response.error, variant: "destructive" });
      }
    });
  };

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const consent = watch("consent");

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...methods}>
          <form noValidate onSubmit={handleSubmit((data) => onSubmit(data))}>
            <DialogHeader>
              <DialogTitle>Order Form</DialogTitle>
              <DialogDescription>
                Fill the form to help us track your order
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  className="col-span-3"
                  {...register("name")}
                  disabled={true}
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" {...register("email")} disabled readOnly />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="value">Order Value</Label>
                <Input
                  id="value"
                  placeholder="1000"
                  {...register("value", { valueAsNumber: true })}
                  error={errors.value?.message}
                />
                <p className={cn("text-[0.8rem] text-muted-foreground -mt-1")}>
                  Amount of product
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <FormField
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date </FormLabel>
                      <Popover
                      // open={openDate}
                      // onOpenChange={() => setOpenDate((prev) => !prev)}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
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
                        <PopoverContent
                          className="w-auto p-0 pointer-events-auto"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              // date > new Date() || date < new Date("1900-01-01")
                              date < new Date()
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>The date of delivery.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(value) => setValue("consent", !!value)}
                />
                <label
                  htmlFor="consent"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I consent to have my order tracked
                </label>
              </div>
              {errors.consent?.message && (
                <p className="text-destructive text-[0.8rem] mt-1">
                  {errors.consent.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;
