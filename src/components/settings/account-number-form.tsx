"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { getAccountName, getBanks } from "@/actions/paystack";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Bank } from "@/types";
import useDebounce from "@/hooks/use-debounce";

const accountFormSchema = z.object({
  accountNumber: z
    .string()
    .min(8, {
      message: "Account number must be at least 8 characters.",
    })
    .max(20, {
      message: "Account number must not be longer than 20 characters.",
    }),
  // bankName: z.string().min(2, {
  //   message: "Bank name must be at least 2 characters.",
  // }),
  bank: z.object({
    slug: z.string(),
    code: z.string(),
    name: z.string(),
  }),
  bankCode: z.string().min(1, { message: "Bank Code required" }),
  // accountType: z.string({
  //   required_error: "Please select an account type.",
  // }),
  accountName: z.string().min(9, {
    message: "Account name is required",
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

const defaultValues: Partial<AccountFormValues> = {
  accountNumber: "",
  // bankName: "",
  bankCode: "",
  accountName: "",
};

export function AccountNumberForm() {
  const { toast } = useToast();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isPending, startTransition] = useTransition();
  const [accountName, setAccountName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  const fetchBanks = useCallback(() => {
    startTransition(async () => {
      const response = await getBanks();
      if (response.success) {
        setBanks(response.success);
      } else {
        toast({ variant: "destructive", description: response.error });
      }
    });
  }, [toast]);

  function onSubmit(data: AccountFormValues) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account information updated",
        description: "Your payment details have been saved successfully.",
      });
      console.log(data);
    }, 1000);
  }

  const bank = form.watch("bank");
  const account = form.watch("accountNumber");

  const handleAccountName = async () => {
    const response = await getAccountName(bank, account);
    if (response.success) {
      // setAccountName(response.success);
      form.setValue("accountName", response.success);
    } else {
      toast({ description: response.error, variant: "destructive" });
    }
  };

  const debouncedFetch = useDebounce(handleAccountName, 500);
  useEffect(() => {
    if (bank && account) {
      debouncedFetch();
    }
  }, [bank, account]);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>
            Add your bank account details to receive payments from the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {/* <div className="flex items-center gap-2 text-amber-600">
                  <Info className="h-4 w-4" />
                  <p className="text-sm">
                    Your account information is encrypted and secure
                  </p>
                </div> */}
                {/* 
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Bank className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-9"
                            placeholder="Enter your bank name"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name="bank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <Select
                        // onValueChange={field.onChange}
                        onValueChange={(value) => {
                          console.log({ value });
                          field.onChange(JSON.parse(value));
                        }}
                        defaultValue={field.value?.slug}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your bank name" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {banks.map((bank: Bank, index: number) => (
                            <SelectItem
                              value={JSON.stringify(bank)}
                              key={`${bank.slug}-${index}`}
                            >
                              {bank.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              placeholder="Enter your account number"
                              type="password"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          This is the account where your funds will be deposited
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Name</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} disabled={true} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* <FormField
                  control={form.control}
                  name="accountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="checking">
                            Checking Account
                          </SelectItem>
                          <SelectItem value="savings">
                            Savings Account
                          </SelectItem>
                          <SelectItem value="business">
                            Business Account
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Payment Information"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      {/* 
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            View your recent payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p>No payment transactions found</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Export History</Button>
          <Button variant="ghost">View All Transactions</Button>
        </CardFooter>
      </Card> */}
    </div>
  );
}
