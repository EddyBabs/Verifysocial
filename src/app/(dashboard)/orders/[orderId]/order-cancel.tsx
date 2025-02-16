"use client";
import { cancelOrder } from "@/actions/order";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { orderCancelFormSchema, orderCancelFormSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const REASONS = [
  "Not Satisfied With Service",
  "Not Satisfied With Agreement",
  "Vendor asked me to cancel",
  "Vendor misrepresentation",
  "Suspected Fraud",
  "Not interested anymore",
  "Found another vendor",
  "Long wait time",
  "Other",
];

const OrderCancel = ({ orderId }: { orderId: string }) => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(orderCancelFormSchema),
    defaultValues: {
      orderId: orderId,
      reason: "",
      otherReason: undefined,
    },
  });

  const {
    watch,
    formState: { isSubmitting },
  } = form;
  const reason = watch("reason");

  const onSubmit = async (values: orderCancelFormSchemaType) => {
    const response = await cancelOrder(values);
    if (response.error) {
      toast({ description: response.error, variant: "destructive" });
    } else {
      toast({ description: response.success });
      router.refresh();
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-destructive">Cancel Request</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancellation Reason</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
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

                {reason === "Other" && (
                  <FormField
                    control={form.control}
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
                  <Button type="submit" disabled={isSubmitting}>
                    Submit{" "}
                    {isSubmitting && <Loader className="ml-2 animate-spin" />}
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderCancel;
