"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { currencyFormat } from "@/lib/utils";
import { useState } from "react";
import { WithdrawalModal } from "../withdrawal-modal";

const WalletOverviewClient = ({
  availableBalance,
  pendingBalance,
  totalBalance,
}: {
  availableBalance: number;
  pendingBalance: number;
  totalBalance: number;
}) => {
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  return (
    <>
      <div className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-3">
        <Card className="col-span-2 sm:col-span-1">
          <CardHeader>
            <CardTitle>Available Balance</CardTitle>
            <CardDescription>Funds available for withdrawal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {currencyFormat(availableBalance)}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => setIsWithdrawalModalOpen(true)}
            >
              Withdraw Funds
            </Button>
          </CardFooter>
        </Card>
        <Card className="col-span-2 sm:col-span-1">
          <CardHeader>
            <CardTitle>Pending Balance</CardTitle>
            <CardDescription>
              Funds awaiting delivery confirmation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {currencyFormat(pendingBalance)}
            </div>
          </CardContent>
          {/* <CardFooter>
          <Button variant="outline" className="w-full">
            View Pending Orders
          </Button>
        </CardFooter> */}
        </Card>
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
            <CardDescription>Lifetime earnings on platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {currencyFormat(totalBalance)}
            </div>
          </CardContent>
          <CardFooter>
            {/* <Button variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Statement
          </Button> */}
          </CardFooter>
        </Card>
      </div>
      <WithdrawalModal
        isOpen={isWithdrawalModalOpen}
        availableBalance={availableBalance}
        onClose={() => setIsWithdrawalModalOpen(false)}
      />
    </>
  );
};

export default WalletOverviewClient;
