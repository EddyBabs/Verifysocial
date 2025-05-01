import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircle2,
  Clock,
  Download,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

export default function WalletPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">
          Manage your funds and track payment status
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Available Balance</CardTitle>
            <CardDescription>Funds available for withdrawal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$3,300.00</div>
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
            <div className="text-3xl font-bold">$1,250.00</div>
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
            <div className="text-3xl font-bold">$24,780.00</div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Statement
            </Button>
          </CardFooter>
        </Card>
      </div>

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
              <TableRow>
                <TableCell className="font-medium">#ORD-7245</TableCell>
                <TableCell>John Smith</TableCell>
                <TableCell className="text-green-600">
                  <div className="flex items-center gap-1">
                    <ArrowUpIcon className="h-4 w-4" />
                    $350.00
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  May 1, 2025
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="flex w-fit items-center gap-1 text-amber-600 border-amber-600"
                  >
                    <Clock className="h-3 w-3" />
                    Pending Delivery
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">#ORD-7244</TableCell>
                <TableCell>Sarah Johnson</TableCell>
                <TableCell className="text-green-600">
                  <div className="flex items-center gap-1">
                    <ArrowUpIcon className="h-4 w-4" />
                    $120.00
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  April 30, 2025
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="flex w-fit items-center gap-1 text-green-600 border-green-600"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Completed
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">#ORD-7243</TableCell>
                <TableCell>Withdrawal</TableCell>
                <TableCell className="text-red-600">
                  <div className="flex items-center gap-1">
                    <ArrowDownIcon className="h-4 w-4" />
                    $780.00
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  April 28, 2025
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="flex w-fit items-center gap-1 text-green-600 border-green-600"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Withdrawn
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">#ORD-7242</TableCell>
                <TableCell>Michael Brown</TableCell>
                <TableCell className="text-green-600">
                  <div className="flex items-center gap-1">
                    <ArrowUpIcon className="h-4 w-4" />
                    $550.00
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  April 25, 2025
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="flex w-fit items-center gap-1 text-amber-600 border-amber-600"
                  >
                    <Clock className="h-3 w-3" />
                    Pending Delivery
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">#ORD-7241</TableCell>
                <TableCell>Emily Davis</TableCell>
                <TableCell className="text-green-600">
                  <div className="flex items-center gap-1">
                    <ArrowUpIcon className="h-4 w-4" />
                    $350.00
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  April 22, 2025
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="flex w-fit items-center gap-1 text-amber-600 border-amber-600"
                  >
                    <Clock className="h-3 w-3" />
                    Pending Delivery
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
