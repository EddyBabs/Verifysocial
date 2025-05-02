import { Download } from "lucide-react";

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
import { getVendorWalletOverview } from "@/actions/vendor";

const WalletOverview = async () => {
  const { totalBalance, pendingBalance, availableBalance } =
    await getVendorWalletOverview();
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
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
          <Button className="w-full">Withdraw Funds</Button>
        </CardFooter>
      </Card>
      <Card>
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
        <CardFooter>
          <Button variant="outline" className="w-full">
            View Pending Orders
          </Button>
        </CardFooter>
      </Card>
      <Card>
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
          <Button variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Statement
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WalletOverview;
