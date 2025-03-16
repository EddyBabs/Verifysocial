"use client";
import { customerVendorFeedback } from "@/actions/feeback";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import {
  vendorCustomerContactSchema,
  vendorCustomerContactSchemaType,
} from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const OrderCustomerVendorContact = ({ orderId }: { orderId: string }) => {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  const form = useForm<vendorCustomerContactSchemaType>({
    resolver: zodResolver(vendorCustomerContactSchema),
    defaultValues: {
      orderId: orderId,
      customerContact: "no",
      customerPayment: false,
      resolved: false,
    },
  });

  const {
    setValue,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (searchParams.get("vendorContact")) {
      setOpen(true);
    }
  }, [searchParams]);

  const onSubmit = async (values: vendorCustomerContactSchemaType) => {
    const response = await customerVendorFeedback(values);
    if (response?.error) {
      toast({ variant: "destructive", description: response.error });
    } else {
      toast({ description: response.success });
      setOpen(false);
    }
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={() => setOpen((prev) => !prev)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer Response Feedback</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
              {step === 2 ? (
                <>
                  <DialogDescription>
                    Have you made payment to the vendor?
                  </DialogDescription>
                  <DialogFooter>
                    <Button
                      variant={"outline"}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => {
                        setValue("customerPayment", true);
                        form.handleSubmit(onSubmit)();
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => {
                        setValue("customerPayment", false);
                        form.handleSubmit(onSubmit)();
                      }}
                    >
                      No
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                <>
                  <DialogDescription>
                    Did the Vendor contact you?
                  </DialogDescription>
                  <DialogFooter>
                    <Button
                      type="button"
                      onClick={() => {
                        setValue("customerContact", "yes");
                        setStep(2);
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setValue("customerContact", "no");
                        setStep(2);
                      }}
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
    </div>
  );
};

export default OrderCustomerVendorContact;
