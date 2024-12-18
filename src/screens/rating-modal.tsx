"use client";
import { reviewOrder } from "@/actions/rating";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import Ratings from "@/components/ui/ratings";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { rateOrderShema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Order } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type rateOrderValueType = z.infer<typeof rateOrderShema>;

const RateVendor = ({ order }: { order: Order }) => {
  const { toast } = useToast();
  const router = useRouter();
  const methods = useForm<rateOrderValueType>({
    resolver: zodResolver(rateOrderShema),
    defaultValues: {
      orderId: order.id,
      rating: 0,
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (values: rateOrderValueType) => {
    await reviewOrder(values).then((response) => {
      if (response.success) {
        toast({ description: response.success });
        router.refresh();
      } else {
        toast({ description: response.error });
      }
    });
  };

  const rate = watch("rating");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="border-primary text-primary">
          Rate our services
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Leave a review
          </DialogTitle>
          <DialogDescription>How was your experience?</DialogDescription>
        </DialogHeader>
        <Form {...methods}>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
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
              <Button className="w-full" disabled={isSubmitting} type="submit">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RateVendor;
