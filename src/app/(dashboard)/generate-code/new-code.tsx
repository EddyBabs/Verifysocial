"use client";
import { getNewCode } from "@/actions/code";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { cn, currencyFormat } from "@/lib/utils";
import { createOrderShema, createOrderShemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Order } from "@prisma/client";
import { formatDate } from "date-fns";
import { CalendarIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ViewCodeSection from "./view-code-section";

const AMOUNT_RANGES = [
  { min: 1000, max: 5000 },
  { min: 5001, max: 10000 },
  { min: 10001, max: 50000 },
  { min: 50001, max: 100000 },
  { min: 100001, max: 500000 },
  { min: 500001, max: 1000000 },
  { min: 1000001, max: 10000000 },
];

const NewCode = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [codeCreated, setCodeCreated] = useState<Order | null>(null);
  const form = useForm<createOrderShemaType>({
    resolver: zodResolver(createOrderShema),
    defaultValues: {
      name: "",
      quantity: 1,
      returnPeriod: 2,
      amount: {
        min: 2000,
        max: 1000000,
      },
    },
  });
  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, touchedFields },
  } = form;

  const onSubmit = async (values: createOrderShemaType) => {
    const order = await getNewCode(values);
    if (order.success) {
      setCodeCreated(order.success);
      reset();
      router.refresh();
    } else {
      toast({ description: order.error });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>New Code</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        {codeCreated ? (
          <ViewCodeSection order={codeCreated} />
        ) : (
          <Form {...form}>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Generate Code</DialogTitle>
                <DialogDescription>
                  Create codes and send to customers to enable us to the track
                  order
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-8 py-4">
                <div className="flex flex-col gap-4">
                  <Label htmlFor="name">Name of Product</Label>
                  <Input
                    id="name"
                    value={watch("name")}
                    onChange={(e) => setValue("name", e.target.value)}
                    className="col-span-3"
                  />
                  {errors.name?.message && (
                    <p className="text-[0.8rem] text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    className="col-span-3"
                    value={watch("quantity")}
                    onChange={(e) => setValue("quantity", +e.target.value)}
                    type="number"
                    min={1}
                  />
                  {touchedFields.quantity && errors.quantity?.message && (
                    <p className="text-[0.8rem] text-destructive">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>

                {/* <div className="flex flex-col gap-4">
                  <Label htmlFor="username">Amount</Label>
                  <Slider
                    max={10000000}
                    min={1000}
                    step={1000}
                    minStepsBetweenThumbs={1000}
                    value={[watch("amount.min"), watch("amount.max")]}
                    onValueChange={(newValues) => {
                      setValue("amount.min", newValues[0]);
                      setValue("amount.max", newValues[1]);
                    }}
                    formatLabel={(value) => currencyFormat(value)}
                  />
                  {errors.amount?.min?.message && (
                    <p className="text-[0.8rem] text-destructive">
                      {errors.amount?.min.message}
                    </p>
                  )}

                  {errors.amount?.max?.message && (
                    <p className="text-[0.8rem] text-destructive">
                      {errors.amount?.max.message}
                    </p>
                  )}
                </div> */}

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <Select
                        onValueChange={(value: string) => {
                          const amount = JSON.parse(value);
                          setValue("amount.min", amount.min);
                          setValue("amount.max", amount.max);
                        }}
                        defaultValue={JSON.stringify({
                          min: field.value.min,
                          max: field.value.max,
                        })}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a an amount range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {AMOUNT_RANGES.map((range) => (
                            <SelectItem
                              value={JSON.stringify(range)}
                              key={range.min}
                            >
                              <span>{currencyFormat(range.min)}</span>{" "}
                              <span className="mx-2">-</span>{" "}
                              <span>
                                {range.max < 10000000
                                  ? currencyFormat(range.max)
                                  : "Above"}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliveryPeriod"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Delivery Period</FormLabel>
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

                <div className="flex flex-col gap-4">
                  <Label htmlFor="username">Return Period</Label>
                  <Input
                    type="number"
                    value={watch("returnPeriod")}
                    onChange={(event) =>
                      setValue("returnPeriod", +event.target.value)
                    }
                    min={1}
                    max={30}
                  />
                  {errors.returnPeriod?.message && (
                    <p className="text-[0.8rem] text-destructive">
                      {errors.returnPeriod.message}
                    </p>
                  )}
                  <p className="text-[0.8rem] text-muted-foreground">
                    Maximum number of days after delivery for product to be
                    delivered
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  Generate{" "}
                  {isSubmitting && (
                    <Loader2Icon
                      className="ml-2 animate-spin
                "
                    />
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewCode;
