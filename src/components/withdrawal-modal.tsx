"use client";

import type React from "react";

import { Check, ChevronsUpDown, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn, currencyFormat } from "@/lib/utils";
import { createWithdrawal } from "@/actions/withdraw";
import { toast } from "@/hooks/use-toast";

const paymentMethods = [
  { label: "Bank Transfer", value: "bank" },
  //   { label: "PayPal", value: "paypal" },
];

interface WithdrawalModalProps {
  isOpen: boolean;
  availableBalance: number;
  onClose: () => void;
}

export function WithdrawalModal({
  isOpen,
  onClose,
  availableBalance,
}: WithdrawalModalProps) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const response = await createWithdrawal(Number(amount), paymentMethod);
    if (response.error) {
      toast({ variant: "destructive", description: response.error });
    } else {
      toast({ description: response.success });
    }
    setIsSubmitting(false);
    onClose();
    router.push("/wallet");
  };

  const fee = Number.parseFloat(amount) * 0.01; // 1% fee
  const total = Number.parseFloat(amount) - fee;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Transfer funds to your bank account or PayPal
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">₦</span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                className="pl-7"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Available balance: {currencyFormat(availableBalance)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {paymentMethod
                    ? paymentMethods.find(
                        (method) => method.value === paymentMethod
                      )?.label
                    : "Select payment method..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search payment method..." />
                  <CommandList>
                    <CommandEmpty>No payment method found.</CommandEmpty>
                    <CommandGroup>
                      {paymentMethods.map((method) => (
                        <CommandItem
                          key={method.value}
                          value={method.value}
                          onSelect={(currentValue) => {
                            setPaymentMethod(
                              currentValue === paymentMethod ? "" : currentValue
                            );
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              paymentMethod === method.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {method.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* {paymentMethod === "bank" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account-name">Account Name</Label>
                <Input
                  id="account-name"
                  placeholder="Enter account name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-number">Account Number</Label>
                <Input
                  id="account-number"
                  placeholder="Enter account number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank-name">Bank Name</Label>
                <Input id="bank-name" placeholder="Enter bank name" required />
              </div>
            </div>
          )} */}

          {/* {paymentMethod === "paypal" && (
                <div className="space-y-2">
                <Label htmlFor="paypal-email">PayPal Email</Label>
                <Input
                    id="paypal-email"
                    type="email"
                    placeholder="Enter PayPal email"
                    required
                />
                </div>
            )} */}

          {amount && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Withdrawal Amount</span>
                  <span>{currencyFormat(Number.parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Processing Fee (1%)</span>
                  <span>{currencyFormat(fee)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total to Receive</span>
                  <span>{currencyFormat(isNaN(total) ? 0 : total)}</span>
                </div>
              </div>
            </>
          )}
        </form>
        <DialogFooter className="flex flex-col gap-4 sm:flex-col">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            <span>Withdrawals typically process within 1-3 business days</span>
          </div>
          <Button
            className="w-full"
            disabled={
              !amount ||
              !paymentMethod ||
              isSubmitting ||
              Number(amount) > availableBalance
            }
            onClick={handleSubmit}
          >
            {isSubmitting ? "Processing..." : "Withdraw Funds"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
