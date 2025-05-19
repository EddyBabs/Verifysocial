import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getWithdrawalOverview } from "@/actions/withdraw";
import { currencyFormat } from "@/lib/utils";

const WithdrawOverview = async () => {
  const { pendingWithdrawals, totalWithdrawals } =
    await getWithdrawalOverview();
  return (
    <div className="grid gap-3 md:gap-6 md:grid-cols-2">
      {/* <Card>
        <CardHeader>
          <CardTitle>Available Balance</CardTitle>
          <CardDescription>Funds available for withdrawal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {currencyFormat(availableWithdrawals)}
          </div>
          <Link href="/wallet">
            <Button className="w-full mt-4">Withdraw Funds</Button>
          </Link>
        </CardContent>
      </Card> */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Withdrawals</CardTitle>
          <CardDescription>Funds being processed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {currencyFormat(pendingWithdrawals)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Expected completion: May 5, 2025
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Withdrawn</CardTitle>
          <CardDescription>Lifetime withdrawals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {currencyFormat(totalWithdrawals)}
          </div>
          {/* <Button variant="outline" className="w-full mt-4">
          <Download className="mr-2 h-4 w-4" />
          Download Statement
        </Button> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default WithdrawOverview;
