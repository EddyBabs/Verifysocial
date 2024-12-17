"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

const OrderForm = () => {
  const [open, setOpen] = useState(true);
  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order Form</DialogTitle>
          <DialogDescription>
            Fill the form to help us track your order
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="" className="col-span-3" />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="username" className="text-right">
              Email
            </Label>
            <Input id="username" value="" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;
