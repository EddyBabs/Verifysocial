import { ArrowDownIcon, ArrowUpIcon, CheckCircle2, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getVendorTransactionHistory } from "@/actions/vendor";
import { currencyFormat } from "@/lib/utils";
import { formatDate } from "date-fns";
import Link from "next/link";

const WalletTable = async () => {
  const histories = await getVendorTransactionHistory();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          A record of all your payment activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {histories.map((history) => (
              <TableRow key={history.id}>
                <TableCell className="font-medium">#{history.id}</TableCell>
                <TableCell>{history.user?.fullname}</TableCell>
                <TableCell className="text-green-600">
                  <div className="flex items-center gap-1">
                    <ArrowUpIcon className="h-4 w-4" />
                    {currencyFormat(history.amountValue)}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {/* May 1, 2025 */}
                  {formatDate(history.createdAt, "PPP")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="flex w-fit items-center gap-1 text-amber-600 border-amber-600"
                  >
                    <Clock className="h-3 w-3" />
                    {/* Pending Delivery */}
                    {history.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WalletTable;
