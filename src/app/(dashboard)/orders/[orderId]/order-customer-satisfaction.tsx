"use client";

import {
  customerSatisfaction,
  vendorSatisfaction,
} from "@/actions/satisfaction";
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
import Ratings from "@/components/ui/ratings";
import { toast } from "@/hooks/use-toast";
import { satisfactionSchema, satisfactionSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { User } from "next-auth";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const OrderCustomerSatisfaction = ({
  orderId,
  user,
}: {
  orderId: string;
  user: User & {
    role: "USER" | "ADMIN" | "VENDOR";
    fullname: string;
  };
}) => {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const form = useForm<satisfactionSchemaType>({
    resolver: zodResolver(satisfactionSchema),
    defaultValues: {
      orderId,
      transactionSatisfaction: 0,
      rateApp: 0,
      returnToApp: 0,
      feelSafe: 0,
      recommend: 0,
    },
  });
  const {
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = form;

  const transactionSatisfaction = watch("transactionSatisfaction");
  const rateApp = watch("rateApp");
  const returnToApp = watch("returnToApp");
  const feelSafe = watch("feelSafe");
  const recommend = watch("recommend");

  const onSubmit = async (values: satisfactionSchemaType) => {
    console.log({ values });
    if (user.role === "VENDOR") {
      const response = await vendorSatisfaction(values);
      if (response.error) {
        toast({ variant: "destructive", description: response.error });
        return;
      }
      toast({ description: response.success });
      setOpen(false);
    } else {
      const response = await customerSatisfaction(values);
      if (response.error) {
        toast({ variant: "destructive", description: response.error });
        return;
      }
      toast({ description: response.success });
      setOpen(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("satisfactoryFeedback")) {
      setOpen(true);
    }
  }, [searchParams]);
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Dialog open={open} onOpenChange={() => setOpen((prev) => !prev)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Vendor Satisfactory Feedback</DialogTitle>
                <DialogDescription>
                  Use the scale of 1-5 with 1 being the very unlikely, 2
                  unlikely, 3 not sure 4, likely and 5, very likely
                </DialogDescription>
              </DialogHeader>

              <form method="POST" onSubmit={handleSubmit(onSubmit)}>
                {step === 4 ? (
                  <>
                    <DialogDescription>
                      Would you recommend family, friends, colleagues and your
                      social media community to sign up?
                    </DialogDescription>
                    <div className="mt-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Ratings
                            asInput
                            value={recommend}
                            variant="yellow"
                            onValueChange={(value) =>
                              setValue("recommend", value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="mt-4">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => setStep(3)}
                        disabled={isSubmitting}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          recommend < 1 || recommend > 5 || isSubmitting
                        }
                      >
                        Next{" "}
                        {isSubmitting && (
                          <Loader className="ml-1 animate-spin" />
                        )}
                      </Button>
                    </DialogFooter>
                  </>
                ) : step === 3 ? (
                  <>
                    <DialogDescription>
                      Do you feel safe and secure with your transaction on the
                      platform?
                    </DialogDescription>
                    <div className="mt-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Ratings
                            asInput
                            value={feelSafe}
                            variant="yellow"
                            onValueChange={(value) =>
                              setValue("feelSafe", value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="mt-4">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => setStep(2)}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        disabled={feelSafe < 1 || feelSafe > 5}
                        onClick={() => setStep(4)}
                      >
                        Next
                      </Button>
                    </DialogFooter>
                  </>
                ) : step === 2 ? (
                  <>
                    <DialogDescription>
                      Would you return to use the platform?
                    </DialogDescription>
                    <div className="mt-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Ratings
                            asInput
                            value={returnToApp}
                            variant="yellow"
                            onValueChange={(value) =>
                              setValue("returnToApp", value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="mt-4">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => setStep(1)}
                        disabled={isSubmitting}
                      >
                        Back
                      </Button>
                      <Button type="button" onClick={() => setStep(3)}>
                        Next
                      </Button>
                    </DialogFooter>
                  </>
                ) : step === 1 ? (
                  <>
                    <DialogDescription>
                      How would you rate verify social as a trusted partner?
                    </DialogDescription>
                    <div className="mt-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Ratings
                            asInput
                            value={rateApp}
                            variant="yellow"
                            onValueChange={(value) =>
                              setValue("rateApp", value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="mt-4">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => setStep(0)}
                        disabled={isSubmitting}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        disabled={rateApp < 1 || rateApp > 5}
                        onClick={() => setStep(2)}
                      >
                        Next
                      </Button>
                    </DialogFooter>
                  </>
                ) : (
                  <>
                    <DialogDescription>
                      How satisfied are you with the transaction?
                    </DialogDescription>
                    <div className="mt-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Ratings
                            asInput
                            value={transactionSatisfaction}
                            variant="yellow"
                            onValueChange={(value) =>
                              setValue("transactionSatisfaction", value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="mt-4">
                      <Button
                        type="button"
                        disabled={
                          transactionSatisfaction < 1 ||
                          transactionSatisfaction > 5
                        }
                        onClick={() => setStep(1)}
                      >
                        Next
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </Form>
  );
};

export default OrderCustomerSatisfaction;
