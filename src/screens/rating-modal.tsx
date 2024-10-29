"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Ratings from "@/components/ui/ratings";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

const RateVendor = () => {
  const [value, setValue] = useState(0);
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
        <div className="space-y-4">
          <div className="space-y-2">
            <Ratings
              asInput
              value={value}
              variant="yellow"
              onValueChange={setValue}
            />
            <div className="flex gap-8 mt-2">
              <span className="text-xs">Very Bad</span>
              <span className="text-xs">Excellent</span>
            </div>
          </div>
          <div>
            <Textarea rows={5} placeholder="Type a review" />
          </div>
          <Button className="w-full">Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RateVendor;
